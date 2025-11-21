<script lang="ts" setup>
import MatchTable from '~/components/molecules/table/MatchTable.vue'
import { useBetsByUser } from '~/composables/bet/useBetsByUser'

const props = defineProps<{
  type: string,
  countPerPage: number
}>()

const variables = computed(() => ({
  type: props.type,
  limit: props.countPerPage,
  accept_null_cursor: false,
  only_finished_matches: true,
}))

const {
  bets: betsData,
  betsLoading: loading,
  betsRefetch
} = useBetsByUser(variables.value)

const tableStrip = ref(0)
watch(
  () => [props.type, props.countPerPage],
  ([type, limit]: any) => {
    betsRefetch({
      type,
      limit,
      accept_null_cursor: false,
      only_finished_matches: true,
    })
  },
  { immediate: true },
)

const rows = computed(() => (betsData.value?.slice(0, variables.value.limit) || []))
</script>

<template>
  <div
    :class="{
      'pb-5': !loading && rows.length < 1
    }"
  >
    <ClientOnly>
      <MatchTable
        :hidden-cols="['display_name']"
        :loading="loading"
        :rows="rows"
        :tr-strip="tableStrip"
      />
    </ClientOnly>
  </div>
</template>
