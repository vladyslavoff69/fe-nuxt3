<script lang="ts" setup>
import CharityRankTable from '~/components/molecules/table/CharityRankTable.vue'
import { CHARITY_INSTITUTION_RANK_UPDATED, CHARITY_RANK } from '~/graphql'
import { PREFERENCE } from '~/constants'
import type { Charity } from '~/types/charity'

const props = defineProps<{
  countPerPage: number
}>()

const { activeFiatCode } = inject(PREFERENCE)!
const { result, loading, refetch } = useQuery(
  CHARITY_RANK,
  {
    limit: props.countPerPage,
    fiatCurrency: activeFiatCode.value,
  },
  { fetchPolicy: 'no-cache' }
)

const { onResult: onNewLiveResult } = useSubscription(
  CHARITY_INSTITUTION_RANK_UPDATED,
  {}
)


// eslint-disable-next-line vue/no-side-effects-in-computed-properties
const rows = computed(() => (result.value?.charityRank ? result.value.charityRank?.sort((a, b) => a.rank - b.rank) : []))

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

onNewLiveResult((subscriptionData) => {
  if (!subscriptionData.data?.charityInstitutionRankUpdated) {
    return
  }

  const _charityRank: Charity[] = []
  for (const i in subscriptionData.data.charityInstitutionRankUpdated) {
    if (i !== '__typename') {
      _charityRank.push(subscriptionData.data.charityInstitutionRankUpdated[i])
    }
  }

  result.value = {
    charityRank: _charityRank?.sort((a, b) => a.rank - b.rank)?.slice(0, 50)
  }
})
</script>

<template>
  <ClientOnly>
    <CharityRankTable
      :loading="loading"
      :rows="rows"
    />
  </ClientOnly>
</template>
