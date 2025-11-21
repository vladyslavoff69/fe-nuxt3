<script lang="ts" setup>
import { helpers, maxValue, minValue, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { CURRENCY, PREFERENCE, THEME } from '~/constants'
import TokenPopover from '~/components/organisms/wallets/popovers/TokenPopover.vue'
import AmountInput from '~/components/molecules/inputs/AmountInput.vue'
import FiatPopover from '~/components/organisms/wallets/popovers/FiatPopover.vue'
import { loadMoonPay } from '@moonpay/moonpay-js'
import { numberWithCommas } from '~/utils'

const { t } = useI18n()
const route = useRoute()
const { screen } = inject(THEME)!
const { userBalances, cryptoCurrencies, usdToFiat, cryptoToUsd } = inject(CURRENCY)!
const { activeFiatCode } = inject(PREFERENCE)!
const selectedCurrency = computed(() => route.query.currency ? String(route.query.currency) : 'BTC')
const selectedCrypto = computed(() => cryptoCurrencies.value.find(c => c.code === selectedCurrency.value)!)
const amount = ref<number>(0)
const selectedUserBalance = computed(() => userBalances.value.find(ub => ub.currencyCode === selectedCurrency.value)!)
const selectedCryptoBalance = computed(() => selectedUserBalance.value.availableBalance)
const estimated = computed(() => ((amount.value * cryptoToUsd.value[selectedCurrency.value]) * usdToFiat.value[activeFiatCode.value]))
const feeEstimated = computed(() => (estimated.value - (estimated.value * 0.01)))
const minAmount = computed(() => Number(selectedCrypto.value.minSellAmount))
const maxAmount = computed(() => Number(selectedCrypto.value.maxSellAmount))

const setMaxAmount = () => {
  amount.value = maxAmount.value
}

const rules = computed(() => {
  return {
    amount: {
      required: helpers.withMessage('Amount is required', required),
      maxValue: helpers.withMessage(
        `The maximum transaction amount is ${(Math.floor(maxAmount.value * 100) / 100)}`,
        maxValue((Math.floor(maxAmount.value * 100) / 100))
      ),
      minValue: helpers.withMessage(
        `The minimum transaction amount is ${(Math.floor(minAmount.value * 100) / 100)}`,
        minValue((Math.floor(minAmount.value * 100) / 100))
      ),
    }
  }
})

const v$ = useVuelidate(rules, { amount })

const inputAmount = async () => {
  disabledSell.value = false
  noBalance.value = false

  if (!await v$.value.amount.$validate()) {
    disabledSell.value = true

    return false
  }

  if (amount.value > selectedCryptoBalance.value) {
    disabledSell.value = true
    noBalance.value = true

    return false
  }

  return true
}

const runtimeConfig = useRuntimeConfig()
const moonPay = ref()
const disabledSell = ref(false)
const noBalance = ref(false)
const initMoonPay = async () => {
  if (!await inputAmount()) {
    return
  }

  if (moonPay.value) {
    // @ts-ignore
    const moonPaySdk = moonPay.value({
      flow: 'sell',
      // @ts-ignore
      environment: runtimeConfig.public.moonPayEnv || 'sandbox',
      params: {
        apiKey: runtimeConfig.public.moonPayApi,
        theme: 'dark',
        defaultBaseCurrencyCode: selectedCurrency.value.toLowerCase(),
        baseCurrencyAmount: Number(amount.value),
        quoteCurrencyCode: activeFiatCode.value.toLowerCase(),
      },
      variant: 'overlay',
      handlers: {
        async onTransactionCompleted () {
        },
      },
    })

    moonPaySdk?.show()
  }
}

onMounted(async () => {
  moonPay.value = await loadMoonPay()
})

watch(() => [selectedCurrency.value, activeFiatCode.value], (newVal, oldVal) => {
  if (newVal !== oldVal) {
    disabledSell.value = false
    noBalance.value = false
    v$.value.$reset()
  }
}, { immediate: true })
</script>

<template>
  <div class="w-full flex flex-col gap-y-5 text-white leading-none text-sm">
    <div class="flex flex-col gap-y-2 w-full">
      <div class="font-bold">
        {{ t('currency.you-sell') }}
      </div>
      <div class="w-full grid grid-cols-9 sm:grid-cols-7">
        <div class="col-span-5 sm:col-span-5">
          <AmountInput
            v-model="amount"
            :is-timer="false"
            class="
              h-12 rounded-l-sm rounded-r-none bg-green-950
              flex items-center
            "
            class-name="bg-green-950! rounded-r-none pl-3 lg:pl-4"
            end-icon="right-0!"
            @set:max-amount="setMaxAmount"
            @update:model-value="inputAmount"
          />
        </div>
        <div class="col-span-4 sm:col-span-2">
          <TokenPopover
            :content-height="screen.md ? 300 : 150"
            button-class="
              w-full pl-4 px-2.5 py-3 sm:pl-2 hover:shadow-none
              rounded-l-none rounded-r-sm bg-green-950!
            "
          />
        </div>
      </div>
      <JbInputMessage v-if="v$.amount.$error && v$.amount.$errors?.length && v$.amount.$errors[0]">
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-red-600"
          name="i-heroicons-information-circle-20-solid"
        />
        {{ v$.amount.$errors[0].$message }}
      </JbInputMessage>
      <JbInputMessage v-if="noBalance">
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-red-600"
          name="i-heroicons-information-circle-20-solid"
        />
        Sell amount exceeds available balance.
      </JbInputMessage>
    </div>

    <div class="flex flex-col gap-y-2 w-full">
      <div class="font-bold">
        {{ t('currency.you-get') }}
      </div>
      <div class="w-full grid grid-cols-9 sm:grid-cols-7">
        <div class="col-span-5 sm:col-span-5 flex items-center px-3 lg:px-4 bg-green-950 rounded-l-sm">
          {{ numberWithCommas(feeEstimated) }}
        </div>
        <div class="col-span-4 sm:col-span-2">
          <FiatPopover
            :content-height="screen.md ? 300 : 150"
            button-class="
              w-full pl-4 px-2.5 py-3 sm:pl-2 hover:shadow-none
              rounded-l-none rounded-r-sm bg-green-950!
            "
          />
        </div>
      </div>
    </div>

    <div class="w-full">
      <JButton
        :disabled="feeEstimated === 0 || disabledSell || noBalance"
        class="w-full"
        size="lg"
        variant="primary"
        @click="initMoonPay"
      >
        {{ t('currency.sell-with-moonpay') }}
      </JButton>
    </div>

    <div class="text-xs text-paragraph leading-none! w-full">
      {{ t('currency.third-party-services-disclaimer-sell') }}
    </div>
  </div>
</template>
