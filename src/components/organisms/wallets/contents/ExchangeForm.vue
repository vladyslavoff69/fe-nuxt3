<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { CURRENCY, PREFERENCE, THEME } from '~/constants'
import { CONFIRM_EXCHANGE_OPERATION, CREATE_EXCHANGE_OPERATION } from '~/graphql'
import { required } from '@vuelidate/validators'
import ExchangeCodePopover from '~/components/organisms/crypto/ExchangeCodePopover.vue'
import RecentSwapTable from '~/components/organisms/wallets/contents/RecentSwapTable.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { screen } = inject(THEME)!
const { activeFiatCode, activeCryptoCode } = inject(PREFERENCE)!
const {
  userBalances, cryptoCurrencies, cryptoToUsd, usdToFiat, refetchBalances, displayFiatAmount
} = inject(CURRENCY)!

const exchangeVal = ref()
const fromCode = computed({
  get () {
    return route.query.currency ? String(route.query.currency) : 'BTC'
  },
  set (v) {
    router.replace({ query: { ...route.query, currency: v } })
  }
})

const fromBalance = computed(() => userBalances.value?.find(item => item.currencyCode === fromCode.value))
const toCode = ref()
const toBalance = computed(() => userBalances.value?.find(item => item.currencyCode === toCode.value))
const validateWatchAmount = (value: number): boolean => {
  return value > 0
}

const validateCryptoMatch = (value: string): boolean => {
  return fromCode.value !== value
}
const operationId = ref()
const rules = {
  toCode: {
    required,
    notMatch: validateCryptoMatch
  },
  fromAmount: {
    required,
    mustBigger: validateWatchAmount
  }
}
const fromAmount = ref()
const exchangeIntervalId = ref<any>(null)
const exchangeData = reactive({
  timeLeft: 0,
  expiresAt: null,
  fee: 0.00
})

const resetCountDown = () => {
  exchangeData.timeLeft = 0
  exchangeData.fee = 0.00
  exchangeData.expiresAt = null
  v$.value.$reset()
  clearInterval(exchangeIntervalId.value)
}

const calculateTimeLeft = () => {
  if (!exchangeData.expiresAt) {
    return
  }
  const now = new Date()
  const expirationTime = new Date(exchangeData.expiresAt)
  const difference = expirationTime.getTime() - now.getTime()

  if (difference <= 0) {
    /* reset */
    resetCountDown()
    return
  }

  exchangeData.timeLeft = Math.floor((difference / 1000) % 60)
}

const v$ = useVuelidate(rules, {
  fromAmount,
  toCode
})

const validationForm = async () => {
  return await v$.value.$validate()
}

const {
  mutate: exchangeMutate,
  loading: loadingExchangeMutate,
  onDone: exchangeOnDone,
  onError: exchangeOnError,
} = useMutation(CREATE_EXCHANGE_OPERATION)

const {
  mutate: confirmMutate,
  loading: loadingConfirmMutate,
  onDone: confirmOnDone,
  onError: confirmOnError,
} = useMutation(CONFIRM_EXCHANGE_OPERATION)

const exchangeCurrency = async () => {
  if (!(await validationForm()) || loadingExchangeMutate.value) {
    return
  }

  await exchangeMutate({
    fromCode: fromCode.value,
    toCode: toCode.value,
    amount: Number(fromAmount.value)
  })
}

const switchCrypto = async () => {
  const _toCode = toCode.value
  toCode.value = fromCode.value
  fromAmount.value = ''
  exchangeVal.value = ''

  await router.replace({ query: { ...route.query, currency: _toCode } })
}

const completeExchange = () => {
  if (operationId.value) {
    confirmMutate({
      operationId: Number(operationId.value)
    })
  }
}

const onBlurFromAmount = () => {
  if (Number(fromAmount.value) && Number(fromAmount.value) > 0) {
    exchangeCurrency()
  }
}

exchangeOnError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message
  })
})

exchangeOnDone(({ data }) => {
  if (data.createExchangeOperation.id) {
    const _exchangeData = data.createExchangeOperation
    operationId.value = _exchangeData.id
    exchangeVal.value = _exchangeData.received_amount?.toFixed(8)
    exchangeData.expiresAt = _exchangeData.expires_at
    calculateTimeLeft()
    exchangeData.fee = _exchangeData.fee
    exchangeIntervalId.value = setInterval(calculateTimeLeft, 1000)
  }
})

confirmOnError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message
  })
})

confirmOnDone(() => {
  refetchBalances()
  v$.value.$reset()
  resetCountDown()
  useGeneralNotify({
    type: 'success',
    title: t('notifications.exchange-success'),
    description: t('notifications.exchange-success-message')
  })
})

const setToCode = () => {
  return cryptoCurrencies.value?.filter(item => item.code !== fromCode.value)?.[0]
}

watch(() => fromCode.value, (v) => {
  if (v && v === toCode.value) {
    toCode.value = setToCode()?.code
  }

  if (v) {
    fromAmount.value = ''
    exchangeVal.value = ''
  }
}, { immediate: true })

watch(() => toCode.value, () => {
  if (Number(fromAmount.value) > 0) {
    exchangeCurrency()
  }
}, { immediate: true })

onMounted(() => {
  if (fromCode.value !== activeCryptoCode.value) {
    toCode.value = activeCryptoCode.value
  } else {
    toCode.value = setToCode()?.code
  }
})

const onClickMax = () => {
  fromAmount.value = fromBalance.value?.availableBalance.toFixed(8)
  if (Number(fromAmount.value) && Number(fromAmount.value) > 0) {
    exchangeCurrency()
  }
}

const updateToFiat = (balance: number, code: string) => {
  return parseFloat((balance * cryptoToUsd.value[code] * usdToFiat.value[activeFiatCode.value]).toFixed(2))
}
</script>

<template>
  <div
    v-if="toCode"
    class="w-full grid grid-cols-1 gap-y-1"
  >
    <div class="col-span-1 w-full text-sm">
      Swap on-site between tokens instantly without gas/transactions fees - Select the currency you’re swapping from on
      the left and the currency you’re swapping to on the right.
    </div>
    <div class="grid grid-cols-11 items-center justify-center w-full col-span-1 gap-1 sm:gap-2">
      <div class="col-span-11 sm:col-span-5 flex flex-col gap-1">
        <div class="border-2 border-paragraph rounded-md bg-green-950 p-3 flex flex-col w-full gap-1 sm:gap-2">
          <div class="flex justify-between items-center">
            <span class="uppercase text-white font-bold">From</span>
            <JButton
              class="min-h-6! py-0! uppercase"
              size="sm"
              type="button"
              variant="alternative"
              @click="onClickMax"
            >
              {{ t('base.max') }}
            </JButton>
          </div>
          <div class="w-full flex flex-col items-center pb-0 sm:pb-2">
            <UInput
              v-model="fromAmount"
              placeholder="0.00000000"
              class="
                w-[95%] mx-auto text-center pb-0! disabled:opacity-100
                disabled:text-paragraph placeholder-white font-medium disabled:placeholder-paragraph px-0
              "
              color="neutral"
              size="xl"
              type="number"
              variant="none"
              :disabled="fromBalance?.availableBalance === 0"
              :ui="{
                base: 'text-2xl! text-center! text-white!'
              }"
              @blur="onBlurFromAmount"
            />
            <div class="text-sm flex items-center justify-end w-[85%] mx-auto leading-none">
              <UIcon
                class="w-4 min-w-4"
                name="lucide:equal-approximately"
              />

              {{
                activeFiatCode === 'USD'
                  ? `$${updateToFiat(Number(fromAmount || 0), fromCode)?.toFixed(2)}`
                  : displayFiatAmount(updateToFiat(Number(fromAmount || 0), fromCode))
              }}
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="flex flex-col">
              <span class="text-xs leading-none">{{ t('affiliate.available') }}</span>
              <span class="text-sm text-white leading-none">{{
                (fromBalance?.availableBalance || 0)?.toFixed(8)
              }}</span>
            </span>
            <ExchangeCodePopover
              :content-height="screen.md ? 300 : 150"
              :init-selected-currency="fromCode"
              :show-label="false"
              button-class="rounded-md bg-brand! w-auto"
              @update:init-selected-crypto="v => fromCode = v"
            />
          </div>
        </div>
        <JbInputMessage
          v-if="v$.fromAmount.$error"
          class="h-4"
        >
          <UIcon
            class="w-4 h-4 min-w-4 min-h-4 text-red-600"
            name="i-heroicons-exclamation-circle-20-solid"
          />
          {{
            v$.fromAmount.required.$invalid ? t('errors.FIELD_REQUIRED') : t('errors.POSITIVE_AMOUNT')
          }}
        </JbInputMessage>
      </div>
      <div class="col-span-11 sm:col-span-1 flex items-center justify-center">
        <UIcon
          name="mdi:swap-horizontal-hidden"
          class="w-full h-7 min-w-full min-h-7 text-primary cursor-pointer rotate-90 sm:rotate-0"
          @click="switchCrypto"
        />
      </div>
      <div class="col-span-11 sm:col-span-5 flex flex-col gap-1">
        <div class="rounded-md bg-green-950 p-3 flex flex-col w-full gap-1 sm:gap-2">
          <div class="flex items-center">
            <span class="uppercase text-white font-bold">To</span>
          </div>
          <div class="w-full flex flex-col items-center pb-0 sm:pb-2">
            <UInput
              v-model="exchangeVal"
              :disabled="true"
              placeholder="0.00000000"
              class="
                w-[95%] mx-auto bg-green-950! text-center pb-0! disabled:opacity-100
                disabled:text-paragraph placeholder-white font-medium disabled:placeholder-paragraph px-0
              "
              color="neutral"
              size="xl"
              type="number"
              variant="none"
              :ui="{
                base: 'text-2xl! text-center! text-white!'
              }"
            />
            <div class="text-sm flex items-center justify-end w-[85%] mx-auto leading-none">
              <UIcon
                class="w-4 min-w-4"
                name="lucide:equal-approximately"
              />

              {{
                activeFiatCode === 'USD'
                  ? `$${updateToFiat((exchangeVal || 0), toCode)?.toFixed(2)}`
                  : displayFiatAmount(updateToFiat((exchangeVal || 0), toCode))
              }}
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="flex flex-col">
              <span class="text-xs leading-none">{{ t('affiliate.available') }}</span>
              <span class="text-sm text-white leading-none">
                {{ (toBalance?.availableBalance || 0).toFixed(8) }}
              </span>
            </span>
            <ExchangeCodePopover
              :content-height="screen.md ? 300 : 150"
              :init-selected-currency="toCode"
              :show-label="false"
              :exclude-init="fromCode"
              button-class="rounded-md bg-brand! w-auto"
              @update:init-selected-crypto="v => toCode = v"
            />
          </div>
        </div>
        <JbInputMessage
          v-if="v$.fromAmount.$error"
          class="h-4"
        />
      </div>
    </div>
    <div
      v-if="exchangeData.timeLeft > 0"
      class="text-xs text-paragraph leading-none"
    >
      {{ t('home.refreshing-in') }} {{ exchangeData.timeLeft }} {{
        exchangeData.timeLeft > 1 ? t('base.seconds') : t('vip.second')
      }}
    </div>

    <JButton
      :disabled="!operationId || !fromAmount || fromAmount === '' || Number(fromAmount) <= 0"
      :loading="loadingExchangeMutate || loadingConfirmMutate"
      class="w-full mt-5 uppercase"
      size="md"
      variant="tab"
      @click="completeExchange"
    >
      {{ t('base.swap') }} {{ fromCode }}
      <UIcon
        name="material-symbols:arrow-forward"
        class="w-4 h-4 min-w-4 min-h-4"
      />
      {{ toCode }}
    </JButton>

    <div class="w-full mt-2 grid grid-cols-7 gap-1 sm:gap-1.5">
      <div class="col-span-7 sm:hidden bg-green-950 rounded-md h-40 p-2" />
      <div class="col-span-7 sm:col-span-5">
        <div class="text-white uppercase font-semibold text-sm">
          My Recent Swaps
        </div>
        <RecentSwapTable />
      </div>
      <div class="hidden sm:block col-span-2 bg-green-950 rounded-md h-full p-4" />
    </div>
  </div>
</template>
