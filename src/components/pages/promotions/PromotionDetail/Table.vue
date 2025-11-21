<script lang="ts" setup>
import PromoLeaderboardTable from '~/components/molecules/table/PromoLeaderboardTable.vue'
import { leaderboardIcon } from '~/components/symbols'
import { CAMPAIGN_RANKING, PROMO_CAMPAIGN_RANK_UPDATED, USER_CAMPAIGN_RANKING } from '~/graphql'

const { promoId, promoDetail, ended } = defineProps<{
  promoId: number
  promoDetail: any,
  ended: boolean
}>()

const { t } = useI18n()
const countPerPage = ref(promoDetail?.total_winners || 7)
const {
  result: campRankResult,
  load: loadCampRank,
} = useLazyQuery(
  USER_CAMPAIGN_RANKING,
  {
    promoCampaignId: promoId
  },
  {
    fetchPolicy: 'no-cache',
    enabled: !!promoId
  }
)

const {
  result,
  loading: loadingRanking
} = useQuery(
  CAMPAIGN_RANKING,
  { promoCampaignId: promoId },
  {
    fetchPolicy: 'no-cache',
    enabled: !!promoId
  }
)

const { onResult: onNewResult } = useSubscription(
  PROMO_CAMPAIGN_RANK_UPDATED,
  { promoCampaignId: promoId },
  { fetchPolicy: 'no-cache' }
)

const rows = computed(() => {
  if (result.value && result.value.campaignRanking) {
    return [...result.value.campaignRanking].sort((a, b) => a.rank - b.rank)?.slice(0, countPerPage.value)
  }

  return []
})

onNewResult((subscriptionData) => {
  if (!subscriptionData.data?.PromoCampaign) {
    return
  }

  const campaignRanking: any[] = []
  for (const i in subscriptionData.data.PromoCampaign) {
    if (i !== '__typename') {
      campaignRanking.push(subscriptionData.data.PromoCampaign[i])
    }
  }

  result.value = {
    ...result.value,
    campaignRanking: {
      ...campaignRanking?.sort((a, b) => a.rank - b.rank)?.slice(0, countPerPage.value)
    }
  }
})

const computedRank = computed(() => (campRankResult.value?.userCampaignRanking))
onMounted(() => {
  loadCampRank()
})

const loading = computed(() => {
  if (rows.value.length < 1) {
    return loadingRanking.value
  }

  return false
})

const formatScore = (score: number) => {
  if (score % 10 === 1) {
    return `${score}st`
  } else if (score % 10 === 2) {
    return `${score}nd`
  } else if (score % 10 === 3) {
    return `${score}rd`
  } else {
    return `${score}th`
  }
}
</script>

<template>
  <div class="bg-brand grid gap-y-4">
    <div class="w-full flex gap-x-3 items-center flex-wrap">
      <div class="bg-green-950 rounded-md py-1 px-6 text-white flex items-center gap-x-1.5">
        <svg
          class="w-4 h-4 min-w-4 min-h-4"
        >
          <use :href="leaderboardIcon" />
        </svg>
        <span class="text-sm font-bold">
          {{ t('promotions.leaderboard') }}
        </span>
        <span
          v-if="!ended"
          class="inline-block w-2 h-2 rounded-full bg-primary"
        />
      </div>
      <div
        v-if="!!computedRank"
        class="bg-green-950 rounded-md py-1 px-4 text-white flex items-center gap-x-1.5 text-sm font-bold"
      >
        <div class="flex items-center">
          <UIcon
            class="w-4 h-4 min-w-4 min-h-4"
            name="hugeicons:ranking"
          />
          : {{ computedRank?.rank ? formatScore(Number((computedRank?.rank || 0))) : '--' }}
        </div>
        <div>|</div>
        <div class="flex items-center">
          <UIcon
            class="w-4 h-4 min-w-4 min-h-4"
            name="streamline:money-cash-bag-dollar-bag-payment-cash-money-finance"
          />
          : ${{ computedRank?.estimated_payout || '--' }}
        </div>
      </div>
      <div
        v-if="promoDetail?.promo_code"
        class="text-lg font-bold text-white w-full sm:w-auto"
      >
        <span class="text-paragraph">
          Claim Code:
        </span>
        {{ promoDetail?.promo_code }}
      </div>
    </div>
    <ClientOnly>
      <PromoLeaderboardTable
        :loading="loading"
        :objective="promoDetail?.objective"
        :rows="rows"
      />
    </ClientOnly>
  </div>
</template>
