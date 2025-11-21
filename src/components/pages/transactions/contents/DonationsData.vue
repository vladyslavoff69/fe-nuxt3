<script lang="ts" setup>
import DonationTaxTable from '~/components/molecules/table/DonationTaxTable.vue'
import { CHARITY_SUBSCRIBES_BY_USER, DONATIONS_BY_USER } from '~/graphql'
import type { Deposit, TransactionPaginate } from '~/types'
import type { SelectMenuItem } from '@nuxt/ui'

const { t } = useI18n()
const {
  result: charitiesResult,
  loading: charitiesLoading
} = useQuery(
  CHARITY_SUBSCRIBES_BY_USER,
  {}
)
const charities = computed(() => (charitiesResult.value ? charitiesResult.value.charitySubscribesByUser : []))
const formData = reactive({
  charityId: undefined,
  timePeriod: undefined as any
})

const requestParams = reactive({
  limit: 10,
  currency_code: 'BTC',
  starts_at: formData.timePeriod?.starts_at || undefined,
  ends_at: formData.timePeriod?.ends_at || undefined,
  institution_id: formData.charityId || undefined,
})

type depositResults = {
  results: Deposit[];
  paginate: TransactionPaginate;
}

const { result: transactionsResult, loading: transactionsLoading, refetch } = useQuery<{
  depositsByUser: depositResults;
}>(DONATIONS_BY_USER, requestParams)

const transactions = computed(() => transactionsResult.value?.depositsByUser?.results ?? [])
const currentDate = new Date()
const currentMonth = currentDate.getMonth() + 1
const currentYear = currentDate.getUTCFullYear()

const generateTimePeriodOptions = (year: number) => {
  return [
    {
      value: year,
      label: String(year),
      starts_at: `${year}-01-01`,
      ends_at: `${year}-12-31`,
    },
    {
      value: `${year}-1`,
      label: `1 Jan - 31 Mar ${year}`,
      starts_at: `${year}-01-01`,
      ends_at: `${year}-03-31`,
      disabled: currentMonth < 3 && year === currentYear
    },
    {
      value: `${year}-2`,
      label: `1 Apr - 30 Jun ${year}`,
      starts_at: `${year}-04-01`,
      ends_at: `${year}-06-30`,
      disabled: currentMonth < 6 && year === currentYear
    },
    {
      value: `${year}-3`,
      label: `1 Jul - 30 Sep ${year}`,
      starts_at: `${year}-07-01`,
      ends_at: `${year}-09-30`,
      disabled: currentMonth < 9 && year === currentYear
    },
    {
      value: `${year}-4`,
      label: `1 Oct - 31 Dec ${year}`,
      starts_at: `${year}-10-01`,
      ends_at: `${year}-12-31`,
      disabled: currentMonth < 12 && year === currentYear
    },
  ] satisfies SelectMenuItem[]
}

const timePeriodOptions = computed(() => {
  const currentYearOptions = generateTimePeriodOptions(currentYear)
  const lastYearOptions = generateTimePeriodOptions(currentYear - 1)

  return [...lastYearOptions, ...currentYearOptions]
})

watch(
  () => requestParams.limit,
  (v, oV) => {
    if (v !== oV) {
      refetch({
        ...requestParams,
        starts_at: formData.timePeriod?.starts_at || undefined,
        ends_at: formData.timePeriod?.ends_at || undefined,
        institution_id: formData.charityId || undefined,
        limit: v
      })
    }
  }
)

watch(
  () => formData.timePeriod,
  (v, oV) => {
    if (v && v !== oV) {
      refetch({
        ...requestParams,
        institution_id: formData.charityId || undefined,
        starts_at: v?.starts_at,
        ends_at: v?.ends_at,
      })
    }
  }
)

watch(
  () => formData.charityId,
  (v, oV) => {
    if (v && v !== oV) {
      refetch({
        ...requestParams,
        starts_at: formData.timePeriod?.starts_at || undefined,
        ends_at: formData.timePeriod?.ends_at || undefined,
        institution_id: v
      })
    }
  }
)
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <h4 class="font-bold text-xl">
      {{ t('transaction.history') }}
    </h4>
    <div class="flex flex-col gap-y-4">
      <div class="flex flex-col sm:flex-row gap-x-5 relative pb-5">
        <div class="flex-1 grid gap-y-2">
          <span class="text-sm font-bold text-white">{{ t('charity.select-the-charity') }}</span>
          <USelect
            v-model="formData.charityId"
            :items="charities"
            :placeholder="t('charity.select-the-charity')"
            class="w-full text-sm h-10 bg-green-950! relative"
            size="lg"
            value-key="id"
            label-key="name"
          />
        </div>
        <div class="flex-1 grid gap-y-2">
          <span class="text-sm font-bold text-white">
            {{ t('base.select-period') }}
          </span>
          <USelect
            v-model="formData.timePeriod"
            :items="timePeriodOptions"
            :placeholder="t('base.select-period')"
            class="w-full text-sm h-10 bg-green-950!"
            size="lg"
          />
        </div>
      </div>
    </div>

    <ClientOnly>
      <DonationTaxTable
        :loading="transactionsLoading || charitiesLoading"
        :rows="transactions"
        @update:count-per-page="(_val) => requestParams.limit = _val"
      />
    </ClientOnly>
  </div>
</template>
