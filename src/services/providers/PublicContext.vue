<script lang="ts" setup>
import {
  APP_QUERIES,
  AUTH,
  cryptoCurrencyMap,
  CURRENCY,
  FIAT,
  fiatCurrencyMap,
  PREFERENCE,
  SITE_SETTINGS
} from '@/constants'
import {
  CURRENCIES_UPDATED_SUBSCRIPTION,
  GET_USER_BALANCES_QUERY,
  SAVE_USER_PREFERENCES_MUTATION,
  USER_BALANCE_UPDATED_SUBSCRIPTION
} from '~/graphql'
import type { Currency, CurrencyItem, UserBalance } from '~/types'
import { numberWithCommas } from '~/utils'

const { isLoggedIn, me } = inject(AUTH)!
const { displayInfiatEnabled, activeCryptoCode, activeFiatCode, changedActiveCode } = inject(PREFERENCE)!
const { isInHousePlaying } = inject(SITE_SETTINGS)!
const {
  getUserBalancesQueryReturn,
  cryptoCurrenciesQueryReturn,
  fiatCurrenciesQueryReturn,
} = inject(APP_QUERIES)!

const {
  result: userBalancesData,
  loading: userBalancesLoading,
  options,
  refetch: refetchBalances,
  subscribeToMore,
  onResult
} = getUserBalancesQueryReturn

const inHouseCasinoPlaying = computed(() => isInHousePlaying.value)
const userBalancesReady = computed(() => !!userBalances.value)
const {
  result: cryptoCurrenciesData,
  loading: cryptoCurrenciesLoading,
  refetch: refetchCryptos,
  subscribeToMore: subscribeCurrenciesToMore
} = cryptoCurrenciesQueryReturn

const {
  result: fiatCurrenciesData,
  refetch: refetchFiats,
  loading: fiatCurrenciesLoading
} = fiatCurrenciesQueryReturn

const { mutate, onDone } = useMutation(SAVE_USER_PREFERENCES_MUTATION)

onDone(() => {
  changedActiveCode.value = true
})

const apollo = useApolloClient()
const userBalancesOrigin = computed(
  () => userBalancesData.value?.getUserBalances || []
)
const userBalances = computed(
  () => userBalancesOrigin.value?.filter(ub => cryptoCurrencies.value.map(c => c.code).includes(ub.currencyCode as string))
)

const userBalancesByCode = computed<{ [key in string]: UserBalance }>(() =>
  userBalances.value.reduce(
    (preV, curV) => ({ ...preV, [curV.currencyCode]: curV }),
    {}
  )
)

const cryptoCurrencies = computed<CurrencyItem[]>(
  () =>
    cryptoCurrenciesData.value?.currencies?.map(currency => ({
      ...currency,
      ...cryptoCurrencyMap[currency.code],
    })) || []
)

const fiatCurrencies = computed<CurrencyItem[]>(
  () =>
    fiatCurrenciesData.value?.currencies?.map(currency => ({
      ...currency,
      ...fiatCurrencyMap[currency.code],
    })) || []
)

const usdToFiat = computed<{ [key in string]: number }>(
  () =>
    fiatCurrencies.value.reduce(
      (acc, curr) => ({ ...acc, [curr.code]: 1 / curr.current_price }),
      {}
    )
)

const cryptoToUsd = computed<{ [key in string]: number }>(() => {
  return cryptoCurrencies.value?.reduce(
    (acc, curr) => ({ ...acc, [curr.code]: curr.current_price }),
    {}
  )
})

const cryptoToFiat = (balance: number, cryptoCode: string, fiatCode: string) =>
  Number((Math.floor((balance * cryptoToUsd.value[cryptoCode] * usdToFiat.value[fiatCode]) * 100) / 100).toFixed(2))

const currentCryptoCurrency = computed<CurrencyItem>(
  () =>
    cryptoCurrencies.value.find(
      cryptoCurrency => cryptoCurrency.code === activeCryptoCode.value
    )!
)

const currentFiatCurrency = computed<CurrencyItem>(
  () =>
    fiatCurrencies.value.find(
      fiatCurrency => fiatCurrency.code === activeFiatCode.value
    )!
)

const activeUserBalance = computed<UserBalance>(
  () =>
    (userBalancesData.value
      ? userBalances.value.find(
        ub => ub.currencyCode === activeCryptoCode.value
      )
      : null) as UserBalance
)

// NOTE: it forces type as we will use user balance after ready
const currentCryptoBalance = computed<number>(
  () => activeUserBalance.value?.availableBalance || 0
)

const currentFiatBalance = computed<number>(() =>
  userBalancesReady.value
    ? Number((Math.floor((currentCryptoBalance.value * cryptoToUsd.value[activeCryptoCode.value] * usdToFiat.value[activeFiatCode.value]) * 100) / 100).toFixed(2))
    : 0
)
const prevCryptoBalance = ref<number>(currentCryptoBalance.value)
const prevFiatBalance = ref<number>(currentFiatBalance.value)

onResult(() => {
  if (!inHouseCasinoPlaying.value) {
    prevCryptoBalance.value = currentCryptoBalance.value
    prevFiatBalance.value = currentFiatBalance.value
  }
})

const currentBalance = computed<number>(() =>
  displayInfiatEnabled.value
    ? currentFiatBalance.value
    : currentCryptoBalance.value
)

const currentCryptoToFiat = computed(() =>
  cryptoToFiat(1, activeCryptoCode.value, activeFiatCode.value)
)

const displayCryptoAmount = (amount: number, code: string) => `${amount?.toFixed(8)} ${code}`
const displayCurrentCryptoAmount = (amount: number) => displayCryptoAmount(amount, activeCryptoCode.value)

const displayFiatAmount = (amount: number) =>
  `${amount < 0 ? '-' : ''} ${currentFiatCurrency.value?.symbol || 'USD'}${numberWithCommas(
    Math.abs(Math.ceil(amount * 100) / 100)
  )}`

const displayOtherAmount = (amount: number, fiat = false) =>
  (displayInfiatEnabled.value || fiat)
    ? displayCryptoAmount(amount, activeCryptoCode.value)
    : displayFiatAmount(amount)

const asCurrentAmount = (cryptoAmount: number, cryptoCode = activeCryptoCode.value, fiat = false) =>
  (displayInfiatEnabled.value || fiat)
    ? cryptoToFiat(1, cryptoCode, activeFiatCode.value) * cryptoAmount
    : cryptoAmount

const asOtherAmount = (cryptoAmount: number, cryptoCode = activeCryptoCode.value, fiat = false) =>
  (displayInfiatEnabled.value || fiat)
    ? cryptoAmount
    : cryptoToFiat(1, cryptoCode, activeFiatCode.value) * cryptoAmount

const loading = computed(
  () =>
    userBalancesLoading.value ||
    cryptoCurrenciesLoading.value ||
    fiatCurrenciesLoading.value
)

const generateUserBalance = (userBalance: UserBalance) => ({
  ...userBalance,
  balance: userBalance.balance ? Number(userBalance.balance) : 0,
  availableBalance: userBalance.availableBalance ? Number(userBalance.availableBalance) : 0,
  lockedBalance: userBalance.lockedBalance ? Number(userBalance.lockedBalance) : 0,
  vaultedBalance: userBalance.vaultedBalance ? Number(userBalance.vaultedBalance) : 0,
  __typename: 'UserBalance'
})

const updateUserBalance = (balance: number, cryptoCode?: string) => {
  if (!userBalancesOrigin.value || !userBalancesOrigin.value.length || userBalancesLoading.value) {
    return
  }

  const selectedCurrency = cryptoCode || activeCryptoCode.value
  try {
    apollo.client.writeQuery({
      query: GET_USER_BALANCES_QUERY,
      data: {
        getUserBalances: userBalances.value?.map((ub) => {
          if (ub.currencyCode === selectedCurrency) {
            return {
              ...ub,
              balance,
              availableBalance: balance,
            }
          }

          return ub
        }),
      }
    })
  } catch (error) {
  }
}

const updateFiatCurrencies = async (values) => {
  const updatedFiatCurrencies = Object.keys(values).map((el) => {
    return el
  })

  if (fiatCurrencies.value.length !== updatedFiatCurrencies.length) {
    await refetchFiats({ type: FIAT, active: true })
  }

  const existingActive = updatedFiatCurrencies?.find(uF => uF === activeFiatCode.value)

  if (!existingActive) {
    await mutate({
      ...me.value?.preferences,
      activeFiatCode: updatedFiatCurrencies[0],
    }, {
      optimisticResponse: {
        saveUserPreferences: {
          __typename: me.value?.__typename || 'User',
          id: me.value?.id || 0,
          preferences: {
            ...me.value?.preferences,
            activeFiatCode: updatedFiatCurrencies[0]
          }
        }
      }
    })
  }
}

const subscribeForCurrencies = () => {
  subscribeCurrenciesToMore({
    document: CURRENCIES_UPDATED_SUBSCRIPTION,
    variables: {},
    // @ts-ignore
    updateQuery (prev, { subscriptionData }) {
      if (
        !prev ||
        !prev.currencies ||
        !subscriptionData?.data ||
        // @ts-ignore
        !subscriptionData?.data?.currenciesUpdated
      ) {
        return prev
      }

      // @ts-ignore
      if (subscriptionData?.data?.currenciesUpdated.length && subscriptionData?.data?.currenciesUpdated[0]?.quotes?.values) {
        // @ts-ignore
        updateFiatCurrencies(subscriptionData?.data?.currenciesUpdated[0]?.quotes?.values)
      }

      const updatedCurrencies = prev.currencies?.map((el: Currency) => {
        // @ts-ignore
        const updatedCurrency: Currency = Object.values(subscriptionData?.data.currenciesUpdated)?.find(
          // @ts-ignore
          (currency: Currency) => currency?.id && Number(currency.id) === Number(el.id)
        )

        if (updatedCurrency && updatedCurrency?.active) {
          return {
            __typename: 'Currency',
            ...el,
            isBuySupported: updatedCurrency?.isBuySupported ? updatedCurrency.isBuySupported : el.isBuySupported,
            isSellSupported: updatedCurrency?.isSellSupported ? updatedCurrency.isSellSupported : el.isSellSupported,
            maxBuyAmount: updatedCurrency?.maxBuyAmount ? Number(updatedCurrency.maxBuyAmount) : el.maxBuyAmount,
            maxSellAmount: updatedCurrency?.maxSellAmount ? Number(updatedCurrency.maxSellAmount) : el.maxSellAmount,
            max_confirmtime: updatedCurrency?.max_confirmtime ? Number(updatedCurrency.max_confirmtime) : el.max_confirmtime,
            minBuyAmount: updatedCurrency?.minBuyAmount ? Number(updatedCurrency.minBuyAmount) : el.minBuyAmount,
            minSellAmount: updatedCurrency?.minSellAmount ? Number(updatedCurrency.minSellAmount) : el.minSellAmount,
            min_confirmtime: updatedCurrency?.min_confirmtime ? Number(updatedCurrency.min_confirmtime) : el.min_confirmtime,
            min_tip_withdraw: updatedCurrency?.min_tip_withdraw ? Number(updatedCurrency.min_tip_withdraw) : el.min_tip_withdraw,
            min_withdraw: updatedCurrency?.min_withdraw ? Number(updatedCurrency.min_withdraw) : el.min_withdraw,
            current_price: updatedCurrency?.current_price ? Number(updatedCurrency.current_price) : el.current_price,
            price_updated_at: updatedCurrency?.price_updated_at,
          }
        } else {
          return el
        }
      })

      return {
        currencies: [
          ...updatedCurrencies
        ]
      }
    }
  })
}

const subscribeForUserBalances = () => {
  subscribeToMore({
    document: USER_BALANCE_UPDATED_SUBSCRIPTION,
    variables: {},
    updateQuery (prev, { subscriptionData }) {
      // @ts-ignore NOTE: subscription event type should follow query return type?
      const userBalanceUpdated = subscriptionData.data?.userBalanceUpdated
      if (!userBalanceUpdated || !prev.getUserBalances || inHouseCasinoPlaying.value) {
        return prev
      }

      const oldUserBalances = prev.getUserBalances
      let updatedUserBalances: any = []
      if (
        oldUserBalances
          .map(ub => ub.currencyCode)
          .includes(userBalanceUpdated.currencyCode)
      ) {
        updatedUserBalances = oldUserBalances.map((userBalance) => {
          if (userBalance.currencyCode === userBalanceUpdated.currencyCode) {
            return {
              ...userBalance,
              ...generateUserBalance(userBalanceUpdated),
              __typename: 'UserBalance'
            }
          }

          return {
            ...userBalance,
            __typename: 'UserBalance'
          }
        })
      } else {
        updatedUserBalances = [
          ...oldUserBalances,
          generateUserBalance(userBalanceUpdated),
        ]
      }

      return {
        getUserBalances: updatedUserBalances,
      }
    },
  })
}

watch(
  () => isLoggedIn.value,
  (v) => {
    if (v) {
      // @ts-ignore
      options.enabled = true
      subscribeForUserBalances()
    }
  },
  { immediate: isLoggedIn.value }
)

provide(CURRENCY, {
  loading,
  ready: computed(
    () =>
      !!(
        userBalancesData.value &&
        cryptoCurrenciesData.value &&
        fiatCurrenciesData.value
      )
  ),
  userBalances,
  usdToFiat,
  cryptoCurrencies,
  fiatCurrencies,
  currentCryptoBalance,
  currentFiatBalance,
  prevCryptoBalance,
  prevFiatBalance,
  cryptoToUsd,
  cryptoToFiat,
  currentCryptoCurrency,
  currentFiatCurrency,
  refetchBalances,
  refetchCryptos,
  currentCryptoToFiat,
  currentBalance,
  displayCryptoAmount,
  displayCurrentCryptoAmount,
  displayFiatAmount,
  displayOtherAmount,
  userBalancesByCode,
  asCurrentAmount,
  asOtherAmount,
  updateUserBalance,
})

onMounted(() => {
  subscribeForCurrencies()
})
</script>
<template>
  <div class="p-0 w-full h-full m-0">
    <slot />
  </div>
</template>
