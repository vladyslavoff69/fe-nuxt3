<script lang="ts" setup>
import CryptoPopover from '~/components/organisms/wallets/popovers/CryptoPopover.vue'
import { useVuelidate } from '@vuelidate/core'
import CloseButton from '~/components/molecules/button/CloseButton.vue'
import { CURRENCY, PREFERENCE, THEME } from '~/constants'
import { EXCHANGE_HORIZONTAL_ICON, EXCHANGE_ICON } from '~/icons'
import { CONFIRM_EXCHANGE_OPERATION, CREATE_EXCHANGE_OPERATION } from '~/graphql'
import { required } from '@vuelidate/validators'
import ExchangeCryptoPopover from '~/components/organisms/crypto/ExchangeCryptoPopover.vue'

const { modalVisible } = defineProps<{
  modalVisible: boolean;
}>()

const emits = defineEmits<{
  (e: 'close:exchangeModal'): void;
}>()

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { screen } = inject(THEME)!
const { activeFiatCode } = inject(PREFERENCE)!
const { displayFiatAmount, cryptoToFiat } = inject(CURRENCY)!
const isSettingModalVisible = ref(modalVisible)
const exchangeVal = ref()

const fromCode = computed({
  get () {
    return (route.query.code ? String(route.query.code) : 'BTC')
  },
  set (v) {
    router.replace({ query: { ...route.query, code: v } })
  }
})

const toCode = computed({
  get () {
    return (route.query.currency ? String(route.query.currency) : 'BTC')
  },
  set (v) {
    router.replace({ query: { ...route.query, currency: v } })
  }
})

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

const v$ = useVuelidate(rules, {
  fromAmount,
  toCode
})

const validationForm = async () => {
  return await v$.value.$validate()
}

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
  await router.replace({ query: { ...route.query, code: toCode.value, currency: fromCode.value } })
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
    exchangeVal.value = _exchangeData.received_amount
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
  useGeneralNotify({
    type: 'success',
    title: t('notifications.exchange-success'),
    description: t('notifications.exchange-success-message')
  })

  resetCountDown()
  useTimeoutFn(() => {
    closeExchangeModal()
  }, 200)
})

watch(
  () => toCode.value,
  () => {
    if (Number(fromAmount.value) > 0) {
      exchangeCurrency()
    }
  }
)

const closeExchangeModal = () => {
  isSettingModalVisible.value = false
  emits('close:exchangeModal')
}
</script>

<template>
  <ClientOnly>
    <UModal
      v-model:open="isSettingModalVisible"
      class="w-11/12 sm:max-w-sm bg-green-950"
      :default-open="isSettingModalVisible"
      @update:open="(v) => {
      if (!v) {
        closeExchangeModal()
      }
    }"
    >
      <template #header>
        <div class="flex flex-col w-full">
          <div class="flex justify-between items-center w-full">
            <div class="text-white font-bold text-xl flex gap-x-2 items-center leading-6">
              <svg
                class="text-white w-5 h-5"
              >
                <use :href="EXCHANGE_ICON" />
              </svg>
              {{ t('home.exchanges') }}
            </div>
            <CloseButton
              class="w-4 h-4 min-w-4 min-h-4 text-paragraph"
              @click="closeExchangeModal"
            />
          </div>
          <span class="text-paragraph text-xs lg:text-sm leading-none">
          {{ t('home.email-and-push-notifications') }}
        </span>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col gap-y-3">
          <div class="grid grid-cols-5 gap-3 w-full">
            <div class="grid grid-cols-5 gap-x-3 col-span-5">
              <div class="flex justify-end col-span-5">
              <span
                v-if="fromAmount"
                class="text-sm font-bold"
              >
                {{ displayFiatAmount(cryptoToFiat(1, fromCode, activeFiatCode) * Number(fromAmount)) }}
              </span>
              </div>
              <div class="relative z-5 col-span-2">
                <ExchangeCryptoPopover
                  :content-height="screen.md ? 300 : 150"
                  :init-selected-currency="fromCode"
                  :show-label="false"
                  @update:init-selected-crypto="v => fromCode = v"
                />
                <div
                  class="flex-none absolute top-9 -right-6 z-10"
                >
                  <JButton
                    class="bg-brand! border border-border cursor-pointer transform transition-transform duration-300 hover:scale-105"
                    shape="circle"
                    size="md"
                    variant="transparent"
                    @click="switchCrypto"
                  >
                    <svg
                      class="text-white w-5 h-5"
                    >
                      <use :href="EXCHANGE_HORIZONTAL_ICON" />
                    </svg>
                  </JButton>
                </div>
              </div>
              <div class="col-span-3 flex flex-col">
                <UInput
                  v-model="fromAmount"
                  :placeholder="t('home.enter-amount')"
                  class="w-full text-sm! h-12!"
                  color="neutral"
                  size="xl"
                  @blur="onBlurFromAmount"
                />
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
            </div>
            <div class="col-span-2 flex flex-col">
              <CryptoPopover
                :class="{
                'ring-1 ring-error': v$.toCode.$error
              }"
                :content-height="screen.md ? 300 : 150"
                :show-label="false"
              />
            </div>
            <div class="col-span-3">
              <UInput
                v-model="exchangeVal"
                :disabled="true"
                :placeholder="t('home.enter-amount')"
                class="w-full text-sm! h-12!"
                color="neutral"
                size="xl"
                type="number"
              />
            </div>
            <JButton
              :disabled="!operationId"
              :loading="loadingExchangeMutate || loadingConfirmMutate"
              class="w-20"
              size="md"
              variant="primary"
              @click="completeExchange"
            >
              {{ t('base.exchange') }}
            </JButton>
          </div>

          <hr class="h-px w-full border border-border">

          <div
            v-if="exchangeData.timeLeft > 0"
            class="text-xs text-paragraph leading-none"
          >
            {{ t('home.refreshing-in') }}
            <span class="bg-brand px-2 py-1 rounded-md">
            {{ exchangeData.timeLeft }} {{ exchangeData.timeLeft > 1 ? t('base.seconds') : t('vip.second') }}.
          </span>
          </div>
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>
