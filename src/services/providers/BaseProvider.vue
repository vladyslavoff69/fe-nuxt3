<script lang="ts" setup>
import type { Currency, DailyFreeSpinRank, User, UserBalance, Vip, Wallet } from '~/types'
import { APP_QUERIES, CRYPTO, FIAT, LANGUAGES, MAIN_META, SITE_SETTINGS } from '~/constants'
import {
  CURRENCIES_QUERY,
  CURRENT_CHARITY_BY_USER,
  DAILY_SPINS_QUERY,
  GET_USER_BALANCES_QUERY,
  ME_QUERY,
  USER_WALLETS_QUERY,
  VIP_QUERY
} from '~/graphql'

const router = useRouter()
const isSidebarOpen = ref<boolean>(false)
const isInHousePlaying = ref<boolean>(false)
const isMobileSidebarOpen = ref<boolean>(false)
const isBodyMounted = ref<boolean>(false)
const selectedMenuPath = computed({
  get () {
    return router.currentRoute.value.fullPath || ''
  },
  set () {
  }
})
const selectedNavItem = ref<string>('')
const fingerprintToken = ref<string>('')
const cookie = getAuthCookie()

// Public Queries
const publicOptions = {
  errorPolicy: (import.meta.server ? 'ignore' as const : 'all' as const),
  notifyOnNetworkStatusChange: true
}
// Private queries
const privateOptions = {
  enabled: !!cookie.value,
  notifyOnNetworkStatusChange: true
}

const meQueryReturn = useQuery<{ me: User }>(ME_QUERY, {}, privateOptions)
const userWalletsQueryReturn = useQuery<
  { userWallets: { data: Wallet[] } },
  { first: number, type: string }
>(USER_WALLETS_QUERY, { first: 100, type: CRYPTO }, privateOptions)
const getUserBalancesQueryReturn = useQuery<{ getUserBalances: UserBalance[] }>(
  GET_USER_BALANCES_QUERY, {}, privateOptions
)
const vipQueryReturn = useQuery<{ vip: Vip }>(VIP_QUERY, {}, privateOptions)
const dailySpinQueryReturn = useQuery<{ dailySpins: DailyFreeSpinRank }>(
  DAILY_SPINS_QUERY, {}, privateOptions
)
const currentCharityQueryReturn = useQuery(CURRENT_CHARITY_BY_USER, {}, privateOptions)

// Public Queries
const cryptoCurrenciesQueryReturn = useQuery<{ currencies: Currency[] }, {
  type: string,
  active: boolean;
}>(CURRENCIES_QUERY, { type: CRYPTO, active: true }, publicOptions)
const fiatCurrenciesQueryReturn = useQuery<{ currencies: Currency[] }, {
  type: string,
  active: boolean;
}>(CURRENCIES_QUERY, { type: FIAT, active: true }, publicOptions)

const {
  loadCharities,
  charities
} = usePlayerCharities({
  limit: 100
})

const toggleSidebar = useToggle(isSidebarOpen)
const toggleMobileSidebar = useToggle(isMobileSidebarOpen)

const { locales } = useI18n()
const languages = computed(() => {
  const items: any = []
  if (locales.value) {
    for (const item of locales.value) {
      const lItem = LANGUAGES.find(lEl => lEl.lang === item.code)
      if (lItem) {
        items.push({
          ...item,
          ...lItem,
          iconType: 'ui',
          label: lItem.display,
          value: item.code,
          id: item.code
        })
      }
    }
  }

  return items
})

onMounted(() => {
  loadCharities()
  isBodyMounted.value = true
})

provide(SITE_SETTINGS, {
  fingerprintToken,
  isBodyMounted,
  isSidebarOpen,
  isMobileSidebarOpen,
  isInHousePlaying,
  languages,
  selectedMenuPath,
  selectedNavItem,
  toggleSidebar,
  toggleMobileSidebar,
  charities,
})

provide(APP_QUERIES, {
  cryptoCurrenciesQueryReturn,
  currentCharityQueryReturn,
  dailySpinQueryReturn,
  fiatCurrenciesQueryReturn,
  getUserBalancesQueryReturn,
  meQueryReturn,
  userWalletsQueryReturn,
  vipQueryReturn
})

useSeoMeta({
  title: MAIN_META.default.title,
  description: MAIN_META.default.description,
})
</script>

<template>
  <slot />
</template>
