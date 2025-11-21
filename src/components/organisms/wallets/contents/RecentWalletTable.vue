<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import copy from 'copy-to-clipboard'
import type { Wallet } from '~/types'
import CurrencyColumn from '~/components/molecules/table/details/CurrencyColumn.vue'

const {
  rows,
  trStrip = 0,
  loading = false
} = defineProps<{
  rows: Wallet[];
  trStrip?: number;
  classes?: {
    td?: string;
    th?: string;
    thead?: string;
  } | undefined;
  loading?: boolean;
  tableName?: string;
}>()

const { t } = useI18n()
const colorMap: { [key in string]: string } = {
  pending: 'text-white',
  failed: 'text-error',
  processed: 'text-primary',
}
const trs = ['bg-transparent', 'bg-green-950']
const { table, thead, tbody, tr, td, th } = useTable()
const columns = [
  { label: t('base.date'), id: 'time', class: 'sm:w-[35%]' },
  { label: t('transaction.state'), id: 'status', class: 'hidden sm:inline-block sm:w-full' },
  { label: t('base.amount'), id: 'amount', class: 'text-right py-3 pr-1 xs:pr-4 sm:w-[35%]' },
]
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
  }
}

const copyUrl = (row: Wallet) => {
  if (row.txHash && row.txHash !== '') {
    const txHashUrl = `https://blockchair.com/search?q=${row.txHash}`
    copyToClipboard(txHashUrl)
    window.open(txHashUrl, '_blank')
  }
}

const copyId = (row: Wallet) => {
  copyToClipboard(String(row.id))
  isCopied.value = true
}
</script>

<template>
  <div
    class="bg-green5 grid gap-y-4"
  >
    <div class="j-table-container relative">
      <table
        :class="table"
        class="w-full table-fixed"
      >
        <thead :class="[thead, classes?.thead || '']">
          <tr
            :class="tr"
            class="w-full"
          >
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
        <tbody
          :class="tbody"
          class="w-full"
        >
          <template v-if="loading">
            <tr
              v-for="index in 3"
              :key="index"
              :class="[tr, trs[index % 2]]"
              class="w-full"
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
              :key="`${index}-${row.id}-table`"
              :class="[tr, trs[index % 2 + trStrip]]"
              class="w-full"
            >
              <td
                v-for="col in columns"
                :key="`r_${index}_${col.id}`"
                :class="[td, classes?.td, col?.class || '']"
                class="py-3"
              >
                <div
                  v-if="col.id === 'status'"
                  class="text-paragraph hover:text-white flex items-center gap-x-1"
                >
                  <span
                    :class="getStatusTextColor(row.status)"
                    class="text-sm text-paragraph leading-5 truncate capitalize"
                  >
                    {{ row.status }}
                  </span>
                  <UTooltip
                    v-if="row.txHash && row.txHash !== ''"
                    :content="{ side: 'top' }"
                    arrow
                    :text="(row.txHash ? `https://blockchair.com/search?q=${row.txHash}` : 'No blockchair.com URL for this transaction.')"
                  >
                    <UIcon
                      class="w-4 h-4 min-h-4 min-w-4 mb-0.5 cursor-pointer"
                      name="charm:link-external"
                      @click="copyUrl(row)"
                    />
                  </UTooltip>
                </div>
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
                    v-if="!row.txHash || row.txHash === ''"
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
                  v-else
                  class="text-paragraph truncate"
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
