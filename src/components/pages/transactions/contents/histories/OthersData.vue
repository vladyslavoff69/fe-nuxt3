<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import TransactionTable from '~/components/pages/transactions/contents/histories/TransactionTable.vue'
import { WALLET_TRANSACTIONS_QUERY } from '~/graphql'
import type { OtherTransaction } from '~/types'
import {
  AUTH,
  CLAIM_AFFILIATE_COMISSIONS,
  COUPON_CLAIM,
  EARN_CHAT_RAIN,
  EXCHANGE_OPERATION,
  RAKEBACK_CLAIM,
  RANK_UP_CLAIM,
  RELOAD_CLAIM,
  SEND_CHAT_RAIN,
  THEME,
} from '~/constants'
import CryptoPopover from '~/components/organisms/wallets/popovers/CryptoPopover.vue'
import DateTimeRangePicker from '~/components/molecules/common/DateTimeRangePicker.vue'

type otherResults = {
  items: OtherTransaction[];
  perPage: number;
  currentPage: number;
  total: number;
}

const {
  countPerPage = 10
} = defineProps<{
  countPerPage: number;
}>()

const runtimeConfig = useRuntimeConfig()
const chatRainConf = runtimeConfig.public?.chatRain
const { isLoggedIn } = inject(AUTH)!
const { screen } = inject(THEME)!
const currentPage = ref(1)
const initCryptoCode = ref('')
const dateRange = ref()
const selectedStatus = ref('ALL')
const { t } = useI18n()

const allOthers = [
  CLAIM_AFFILIATE_COMISSIONS,
  COUPON_CLAIM,
  EARN_CHAT_RAIN,
  EXCHANGE_OPERATION,
  RAKEBACK_CLAIM,
  RANK_UP_CLAIM,
  RELOAD_CLAIM,
  SEND_CHAT_RAIN,
]

const typeOptions = [
  {
    label: 'All Others',
    value: 'ALL',
  },
  {
    label: 'Affiliate Commissions Claim',
    value: CLAIM_AFFILIATE_COMISSIONS,
  },
  {
    label: 'Coupon Claim',
    value: COUPON_CLAIM,
  },
  {
    label: `${chatRainConf === 'rain' ? t('chat.chat-rain') : t('chat.chat-snow')} Received`,
    value: EARN_CHAT_RAIN,
  },
  {
    label: `${chatRainConf === 'rain' ? t('chat.chat-rain') : t('chat.chat-snow')} Sent`,
    value: SEND_CHAT_RAIN,
  },
  {
    label: 'Rank up',
    value: RANK_UP_CLAIM,
  },
  {
    label: 'Rakeback',
    value: RAKEBACK_CLAIM,
  },
  {
    label: 'Drip',
    value: RELOAD_CLAIM,
  },
  {
    label: 'Token Swap',
    value: EXCHANGE_OPERATION,
  }
]

const selectedType = ref('ALL')
const requestParams = computed(() => ({
  perPage: countPerPage,
  page: currentPage.value,
  types: (selectedType.value === 'ALL' ? allOthers : [selectedType.value]),
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
  playerTransactions: otherResults;
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
        page: v,
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

watch(() => selectedType.value, (v, oV) => {
  if (oV && v !== oV) {
    currentPage.value = 1

    refetch({
      input: {
        ...requestParams.value,
        page: currentPage.value,
        types: (v === 'ALL' ? allOthers : [v]),
      }
    })
  }
}, { immediate: true })

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
  selectedStatus.value = 'ALL'
  initCryptoCode.value = ''
  dateRange.value = null

  filterData()
}
</script>

<template>
  <div class="w-full h-auto p-0 m-0">
    <TransactionTable
      :loading="transactionsLoading"
      :rows="transactions"
      table-name="bonuses"
    >
      <template #table-header>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center mb-4 gap-3 w-full">
          <div class="flex items-center gap-x-2 col-span-1 w-full">
            <span class="text-sm font-bold">Type:</span>
            <div class="w-full max-w-[200px]">
              <JSelect
                v-model="selectedType"
                :classes="{
                  ListboxButton: 'bg-green-950 min-w-[65px] h-[40px] py-2 px-2.5 pr-1! font-bold text-paragraph',
                  Placeholder: 'text-xs',
                  LabelOptLabel: 'text-xs'
                }"
                :has-check-box="false"
                :options="typeOptions"
                class="mr-2"
              />
            </div>
          </div>

          <div class="flex items-center gap-x-0.5 col-span-1">
            <CryptoPopover
              button-class="h-10 py-0 bg-green-950!"
              :content-height="screen.md ? 300 : 150"
              :show-label="false"
              :init-selected-currency="initCryptoCode"
              @update:init-selected-crypto="value => initCryptoCode = value"
            />
          </div>

          <div class="flex items-center gap-x-0.5 col-span-1">
            <span class="text-sm font-bold">{{ t('base.status') }}:</span>
            <JSelect
              v-model="selectedStatus"
              :classes="{
                ListboxButton: 'bg-green-950 w-full h-[40px] py-2 px-2.5 pr-1! font-bold text-paragraph',
                Placeholder: 'text-xs',
                LabelOptLabel: 'text-xs'
              }"
              :has-check-box="false"
              :options="[
                { label: t('base.all'), value: 'ALL' },
                { label: 'Processed', value: 'processed' },
                { label: 'Pending', value: 'pending' },
                { label: 'Declined', value: 'declined' },
              ]"
            />
          </div>

          <div class="flex items-center gap-x-0.5 col-span-1 lg:justify-end w-full">
            <span class="text-sm font-bold">{{ t('base.date') }}:</span>
            <DateTimeRangePicker
              v-model="dateRange"
              class="w-full"
            >
              <template #trigger>
                <UInput
                  v-model="formattedDate"
                  class="w-full text-xs! h-10"
                  color="primary"
                  size="lg"
                  type="text"
                />
              </template>
            </DateTimeRangePicker>
          </div>

          <div class="flex items-center gap-x-1 col-span-2 lg:justify-end">
            <JButton
              variant="outline"
              button-class="px-4! h-9!"
              @click="resetFilter"
            >
              {{ t('base.reset') }}
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
      </template>
    </TransactionTable>
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
