<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import GameHistoryTable from '~/components/pages/transactions/contents/histories/GameHistoryTable.vue'
import SearchPopper from '~/apps/casino/components/details/SearchPopper.vue'
import { MY_GAME_HISTORY_QUERY } from '~/graphql'
import { AUTH, GAME_TRANSACTION, THEME } from '~/constants'
import type { GameTransaction } from '~/types'
import CryptoPopover from '~/components/organisms/wallets/popovers/CryptoPopover.vue'
import DateTimeRangePicker from '~/components/molecules/common/DateTimeRangePicker.vue'

type GameTransactions = {
  items: GameTransaction[];
  perPage: number;
  currentPage: number;
  total: number;
}

const { isLoggedIn } = inject(AUTH)!
const { screen } = inject(THEME)!
const countPerPage = ref(10)
const currentPage = ref(1)
const gameId = ref()
const amountStart = ref(0)
const amountEnd = ref(0)
const initCryptoCode = ref('')
const dateRange = ref()

const requestParams = computed(
  () => (
    {
      perPage: countPerPage.value,
      page: currentPage.value,
      types: [GAME_TRANSACTION],
      ...(gameId.value ? { game_id: gameId.value } : {}),
      ...((amountStart.value && amountStart.value !== 0 && !isNaN(amountStart.value)) ? { payout_start: amountStart.value } : {}),
      ...((amountEnd.value && amountEnd.value !== 0 && !isNaN(amountEnd.value)) ? { payout_end: amountEnd.value } : {}),
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
      ),
    }
  )
)

const {
  result: transactionsResult,
  loading: transactionsLoading,
  refetch,
  options
} = useQuery<{
  playerTransactions: GameTransactions;
}>(
  MY_GAME_HISTORY_QUERY,
  { input: requestParams.value },
  {
    errorPolicy: (import.meta.server ? 'ignore' as const : 'all' as const),
    enabled: isLoggedIn.value,
    fetchPolicy: 'cache-and-network'
  }
)

const transactions = computed(() => (transactionsResult.value?.playerTransactions?.items || []))
const total = computed(() => (transactionsResult.value?.playerTransactions?.total || 1))

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

watch(
  () => [countPerPage.value, gameId.value],
  (v, oldV) => {
    if (oldV && (v[0] !== oldV[0] || v[1] !== oldV[1])) {
      currentPage.value = 1

      const params = v[1] === '' || !gameId.value
        ? {
          page: currentPage.value,
          perPage: v[0],
          types: [GAME_TRANSACTION],
        }
        : {
          page: currentPage.value,
          perPage: v[0],
          game_id: Number(v[1]),
          types: [GAME_TRANSACTION],
        }

      refetch({
        input: {
          ...params
        }
      })
    }
  },
  { immediate: true },
)

watch(
  () => currentPage.value,
  (v, oldV) => {
    if (oldV && v !== oldV) {
      refetch({
        input: {
          ...requestParams.value,
          page: v
        }
      })
    }
  },
  { immediate: true },
)

const searchResult = (id: any) => {
  gameId.value = id
}

const formattedDate = computed(() => {
  if (dateRange.value?.start && dateRange.value?.end) {
    return `${
      useDateFormat(new Date(dateRange.value.start), 'YYYY/MM/DD, hh:mm A').value
    } ~ ${useDateFormat(new Date(dateRange.value.end), 'YYYY/MM/DD, hh:mm A').value}`
  }

  return 'Filter Period'
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
  amountStart.value = 0
  amountEnd.value = 0
  initCryptoCode.value = ''
  dateRange.value = null

  filterData()
}
</script>

<template>
  <div
    class="bg-green5 flex flex-col gap-y-4"
  >
    <div class="w-full flex justify-end gap-x-2">
      <div class="max-w-[350px] w-full">
        <SearchPopper
          :search-id="true"
          class="flex-1"
          @search-game="searchResult"
        />
      </div>
      <div class="max-w-[100px]">
        <JSelect
          v-model="countPerPage"
          :classes="{
            ListboxButton: 'bg-green-950 w-full h-[40px] py-2 px-2.5 pr-1! font-bold text-paragraph',
            Placeholder: 'text-xs',
            LabelOptLabel: 'text-xs'
          }"
          :has-check-box="false"
          :options="[
            { label: '10', value: 10 },
            { label: '20', value: 20 },
            { label: '50', value: 50 },
            { label: '100', value: 100 }
          ]"
          class="mr-2"
        />
      </div>
    </div>
    <div class="flex items-center justify-between gap-3 w-full flex-wrap md:flex-nowrap">
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
        <span class="text-sm font-bold">Payout:</span>
        <UInput
          v-model="amountStart"
          class="w-full text-xs! border-none! h-9"
          color="neutral"
          type="number"
          size="lg"
        />
        <span class="text-sm font-bold">~</span>
        <UInput
          v-model="amountEnd"
          class="w-full text-xs! border-none! h-9"
          color="neutral"
          type="number"
          size="lg"
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

    <div class="w-full h-auto p-0 m-0">
      <ClientOnly>
        <GameHistoryTable
          :loading="transactionsLoading"
          :rows="transactions"
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
  </div>
</template>
