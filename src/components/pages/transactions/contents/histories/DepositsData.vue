<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import { WALLET_TRANSACTIONS_QUERY } from '~/graphql'
import type { Deposit } from '~/types'
import { AUTH, DEPOSIT, THEME } from '~/constants'
import WalletTable from '~/components/pages/transactions/contents/histories/WalletTable.vue'
import DateTimeRangePicker from '~/components/molecules/common/DateTimeRangePicker.vue'
import CryptoPopover from '~/components/organisms/wallets/popovers/CryptoPopover.vue'

type depositResults = {
  items: Deposit[];
  perPage: number;
  currentPage: number;
  total: number;
}

const {
  countPerPage = 10
} = defineProps<{
  countPerPage: number;
}>()

const { isLoggedIn } = inject(AUTH)!
const { screen } = inject(THEME)!
const currentPage = ref(1)
const initCryptoCode = ref('')
const dateRange = ref()
const selectedStatus = ref('ALL')

const requestParams = computed(() => ({
  perPage: countPerPage,
  page: currentPage.value,
  types: [DEPOSIT],
  ...(selectedStatus.value !== 'ALL' ? { status: selectedStatus.value } : {}),
  ...(initCryptoCode.value !== '' ? { currency_code: initCryptoCode.value } : {}),
  ...(
    dateRange.value && dateRange.value?.start
      ? { starts_at: useDateFormat(new Date(dateRange.value.start), 'YYYY-MM-DD HH:mm:ss').value }
      : {}
  ),
  ...(
    dateRange.value && dateRange.value?.end
      ? { ends_at: useDateFormat(new Date(dateRange.value.end), 'YYYY-MM-DD HH:mm:ss').value }
      : {}
  )
}))

const {
  result: transactionsResult,
  loading: transactionsLoading,
  refetch,
  options
} = useQuery<{
  playerTransactions: depositResults;
}>(
  WALLET_TRANSACTIONS_QUERY,
  { input: requestParams.value },
  {
    errorPolicy: (import.meta.server ? 'ignore' as const : 'all' as const),
    enabled: isLoggedIn.value,
    fetchPolicy: 'cache-and-network'
  }
)

const transactions = computed(() => (transactionsResult.value?.playerTransactions?.items || []))
const total = computed(() => (transactionsResult.value?.playerTransactions?.total || 1))

watch(() => countPerPage, (v, oV) => {
  if (v !== oV) {
    currentPage.value = 1
    refetch({
      input: {
        ...requestParams.value,
        perPage: v,
        page: currentPage.value,
      }
    })
  }
}, { immediate: true })

watch(() => currentPage.value, (v, oV) => {
  if (oV && v !== oV && v > 0) {
    refetch({
      input: {
        ...requestParams.value,
        page: v
      }
    })
  }
}, { immediate: true })

watch(
  () => isLoggedIn.value,
  (v: boolean) => {
    if (v) {
      // @ts-ignore
      options.enabled = true
    }
  },
  { immediate: isLoggedIn.value }
)

const formattedDate = computed(() => {
  if (dateRange.value?.start && dateRange.value?.end) {
    return `${
      useDateFormat(new Date(dateRange.value.start), 'YYYY/MM/DD, hh:mm A').value
    } ~ ${useDateFormat(new Date(dateRange.value.end), 'YYYY/MM/DD, hh:mm A').value}`
  }

  return 'Select a Period'
})

const filterData = () => {
  refetch({
    input: {
      ...requestParams.value
    }
  })
}

const resetFilter = () => {
  currentPage.value = 1
  initCryptoCode.value = ''
  selectedStatus.value = 'ALL'
  dateRange.value = null

  filterData()
}
</script>

<template>
  <div class="w-full h-auto p-0 m-0">
    <div class="flex items-center justify-between mb-4 gap-3 w-full flex-wrap md:flex-nowrap">
      <div class="flex items-center gap-x-0.5 w-full">
        <span class="text-sm font-bold">Date:</span>
        <DateTimeRangePicker
          v-model="dateRange"
          class="w-full"
        >
          <template #trigger>
            <UInput
              v-model="formattedDate"
              class="w-full min-w-[300px] text-xs! h-10"
              color="primary"
              size="lg"
              type="text"
            />
          </template>
        </DateTimeRangePicker>
      </div>
      <div class="flex items-center gap-x-0.5 w-full">
        <span class="text-sm font-bold">Status:</span>
        <JSelect
          v-model="selectedStatus"
          :classes="{
            ListboxButton: 'bg-green-950 w-full h-[40px] py-2 px-2.5 pr-1! font-bold text-paragraph',
            Placeholder: 'text-xs',
            LabelOptLabel: 'text-xs'
          }"
          :has-check-box="false"
          :options="[
            { label: 'All', value: 'ALL' },
            { label: 'Processed', value: 'processed' },
            { label: 'Pending', value: 'pending' },
            { label: 'Declined', value: 'declined' },
          ]"
        />
      </div>
      <div class="flex items-center gap-x-0.5 w-full">
        <CryptoPopover
          button-class="h-10 py-0 bg-green-950!"
          :content-height="screen.md ? 300 : 150"
          :show-label="false"
          :init-selected-currency="initCryptoCode"
          @update:init-selected-crypto="value => initCryptoCode = value"
        />
      </div>
      <div class="flex items-center gap-x-1">
        <JButton
          variant="outline"
          button-class="px-4! h-9!"
          @click="resetFilter"
        >
          Reset
        </JButton>
        <JButton
          variant="primary"
          button-class="px-4! h-9!"
          @click="filterData"
        >
          Filter
        </JButton>
      </div>
    </div>

    <ClientOnly>
      <WalletTable
        :loading="transactionsLoading"
        :rows="transactions"
        table-name="deposits"
      />
    </ClientOnly>

    <div class="mt-4 flex items-center justify-end">
      <JPagination
        :current-page="currentPage"
        :last-page="Math.ceil(total/countPerPage)"
        :max-visible="5"
        @update:current="v => currentPage = v"
      />
    </div>
  </div>
</template>
