<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import copy from 'copy-to-clipboard'
import type { Deposit } from '~/types'
import CurrencyColumn from '~/components/molecules/table/details/CurrencyColumn.vue'
import { BLOCKCHAIR_URL_QUERY } from '~/graphql'
import { BLOCKCHAIR_ICON } from '~/icons'

const { t } = useI18n()
const {
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
const columns = [
  { label: t('base.date'), id: 'time', class: '' },
  { label: t('transaction.state'), id: 'status', class: '' },
  { label: t('base.amount'), id: 'amount', class: 'text-right py-3' },
  { label: `TX ${t('base.id')}`, id: 'action_id', class: 'text-right pr-1 xs:pr-4' },
]
const getStatusTextColor = (status: string) => {
  return colorMap[status] || 'text-white'
}
const isCopied = ref(false)
const copyValue = ref<string | number>('')
const copyToClipboard = (_copyValue: string | number) => {
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

const copyUrl = (row: Deposit) => {
  if (row.txHash && row.txHash !== '') {
    const txHashUrl = `https://blockchair.com/search?q=${row.txHash}`
    copyToClipboard(txHashUrl)
    window.open(txHashUrl, '_blank')
  }
}

const actionId = ref('')
const {
  loading: actionLoading,
  result: urlResult,
  refetch: loadUrl
} = useQuery(
  BLOCKCHAIR_URL_QUERY,
  { actionId: actionId.value }
)

const getActionUrl = async (row: Deposit) => {
  if (!row.action_id) {
    return
  }

  actionId.value = row.action_id
  await loadUrl({ actionId: row.action_id })

  const url = urlResult.value?.getBlockchairUrl?.url
  if (url) {
    window.open(url, '_blank')
  }
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
        <thead
          :class="[
            thead, classes?.thead || ''
          ]"
        >
          <tr :class="tr">
            <td
              v-for="(column, colIdx) in columns"
              :key="colIdx"
              :class="[
                th, classes?.th, column?.class || ''
              ]"
              class="leading-normal"
            >
              {{ column?.label || '' }}
            </td>
          </tr>
        </thead>

        <!--TBody-->
        <tbody
          :class="tbody"
          class=""
        >
          <template v-if="loading">
            <tr
              v-for="index in 10"
              :key="index"
              :class="[tr, trs[index % 2]]"
            >
              <template
                v-for="(col, colIdx) in columns"
                :key="`r_${index}_${col.id}`"
              >
                <td
                  :class="[
                    td, classes?.td, col?.class || ''
                  ]"
                  class="py-3"
                >
                  <div
                    class="w-full flex-1 flex items-center"
                    :class="{
                      'justify-end': col.id === 'amount' || col.id === 'action_id'
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
              </template>
            </tr>
          </template>
          <template v-else>
            <template v-if="rows && rows.length > 0">
              <tr
                v-for="(row, index) in rows"
                :key="`${index}-wallet-${row.status}-table`"
                :class="[tr, trs[index % 2 + trStrip]]"
              >
                <template
                  v-for="(col, colIdx) in columns"
                  :key="`r_${index}_${col.id}`"
                >
                  <td
                    :class="[
                      td, classes?.td,
                      col?.class || ''
                    ]"
                    class="py-3"
                  >
                    <template
                      v-if="col.id === 'status'"
                    >
                      <div
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
                    </template>
                    <template v-else-if="col.id === 'time'">
                      <div class="text-sm text-paragraph leading-5 text-wrap sm:text-nowrap">
                        {{ useDateFormat(new Date(row.created_at), "DD MMM, YYYY, HH:mm A").value }}
                      </div>
                    </template>
                    <template v-else-if="col.id === 'amount'">
                      <CurrencyColumn
                        :amount="row[col.id]"
                        :normalized-amount="row.normalized_amount"
                        :currency-code="row.currency_code"
                        :front="false"
                        class="justify-end"
                      />
                    </template>
                    <template v-else-if="col.id === 'action_id'">
                      <JbBlankButton
                        v-if="row.action_id"
                        :disabled="actionLoading"
                        class="disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        @click="getActionUrl(row)"
                      >
                        <svg
                          class="w-4 h-4 min-w-4 min-h-4 xs:w-5 xs:h-5"
                        >
                          <use :xlink:href="BLOCKCHAIR_ICON" />
                        </svg>
                      </JbBlankButton>
                    </template>
                    <template v-else>
                      <div class="text-paragraph truncate">
                        {{ row[col.id] }}
                      </div>
                    </template>
                  </td>
                </template>
              </tr>
            </template>
            <template v-else>
              <tr
                :class="[tr]"
              >
                <td
                  :class="[
                    td, classes?.td
                  ]"
                  :colspan="columns.length"
                  class="py-3 text-center text-paragraph bg-green-950 italic"
                >
                  {{ t('base.no-data') }}
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
