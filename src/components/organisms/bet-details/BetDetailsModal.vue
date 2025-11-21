<script lang="ts" setup>
import { BET_DETAIL_QUERY } from '~/graphql'
import type { BetDetail } from '~/types'
import BetDetailsProvider from '~/services/providers/components/BetDetailsProvider.vue'
import BetDetailsModalWrapper from '~/components/organisms/bet-details/modal-content/BetDetailsModalWrapper.vue'
import BetDetailsSkeleton from '~/components/organisms/bet-details/modal-content/BetDetailsSkeleton.vue'

const route = useRoute()
const { t } = useI18n()
const transactionId = computed(() => (route.query.ref ? String(route.query.ref) : ''))
const { result, loading, onError } = useQuery<{ betDetail: BetDetail }>(BET_DETAIL_QUERY, { transactionId })
const betDetail = computed(() => result.value?.betDetail)

onError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message
  })
})
</script>

<template>
  <div class="bet-detail-modal w-full">
    <div v-if="betDetail">
      <BetDetailsProvider :bet-detail="betDetail">
        <BetDetailsModalWrapper />
      </BetDetailsProvider>
    </div>
    <div v-else-if="loading">
      <BetDetailsSkeleton />
    </div>
  </div>
</template>
