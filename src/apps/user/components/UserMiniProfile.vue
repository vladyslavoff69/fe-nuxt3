<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import UserStatistics from '~/apps/user/components/UserStatistics.vue'
import DetailsModalHeader from '~/components/organisms/header/DetailsModalHeader.vue'
import MiniProfileSkeleton from '~/apps/user/components/MiniProfileSkeleton.vue'
import VipRankImg from '~/components/molecules/table/details/VipRankImg.vue'
import { AUTH, CURRENCY, PREFERENCE, UNRANKED_VIP } from '~/constants'
import { MINI_PROFILE_QUERY, SAVE_USER_PREFERENCES_MUTATION } from '~/graphql'
import { Filter as DateFilter } from '~/types/statistics'
import { numberWithCommas } from '~/utils'

const emits = defineEmits(['close:detailsModal'])
const isStatisticsVisible = ref<boolean>(false)
const { activeCryptoCode, activeFiatCode } = inject(PREFERENCE)!
const { me, isLoggedIn } = inject(AUTH)!
const { usdToFiat, displayFiatAmount } = inject(CURRENCY)!
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const username = computed(() => route.query?.name || '')
const currencyRate = computed(() => usdToFiat.value[activeFiatCode.value])

const { result, loading, refetch } = useQuery(
  MINI_PROFILE_QUERY,
  { username: username.value, dateFilter: DateFilter.LIFETIME, ignorePeriod: true },
  { fetchPolicy: 'no-cache' }
)

const {
  mutate: saveUserPreferences,
  onDone,
  onError,
  loading: updatingUser,
} = useMutation(SAVE_USER_PREFERENCES_MUTATION)

const data = computed(() => result.value?.miniProfile)
const isMyProfile = computed(() => (me.value?.username === data.value?.username))
const isModerator = computed(
  () => !!me.value?.roles?.some(role => [
    'superadmin', 'admin', 'developer', 'moderator'
  ].includes(role.name?.toLowerCase()))
)
const isAdmin = computed(
  () => !!me.value?.roles?.some(role => [
    'superadmin', 'admin', 'developer'
  ].includes(role.name?.toLowerCase()))
)
const allowedPrivate = computed(() => (data.value?.ghostMode || false))
const isAccessAble = computed(() => (isModerator.value || isMyProfile.value))

const handleChangeIncognito = () => {
  if (!isLoggedIn.value) {
    return
  }

  const existingPreferences = me.value?.preferences
  saveUserPreferences({
    ...existingPreferences,
    ghostMode: !existingPreferences?.ghostMode || false,
  })
}

onDone(() => {
  useGeneralNotify({
    type: 'success',
    title: !allowedPrivate.value ? t('notifications.incognito-mode-on') : t('notifications.incognito-mode-off'),
    description: !allowedPrivate.value ? t('notifications.incognito-mode-on-desc') : t('notifications.incognito-mode-off-desc'),
  })

  refetch()
})

onError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message,
  })
})

const handleClickTip = () => {
  router.push({
    path: router.currentRoute.value.path,
    query: {
      tab: 'tip',
      currency: activeCryptoCode.value,
      modal: 'wallet',
      name: username.value,
    },
  })
}

const handleModalClose = () => {
  emits('close:detailsModal')
}

onMounted(() => {
  refetch()
})
</script>

<template>
  <div class="mini-profile font-semibold">
    <div v-if="!isStatisticsVisible">
      <DetailsModalHeader
        :title="t('auth.user_details')"
        icon="i-heroicons-user-circle-20-solid"
        icon-type="ui"
        @close:details-modal="handleModalClose"
      />

      <div class="w-full flex flex-col gap-3 pt-4">
        <MiniProfileSkeleton v-if="loading || updatingUser" />
        <div
          v-else-if="data"
          class="w-full flex flex-col items-center justify-center gap-y-3 text-sm"
        >
          <div class="w-full flex flex-col items-center justify-center gap-y-3">
            <div class="w-full text-center flex flex-col justify-center gap-y-2">
              <div class="text-white font-bold text-xl lg:text-2xl leading-none! flex items-center justify-center w-full gap-2">
                <span
                  v-if="data?.vip_dual_rank?.vipLevel !== UNRANKED_VIP"
                  class="w-7 h-7 min-w-7 min-h-7 rounded-full flex items-center justify-center"
                >
                  <VipRankImg
                    :vip-level-name="data?.vip_dual_rank?.vipLevel"
                    class="w-full h-full"
                  />
                </span>
                <span>{{ username }}</span>
              </div>
              <div class="text-sm font-bold text-paragraph leading-none!">
                Joined on {{ data?.created_at ? useDateFormat(new Date(data.created_at), "DD MMM, YYYY").value : '' }}
              </div>
              <div
                v-if="isLoggedIn"
                class="justify-center items-center gap-2.5 flex"
              >
                <JButton
                  v-if="!isMyProfile"
                  class="h-8 py-1 w-20"
                  size="sm"
                  variant="alternative"
                  @click="handleClickTip"
                >
                  {{ t('base.send') }} {{ t('transaction.tip') }}
                </JButton>
                <JButton
                  v-else
                  class="capitalize h-8 py-1"
                  size="sm"
                  variant="alternative"
                  @click="handleChangeIncognito"
                >
                  {{ t('auth.incognito') }} {{ allowedPrivate ? t('base.off') : t('base.on') }}
                </JButton>
              </div>
            </div>
          </div>
          <div
            v-if="!allowedPrivate || isAccessAble"
            class="w-full flex flex-col gap-y-3"
          >
            <hr class="w-full border border-border">

            <div class="w-full grid gap-y-1.5 lg:gap-y-2">
              <div class="w-full grid grid-cols-2 gap-x-1.5 lg:gap-x-2 font-bold text-sm">
                <div class="col-span-1 bg-green-950 rounded-md flex flex-col justify-center px-3 lg:px-4 py-2">
                  <label
                    class="flex items-center gap-x-0.5 cursor-pointer"
                    @click="isStatisticsVisible = (!allowedPrivate || isAdmin || isMyProfile)"
                  >
                    <span class="text-xs capitalize font-bold">
                      {{ t('vip.total-wagered') }}
                    </span>

                    <UTooltip
                      v-if="(!allowedPrivate || isAdmin || isMyProfile)"
                      :content="{ side: 'top' }"
                      arrow
                      :text="t('games.tool-stats')"
                    >
                      <UIcon
                        class="w-3 h-3 min-h-3 min-w-3  text-paragraph hover:text-white cursor-pointer"
                        name="charm:link-external"
                      />
                    </UTooltip>
                  </label>

                  <label class="truncate text-white text-sm leading-5 capitalize">
                    {{ displayFiatAmount((data?.wageredData?.fiat_value || 0) * currencyRate) }}
                  </label>
                </div>
                <div class="col-span-1 bg-green-950 rounded-md flex flex-col justify-center px-3 lg:px-4 py-2">
                  <label class="flex items-center gap-x-0.5">

                    <span class="text-xs capitalize font-bold">
                      {{ t('charity.casino-donated') }}
                    </span>
                    <UTooltip
                      :content="{ side: 'top' }"
                      arrow
                      :text="t('charity.total-donated-tooltip')"
                    >
                      <UIcon
                        class="w-3 h-3 min-h-3 min-w-3 text-paragraph hover:text-white cursor-help"
                        name="i-heroicons-information-circle-20-solid"
                      />
                    </UTooltip>
                  </label>
                  <label class="truncate text-white text-sm leading-5 capitalize">
                    {{ displayFiatAmount((data?.wageredData?.fiat_value || 0) * 0.0005 * currencyRate) }}
                  </label>
                </div>
              </div>

              <div class="w-full grid grid-cols-2 gap-x-1.5 lg:gap-x-2">
                <div class="col-span-1 bg-green-950 rounded-md flex flex-col justify-center px-3 lg:px-4 py-2">
                  <label class="text-xs capitalize font-bold">
                    Most Played {{ t('base.currency') }}
                  </label>
                  <label class="truncate text-white text-sm leading-5 capitalize">
                    {{ data?.favoriteCurrency || 'N/A' }}
                  </label>
                </div>
                <div class="col-span-1 bg-green-950 rounded-md flex flex-col justify-center px-3 lg:px-4 py-2">
                  <label class="text-xs capitalize font-bold">
                    {{ t('bets.total-bets') }}
                  </label>
                  <label class="truncate text-white text-sm leading-5 capitalize">
                    {{ data?.totalPlays ? numberWithCommas(data?.totalPlays, 0) : 0 }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="w-full text-center text-base font-bold"
          >
            {{ t('auth.this-account-is-private') }}
          </div>
        </div>
        <div
          v-else
          class="text-2xl text-error text-center w-full p-4 font-bold"
        >
          {{ username }} is not a registered user
        </div>
      </div>
    </div>
    <div v-else>
      <DetailsModalHeader
        :title="t('auth.user_statistics')"
        icon="heroicons:arrow-left-circle-16-solid"
        icon-type="ui"
        @close:details-modal="handleModalClose"
        @click:icon="isStatisticsVisible = false"
      />

      <UserStatistics v-if="(!allowedPrivate || isAdmin || isMyProfile)" />
    </div>
  </div>
</template>
