<script lang="ts" setup>
import { APP_QUERIES, AUTH, VIP, DAILY_FREE_SPIN } from '~/constants'
import { VIP_SUBSCRIPTION } from '~/graphql'
import type { DailyFreeSpinRank, Vip } from '~/types'

const { vipQueryReturn, dailySpinQueryReturn } = inject(APP_QUERIES)!
const { result, loading, refetch, subscribeToMore, options } = vipQueryReturn
const { result: dailySpinResult, loading: dailySpinLoading, refetch: dailySpinRefetch, options: dailySpinOptions } = dailySpinQueryReturn
const vip = computed(() => result.value?.vip as Vip)
const dailyFreeSpin = computed(() => dailySpinResult.value?.dailySpins as DailyFreeSpinRank)
const wageredAllTime = computed(() => vip.value?.wagered_all_time || 0)
const { isLoggedIn } = inject(AUTH)!
const router = useRouter()
const route = useRoute()

provide(VIP, {
  loading,
  vip,
  wageredAllTime,
  refetch,
})

provide(DAILY_FREE_SPIN, {
  loading: dailySpinLoading,
  dailyFreeSpin,
  refetch: dailySpinRefetch,
})

const formatVipData = (prev: { vip: any }, vipUpdated: any) => {
  const vipLevel = vipUpdated?.vipLevel ? vipUpdated.vipLevel : prev.vip?.vipLevel

  return {
    ...prev.vip,
    __typename: 'Vip',
    id: vipUpdated?.id?.toString(),
    nextXpThreshold: vipUpdated.nextXpThreshold,
    wagered_all_time: Number(vipUpdated.wagered_all_time),
    xp: Number(vipUpdated.xp),
    vipLevel: vipLevel
      ? {
        ...vipLevel
      }
      : { order: 1 },
    dualRank: {
      ...prev.vip?.dualRank,
      ...vipUpdated?.dualRank,
      id: prev.vip?.dualRank?.id || vipUpdated?.dualRank?.id,
      wagered: vipUpdated?.dualRank?.wagered ? Number(vipUpdated?.dualRank?.wagered) : prev.vip?.dualRank?.wagered,
      xp: vipUpdated?.dualRank?.xp ? Number(vipUpdated?.dualRank?.xp) : prev.vip?.dualRank?.xp,
      xpThreshold: vipUpdated?.dualRank?.xpThreshold ? Number(vipUpdated?.dualRank?.xpThreshold) : prev.vip?.dualRank?.xpThreshold,
      upcomingRank: {
        level_name: vipUpdated?.dualRank?.upcomingRank?.level_name || prev.vip?.dualRank?.upcomingRank?.level_name,
        total_wagered: vipUpdated?.dualRank?.upcomingRank?.total_wagered
          ? Number(vipUpdated?.dualRank?.upcomingRank?.total_wagered)
          : prev.vip?.dualRank?.upcomingRank?.total_wagered,
        xp_threshold: vipUpdated?.dualRank?.upcomingRank?.xp_threshold
          ? Number(vipUpdated?.dualRank?.upcomingRank?.xp_threshold)
          : prev.vip?.dualRank?.upcomingRank?.xp_threshold,
        __typename: 'Rank',
      },
      __typename: 'DualRank',
    }
  }
}

const subscribeVip = () => {
  subscribeToMore({
    document: VIP_SUBSCRIPTION,
    variables: {},
    // @ts-ignore
    updateQuery (prev, { subscriptionData }) {
      // @ts-ignore
      if (!subscriptionData?.data?.vipUpdated) {
        return prev
      }
      // @ts-ignore
      const vipUpdated = subscriptionData.data.vipUpdated
      if (vipUpdated && vipUpdated.didLevelUp) {
        router.push({
          ...router.currentRoute,
          query: {
            ...route.query,
            modal: 'vip',
            tab: 'rakeback',
          },
        })
      }

      if (vipUpdated && vipUpdated.dualRank) {
        const updatedVipData = formatVipData(prev, vipUpdated)

        return {
          ...prev,
          vip: {
            ...updatedVipData
          }
        }
      }

      return prev
    },
  })
}

watch(
  () => isLoggedIn.value,
  (v: boolean) => {
    if (v) {
      // @ts-ignore
      options.enabled = true
      // @ts-ignore
      dailySpinOptions.enabled = true
      subscribeVip()
    }
  },
  { immediate: isLoggedIn.value }
)
</script>

<template>
  <slot />
</template>
