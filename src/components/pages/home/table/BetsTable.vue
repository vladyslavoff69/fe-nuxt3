<script lang="ts" setup>
import MatchTable from '~/components/molecules/table/MatchTable.vue'
import { useBets } from '~/composables/bet'

const props = defineProps<{
  countPerPage: number,
  type?: string,
}>()

const variables = computed(() => ({
  type: props.type || 'CASINO',
  limit: props.countPerPage,
  accept_null_cursor: false,
  only_finished_matches: true
}))

const {
  bets: betsData,
  betsLoading: loading,
  betsRefetch
} = useBets(variables.value)

const tableStrip = ref(0)
watch(
  () => props.countPerPage,
  (limit) => {
    betsRefetch({
      game_id: '',
      type: 'CASINO',
      limit: Number(limit),
      accept_null_cursor: false,
      only_finished_matches: true,
      amount_start: 0.00000001
    })
  },
  { immediate: true }
)

const limit = computed(() => props.countPerPage)
const rows = computed(() => (betsData.value?.slice(0, limit.value) || []))
</script>

<template>
  <div
    :class="{
      'pb-5': !loading && rows.length < 1
    }"
  >
    <ClientOnly>
      <MatchTable
        :loading="loading"
        :rows="rows"
        :tr-strip="tableStrip"
      />
    </ClientOnly>
  </div>
</template>
