<script lang="ts" setup>
import { useDateFormat, useLocalStorage } from '@vueuse/core'
import type { User, UserModalNotification } from '~/types'
import {
  APP_QUERIES,
  AUTH,
  CREATE_USER,
  cryptoCurrencyMap,
  FREE_SPIN,
  PREFERENCE,
  SITE_LOADING,
  SITE_SETTINGS
} from '~/constants'
import {
  FAVORITES_CURRENCIES_QUERY,
  GET_KYC_USER_QUERY,
  USER_FAVORITES_QUERY,
  USER_UPDATED_SUBSCRIPTION,
  USER_WATCH_LIST_QUERY
} from '~/graphql'
import AuthModal from '~/components/organisms/auth/AuthModal.vue'
import RegionBlock from '~/components/pages/region-block/index.vue'
import VerifyEmail from '~/components/pages/verify-email/index.vue'
import FreeSpinModal from '~/apps/free-spin/components/FreeSpinModal.vue'
import UserNotificationModal from '~/components/organisms/auth/UserNotificationModal.vue'

const { $posthog } = useNuxtApp()
const { onInitialRendering, addLoading } = inject(SITE_LOADING)!
const { isBodyMounted } = inject(SITE_SETTINGS)!
const cookie = getAuthCookie()
const { meQueryReturn, currentCharityQueryReturn } = inject(APP_QUERIES)!
const { loading, result, options, subscribeToMore, refetch } = meQueryReturn
const {
  options: currentCharityOptions,
  result: currentCharityResult,
  refetch: currentCharityRefetch
} = currentCharityQueryReturn
const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const forcePromo = runtimeConfig.public?.forcePromo
const forcePromoCode = runtimeConfig.public?.forcePromoCode
const route = useRoute()
const router = useRouter()
const isLoggedIn = computed(() => !!me.value && isBodyMounted.value)
const currentCharity = computed(() => isLoggedIn.value ? (currentCharityResult.value?.currentCharityByUser || []) : {})
const modalVisible = computed(() => route.query.modal === 'auth')
const authType = computed(() => (modalVisible.value && route.query.type) ? String(route.query.type) : '')
const isOpenRegionBlock = computed(() => (route.query.modal === 'region' && runtimeConfig.public.checkRegion))
const turnstileToken = ref()
const hideTurnstile = computed(() => runtimeConfig.public.appEnv !== 'production')
const emailOrUsername = ref<string>('')
const password = ref<string>('')
const ipAddress = ref<string>('')
const affiliateCode = ref<string>('')
const me = computed(() => result.value?.me || null)
const isOpenEmailVerify = ref(false)
const isVerifyPage = computed(() => !!route.query.userId && !!route.query.hash && route.path === '/verify-email')
const isNotVerifiedEmail = computed(() => (isLoggedIn.value && !!me.value && !!me.value?.id && !me.value.email_verified_at))
const storageCode = useLocalStorage('JUNGLEBET_AFFILIATE_CODE', affiliateCode.value)
const myFreeSpins = computed(() => isLoggedIn.value ? (me.value?.remaining_free_spins || []) : [])
const isDailySpin = computed(() => (myFreeSpins.value && myFreeSpins.value.length > 0)
  ? (myFreeSpins.value[(myFreeSpins.value.length - 1)].isDaily)
  : false
)
const myFreeBets = computed(() => (myFreeSpins.value && myFreeSpins.value.length > 0)
  ? myFreeSpins.value?.reduce(
    (previousValue, iRoundResult) =>
      previousValue + iRoundResult.free_rounds,
    0
  )
  : 0)
const myPromoSpins = computed(() => (!isDailySpin.value && myFreeSpins.value && myFreeSpins.value.length > 0)
  ? myFreeSpins.value?.reduce(
    (previousValue, iRoundResult) =>
      previousValue + iRoundResult.promo_spin,
    0
  )
  : 0)
const isFreeSpinning = ref(false)
const isDailySpinning = ref(false)
const cancelFreeBets = ref(false)
const isUserModalNotify = ref(false)
const userModalNotification = ref<UserModalNotification>()
const freeSpinsCode = computed(() => route.query.promo ? String(route.query.promo) : '')
const freeSpinModalVisible = computed(() =>
  !isDailySpin.value &&
  !isDailySpinning.value &&
  (
    isFreeSpinning.value ||
    freeSpinsCode.value !== '' ||
    (!isFreeSpinning.value && isLoggedIn.value && myPromoSpins.value > 0)
  )
)

const privateOptions = {
  enabled: import.meta.client && isLoggedIn.value,
  notifyOnNetworkStatusChange: true,
}

const {
  result: favCryptoResult,
  loading: favCryptoLoading,
  options: favCryptoOptions,
  refetch: favCryptoReFetch
} = useQuery(
  FAVORITES_CURRENCIES_QUERY,
  { first: 100 },
  privateOptions
)

const {
  result: kycResult,
  options: kycOptions,
} = useQuery(
  GET_KYC_USER_QUERY,
  {},
  privateOptions
)

const {
  result: favGameResult,
  loading: favGameLoading,
  options: favGameOptions,
  refetch: favGameReFetch
} = useQuery(
  USER_FAVORITES_QUERY,
  { first: 100 },
  privateOptions
)

const {
  result: currencyWatchListResult,
  loading: watchCryptoCodesLoading,
  options: watchCryptoCodesOptions,
  refetch: watchCryptoCodesReFetch
} = useQuery(
  USER_WATCH_LIST_QUERY,
  { first: 100 },
  privateOptions
)

const userKyc = computed(() => kycResult.value?.getKycUser || null)

// User preferences
const displayInfiatEnabled = computed(() => me.value?.preferences?.displayInfiatEnabled || false)
const showVaultBalance = computed(() => me.value?.preferences?.showVaultBalance || false)
const hideZeroBalance = computed(() => me.value?.preferences?.hideZeroBalance || false)
const activeCryptoCode = computed(() => (myFreeBets.value > 0 && !isDailySpin.value ? 'DOGE' : (me.value?.preferences?.activeCryptoCode || 'DOGE')))
const activeFiatCode = computed(() => me.value?.preferences?.activeFiatCode || 'USD')
const orderedCryptoCodes = computed(() => me.value?.preferences?.orderedCryptoCodes || [])
const favoriteCryptoCodes = computed(() => favCryptoResult.value?.favoriteCurrencies?.data || [])
const favoriteGames = computed(() => favGameResult.value?.userFavorites?.data || [])
const changedActiveCode = ref(false)
const watchCryptoCodesList = computed(() => {
  return (currencyWatchListResult.value?.userWatchlist?.data || []).map((item: any) => {
    return {
      ...item,
      currency: {
        ...item.currency,
        ...cryptoCurrencyMap[item.currency.code]
      }
    }
  })
})

const apiLogin = async () => {
  // @ts-ignore
  await useFetch('/api/auth/login', { method: 'POST', body: { token: cookie.value } })
}

const login = async (promo = false) => {
  cookie.value = getAuthCookie().value
  // @ts-ignore
  options.enabled = true
  refetch()
  await apiLogin()
  if (!promo) {
    await router.push({
      path: router.currentRoute.value.path,
    })
  }
}

const openAuthModal = (type = 'login') => {
  if (type === CREATE_USER && forcePromo) {
    router.push({
      path: router.currentRoute.value.path,
      query: {
        promo: String(forcePromoCode)
      },
    })
  } else {
    router.push({
      path: router.currentRoute.value.path,
      query: {
        ...route.query,
        type,
        modal: 'auth',
      },
    })
  }
}

const openVerifyModal = () => {
  isOpenEmailVerify.value = true
}

const onCloseModal = () => {
  if (!hideTurnstile.value) {
    turnstileToken.value = ''
  }

  const queryWithoutModal = { ...route.query }
  delete queryWithoutModal.modal
  delete queryWithoutModal.type

  router.push({
    ...router.currentRoute,
    query: { ...queryWithoutModal },
  })
}

onInitialRendering(() => {
  // check if browser is checking logged in
  if (loading.value) {
    const removeLoading = addLoading()
    const stopWatch = watch(
      () => loading.value,
      (isLoading) => {
        if (!isLoading) {
          removeLoading()
          stopWatch()
        }
      }
    )
  }
})

const subscribeMeQuery = () => {
  let newMeData: User

  subscribeToMore({
    document: USER_UPDATED_SUBSCRIPTION,
    variables: {},
    updateQuery(prev, { subscriptionData }) {
      // @ts-ignore
      const updatedUser = subscriptionData.data?.userUpdated
      if (!updatedUser || !prev.me || updatedUser.id !== prev.me?.id) {
        return prev
      }

      if (updatedUser.is_banned) {
        const reason: string = updatedUser.is_banned.comment
          ? '. Reason: ' + updatedUser.is_banned.comment
          : ''
        const formatted = useDateFormat(updatedUser.is_banned.expired_at, 'D MMM, YYYY')
        const msg = updatedUser.is_banned.expired_at
          ? 'We suspended your account until ' + formatted.value + reason
          : 'Your account has been suspended indefinitely' + reason

        useGeneralNotify({
          type: 'warning',
          title: t('notifications.account-notification'),
          description: msg
        })
      }

      newMeData = {
        ...updatedUser,
        roles: updatedUser.roles || null,
        address: updatedUser.address
          ? {
            ...updatedUser.address,
          }
          : {},
        fingerprints: updatedUser.fingerprints,
        socialiteProviders: updatedUser.socialiteProviders || null,
        sponsorCodes: updatedUser.sponsorCodes,
        total_affiliates: updatedUser.total_affiliates,
        vip_level_name: updatedUser.vip_level_name || null,
        is_banned: updatedUser.is_banned || null,
        __typename: 'User',
      }

      return {
        me: {
          ...prev.me,
          ...newMeData
        },
      }
    },
  })
}

const stopLoginWatch = watch(
  () => isLoggedIn.value,
  (val: boolean) => {
    if (!val) {
      return
    }

    storageCode.value = ''
    subscribeMeQuery()
    // @ts-ignore
    favCryptoOptions.enabled = true
    // @ts-ignore
    favGameOptions.enabled = true
    // @ts-ignore
    watchCryptoCodesOptions.enabled = true
    // @ts-ignore
    currentCharityOptions.enabled = true
    // @ts-ignore
    kycOptions.enabled = true

    nextTick(() => {
      apiLogin()

      if (import.meta.client && runtimeConfig.public.appEnv !== 'local') {
        // @ts-ignore
        $posthog.identify(me.value?.id, {
          email: me.value?.email,
          name: me.value?.username
        })
      }
    })
  },
  { immediate: isLoggedIn.value }
)

provide(AUTH, {
  authType,
  emailOrUsername,
  password,
  ipAddress,
  affiliateCode,
  freeSpinsCode,
  loading,
  me,
  userKyc,
  turnstileToken,
  hideTurnstile,
  isLoggedIn,
  isNotVerifiedEmail,
  isUserModalNotify,
  modalVisible,
  userModalNotification,
  login,
  refetch,
  openAuthModal,
  openVerifyModal,
})

const updateIsFreeSpinning = (v: boolean) => {
  isFreeSpinning.value = v
}

const updateIsDailySpinning = (v: boolean) => {
  isDailySpinning.value = v
}

provide(PREFERENCE, {
  currency: activeFiatCode,
  currentCharity,
  activeCryptoCode,
  activeFiatCode,
  displayInfiatEnabled,
  showVaultBalance,
  hideZeroBalance,
  orderedCryptoCodes,
  favoriteCryptoCodes,
  watchCryptoCodesList,
  watchCryptoCodesLoading,
  watchCryptoCodesReFetch,
  favCryptoLoading,
  favCryptoReFetch,
  favGameLoading,
  favoriteGames,
  favGameReFetch,
  changedActiveCode,
  currentCharityRefetch
})

provide(FREE_SPIN, {
  cancelFreeBets,
  isDailySpin,
  isDailySpinning,
  isFreeSpinning,
  myFreeSpins,
  myFreeBets,
  myPromoSpins,
  updateIsFreeSpinning,
  updateIsDailySpinning,
})

onBeforeUnmount(() => {
  stopLoginWatch()
})
</script>

<template>
  <slot />
  <ClientOnly>
    <AuthModal
      v-if="!me || modalVisible"
      :modal-visible="modalVisible"
      @close:login-modal="onCloseModal"
    />
  </ClientOnly>
  <ClientOnly>
    <FreeSpinModal
      v-if="freeSpinModalVisible"
      :modal-visible="freeSpinModalVisible"
      :is-registered="(isLoggedIn && myPromoSpins > 0)"
    />
  </ClientOnly>
  <UModal
    v-model:open="isOpenRegionBlock"
    :default-open="isOpenRegionBlock"
    :dismissible="false"
    :close="false"
    class="p-6 sm:px-10 md:py-16 bg-brand w-full md:max-w-sm"
  >
    <template #content>
      <RegionBlock />
    </template>
  </UModal>
  <UModal
    :default-open="isOpenEmailVerify && !isVerifyPage"
    :dismissible="false"
    :close="false"
    class="p-6 sm:px-10 md:py-16 bg-brand w-full md:max-w-sm"
  >
    <template #content>
      <VerifyEmail />
    </template>
  </UModal>

  <ClientOnly>
    <UserNotificationModal v-if="isUserModalNotify" />
  </ClientOnly>
</template>
