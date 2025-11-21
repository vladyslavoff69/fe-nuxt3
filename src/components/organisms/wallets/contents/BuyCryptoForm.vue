<script lang="ts" setup>
import { helpers, maxValue, minValue, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { CURRENCY, PREFERENCE, THEME, WALLET } from '~/constants'
import TokenPopover from '~/components/organisms/wallets/popovers/TokenPopover.vue'
import FiatPopover from '~/components/organisms/wallets/popovers/FiatPopover.vue'
import { loadMoonPay } from '@moonpay/moonpay-js'

const route = useRoute()
const { screen } = inject(THEME)!
const { cryptoCurrencies, usdToFiat, cryptoToUsd, cryptoToFiat } = inject(CURRENCY)!
const { activeFiatCode } = inject(PREFERENCE)!
const { wallets } = inject(WALLET)!
const { t } = useI18n()

const selectedCurrency = computed(() => (route.query.currency ? String(route.query.currency) : 'BTC'))
const selectedCrypto = computed(() => cryptoCurrencies.value.find(c => c.code === selectedCurrency.value)!)
const selectedNetwork = ref((selectedCrypto.value?.networks && selectedCrypto.value.networks.length) ? selectedCrypto.value.networks[0]?.id : 0)
const { result, loading, refetch, onError } = useWalletAddress({
  currencyCode: selectedCurrency.value,
  networkId: Number(selectedNetwork.value),
})

const walletAddress = computed(() => result.value?.depositAddress?.walletAddress)
const wallet = computed(() =>
  wallets.value.find(wallet => wallet.currency_code === route.query.currency)!
)
const address = computed(() => wallet.value?.activeAddress?.address || null)
const amount = ref<number>(0)
const disabledBuy = ref<boolean>(false)

const minAmount = computed(() => (
  cryptoToFiat(Number(selectedCrypto.value.minBuyAmount), selectedCurrency.value, activeFiatCode.value) || 0)
)
const maxAmount = computed(() => (
  cryptoToFiat(Number(selectedCrypto.value.maxBuyAmount), selectedCurrency.value, activeFiatCode.value) || 0)
)

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

const setMaxAmount = () => {
  amount.value = Number(maxAmount.value)
}

const v$ = useVuelidate(rules, { amount })

const inputAmount = async () => {
  disabledBuy.value = false
  if (!await v$.value.amount.$validate()) {
    disabledBuy.value = true
    return false
  }

  return true
}

const estimated = computed(() => ((amount.value / usdToFiat.value[activeFiatCode.value]) / cryptoToUsd.value[selectedCurrency.value]))
const feeEstimated = computed(() => (estimated.value - (estimated.value * 0.01)))

const runtimeConfig = useRuntimeConfig()
const moonPay = ref()
const initMoonPay = async () => {
  if (!await inputAmount() || (!walletAddress.value && !address.value)) {
    return
  }

  if (moonPay.value) {
    // @ts-ignore
    const moonPaySdk = moonPay.value({
      flow: 'buy',
      // @ts-ignore
      environment: runtimeConfig.public.moonPayEnv || 'sandbox',
      params: {
        apiKey: runtimeConfig.public.moonPayApi,
        theme: 'dark',
        currencyCode: selectedCurrency.value.toLowerCase(),
        baseCurrencyCode: activeFiatCode.value.toLowerCase(),
        baseCurrencyAmount: Number(amount.value),
        walletAddress: walletAddress.value || address.value,
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

onError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.failed-get-wallet-address'),
    description: parsedError.message,
  })
})

watch(() => [selectedCurrency.value, activeFiatCode.value], (newVal, oldVal) => {
  if (newVal !== oldVal) {
    disabledBuy.value = false
    v$.value.$reset()
  }
}, { immediate: true })

watch(() => selectedNetwork.value, (newValue) => {
  if (newValue !== 0) {
    refetch({
      currencyCode: selectedCurrency.value,
      networkId: Number(selectedNetwork.value),
    })
  }
})

onMounted(async () => {
  moonPay.value = await loadMoonPay()
})
</script>

<template>
  <div class="w-full flex flex-col gap-y-5 text-white leading-none text-sm">
    <div class="flex flex-col gap-y-2 w-full">
      <div class="font-bold">
        {{ t('currency.pay-with') }}
      </div>
      <div class="w-full grid grid-cols-9 sm:grid-cols-7">
        <div class="col-span-5 sm:col-span-5">
          <UInput
            v-model="amount"
            class="w-full relative bg-green-950 h-12 rounded-l-sm flex items-center rounded-r-0 px-2 lg:px-3 py-2.5 lg:py-3 ring-0 border-0"
            color="neutral"
            placeholder="0.00"
            size="md"
            variant="none"
            @update:model-value="inputAmount"
          >
            <template #trailing>
              <JButton
                class="z-10 duration-150 min-h-6! py-1!"
                size="sm"
                type="button"
                variant="primary"
                @click="setMaxAmount"
              >
                {{ t('base.max') }}
              </JButton>
            </template>
          </UInput>
        </div>
        <div class="col-span-4 sm:col-span-2">
          <FiatPopover
            :content-height="screen.md ? 300 : 150"
            button-class="
                w-full pl-4 px-2.5 py-3 sm:pl-2 hover:shadow-none rounded-l-none rounded-r-sm bg-green-950!
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
    </div>

    <div class="flex flex-col gap-y-2 w-full">
      <div class="font-bold">
        {{ t('currency.you-get') }}
      </div>
      <div class="w-full grid grid-cols-9 sm:grid-cols-7">
        <div class="col-span-5 sm:col-span-5 flex items-center px-3 lg:px-4 bg-green-950 rounded-l-sm">
          {{ (feeEstimated - feeEstimated * 0.073).toFixed(8) || '0.00000000' }}
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
    </div>

    <div class="flex flex-col gap-y-2 w-full">
      <div class="font-bold">
        {{ t('currency.acceptable-payment-methods') }}
      </div>
      <div class="w-full flex items-center justify-center">
        <div class="text-white font-bold flex flex-col justify-center items-center">
          <NuxtImg
            alt="Master Card"
            class="h-10"
            loading="lazy"
            provider="cloudflare"
            src="aa5a8451-90fa-4900-4aeb-a1dee0fd5600/sm"
          />
          <span class="-mt-2 text-lg leading-none">mastercard</span>
        </div>
        <NuxtImg
          alt="Visa Card"
          class="h-10"
          loading="lazy"
          provider="cloudflare"
          src="4cd38b9e-9ecd-4c8a-01b3-dac884ac9700/sm"
        />
        <NuxtImg
          alt="Maestro Card"
          class="h-10"
          loading="lazy"
          provider="cloudflare"
          src="299da5e4-1964-4d4c-2e4a-cc31c456af00/sm"
        />
      </div>
    </div>

    <div class="w-full">
      <JButton
        :disabled="feeEstimated === 0 || disabledBuy || (!walletAddress && !address)"
        :loading="loading"
        class="w-full"
        size="lg"
        variant="primary"
        @click="initMoonPay"
      >
        {{ t('currency.buy-with-moonpay') }}
      </JButton>
    </div>

    <div class="text-xs text-paragraph leading-none! w-full">
      {{ t('currency.third-party-services-disclaimer') }}
    </div>
  </div>
</template>
