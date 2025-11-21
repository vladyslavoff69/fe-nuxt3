<script lang="ts" setup>
import { PLAYERS_RANK } from '~/graphql'
import { PREFERENCE } from '~/constants'
import PlayerRankTable from '~/components/molecules/table/PlayerRankTable.vue'

const props = defineProps<{
  countPerPage: number
}>()

const { activeFiatCode } = inject(PREFERENCE)!
const { result, loading, refetch } = useQuery(
  PLAYERS_RANK,
  {
    limit: props.countPerPage,
    fiatCurrency: activeFiatCode.value,
  }
)

const rows = computed(() => {
  if (result.value && result.value.playersRank) {
    return result.value.playersRank.sort((a, b) => a.rank - b.rank)
  }

  return []
})

watch(
  () => [props.countPerPage, activeFiatCode.value],
  ([_countPerPage, _currentFiatCode]: any) => {
    refetch({
      limit: _countPerPage,
      fiatCurrency: _currentFiatCode
    })
  },
  { immediate: true }
)
</script>

<template>
  <PlayerRankTable
    :loading="loading"
    :rows="rows"
  />
</template>
