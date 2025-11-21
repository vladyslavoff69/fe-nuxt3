<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import type { Deposit } from '~/types'
import CurrencyColumn from '~/components/molecules/table/details/CurrencyColumn.vue'
import copy from 'copy-to-clipboard'

const { t } = useI18n()
const {
  tableName,
  rows,
  trStrip = 0,
  loading = false
} = defineProps<{
  rows: Deposit[];
  trStrip?: number;
  classes?: {
    td?: string;
    th?: string;
    thead?: string;
  } | undefined;
  loading?: boolean;
  tableName?: string;
}>()

const colorMap: { [key in string]: string } = {
  pending: 'text-white',
  failed: 'text-error',
  processed: 'text-primary',
}

const trs = ['bg-transparent', 'bg-green-950']

const { table, thead, tbody, tr, td, th } = useTable()

const columns = computed(() => {
  if (tableName === 'tips') {
    return [
      { label: t('base.date'), id: 'time', class: 'sm:w-[35%]' },
      { label: t('transaction.state'), id: 'receiver_username', class: 'hidden sm:inline-block sm:w-full' },
      { label: t('base.amount'), id: 'amount', class: 'text-right py-3 pr-1 xs:pr-4 sm:w-[35%]' },
    ]
  }

  return [
    { label: t('base.date'), id: 'time', class: 'sm:w-[35%]' },
    { label: t('transaction.state'), id: 'status', class: 'hidden sm:inline-block sm:w-full' },
    { label: t('base.amount'), id: 'amount', class: 'text-right py-3 pr-1 xs:pr-4 sm:w-[35%]' },
  ]
})

const getStatusTextColor = (status: string) => {
  return colorMap[status] || 'text-white'
}

const isCopied = ref(false)
const copyValue = ref<string>('')
const copyToClipboard = (_copyValue: string) => {
  try {
    copy(String(_copyValue))
    copyValue.value = _copyValue
    setTimeout(() => {
      copyValue.value = ''
      isCopied.value = false
    }, 1500)
  } catch (error) {
    // console.log('Failed to copy:', error)
  }
}

const copyId = (row: Deposit) => {
  copyToClipboard(String(row.transaction_id))
  isCopied.value = true
}
</script>

<template>
  <div class="bg-green5 grid gap-y-4">
    <div class="w-full flex justify-start gap-x-2">
      <slot name="table-header" />
    </div>
    <div class="j-table-container relative">
      <table
        :class="table"
        class="w-full table-fixed"
      >
        <thead
          :class="[
            thead, classes?.thead || ''
          ]"
        >
          <tr :class="tr">
            <td
              v-for="(column, colIdx) in columns"
              :key="colIdx"
              :class="[th, classes?.th, column?.class || '']"
              class="leading-normal"
            >
              {{ column?.label || '' }}
            </td>
          </tr>
        </thead>

        <!--TBody-->
        <tbody :class="tbody">
          <template v-if="loading">
            <tr
              v-for="index in 3"
              :key="index"
              :class="[tr, trs[index % 2]]"
            >
              <td
                v-for="col in columns"
                :key="`r_${index}_${col.id}`"
                :class="[td, classes?.td, col?.class || '']"
                class="py-3"
              >
                <div
                  class="w-full flex-1 flex items-center"
                  :class="{
                    'justify-end': col.id === 'amount'
                  }"
                >
                  <USkeleton
                    class="w-20 h-5"
                    :class="{
                      'bg-green-950': index % 2 === 0,
                      'bg-brand': index % 2 !== 0
                    }"
                  />
                </div>
              </td>
            </tr>
          </template>
          <template v-else-if="rows && rows.length > 0">
            <tr
              v-for="(row, index) in rows"
              :key="`c_${index}_${row.transaction_id}`"
              :class="[tr, trs[index % 2 + trStrip]]"
            >
              <td
                v-for="col in columns"
                :key="`r_${index}_${col.id}`"
                :class="[td, classes?.td, col?.class || '']"
                class="py-3"
              >
                <span
                  v-if="col.id === 'status'"
                  :class="getStatusTextColor(row.status)"
                  class="text-sm text-paragraph leading-5 truncate capitalize"
                >
                  {{ row.status }}
                </span>
                <div
                  v-else-if="col.id === 'time'"
                  class="flex items-center gap-x-1"
                >
                  <span
                    class="text-sm text-paragraph leading-5 text-wrap sm:text-nowrap"
                  >
                    {{ useDateFormat(new Date(row.created_at), "DD MMM, YYYY, HH:mm A").value }}
                  </span>
                  <UTooltip
                    :content="{ side: 'top' }"
                    arrow
                    :text="(isCopied ? `${t('base.copied')} transaction ID!` : t('base.copy'))"
                  >
                    <UIcon
                      class="w-4 h-4 min-h-4 min-w-4 cursor-copy"
                      name="icon-park-solid:copy"
                      @click="copyId(row)"
                    />
                  </UTooltip>
                </div>
                <CurrencyColumn
                  v-else-if="col.id === 'amount'"
                  :amount="row[col.id]"
                  :currency-code="row.currency_code"
                  :front="false"
                  class="justify-end"
                />
                <div
                  v-else-if="col.id === 'receiver_username'"
                  class="text-paragraph flex items-center gap-0.5"
                >
                  <span>{{ row.sender_username }}</span>
                  <UIcon
                    name="material-symbols:arrow-forward"
                    class="w-3 h-3 min-w-3 min-h-3"
                  />
                  <span>{{ row[col.id] }}</span>
                </div>
                <div
                  v-else
                  class="text-paragraph capitalize truncate"
                >
                  {{ row[col.id] }}
                </div>
              </td>
            </tr>
          </template>
          <tr
            v-else
            :class="[tr]"
          >
            <td
              :class="[td, classes?.td]"
              :colspan="columns.length"
              class="py-3 text-center text-paragraph bg-green-950 italic"
            >
              {{ t('base.no-data') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
