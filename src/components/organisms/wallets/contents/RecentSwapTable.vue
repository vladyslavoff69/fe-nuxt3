<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import { WALLET_TRANSACTIONS_QUERY } from '~/graphql'
import { EXCHANGE_OPERATION } from '~/constants'
import type { OtherTransaction } from '~/types'

type swapResults = {
  items: OtherTransaction[];
  perPage: number;
  currentPage: number;
  total: number;
}

const {
  result: transactionsResult,
  loading: transactionsLoading
} = useQuery<{
  playerTransactions: swapResults;
}>(
  WALLET_TRANSACTIONS_QUERY,
  {
    input: {
      perPage: 10,
      page: 1,
      types: [EXCHANGE_OPERATION]
    }
  }
)

const transactions = computed(() => (transactionsResult.value?.playerTransactions?.items || []).slice(0, 10))
const mergedTransactions = computed(() => transactions.value?.reduce((acc, transaction, index) => {
  const pairIndex = Math.floor(index / 2) // Group items in pairs (0,1), (2,3), (4,5), etc.

  if (!acc[pairIndex]) {
    acc[pairIndex] = {
      row_index: pairIndex, // Index-based grouping
      transactions: [], // Store original transactions
      created_dates: new Set(),
      currency_codes: new Set(),
      amounts: new Set(),
      normalized_amounts: new Set(),
    }
  }

  // Store unique values
  acc[pairIndex].created_dates.add(transaction.created_at)
  acc[pairIndex].currency_codes.add(transaction.currency_code)
  acc[pairIndex].amounts.add(transaction.amount)
  acc[pairIndex].normalized_amounts.add(transaction.normalized_amount)

  // Store the transaction details
  acc[pairIndex].transactions.push(transaction)

  return acc
}, []).map(group => ({
  row_index: group.row_index,
  created_dates: Array.from(group.created_dates), // Convert Set to Array
  currency_codes: Array.from(group.currency_codes), // Convert Set to Array
  amounts: Array.from(group.amounts),
  normalized_amounts: Array.from(group.normalized_amounts),
  transactions: group.transactions, // Keep original transactions if needed
})))
</script>

<template>
  <div class="w-full">
    <div
      v-if="transactionsLoading"
      class="w-full flex flex-col"
    >
      <div
        v-for="index in 5"
        :key="index"
        class="w-full p-1 flex items-center gap-1"
      >
        <template
          v-for="colIdx in 3"
          :key="`c_${index}_${colIdx}`"
        >
          <USkeleton
            class="h-6 bg-green-950"
            :class="{
              'w-full': colIdx === 2,
              'w-20': colIdx !== 2
            }"
          />
        </template>
      </div>
    </div>
    <div
      v-else-if="mergedTransactions"
      class="w-full"
    >
      <template
        v-for="(transaction, tInd) in mergedTransactions"
        :key="`tInd_${tInd}`"
      >
        <div
          class="border-b border-border grid grid-cols-10 items-center gap-1 sm:gap-1.5 text-sm p-1"
        >
          <div class="text-white col-span-2">
            {{ transaction.created_dates[0] ? useDateFormat(new Date(transaction.created_dates[0]), "MM/DD/YY").value : '' }}
          </div>
          <div class="col-span-7 grid grid-cols-9 items-center gap-0.5 px-2 truncate">
            <div class="col-span-4 text-right">
              {{ Math.abs((transaction.amounts[1] || 0)) }}
              {{ transaction.currency_codes[1] }}
            </div>
            <UIcon
              name="material-symbols:arrow-forward"
              class="w-3 h-3 min-w-3 min-h-3"
            />
            <div class="col-span-4">
              <span v-if="transaction.amounts[0]">
                {{ Math.abs((transaction.amounts[0] || 0)) }}
              </span>
              {{ transaction.currency_codes[0] }}
              <span v-if="!transaction.amounts[0]">
                (${{ Math.abs((transaction.normalized_amounts[0] || 0)).toFixed(2) }})
              </span>
            </div>
          </div>
          <div class="col-span-1 uppercase text-primary">
            <NuxtLinkLocale to="/transactions?tabs=transactions&transaction=other">
              View
            </NuxtLinkLocale>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
