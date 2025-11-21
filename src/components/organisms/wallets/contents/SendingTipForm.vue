<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import type { User } from '~/types'
import { helpers, maxLength, maxValue, minLength, minValue, required } from '@vuelidate/validators'
import TokenPopover from '~/components/organisms/wallets/popovers/TokenPopover.vue'
import LAmountInput from '~/components/molecules/inputs/LAmountInput.vue'
import ConfirmWithdraw from '~/components/organisms/wallets/contents/ConfirmWithdraw.vue'
import { AUTH, CURRENCY, PREFERENCE, THEME } from '~/constants'
import { EMAIL_TWO_FA_MUTATION, RECENT_TIPS_QUERY, TIPS_MUTATION, TIPS_USERNAME_MUTATION } from '~/graphql'
import RecentTransactionTable from '~/components/organisms/wallets/contents/RecentTransactionTable.vue'
import { numberWithCommas } from '~/utils'

const emits = defineEmits<{
  (e: 'close:walletModal'): void;
}>()

/* Site level variables */
const route = useRoute()
const { t } = useI18n()
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
const isPublic = ref<boolean>(false)
const selectedCryptoCode = computed(() => route.query.currency ? String(route.query.currency) : activeCryptoCode.value)
const selectedUserName = computed(() => route.query.name ? String(route.query.name) : '')
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

const fiatPrice = computed(() => cryptoToFiat(1, selectedCryptoCode.value, activeFiatCode.value))
const minTipAmount = computed(() => {
  if (v.inFiat) {
    return selectedCryptoItem.value.min_tip_withdraw * fiatPrice.value
  }

  return selectedCryptoItem.value.min_tip_withdraw
})

const maxAmount = computed(() => {
  const maxDollarCryptoAmount = 10000 / cryptoToFiat(1, selectedCryptoCode.value, 'USD') /* $10000 */
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

const checkNameLetters = helpers.regex(/^[a-zA-Z0-9]+$/)
const tipFormData = reactive({
  username: selectedUserName.value || '',
  amount: 0,
  verifyCode: '',
})

const rules = computed(() => {
  return {
    username: {
      required: helpers.withMessage('Username is required', required),
      minLength: helpers.withMessage('Must be at least 3 characters in length', minLength(3)),
      maxLength: helpers.withMessage('Must be less than 14 characters in length', maxLength(14)),
      checkNameLetters: helpers.withMessage('Username is invalid', checkNameLetters),
      validUsername: helpers.withMessage('Username is invalid', () => !usernameErrorString.value),
    },
    amount: {
      maxValue: helpers.withMessage('Tip amount exceeds max amount or available balance.', maxValue(maxAmount.value)),
      minValue: helpers.withMessage(
        `The minimum tip amount is ${v.inFiat ? displayFiatAmount(minTipAmount.value) : displayCryptoAmount(minTipAmount.value, selectedCryptoCode.value)}`,
        minValue(minTipAmount.value)),
      required: helpers.withMessage('Amount is required', required),
    }
  }
})

const v$ = useVuelidate(rules, tipFormData)
const usernameErrorString = ref<string>('')

const { result: transactionsResult, loading: transactionsLoading, refetch: tipRefetch } = useQuery(
  RECENT_TIPS_QUERY, { filter: { limit: 10 } }
)
const transactions = computed(() => (transactionsResult.value?.myTips?.results || []).slice(0, 5))

const inputUsername = async () => {
  usernameErrorString.value = ''
  await v$.value.username.$validate()
}

const setMaxAmount = () => {
  tipFormData.amount = maxAmount.value
}

/* Handle Tip to User */
const {
  mutate: tipToUserMutation,
  loading: tipToUserLoading,
  onDone: tipToUserDone,
  onError: tipToUserError
} = useMutation(TIPS_MUTATION)

tipToUserDone(() => {
  tipFormData.username = ''
  tipFormData.amount = 0

  tipRefetch()

  isConfirmOpen.value = false

  emits('close:walletModal')
})

tipToUserError(async (error) => {
  const parsedError = parseGraphqlError(error)

  useGeneralNotify({
    type: 'error',
    title: 'Server Error!',
    description: parsedError.message,
  })

  isConfirmOpen.value = false
})

/* Handle 2FA Email Verification */
const {
  mutate: emailTwoFaMutate,
  onDone: onEmailTwoFaDone,
  onError: onEmailTwoFaError,
  loading: emailTwoFaLoading
} = useMutation(EMAIL_TWO_FA_MUTATION)

/* Check User existing and if valid, submit to tip */
const {
  mutate: tipsUsernameMutate,
  loading: tipsUsernameLoading,
  onDone: onTipsUsernameDone,
  onError: onTipsUsernameError,
} = useMutation(TIPS_USERNAME_MUTATION)

const onSendTip = async () => {
  if (!(await v$.value.$validate())) {
    return
  }

  await tipsUsernameMutate({
    q: tipFormData.username,
  })
}

/* Submit Form & Actions */
const isSubmitting = computed(() => tipsUsernameLoading.value || tipToUserLoading.value || emailTwoFaLoading.value)

onTipsUsernameDone(async ({ data }) => {
  const users: User[] = data.tipsUsername || []
  const lowercaseUsername = tipFormData.username.toLowerCase()
  if (users && users.length && users.some(user => user.username && user.username?.toLowerCase() === lowercaseUsername)) {
    if (me.value?.username?.toLowerCase() === lowercaseUsername) {
      useGeneralNotify({
        type: 'error',
        title: 'Server Error!',
        description: t('errors.INVALID_TIP_USER'),
      })

      usernameErrorString.value = t('errors.INVALID_TIP_USER')
      return
    }

    if (isSubmitting.value) {
      return
    }

    if (me.value!.enable2fa) {
      isConfirmOpen.value = true
    } else {
      await emailTwoFaMutate({
        action: 'TIPS',
        amount: cryptoValue.value,
        username: tipFormData.username,
        currencyCode: selectedCryptoCode.value
      })
    }
  } else {
    useGeneralNotify({
      type: 'error',
      title: 'Server Error!',
      description: 'Entered username does not exist.',
    })

    usernameErrorString.value = 'Entered username does not exist.'
  }
})

onTipsUsernameError((error) => {
  const parsedError = parseGraphqlError(error)

  useGeneralNotify({
    type: 'error',
    title: 'Server Error!',
    description: parsedError.message || 'Entered username does not exist.',
  })

  usernameErrorString.value = parsedError.message || 'Entered username does not exist.'
})

/* Handle 2FA validation success and submit tip */
const onSubmit = (code: string) => {
  if (!isSubmitting.value) {
    tipToUserMutation({
      username: tipFormData.username,
      currencyCode: selectedCryptoCode.value,
      amount: cryptoValue.value,
      code,
      isPublic: isPublic.value,
    })
  }
}

onEmailTwoFaDone(async () => {
  isConfirmOpen.value = true
})

onEmailTwoFaError((error) => {
  const parsedError = parseGraphqlError(error)

  useGeneralNotify({
    type: 'error',
    title: t('errors.EMAIL_TWO_FACTOR_VERIFICATION_FAILED'),
    description: parsedError.message,
  })
})

const inputAmount = async () => {
  await v$.value.amount.$validate()
}
</script>

<template>
  <div class="grid grid-cols-3 gap-x-3 gap-y-5 text-white leading-none text-sm">
    <div
      class="col-span-3 font-bold flex flex-col gap-y-2"
    >
      {{ t('base.name') }}
      <UInput
        v-model="tipFormData.username"
        placeholder="Enter username"
        size="xl"
        type="text"
        variant="none"
        class="bg-green-950 rounded-md text-sm h-12"
        @update:model-value="inputUsername"
      />

      <JbInputMessage v-if="v$.username.$error">
        {{ v$.username.$errors[0].$message }}
      </JbInputMessage>

      <JbInputMessage v-if="usernameErrorString && usernameErrorString !== ''">
        {{ usernameErrorString }}
      </JbInputMessage>
    </div>

    <div class="col-span-3 sm:col-span-1 font-bold flex flex-col gap-y-2">
      {{ t('currency.wallet') }}
      <TokenPopover :content-height="screen.md ? 300 : 150" />
    </div>

    <div
      class="col-span-3 sm:col-span-2 flex flex-col gap-y-2"
    >
      <div class="h-3.5 hidden sm:block" />
      <div
        class="rounded-md px-3 sm:px-4 h-12 flex items-center bg-green-950"
      >
        <div
          v-if="displayInfiatEnabled"
          class="flex flex-row"
        >
          <span>{{
            currentFiatCurrency?.symbol
          }}</span>
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
        {{ t('currency.tip-amount') }}
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
        class-name="bg-green-950! pl-3 lg:pl-4 focus:ring-0! focus:border-none!"
        @set:max-amount="setMaxAmount"
        @update:model-value="inputAmount"
      />

      <JbInputMessage v-if="v$.amount.$error">
        {{ v$.amount.$errors[0].$message }}
      </JbInputMessage>
    </div>

    <div class="col-span-3">
      <JSwitch
        :classes="{
          Inner: 'gap-x-2.5',
          SwitchButton: 'w-9! min-w-9 h-[18px]!',
          SwitchInner: 'w-3.5! h-3.5!',
        }"
        :model-value="isPublic"
        translate="translate-x-5"
        @update:model-value="isPublic = !isPublic"
      >
        <template #SwitchLabel>
          <span class="flex flex-col gap-y-0.5">
            <span class="text-white text-sm font-bold leading-none">{{ t('base.public') }}</span>
            <span class="text-paragraph text-xs leading-none">
              {{ t('currency.tip-global-chat-message') }}
            </span>
          </span>
        </template>
      </JSwitch>
    </div>

    <div class="col-span-3">
      <JButton
        :loading="isSubmitting"
        class="w-full"
        size="lg"
        variant="primary"
        @click="onSendTip"
      >
        {{ t('base.send-tip') }}
      </JButton>
    </div>

    <div
      class="w-full col-span-3 flex flex-col"
    >
      <div class="font-bold text-white">
        My Recent Tips
      </div>
      <RecentTransactionTable
        :loading="transactionsLoading"
        :rows="transactions"
        table-name="tips"
      />
    </div>
  </div>

  <ClientOnly>
    <UModal
      v-model:open="isConfirmOpen"
      :default-open="isConfirmOpen"
      class="w-11/12 sm:w-[465px] bg-brand"
      :title="t('currency.tip-confirmation')"
      :close="{
      onClick: () => {
        isConfirmOpen = false
      }
    }"
    >
      <template #body>
        <ConfirmWithdraw
          :enable2fa="me?.enable2fa"
          :loading="isSubmitting || emailTwoFaLoading"
          @confirm:withdraw-confirm="onSubmit"
          @close:modal="isConfirmOpen = false"
        />
      </template>
    </UModal>
  </ClientOnly>
</template>
