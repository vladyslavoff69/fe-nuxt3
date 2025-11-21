<script lang="ts" setup>
import type { TopFiveResultData, TopFiveResultType } from '~/types'
import { GAME } from '~/constants'
import { GET_TOP_FIVE_QUERY } from '~/graphql'
import HighestTable from '~/components/molecules/table/HighestTable.vue'

const props = defineProps<{
  type: TopFiveResultType;
}>()

const { game } = inject(GAME)!

const {
  result: topFiveResult,
  loading: dataLoading,
} = useQuery<{
  getTopFive: TopFiveResultData[];
}>(
  GET_TOP_FIVE_QUERY,
  {
    type: props.type,
    slug: game?.slug,
  }
)
</script>

<template>
  <HighestTable
    :classes="{ th: 'text-xs' }"
    :loading="dataLoading"
    :rows="topFiveResult?.getTopFive"
  />
</template>
