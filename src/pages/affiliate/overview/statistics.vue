<script lang="ts" setup>
import LazyReferralFiltersForm from '~/apps/affiliate/components/statistics/ReferralFiltersForm.vue'
import LazyReferredUsersTable from '~/apps/affiliate/components/statistics/ReferredUsersTable.vue'
import type { SponsorAffiliatePaginator, SponsorAnalyticsFilter } from '~/types'
import { SPONSOR_AFFILIATES_ANALYTICS_QUERY } from '~/graphql'
import { AUTH } from '~/constants'

const { me } = inject(AUTH)!
const requestParams = reactive({
  first: 10,
  page: 1,
  input: {
    code: '',
    username: '',
  },
  orderBy: [{ column: 'NEWEST', order: 'DESC' }]
})

const { result: sponsorAffiliatesResult, loading: sponsorAffiliatesLoading } =
  useQuery<{
    sponsorAffiliatesAnalytics: SponsorAffiliatePaginator;
  }>(SPONSOR_AFFILIATES_ANALYTICS_QUERY, requestParams)

const sponsorAffiliates = computed(
  () => sponsorAffiliatesResult.value?.sponsorAffiliatesAnalytics?.data || []
)

const sponsorPagination = computed(
  () => sponsorAffiliatesResult.value?.sponsorAffiliatesAnalytics?.paginatorInfo
)

const handleFilters = (filters: SponsorAnalyticsFilter) => {
  requestParams.input.username = filters.username
  requestParams.orderBy[0].column = String(filters.sortBy)
  requestParams.input.code = filters.code !== 'ALL' ? filters.code : ''
}
</script>

<template>
  <div
    v-if="!!me"
    class="flex flex-col gap-y-2 md:gap-y-4"
  >
    <DelayHydration>
      <LazyReferralFiltersForm
        hydrate-on-visible
        @search:filters="handleFilters"
      />
    </DelayHydration>

    <DelayHydration>
      <LazyReferredUsersTable
        hydrate-on-visible
        :loading="sponsorAffiliatesLoading"
        :sponsor-affiliates="sponsorAffiliates"
      />
    </DelayHydration>

    <div
      v-if="sponsorPagination"
      class="flex items-center justify-end"
    >
      <JPagination
        :current-page="sponsorPagination?.currentPage || 1"
        :last-page="sponsorPagination?.lastPage || 1"
        :max-visible="10"
        @update:current="v => requestParams.page = v"
      />
    </div>
  </div>
</template>
