<script lang="ts" setup>
import { helpers, maxValue, minValue, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import type { CurrencyItem } from '~/types'
import { AUTH, CURRENCY, PREFERENCE, THEME, WALLET } from '~/constants'
import { EMAIL_TWO_FA_MUTATION, RECENT_WITHDRAWS_QUERY, WITHDRAW_MUTATION } from '~/graphql'
import TokenPopover from '~/components/organisms/wallets/popovers/TokenPopover.vue'
import LAmountInput from '~/components/molecules/inputs/LAmountInput.vue'
import ConfirmWithdraw from '~/components/organisms/wallets/contents/ConfirmWithdraw.vue'
import RecentWalletTable from '~/components/organisms/wallets/contents/RecentWalletTable.vue'
import { numberWithCommas } from '~/utils'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const { screen } = inject(THEME)!
const { me } = inject(AUTH)!
const { wallets } = inject(WALLET)!
const {
  userBalances,
  cryptoToFiat,
  cryptoCurrencies,
  currentFiatCurrency,
  displayFiatAmount,
  displayCryptoAmount
} = inject(CURRENCY)!
const { displayInfiatEnabled, activeFiatCode } = inject(PREFERENCE)!
const selectedCryptoCode = computed(() => route.query.currency ? String(route.query.currency) : 'BTC')
const selectedCrypto = computed(() => cryptoCurrencies.value.find((cItem: CurrencyItem) => cItem.code === selectedCryptoCode.value))
const selectedNetwork = ref((selectedCrypto.value?.networks && selectedCrypto.value.networks.length) ? selectedCrypto.value.networks[0]?.id : 0)
const amount = ref<number>(0)
const address = computed({
  get () {
    return route.query.address ? String(route.query.address) : ''
  },
  set (v) {
    router.replace({
      query: {
        ...route.query,
        address: v
      }
    })
  }
})
const tag = ref('')
const disableTag = ref(false)
const wallet = computed(() => wallets.value.find(wallet => wallet.currency_code === selectedCryptoCode.value))
const fiatPrice = computed(() => cryptoToFiat(1, selectedCryptoCode.value, activeFiatCode.value))
const selectedUserBalance = computed(() => userBalances.value.find(ub => ub.currencyCode === selectedCryptoCode.value)!)
const selectedCryptoBalance = computed(() => selectedUserBalance.value.availableBalance)
const selectedFiatBalance = computed(() => selectedUserBalance.value.availableBalance * fiatPrice.value)
const isConfirmOpen = ref<boolean>(false)
const minWithdraw = computed(() => (selectedCrypto.value?.min_withdraw || 0) * (displayInfiatEnabled.value ? fiatPrice.value : 1))
const maxAmount = computed(() => (displayInfiatEnabled.value ? selectedFiatBalance.value : selectedCryptoBalance.value))
const { result: transactionsResult, loading: transactionsLoading, refetch: withdrawRefetch } = useQuery(
  RECENT_WITHDRAWS_QUERY, { filter: { limit: 10 } }
)
const transactions = computed(() => (transactionsResult.value?.withdrawsByUser?.results || []).slice(0, 5))
const v = {
  get inFiat () {
    return displayInfiatEnabled.value
  },
  get selectedCode () {
    return selectedCryptoCode.value
  }
}
const fiatValue = computed(() => (Number(amount.value) * fiatPrice.value))
const cryptoValue = computed(() => {
  if (
    !displayInfiatEnabled.value
  ) {
    return Number(amount.value)
  } else {
    return Number(amount.value) / fiatPrice.value
  }
})

const { mutate, loading, onDone, onError } = useMutation(WITHDRAW_MUTATION)
const {
  mutate: emailTwoFaMutate,
  onDone: onEmailTwoFaDone,
  onError: onEmailTwoFaError,
  loading: emailTwoFaLoading,
} = useMutation(EMAIL_TWO_FA_MUTATION)

const setMaxAmount = () => {
  amount.value = Number(maxAmount.value)
}

const rules = computed(() => {
  return {
    address: {
      required: helpers.withMessage('Address is required', required),
      validAddress: helpers.withMessage(
        'Address is invalid, please enter valid address',
        // @ts-ignore
        (value: string) => valid(value, selectedCryptoCode.value)
      )
    },
    amount: {
      required: helpers.withMessage('Amount is required', required),
      maxValue: helpers.withMessage('Withdrawal amount exceeds available balance.', maxValue(maxAmount.value)),
      minValue: helpers.withMessage(
        `The minimum withdrawal amount is ${v.inFiat ? displayFiatAmount(minWithdraw.value) : displayCryptoAmount(minWithdraw.value, v.selectedCode)}`,
        minValue(minWithdraw.value)),
    }
  }
})
const v$ = useVuelidate(rules, { address, amount })

const valid = (address: string, currency: string) => {
  // @ts-ignore
  return WAValidator.validate(address, currency, 'both')
}

const onSubmit = async () => {
  if (!await v$.value.$validate() || loading.value) {
    return
  }

  if (me.value!.enable2fa) {
    isConfirmOpen.value = true
  } else {
    await emailTwoFaMutate({
      action: 'WITHDRAW',
      currencyCode: selectedCryptoCode.value,
      amount: cryptoValue.value,
    })
  }
}

// code: string
const onWithdraw = async (code: any) => {
  if (loading.value) {
    return
  }
  await mutate({
    userId: Number(me.value!.id),
    amount: Number(cryptoValue.value),
    destination: address.value,
    currencyCode: selectedCryptoCode.value,
    walletId: Number(wallet.value!.id),
    withdrawType: '44',
    code,
    tag: tag.value,
    networkId: Number(selectedNetwork.value)
  })
}

onError((error) => {
  isConfirmOpen.value = false
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message
  })
})

onDone(async () => {
  address.value = ''
  amount.value = 0
  isConfirmOpen.value = false
  v$.value.$reset()
  withdrawRefetch()
})

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

const inputAmount = async () => {
  await v$.value.amount.$validate()
}

watch(() => selectedCryptoCode.value, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    selectedNetwork.value = (selectedCrypto.value?.networks && selectedCrypto.value?.networks.length)
      ? selectedCrypto.value.networks[0]?.id
      : 0
  }
})
</script>

<template>
  <div class="grid grid-cols-2 gap-x-3 gap-y-5 text-white leading-none text-sm">
    <div class="col-span-2 sm:col-span-1 font-bold flex flex-col gap-y-2">
      <div class="flex justify-between items-center">
        <span>{{ t('currency.wallet') }}</span>
        <span class="text-paragraph font-bold">
          <span
            v-if="displayInfiatEnabled"
            class="flex items-center"
          >
            <span>
              {{ currentFiatCurrency.symbol }}
            </span>
            <span>
              {{ numberWithCommas(selectedFiatBalance) }}
            </span>
          </span>
          <span
            v-else
            class="flex items-center gap-x-0.5"
          >
            <UIcon
              v-if="selectedCrypto?.iconType === 'ui'"
              :name="selectedCrypto?.icon"
              class="h-3 w-3 min-w-3 min-h-3"
            />
            <svg
              v-else-if="selectedCrypto?.iconType === 'symbol'"
              class="h-3 w-3 min-w-3 min-h-3"
            >
              <use :href="selectedCrypto.icon || ''" />
            </svg>
            <UAvatar
              v-else
              :alt="selectedCrypto?.name"
              :src="selectedCrypto?.logo"
              class="h-3 w-3 min-w-3 min-h-3"
              img-class="w-3 h-3"
              size="sm"
            />
            <span>{{ selectedCryptoBalance.toFixed(8) }}</span>
          </span>
        </span>
      </div>
      <TokenPopover :content-height="screen.md ? 300 : 150" />
    </div>

    <div
      v-if="selectedCrypto && selectedCrypto.networks && selectedCrypto.networks.length"
      class="col-span-2 sm:col-span-1 font-bold flex flex-col gap-y-2"
    >
      <span class="leading-none">{{ t('base.network') }}</span>
      <USelect
        v-model="selectedNetwork"
        :items="selectedCrypto.networks"
        :arrow="true"
        class="w-full text-sm text-white bg-green-950! font-bold leading-none h-12! ring-0!"
        label-key="name"
        size="lg"
        value-key="id"
      >
        <template #leading>
          <UIcon
            v-if="selectedCrypto?.iconType === 'ui'"
            :name="selectedCrypto?.icon"
            class="h-6 w-6 min-w-6 min-h-6"
          />
          <svg
            v-else-if="selectedCrypto?.iconType === 'symbol'"
            class="h-6 w-6 min-w-6 min-h-6"
          >
            <use :href="selectedCrypto.icon || ''" />
          </svg>
          <UAvatar
            v-else
            :alt="selectedCrypto?.name"
            :src="selectedCrypto?.logo"
            class="h-6 w-6 min-w-6 min-h-6"
            img-class="w-6 h-6"
            size="sm"
          />
        </template>
      </USelect>
    </div>

    <div class="col-span-2 font-bold flex flex-col gap-y-2">
      <div class="flex justify-between items-center">
        {{ t('base.amount') }}
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
        v-model="amount"
        class="
          h-12 rounded-md bg-green-950 flex items-center
        "
        class-name="bg-green-950! pl-3 lg:pl-4 focus:ring-0! focus:border-none!"
        @set:max-amount="setMaxAmount"
        @update:model-value="inputAmount"
      />

      <JbInputMessage v-if="v$.amount.$error">
        {{ v$.amount.$errors[0].$message }}
      </JbInputMessage>
    </div>

    <div class="col-span-2 flex flex-col gap-y-2">
      <div class="text-white font-bold">
        {{ t('currency.btc-address') }}
      </div>

      <UInput
        v-model="address"
        :placeholder="t('currency.enter-address')"
        class="bg-green-950 rounded-md text-sm h-12"
        size="xl"
        type="text"
        variant="none"
      />

      <JbInputMessage v-if="v$.address.$error">
        {{ v$.address.$errors[0].$message }}
      </JbInputMessage>
    </div>

    <div
      v-if="selectedCryptoCode === 'XRP'"
      class="col-span-2 flex flex-col gap-y-2 font-bold"
    >
      <div
        class="flex items-center p-4 bg-green-950 rounded-md gap-2"
      >
        <JSwitch
          :classes="{
            Inner: 'gap-x-0!',
            SwitchButton: 'w-9! min-w-9 h-[18px]!',
            SwitchInner: 'w-3.5! h-3.5!',
          }"
          :model-value="disableTag"
          translate="translate-x-5"
          @update:model-value="disableTag = !disableTag"
        />
        <div class="text-sm text-white font-bold">
          No Tag
        </div>
      </div>

      <div
        v-if="!disableTag"
        class="font-bold"
      >
        {{ t('currency.tag') }}
      </div>

      <UInput
        v-if="!disableTag"
        v-model="tag"
        class="bg-green-950 rounded-md text-sm h-12"
        size="xl"
        type="text"
        variant="none"
      />
    </div>

    <div class="w-full col-span-2">
      <JButton
        :loading="loading"
        class="w-full"
        size="lg"
        variant="primary"
        @click="onSubmit"
      >
        {{ t('currency.withdraw') }}
      </JButton>
    </div>

    <div
      v-if="!loading"
      class="w-full col-span-2 flex flex-col"
    >
      <div class="font-bold text-white">
        My Recent Withdrawals
      </div>
      <RecentWalletTable
        :loading="transactionsLoading"
        :rows="transactions"
        table-name="withdrawals"
      />
    </div>
  </div>

  <ClientOnly>
    <UModal
      v-model:open="isConfirmOpen"
      :default-open="isConfirmOpen"
      class="w-11/12 sm:w-[465px] bg-brand"
      :title="t('currency.withdrawal-confirmation')"
      :close="{
      onClick: () => {
        isConfirmOpen = false
      }
    }"
    >
      <template #body>
        <ConfirmWithdraw
          :loading="loading || emailTwoFaLoading"
          @confirm:withdraw-confirm="onWithdraw"
          @close:modal="isConfirmOpen = false"
        />
      </template>
    </UModal>
  </ClientOnly>
</template>
