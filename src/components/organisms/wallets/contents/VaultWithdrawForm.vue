<script lang="ts" setup>
import { AUTH, CURRENCY, PREFERENCE, THEME } from '~/constants'
import { helpers, maxValue, required } from '@vuelidate/validators'
import TokenPopover from '~/components/organisms/wallets/popovers/TokenPopover.vue'
import { useVuelidate } from '@vuelidate/core'
import LAmountInput from '~/components/molecules/inputs/LAmountInput.vue'
import { EMAIL_TWO_FA_MUTATION, WITHDRAW_FROM_VAULT_MUTATION } from '~/graphql'
import { LOADING_ICON } from '~/components/symbols'
import ConfirmVaultWithdraw from '~/components/organisms/wallets/contents/ConfirmVaultWithdraw.vue'

const { t } = useI18n()
const { screen } = inject(THEME)!
const router = useRouter()
const route = useRoute()
const { me } = inject(AUTH)!
const { activeFiatCode, activeCryptoCode, displayInfiatEnabled } = inject(PREFERENCE)!
const {
  userBalances,
  refetchBalances,
  cryptoToFiat,
  displayCryptoAmount,
  displayFiatAmount
} = inject(CURRENCY)!

const formData = reactive({
  amount: 0
})

const selectedCryptoCode = computed({
  get () {
    return route.query.currency ? String(route.query.currency) : 'BTC'
  },
  set (v) {
    router.replace({ query: { ...route.query, currency: v } })
  }
})

const fiatPrice = computed(() => cryptoToFiat(1, selectedCryptoCode.value, activeFiatCode.value))
const selectedBalance = computed(() => userBalances.value?.find(item => item.currencyCode === selectedCryptoCode.value))
const selectedVaultedBalance = computed(() => selectedBalance.value?.vaultedBalance || 0)
const selectedLockedBalance = computed(() => selectedBalance.value?.lockedBalance || 0)
const selectedVaultedFiatBalance = computed(() => (selectedBalance.value?.vaultedBalance || 0) * fiatPrice.value)
const selectedLockedFiatBalance = computed(() => (selectedBalance.value?.lockedBalance || 0) * fiatPrice.value)
const withdrawLoading = ref(false)
const isLocked = ref(true)
const isConfirmOpen = ref<boolean>(false)
const enabledTwoFa = computed(() => me.value?.enable2fa)

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

const maxAmount = computed(() => (displayInfiatEnabled.value ? selectedVaultedFiatBalance.value : selectedVaultedBalance.value))
const formRules = computed(() => {
  return {
    amount: {
      maxValue: helpers.withMessage('Withdraw amount exceeds available in vaulted.', maxValue(maxAmount.value)),
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

const { mutate, loading, onDone, onError } = useMutation(WITHDRAW_FROM_VAULT_MUTATION, {
  errorPolicy: 'none',
})
const {
  mutate: emailTwoFaMutate,
  onDone: onEmailTwoFaDone,
  onError: onEmailTwoFaError,
  loading: emailTwoFaLoading,
} = useMutation(EMAIL_TWO_FA_MUTATION)

const onSubmit = async () => {
  if (!await v$.value.$validate() || loading.value || emailTwoFaLoading.value || withdrawLoading.value) {
    return
  }

  if (Number(formData.amount) === 0) {
    return
  }

  withdrawLoading.value = true
  if (enabledTwoFa.value) {
    isConfirmOpen.value = true
  } else {
    await emailTwoFaMutate({
      action: 'VAULT',
      currencyCode: selectedCryptoCode.value,
      amount: cryptoValue.value,
    })
  }
}

onEmailTwoFaDone(async () => {
  isConfirmOpen.value = true
})

onEmailTwoFaError((error) => {
  withdrawLoading.value = false
  useGeneralNotify({
    type: 'error',
    title: t('errors.EMAIL_TWO_FACTOR_VERIFICATION_FAILED'),
    description: getGraphqlErrorMessage(error)
  })
})

const onWithdraw = async (code: any) => {
  if (!(await v$.value.amount.$validate()) || Number(formData.amount) === 0 || loading.value) {
    return
  }

  isLocked.value = false
  await mutate({
    currencyCode: selectedCryptoCode.value,
    amount: displayInfiatEnabled.value ? cryptoValue.value : Number(formData.amount),
    code
  })
}

onDone(() => {
  formData.amount = 0
  withdrawLoading.value = false
  v$.value.$reset()
  refetchBalances()

  useTimeoutFn(() => {
    isLocked.value = true
    isConfirmOpen.value = false
  }, 5000)
})

onError((error) => {
  withdrawLoading.value = false
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
    <div class="w-full h-auto aspect-3/2 relative rounded-xl bg-green-950 z-1 flex items-center justify-center">
      <div class="w-[80%] h-[80%] absolute flex items-center justify-center box-border overflow-hidden bg-brand rounded-3xl">
        <div
          class="w-[90%] h-[90%] flex items-center justify-center relative"
          :class="{
            'opacity-40': isLocked
          }"
        >
          <div
            v-if="isLocked"
            class="w-4 h-full bg-vip-diamond rounded-md absolute z-1"
          />
          <div
            v-if="isLocked"
            class="w-4 h-full bg-vip-diamond rounded-md rotate-45 absolute z-1"
          />
          <div
            v-if="isLocked"
            class="w-4 h-full bg-vip-diamond rounded-md -rotate-45 absolute z-1"
          />
          <div
            v-if="isLocked"
            class="w-[67%] h-4 bg-vip-diamond rounded-md absolute z-1"
          />
          <div class="h-[80%] aspect-square rounded-full  bg-paragraph z-2 absolute flex items-center justify-center">
            <div class="h-[65%] aspect-square rounded-full bg-vip-diamond absolute flex items-center justify-center">
              <div class="h-[70%] aspect-square rounded-full bg-brand border border-brand absolute flex items-center justify-center overflow-hidden">
                <div class="w-4 h-full bg-vip-diamond rotate-45 absolute" />
                <div class="w-4 h-full bg-vip-diamond -rotate-45 absolute" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="isConfirmOpen"
        class="w-[95%] p-2 md:p-4 relative z-3 text-paragraph flex flex-col gap-2"
      >
        <ConfirmVaultWithdraw
          :loading="loading || emailTwoFaLoading"
          @confirm:withdraw-confirm="onWithdraw"
          @close:modal="isConfirmOpen = false"
        />
        <div
          v-if="isLocked"
          class="flex items-center gap-0.5 font-bold justify-end absolute bottom-0 w-full px-4 md:px-8"
        >
          <UIcon
            class="w-4 h-4 min-w-4 min-h-4"
            name="material-symbols-light:lock"
          />
          <span class="leading-none text-sm">Locked</span>
        </div>
        <div
          v-else
          class="flex items-center gap-0.5 font-bold justify-end absolute bottom-0 w-full px-4 md:px-8"
        >
          <UIcon
            class="w-4 h-4 min-w-4 min-h-4"
            name="material-symbols-light:lock-open-right-rounded"
          />
          <span class="leading-none text-sm">Unlocked</span>
        </div>
      </div>

      <div class="w-full flex items-center justify-between absolute bottom-1 md:bottom-0 p-2 md:p-4">
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

    <div class="flex flex-col gap-1 w-full p-2 md:p-4 rounded-md bg-primary -mt-3 z-2 relative">
      <div class="w-full flex flex-col md:flex-row items-center gap-1">
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
              :is-vault="true"
              placement="top"
              button-class="h-9! py-0 rounded-r-none"
            />
            <div class="w-full">
              <LAmountInput
                v-model="formData.amount"
                class="h-9 rounded-md bg-white flex items-center rounded-l-none"
                class-name="bg-white! pl-3 lg:pl-4 text-brand! focus:ring-0!"
                :show-icon="false"
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
            :disabled="loading || emailTwoFaLoading || withdrawLoading || formData.amount <= 0 || selectedVaultedBalance <= 0"
            @click="onSubmit"
          >
            <span
              v-if="loading || emailTwoFaLoading || withdrawLoading"
              class="w-full flex items-center justify-center min-h-5"
              @click.prevent
            >
              <svg class="text-paragraph animate-spin w-4 h-4">
                <use :href="LOADING_ICON" />
              </svg>
            </span>
            <span v-else>Vault Withdraw</span>
          </JbBlankButton>
        </div>
      </div>

      <JbInputMessage v-if="v$.amount.$error">
        {{ v$.amount.$errors[0].$message }}
      </JbInputMessage>
    </div>
  </div>
</template>
