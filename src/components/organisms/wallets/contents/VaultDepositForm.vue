<script lang="ts" setup>
import { CURRENCY, PREFERENCE, THEME } from '~/constants'
import { helpers, maxValue, required } from '@vuelidate/validators'
import TokenPopover from '~/components/organisms/wallets/popovers/TokenPopover.vue'
import { useVuelidate } from '@vuelidate/core'
import LAmountInput from '~/components/molecules/inputs/LAmountInput.vue'
import { DEPOSIT_TO_VAULT_MUTATION, GET_VAULT_RATE_QUERY } from '~/graphql'
import type { CurrencyItem } from '~/types'
import { VAULT_TRANSPARENT_ICON } from '~/icons'
import { LOADING_ICON } from '~/components/symbols'

const { t } = useI18n()
const { screen } = inject(THEME)!
const router = useRouter()
const route = useRoute()
const { activeFiatCode, displayInfiatEnabled } = inject(PREFERENCE)!
const {
  userBalances,
  cryptoCurrencies,
  refetchBalances,
  cryptoToFiat,
  displayCryptoAmount,
  displayFiatAmount
} = inject(CURRENCY)!

const formData = reactive({
  amount: 0,
})

const { result: vaultRateResult, loading: vaultRateLoading } = useQuery(
  GET_VAULT_RATE_QUERY, {}
)

const selectedCryptoCode = computed({
  get () {
    return route.query.currency ? String(route.query.currency) : 'BTC'
  },
  set (v) {
    router.replace({ query: { ...route.query, currency: v } })
  }
})
const cryptoItem = computed(() => cryptoCurrencies.value.find((cItem: CurrencyItem) => cItem.code === selectedCryptoCode.value))
const fiatPrice = computed(() => cryptoToFiat(1, selectedCryptoCode.value, activeFiatCode.value))
const selectedBalance = computed(() => userBalances.value?.find(item => item.currencyCode === selectedCryptoCode.value))
const selectedCryptoBalance = computed(() => selectedBalance.value?.availableBalance || 0)
const selectedVaultedBalance = computed(() => selectedBalance.value?.vaultedBalance || 0)
const selectedLockedBalance = computed(() => selectedBalance.value?.lockedBalance || 0)
const selectedFiatBalance = computed(() => (selectedBalance.value?.availableBalance || 0) * fiatPrice.value)
const selectedVaultedFiatBalance = computed(() => (selectedBalance.value?.vaultedBalance || 0) * fiatPrice.value)
const selectedLockedFiatBalance = computed(() => (selectedBalance.value?.lockedBalance || 0) * fiatPrice.value)
const selectedRate = computed(() => vaultRateResult.value?.getVaultRates?.find(rItem => rItem.active && rItem.currency?.code === selectedCryptoCode.value))

const v = {
  get inFiat () {
    return displayInfiatEnabled.value
  }
}

const fiatValue = computed(() => (Number(formData.amount) * fiatPrice.value))
const cryptoValue = computed(() => {
  if (v.inFiat) {
    return formData.amount / fiatPrice.value
  } else {
    return Number(formData.amount)
  }
})

const maxAmount = computed(() => (displayInfiatEnabled.value ? selectedFiatBalance.value : selectedCryptoBalance.value))
const formRules = computed(() => {
  return {
    amount: {
      maxValue: helpers.withMessage('Deposit amount exceeds available balance.', maxValue(maxAmount.value)),
      required: helpers.withMessage('Amount is required', required),
    }
  }
})

const v$ = useVuelidate(formRules, formData)
const inputAmount = async () => {
  await v$.value.amount.$validate()
}

const isMaxAmountSelect = ref<boolean>(false)
const setMaxAmount = () => {
  formData.amount = maxAmount.value
  isMaxAmountSelect.value = true
}

watch(
  () => fiatPrice.value,
  (v) => {
    if ((v && isMaxAmountSelect.value) || Number(formData.amount) > maxAmount.value) {
      setMaxAmount()
    }
  },
)

const { mutate, loading, onDone, onError } = useMutation(DEPOSIT_TO_VAULT_MUTATION, {
  errorPolicy: 'none',
})

const onDeposit = async () => {
  if (!(await v$.value.amount.$validate())) {
    return
  }

  if (Number(formData.amount) === 0) {
    return
  }

  if (loading.value) {
    return
  }

  await mutate({
    currencyCode: selectedCryptoCode.value,
    amount: displayInfiatEnabled.value ? cryptoValue.value : Number(formData.amount),
  })
}

onDone(() => {
  formData.amount = 0
  v$.value.$reset()
  refetchBalances()
})

onError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message,
  })
})
</script>

<template>
  <div class="col-span-3 w-full md:w-[90%] mx-auto text-white">
    <div class="w-full relative aspect-3/2 rounded-xl bg-green-950 flex flex-col items-center justify-center z-1">
      <div class="w-[80%] h-[80%] mx-auto flex items-center justify-center box-border overflow-hidden bg-brand rounded-3xl">
        <NuxtImg
          class="w-auto h-[220px] md:h-[290px] scale-110 box-border"
          loading="lazy"
          provider="cloudflare"
          alt="Junglebet.com"
          src="/8cba28ec-f2e2-41e7-8e2d-98f5cc970f00/md"
        />
      </div>

      <div class="w-full flex items-center justify-between absolute p-2 md:p-4 bottom-1 md:bottom-0">
        <div class="flex items-center gap-1 w-1/2">
          <span class="font-bold">Vaulted:</span>
          <span class="flex flex-col text-sm text-white leading-none">
            <span>
              {{ displayCryptoAmount(selectedVaultedBalance, selectedCryptoCode) }}
            </span>
            <span class="text-paragraph flex items-center gap-0.5">
              <UIcon
                class="w-4 min-w-4"
                name="lucide:equal-approximately"
              />
              {{ displayFiatAmount(selectedVaultedFiatBalance) }}
            </span>
          </span>
        </div>
        <div class="flex items-center gap-1 w-1/2 justify-end">
          <span class="font-bold">Locked:</span>
          <span class="flex flex-col text-sm text-white leading-none">
            <span>
              {{ displayCryptoAmount(selectedLockedBalance, selectedCryptoCode) }}
            </span>
            <span class="text-paragraph flex items-center gap-0.5">
              <UIcon
                class="w-4 min-w-4"
                name="lucide:equal-approximately"
              />
              {{ displayFiatAmount(selectedLockedFiatBalance) }}
            </span>
          </span>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-1 w-full p-2 md:p-4 rounded-md bg-primary -mt-3 relative z-2">
      <div class="flex flex-col md:flex-row items-center gap-1">
        <div class="font-bold flex flex-col gap-0.5 w-full text-brand">
          <div
            v-if="v.inFiat"
            class="flex items-center gap-0.5 justify-end"
          >
            <UIcon
              class="w-4 min-w-4"
              name="lucide:equal-approximately"
            />
            {{ displayCryptoAmount(cryptoValue, selectedCryptoCode) }}
          </div>
          <div
            v-else
            class="flex items-center gap-0.5 justify-end"
          >
            <UIcon
              class="w-4 min-w-4"
              name="lucide:equal-approximately"
            />
            {{ displayFiatAmount(fiatValue) }}
          </div>

          <div class="flex items-center">
            <TokenPopover
              :content-height="screen.md ? 300 : 150"
              placement="top"
              button-class="h-9! py-0 rounded-r-none"
            />
            <div class="w-full">
              <LAmountInput
                v-model="formData.amount"
                class="h-9 rounded-md bg-white flex items-center rounded-l-none"
                class-name="bg-white! pl-3 lg:pl-4 text-brand! focus:ring-0!"
                :show-icon="false"
                :lock="!selectedRate && !vaultRateLoading"
                @set:max-amount="setMaxAmount"
                @update:model-value="inputAmount"
              />
            </div>
          </div>
        </div>
        <div class="w-full md:w-auto">
          <div class="h-3.5 hidden md:block" />
          <JbBlankButton
            class="
              text-nowrap px-2 h-9 bg-brand rounded-md active:scale-[0.98]
              active:translate-y-1 w-full md:w-32 disabled:opacity-60 disabled:cursor-not-allowed
            "
            :disabled="loading || formData.amount <= 0 || (!selectedRate && !vaultRateLoading)"
            @click="onDeposit"
          >
            <span
              v-if="loading"
              class="w-full flex items-center justify-center min-h-5"
              @click.prevent
            >
              <svg class="text-paragraph animate-spin w-4 h-4">
                <use :href="LOADING_ICON" />
              </svg>
            </span>
            <span v-else>Vault Deposit</span>
          </JbBlankButton>
        </div>
      </div>

      <JbInputMessage v-if="v$.amount.$error">
        {{ v$.amount.$errors[0].$message }}
      </JbInputMessage>
    </div>
    <div
      v-if="vaultRateLoading"
      class="w-full h-3 flex items-center"
    >
      <USkeleton class="w-1/3 h-3 bg-green-950" />
    </div>
    <div
      v-else-if="selectedRate"
      class="w-full flex items-center justify-center gap-1 font-bold"
    >
      <span>Earns up to</span>
      <UTooltip
        :content="{ side: 'top' }"
        arrow
        class="ring-1 ring-gold"
      >
        <template #content>
            <span class="w-full flex flex-col justify-center items-center px-1.5 py-1">
              <span class="text-white font-bold">Save {{ cryptoItem?.name }} for a Rainy Day</span>
              <span class="text-xs leading-none">
                earns up to {{ selectedRate.rate }}% APR interest
              </span>
              <span class="w-full sm:px-4 grid grid-cols-6 items-center mt-2 gap-1">
                <span class="col-span-2">
                  <svg class="w-16 h-16 text-gold">
                    <use :href="VAULT_TRANSPARENT_ICON" />
                  </svg>
                </span>
                <span class="col-span-4 flex flex-col leading-none">
                  <span class="text-white grid grid-cols-6 w-full gap-x-1">
                    <span class="col-span-3">0 - 30 days</span>
                    <span class="col-span-2 flex items-center justify-center">..................</span>
                    <span class="col-span-1">{{ selectedRate.monthly_rate }}%</span>
                  </span>
                  <span class="text-white grid grid-cols-6 w-full gap-x-1">
                    <span class="col-span-3">31 - 60 days</span>
                    <span class="col-span-2 flex items-center justify-center">..................</span>
                    <span class="col-span-1 text-booster">{{ (selectedRate.monthly_rate + 1) }}%</span>
                  </span>
                  <span class="text-white grid grid-cols-6 w-full gap-x-1">
                    <span class="col-span-3">61+ days</span>
                    <span class="col-span-2 flex items-center justify-center">..................</span>
                    <span class="col-span-1 text-booster">{{ (selectedRate.monthly_rate + 2) }}%</span>
                  </span>
                  <span
                    v-if="selectedRate.period && selectedRate.period !== ''"
                    class="text-white grid grid-cols-6 w-full gap-x-1"
                  >
                    <span class="col-span-3">Minimum lock days</span>
                    <span class="col-span-2 flex items-center justify-center">..................</span>
                    <span class="col-span-1">{{ selectedRate.minimum_lock_days }}</span>
                  </span>
                  <span
                    v-if="selectedRate.period && selectedRate.period !== ''"
                    class="text-white grid grid-cols-6 w-full gap-x-1"
                  >
                    <span class="col-span-3">Maximum lock days</span>
                    <span class="col-span-2 flex items-center justify-center">..................</span>
                    <span class="col-span-1">{{ selectedRate.maximum_lock_days }}</span>
                  </span>
                </span>
              </span>
              <span class="w-full flex justify-between items-center py-1 mt-2">
                <span
                  v-if="selectedRate.period && selectedRate.period !== ''"
                  class="text-highlights font-bold"
                >
                  <span class="capitalize">{{ selectedRate.period }}</span> lock period
                </span>
                <span
                  v-else
                  class="text-highlights font-bold"
                >
                  No lock period
                </span>
              </span>
            </span>
        </template>
        <span class="flex flex-col mt-1 cursor-help">
            <span class="text-booster border-b border-dashed border-white">{{ selectedRate.rate }}%</span>
          </span>
      </UTooltip>
      <span>Interest</span>
    </div>
    <div
      v-else
      class="w-full flex items-center justify-center"
    >
      <JbInputMessage>
        No defined rate for the selected token.
      </JbInputMessage>
    </div>
  </div>
</template>
