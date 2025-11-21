<script lang="ts" setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import {
  BUY_CRYPTO_ICON,
  DEPOSIT_ICON,
  PROMOTIONS_ICON,
  SEND_TIP_ICON,
  WALLET_TRANSACTION_ICON,
  WITHDRAWAL_ICON
} from '~/components/symbols'
import DepositCryptoForm from '~/components/organisms/wallets/contents/DepositCryptoForm.vue'
import WithdrawCryptoForm from '~/components/organisms/wallets/contents/WithdrawCryptoForm.vue'
import PromoCodeForm from '~/components/organisms/wallets/contents/PromoCodeForm.vue'
import SendingTipForm from '~/components/organisms/wallets/contents/SendingTipForm.vue'
import BuyCryptoForm from '~/components/organisms/wallets/contents/BuyCryptoForm.vue'
import SellCryptoForm from '~/components/organisms/wallets/contents/SellCryptoForm.vue'
import ExchangeForm from '~/components/organisms/wallets/contents/ExchangeForm.vue'
import { EXCHANGE_ICON, VAULT_TRANSPARENT_ICON } from '~/icons'
import { CURRENCY, PREFERENCE, THEME } from '~/constants'
import CloseButton from '~/components/molecules/button/CloseButton.vue'
import VaultForm from '~/components/organisms/wallets/contents/VaultForm.vue'

const emits = defineEmits<{
  (e: 'close:walletModal'): void;
}>()

useHead({
  script: [
    {
      src: '/assets/js/wallet-address-validator.min.js',
      defer: true,
      tagPosition: 'bodyClose',
    },
  ],
})

const runtimeConfig = useRuntimeConfig()
const { sendFingerprint } = useSendFingerprint()
const enableVault = runtimeConfig.public?.enableVault
const { screen } = inject(THEME)!
const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const route = useRoute()
const originTabs = [
  { label: t('currency.deposit'), value: 'deposit', iconName: DEPOSIT_ICON, iconType: 'svg', transaction: localePath('/transactions?tabs=transactions&transaction=deposit') },
  { label: t('currency.withdraw'), value: 'withdraw', iconName: WITHDRAWAL_ICON, iconType: 'svg', transaction: localePath('/transactions?tabs=transactions&transaction=withdrawals') },
  { label: t('currency.buy-crypto'), value: 'buyCrypto', iconName: BUY_CRYPTO_ICON, iconType: 'svg', transaction: localePath('/transactions?tabs=transactions&transaction=other') },
  { label: t('currency.sell-crypto'), value: 'sellCrypto', iconName: BUY_CRYPTO_ICON, iconType: 'svg', transaction: localePath('/transactions?tabs=transactions&transaction=other') },
  { label: t('promotions.promo-code'), value: 'promoCode', iconName: PROMOTIONS_ICON, iconType: 'svg', transaction: localePath('/transactions?tabs=transactions&transaction=other') },
  { label: t('base.send-tip'), value: 'tip', iconName: SEND_TIP_ICON, iconType: 'svg', transaction: localePath('/transactions?tabs=transactions&transaction=tip') },
  { label: t('missing.swap-tokens'), value: 'exchange', iconName: EXCHANGE_ICON, iconType: 'svg', transaction: localePath('/transactions?tabs=transactions&transaction=other') },
]
const tabs = computed(() => (
  enableVault
    ? [
      ...originTabs,
      { label: 'My Vault', value: 'myVault', iconName: VAULT_TRANSPARENT_ICON, iconType: 'svg', transaction: localePath('/') },
    ]
    : originTabs
))

const { activeFiatCode } = inject(PREFERENCE)!
const { userBalances, cryptoToFiat, displayFiatAmount, } = inject(CURRENCY)!
const totalVaulted = computed<number>(() =>
  userBalances.value.reduce(
    (previousValue, iBalanceResult) =>
      previousValue + (cryptoToFiat(1, iBalanceResult.currencyCode, activeFiatCode.value) * iBalanceResult.vaultedBalance),
    0
  )
)
const selectedTab = computed({
  get () {
    return route.query.tab ? String(route.query.tab) : 'deposit'
  },
  set (v) {
    router.push({ path: router.currentRoute.value.path, query: { ...route.query, tab: v } })
  }
})

const currentTab = computed({
  get () {
    const index = tabs.value.findIndex((item) => item.value === route.query.tab)
    if (!route.query.tab || index === -1) {
      return 'deposit'
    }

    return String(route.query.tab)
  },
  set (v) {
    router.push({ path: router.currentRoute.value.path, query: { ...route.query, tab: v } })
  }
})

const selectedIndex = computed(() => tabs.value.findIndex((item) => item.value === currentTab.value))

const [tabParent] = useAutoAnimate({
  duration: 150
})

const onCloseWalletModal = () => {
  emits('close:walletModal')
}

onMounted(async () => {
  await sendFingerprint()
})
</script>

<template>
  <div
    class="grid grid-cols-11 h-full w-full p-3 sm:p-0 lg:min-h-[560px] pb-16 lg:pb-0"
  >
    <div
      v-if="screen.md"
      class="col-span-3 h-full bg-brand py-4 pl-4 pr-2 ml-2 border-r border-border"
    >
      <UTabs
        v-model="currentTab"
        :items="tabs"
        orientation="vertical"
        size="xl"
        class="w-full"
        :ui="{
          trigger: 'w-full min-w-40 h-10'
        }"
      >
        <template #default="{ item }">
          <div class="flex items-center justify-start gap-x-2 relative cursor-pointer">
            <UIcon
              v-if="item.iconType === 'ui'"
              :name="item.iconName"
              class="block w-4 h-4 min-w-4 min-h-4"
            />
            <svg
              v-else
              class="block w-4 h-4 min-w-4 min-h-4"
            >
              <use :href="item.iconName" />
            </svg>

            {{ item.label }}
          </div>
        </template>
      </UTabs>
    </div>

    <div
      ref="tabParent"
      class="col-span-11 sm:col-span-8 w-full pl-0 sm:p-6 flex flex-col gap-y-3"
    >
      <div
        class="flex items-center w-full text-white"
      >
        <div class="font-bold text-xl flex items-center gap-x-4 flex-1 leading-none">
          <div
            v-if="selectedTab !== 'exchange' && selectedTab !== 'myVault'"
            class="flex items-center gap-x-2"
          >
            <svg class="w-4 h-4">
              <use :href="WALLET_TRANSACTION_ICON" />
            </svg>
            {{ t('currency.wallet') }}
          </div>
          <div
            v-else-if="selectedTab === 'exchange'"
            class="flex items-center gap-x-2"
          >
            <svg class="w-4 h-4">
              <use :href="EXCHANGE_ICON" />
            </svg>
            {{ t('missing.instant-token-swap') }}
          </div>
          <div
            v-else-if="selectedTab === 'myVault'"
            class="flex items-center justify-between w-full"
          >
            <span class="flex items-center gap-x-2">
              <svg class="w-4 h-4">
                <use :href="VAULT_TRANSPARENT_ICON" />
              </svg>
              My Vault
            </span>
            <span class="text-primary">
              {{ displayFiatAmount(totalVaulted) }}
            </span>
          </div>
          <JButton
            v-if="tabs[selectedIndex].transaction"
            variant="alternative"
            class="text-xs"
          >
            <UIcon
              name="streamline:money-cash-bag-dollar-bag-payment-cash-money-finance"
              class="min-w-4 min-h-4 h-4 w-4"
            />
            <RouterLink :to="tabs?.[selectedIndex]?.transaction">
              {{ t('account.transactions') }}
            </RouterLink>
          </JButton>
        </div>
        <div class="ml-auto flex items-center min-w-4">
          <CloseButton
            class="w-4 h-4 min-w-4 min-h-4 -mt-4 -mr-4"
            @click="onCloseWalletModal"
          />
        </div>
      </div>

      <div v-if="!screen.md">
        <JTabs
          v-model="selectedTab"
          :tabs="tabs"
          class="w-full md:w-auto mr-2"
          width="auto"
        />
      </div>

      <DepositCryptoForm v-if="selectedTab === 'deposit'" />
      <WithdrawCryptoForm v-if="selectedTab === 'withdraw'" />
      <BuyCryptoForm v-if="selectedTab === 'buyCrypto'" />
      <SellCryptoForm v-if="selectedTab === 'sellCrypto'" />
      <PromoCodeForm v-if="selectedTab === 'promoCode'" />
      <SendingTipForm
        v-if="selectedTab === 'tip'"
        @close:wallet-modal="onCloseWalletModal"
      />
      <ExchangeForm
        v-if="selectedTab === 'exchange'"
      />
      <VaultForm
        v-if="selectedTab === 'myVault'"
      />
    </div>
  </div>
</template>
