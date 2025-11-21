<script lang="ts" setup>
import LAmountInput from '~/components/molecules/inputs/LAmountInput.vue'
import CloseButton from '~/components/molecules/button/CloseButton.vue'
import { CHAT_RAIN_ICON } from '~/components/symbols'
import { helpers, maxValue, minValue, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { AUTH, CHAT, CURRENCY, PREFERENCE, THEME } from '~/constants'
import { CHAT_RAIN, EMAIL_TWO_FA_MUTATION } from '~/graphql'
import ConfirmWithdraw from '~/components/organisms/wallets/contents/ConfirmWithdraw.vue'
import TokenPopover from '~/components/organisms/wallets/popovers/TokenPopover.vue'

const { modalVisible } = defineProps({
  modalVisible: {
    type: Boolean,
  },
})

const emit = defineEmits<{
  (e: 'closed:rainmodal'): void;
}>()

const runtimeConfig = useRuntimeConfig()
const chatRainConf = runtimeConfig.public?.chatRain
const { t } = useI18n()
const { screen } = inject(THEME)!
const { me } = inject(AUTH)!
const route = useRoute()
const { activeFiatCode, activeCryptoCode } = inject(PREFERENCE)!
const {
  cryptoToFiat,
  userBalances,
  displayFiatAmount,
  displayCryptoAmount,
  cryptoCurrencies,
} = inject(CURRENCY)!
const { chatRoomId } = inject(CHAT)!

const isOpen = ref(modalVisible)
const isConfirmOpen = ref<boolean>(false)
const selectedCryptoCode = computed(() => route.query.currency ? String(route.query.currency) : activeCryptoCode.value)
const selectedUserBalance = computed(() => userBalances.value.find(ub => ub.currencyCode === selectedCryptoCode.value)!)
const selectedCryptoBalance = computed(() => selectedUserBalance.value.availableBalance)
const selectedCryptoItem = computed(() => cryptoCurrencies.value.find(c => c.code === selectedCryptoCode.value)!)

const fiatPrice = computed(() => {
  return cryptoToFiat(1, selectedCryptoCode.value, activeFiatCode.value)
})

const minRainAmount = computed(() => {
  return selectedCryptoItem.value.min_tip_withdraw
})

const maxAmount = computed(() => {
  const maxDollarCryptoAmount = 500 / cryptoToFiat(1, selectedCryptoCode.value, 'USD') /* $500 */
  return Math.min(maxDollarCryptoAmount, selectedCryptoBalance.value)
})

const formData = reactive({
  amount: 0,
  message: null,
  numberOfPeople: 1
})

const fiatValue = computed(() => {
  return Number(formData.amount) * fiatPrice.value
})

const rules = computed(() => {
  return {
    amount: {
      maxValue: helpers.withMessage('Rain amount exceeds max amount or available balance.', maxValue(maxAmount.value)),
      minValue: helpers.withMessage(
        `The minimum rain amount is ${displayCryptoAmount(minRainAmount.value, selectedCryptoCode.value)}`,
        minValue(minRainAmount.value)),
      required: helpers.withMessage('Amount is required', required),
    },
    numberOfPeople: {
      required,
      minValue: minValue(1),
      maxValue: maxValue(30),
    },
  }
})
const v$ = useVuelidate(rules, formData)

const inputNumberOfPeople = () => {
  v$.value.numberOfPeople.$validate()
}

const inputAmount = () => {
  v$.value.amount.$validate()
}

const setMaxAmount = () => {
  formData.amount = Number(maxAmount.value)
}

/* Make Rain */
const {
  mutate: rainMutate,
  loading: rainLoading,
  onDone: onRainDone,
  onError: onRainError,
  error: rainError
} = useMutation(CHAT_RAIN)
const parsedError = useGraphqlError(rainError)

onRainDone(() => {
  onCloseModal()
})

onRainError(async (error) => {
  if ('input.code' in parsedError.value) {
    useGeneralNotify({
      type: 'error',
      title: t('notifications.incorrect-2fa-code'),
      description: t('errors.VERIFICATION_CODE_NOT_MATCH')
    })

    return
  }

  isConfirmOpen.value = false
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: getGraphqlErrorMessage(error)
  })
})

/* Handle 2FA Email Verification */
const {
  mutate: emailTwoFaMutate,
  onDone: onEmailTwoFaDone,
  onError: onEmailTwoFaError,
  loading: emailTwoFaLoading
} = useMutation(EMAIL_TWO_FA_MUTATION)

onEmailTwoFaDone(async () => {
  isConfirmOpen.value = true
})

onEmailTwoFaError((error) => {
  useGeneralNotify({
    type: 'error',
    title: t('errors.EMAIL_TWO_FACTOR_VERIFICATION_FAILED'),
    description: getGraphqlErrorMessage(error)
  })
})

const isSubmitting = computed(() => rainLoading.value || emailTwoFaLoading.value)

const onMakeRain = async () => {
  if (!await v$.value.$validate()) {
    return false
  }
  if (isSubmitting.value) {
    return false
  }
  if (me.value!.enable2fa) {
    isConfirmOpen.value = true
  } else {
    await emailTwoFaMutate({
      action: 'RAIN',
      amount: formData.amount,
      username: me.value?.username,
      currencyCode: selectedCryptoCode.value
    })
  }
}

/* Handle 2FA validation success & send rain */
const onSubmit = (code: string) => {
  const payload: any = {
    chat_room_id: chatRoomId.value,
    currency_code: selectedCryptoCode.value,
    currency_amount: Number(formData.amount),
    user_amount: Number(formData.numberOfPeople),
    code
  }

  if (formData.message) {
    payload.message = formData.message
  }

  rainMutate(payload)
}

const onCloseModal = () => {
  emit('closed:rainmodal')
}
</script>
<template>
  <ClientOnly>
    <UModal
      v-model:open="isOpen"
      class="w-11/12 sm:max-w-lg p-2 sm:p-4 bg-green-950"
      :default-open="isOpen"
      @update:open="(v) => {
      if (!v) {
        onCloseModal()
      }
    }"
    >
      <template #content>
        <div class="w-full h-full flex flex-col gap-y-2 md:gap-y-4">
          <div class="flex items-center justify-between">
            <div class="flex gap-4 items-center justify-between w-full border-b border-b-green-950">
              <div class="flex-1 flex gap-x-2 items-center text-white">
                <svg
                  v-if="chatRainConf === 'rain'"
                  class="w-6 h-6 min-w-6 min-h-6"
                >
                  <use :href="CHAT_RAIN_ICON" />
                </svg>
                <UIcon
                  v-else
                  name="mingcute:snow-line"
                  class="w-6 h-6 min-w-6 min-h-6 text-white"
                />
                <span class="text-lg font-bold">
                {{ t('chat.chat') }} {{ chatRainConf === 'rain' ? t('chat.rain') : t('chat.snow') }}
              </span>
              </div>
              <div class="flex items-center gap-x-2">
                <CloseButton
                  class="w-4 h-4 min-w-4 min-h-4 text-paragraph"
                  @click="onCloseModal"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-x-2 md:gap-x-3 gap-y-2 md:gap-y-4 text-white leading-none text-sm">
            <div class="col-span-3 sm:col-span-1 font-bold flex flex-col gap-y-2">
              {{ t('currency.wallet') }}
              <TokenPopover
                :content-height="screen.md ? 300 : 150"
                button-class="w-full pl-3 lg:pl-4 pr-2 lg:pr-3 py-3 rounded-md bg-brand!"
              />
            </div>

            <div
              class="col-span-3 sm:col-span-2 flex flex-col gap-y-2"
            >
              <div class="h-3.5 hidden sm:block" />
              <div class="rounded-md px-3 sm:px-4 h-12 flex items-center bg-brand">
                {{ selectedCryptoBalance.toFixed(8) }}
              </div>
            </div>

            <div class="col-span-3 flex flex-col gap-y-2">
              <div class="flex justify-between items-center font-bold">
                {{ t('missing.total') }} {{ t('base.amount') }}
                <div class="text-paragraph">
                  {{ displayFiatAmount(fiatValue) }}
                </div>
              </div>

              <LAmountInput
                v-model="formData.amount"
                :force-crypto="true"
                class="h-12! rounded-md bg-green-950 flex items-center"
                class-name="h-12! bg-brand! pl-3 lg:pl-4"
                @set:max-amount="setMaxAmount"
                @update:model-value="inputAmount"
              />

              <JbInputMessage v-if="v$.amount.$error">
                {{ v$.amount.$errors[0].$message }}
              </JbInputMessage>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-y-2 md:gap-y-4 text-white leading-none text-sm">
            <div class="col-span-1 flex flex-col gap-y-2">
              <div class="flex justify-between items-center font-bold">
                {{ t('chat.number-of-people') }}
                <div class="text-paragraph">
                  {{ formData.numberOfPeople > 0 ? (formData.amount / formData.numberOfPeople).toFixed(8) : 0 }}
                </div>
              </div>
              <JInputNumber
                v-model="formData.numberOfPeople"
                :error="v$.numberOfPeople.$error"
                :step="1"
                :to-fixed="0"
                :min="0"
                class="h-12! rounded-md bg-green-950 flex items-center"
                class-name="h-12! bg-brand! pl-3 lg:pl-4"
                @update:model-value="inputNumberOfPeople"
              />
              <JbInputMessage v-if="v$.numberOfPeople.$error">
                <UIcon
                  class="w-4 h-4 min-w-4 min-h-4 text-red-600"
                  name="i-heroicons-information-circle-20-solid"
                />
                {{
                  v$.numberOfPeople.required.$invalid
                    ? t('errors.FIELD_REQUIRED')
                    : v$.numberOfPeople.minValue.$invalid
                      ? `${t('errors.MIN_IS')} 1`
                      : `${t('errors.MAX_IS')} 30`
                }}
              </JbInputMessage>
            </div>
            <div class="col-span-1 flex flex-col gap-y-2">
              <div class="font-bold">
                {{ t('chat.message-optional') }}
              </div>
              <textarea
                ref="textarea"
                v-model="formData.message"
                class="
                  bg-brand pl-3 md:pl-[15px] py-2.5 pr-7 text-sm w-full text-white
                  focus:ring-primary focus:outline-hidden placeholder:text-paragraph
                  overflow-y-auto max-h-20 resize-none ring-0 focus:ring-1 ring-border hover:ring-primary rounded
                "
                placeholder="Type your message"
              />
            </div>
          </div>
          <JButton
            :loading="isSubmitting"
            class="uppercase"
            @click="onMakeRain"
          >
            {{ chatRainConf === 'rain' ? t('chat.make-it-rain') : t('chat.make-it-snow') }}
          </JButton>
        </div>

        <UModal
          v-model:open="isConfirmOpen"
          class="w-11/12 sm:w-[465px] bg-brand"
          :title="chatRainConf === 'rain' ? t('chat.rain-confirmation') : t('chat.snow-confirmation')"
          :close="{
          onClick: () => {
            isConfirmOpen = false
          }
        }"
        >
          <template #body>
            <ConfirmWithdraw
              :loading="isSubmitting || emailTwoFaLoading"
              @confirm:withdraw-confirm="onSubmit"
              @close:modal="isConfirmOpen = false"
            />
          </template>
        </UModal>
      </template>
    </UModal>
  </ClientOnly>
</template>
