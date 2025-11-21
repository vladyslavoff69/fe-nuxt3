<script lang="ts" setup>
import { CHARITY_INSTITUTION_DONATE, EMAIL_TWO_FA_MUTATION } from '~/graphql'
import { AUTH, CURRENCY, PREFERENCE, SITE_SETTINGS, THEME } from '~/constants'
import LAmountInput from '~/components/molecules/inputs/LAmountInput.vue'
import ConfirmWithdraw from '~/components/organisms/wallets/contents/ConfirmWithdraw.vue'
import TokenPopover from '~/components/organisms/wallets/popovers/TokenPopover.vue'
import { helpers, maxValue, minValue, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { numberWithCommas } from '~/utils'

const { t } = useI18n()
const { charities } = inject(SITE_SETTINGS)!
const { modalVisible, charityId: initialCharityId } = defineProps<{
  modalVisible: boolean
  charityId?: number
}>()
const emits = defineEmits<{
  (e: 'close:donationModal'): void;
}>()

const isModalVisible = ref(modalVisible)

/* Site level variables */
const route = useRoute()
const { screen } = inject(THEME)!
const { me } = inject(AUTH)!
const { displayInfiatEnabled, activeFiatCode, activeCryptoCode } = inject(PREFERENCE)!
const {
  cryptoToFiat,
  userBalances,
  displayFiatAmount,
  displayCryptoAmount,
  cryptoCurrencies,
  currentFiatCurrency,
} = inject(CURRENCY)!

const isConfirmOpen = ref<boolean>(false)
const selectedCryptoCode = computed(() => route.query.currency ? String(route.query.currency) : activeCryptoCode.value)
const selectedUserBalance = computed(() => userBalances.value.find(ub => ub.currencyCode === selectedCryptoCode.value)!)
const selectedCryptoBalance = computed(() => selectedUserBalance.value.availableBalance)
const selectedFiatBalance = computed(() => cryptoToFiat(selectedCryptoBalance.value, selectedCryptoCode.value, activeFiatCode.value))
const selectedCryptoItem = computed(() => cryptoCurrencies.value.find(c => c.code === selectedCryptoCode.value)!)
const v = {
  get inFiat () {
    return displayInfiatEnabled.value
  },
  get selectedCode () {
    return selectedCryptoCode.value
  }
}

const fiatPrice = computed(() => {
  return cryptoToFiat(1, selectedCryptoCode.value, activeFiatCode.value)
})

const minTipAmount = computed(() => {
  if (v.inFiat) {
    return selectedCryptoItem.value.min_tip_withdraw * fiatPrice.value
  }

  return selectedCryptoItem.value.min_tip_withdraw
})

const maxAmount = computed(() => {
  const maxDollarCryptoAmount = 500 / cryptoToFiat(1, selectedCryptoCode.value, 'USD') /* $500 */
  const maxCryptoAmount = Math.min(maxDollarCryptoAmount, selectedCryptoBalance.value)

  return v.inFiat ? cryptoToFiat(maxCryptoAmount, selectedCryptoCode.value, activeFiatCode.value) : maxCryptoAmount
})

const fiatValue = computed(() => {
  return Number(tipFormData.amount) * fiatPrice.value
})

const cryptoValue = computed(() => {
  if (v.inFiat) {
    return tipFormData.amount / fiatPrice.value
  } else {
    return Number(tipFormData.amount)
  }
})

const tipFormData = reactive({
  charityId: initialCharityId || undefined,
  amount: 0,
  verifyCode: '',
})

const rules = computed(() => {
  return {
    charityId: {
      required
    },
    amount: {
      maxValue: helpers.withMessage('Tip amount exceeds max amount or available balance.', maxValue(maxAmount.value)),
      minValue: helpers.withMessage(
        `The minimum donation amount is ${v.inFiat ? displayFiatAmount(minTipAmount.value) : displayCryptoAmount(minTipAmount.value, selectedCryptoCode.value)}`,
        minValue(minTipAmount.value)),
      required: helpers.withMessage('Amount is required', required),
    }
  }
})

const v$ = useVuelidate(rules, tipFormData)

const setMaxAmount = () => {
  tipFormData.amount = maxAmount.value
}

/* Submit Form & Actions */
/* Handle Tip */
const {
  mutate: donateMutate,
  loading: donateLoading,
  onDone: onDonateDone,
  onError: onDonateError,
  error: donateError
} = useMutation(CHARITY_INSTITUTION_DONATE)
const parsedError = useGraphqlError(donateError)

onDonateDone(() => {
  useGeneralNotify({
    type: 'success',
    title: t('notifications.tip-sent'),
    description: t('notifications.tip-sent-desc')
  })
  emits('close:donationModal')
})

onDonateError(async (error) => {
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
  useGeneralNotify({
    type: 'success',
    title: t('notifications.confirmation-email-sent'),
    description: t('notifications.tip-pending-email-confirmation-code')
  })
  isConfirmOpen.value = true
})

onEmailTwoFaError((error) => {
  useGeneralNotify({
    type: 'error',
    title: t('errors.EMAIL_TWO_FACTOR_VERIFICATION_FAILED'),
    description: getGraphqlErrorMessage(error)
  })
})

const isSubmitting = computed(() => donateLoading.value || emailTwoFaLoading.value)

const onSendTip = async () => {
  if (!(await v$.value.$validate())) {
    return
  }

  if (me.value!.enable2fa) {
    isConfirmOpen.value = true
  } else {
    await emailTwoFaMutate({
      action: 'DONATE',
      amount: cryptoValue.value,
      username: me.value?.username,
      currencyCode: selectedCryptoCode.value
    })
  }
}

/* Handle 2FA validation success & submit tip */
const onSubmit = (code: string) => {
  donateMutate({
    charityInstitutionId: tipFormData.charityId,
    currencyCode: selectedCryptoCode.value,
    amountDonated: cryptoValue.value,
    code
  })
}

const inputAmount = async () => {
  await v$.value.amount.$validate()
}

const selectedCharity = computed(() => charities.value?.find(c => c.id === tipFormData.charityId))
</script>

<template>
  <ClientOnly>
    <UModal
      v-model:open="isModalVisible"
      class="p-6! overflow-visible w-11/12 sm:max-w-lg"
      :default-open="isModalVisible"
      @update:open="(v) => {
      if (!v) {
        emits('close:donationModal')
      }
    }"
    >
      <template #content>
        <div class="grid grid-cols-3 gap-x-3 gap-y-5 leading-none text-sm">
          <div
            class="col-span-3 font-bold flex flex-col gap-y-2"
          >
            {{ t('charity.charity') }}
            <div
              class="rounded-md px-3 sm:px-4 h-12 flex items-center bg-green-950 text-white"
            >
              {{ selectedCharity?.name }}
            </div>
          </div>

          <div class="col-span-1 font-bold flex flex-col gap-y-2">
            {{ t('games.balance-in') }}
            <TokenPopover :content-height="screen.md ? 300 : 150" />
          </div>

          <div
            class="col-span-3 sm:col-span-2 flex flex-col gap-y-2"
          >
            <JbInputMessage
              v-if="selectedCryptoBalance <= 0 || tipFormData.amount > selectedCryptoBalance"
              class="leading-none"
            >
              No balance available
            </JbInputMessage>
            <div
              v-else
              class="h-3.5 hidden sm:block"
            />
            <div
              class="rounded-md px-3 sm:px-4 h-12 flex items-center bg-green-950 text-white"
            >
              <div
                v-if="displayInfiatEnabled"
                class="flex flex-row"
              >
              <span>
                {{ currentFiatCurrency?.symbol }}
              </span>
                <span>
                {{ numberWithCommas(selectedFiatBalance) }}
              </span>
              </div>
              <p
                v-if="!displayInfiatEnabled"
              >
                {{ selectedCryptoBalance.toFixed(8) }}
              </p>
            </div>
          </div>

          <div class="col-span-3 font-bold flex flex-col gap-y-2">
            <div class="flex justify-between items-center">
              {{ t('currency.donation-amount') }}
              <div
                v-if="v.inFiat"
                class="text-paragraph"
              >
                {{ displayCryptoAmount(cryptoValue, selectedCryptoCode) }}
              </div>
              <div
                v-else
                class="text-paragraph"
              >
                {{ displayFiatAmount(fiatValue) }}
              </div>
            </div>

            <LAmountInput
              v-model="tipFormData.amount"
              class="h-12 rounded-md bg-green-950 flex items-center"
              class-name="bg-green-950! pl-3 lg:pl-4"
              :crypto-code="selectedCryptoCode"
              @set:max-amount="setMaxAmount"
              @update:model-value="inputAmount"
            />

            <JbInputMessage v-if="v$.amount.$error">
              {{ v$.amount.$errors[0].$message }}
            </JbInputMessage>
          </div>

          <div class="col-span-3">
            <JButton
              :loading="isSubmitting"
              :disabled="selectedCryptoBalance <= 0 || tipFormData.amount <= 0"
              class="w-full"
              size="lg"
              variant="primary"
              @click="onSendTip"
            >
              {{ t('charity.send-donation') }}
            </JButton>
          </div>
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="isConfirmOpen"
      class="w-11/12 sm:w-[465px] bg-brand"
      title="Donation Confirmation"
      :close="{
          onClick: () => {
            isConfirmOpen = false
          }
        }"
    >
      <template #body>
        <ConfirmWithdraw
          :loading="isSubmitting"
          @confirm:withdraw-confirm="onSubmit"
          @close:modal="isConfirmOpen = false"
        />
      </template>
    </UModal>
  </ClientOnly>
</template>
