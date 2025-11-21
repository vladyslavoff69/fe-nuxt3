<script lang="ts" setup>
import MatchTable from '~/components/molecules/table/MatchTable.vue'
import { useHighRollersBets } from '~/composables/bet'

const props = defineProps<{
  countPerPage: number
  type?: string
}>()

const variables = computed(() => ({
  limit: props.countPerPage,
  type: props.type || 'CASINO',
  accept_null_cursor: false,
  only_finished_matches: true
}))

const { bets, loading, refetch } = useHighRollersBets(
  variables.value
)

watch(
  () => props.countPerPage,
  (v) => {
    refetch({
      limit: v,
      type: props.type || 'CASINO',
      accept_null_cursor: false,
      only_finished_matches: true,
      amount_start: 0.00000001
    })
  },
  { immediate: true },
)

const rows = computed(() => (bets.value?.slice(0, variables.value.limit) || []))
</script>

<template>
  <div
    :class="{
      'mb-5': !loading && rows.length < 1
    }"
  >
    <ClientOnly>
      <MatchTable
        :loading="loading"
        :rows="rows"
      />
    </ClientOnly>
  </div>
</template>
