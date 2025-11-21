<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import type { Deposit } from '~/types'
import CurrencyColumn from '~/components/molecules/table/details/CurrencyColumn.vue'
import copy from 'copy-to-clipboard'

const { t } = useI18n()
const {
  rows,
  trStrip = 0,
  loading = false,
  tableName
} = defineProps<{
  rows: any[];
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
  if (tableName === 'bonuses') {
    return [
      { label: t('base.id'), id: 'transaction_id', class: 'hidden md:block' },
      { label: t('base.date'), id: 'time', class: '' },
      { label: 'Transaction type', id: 'transaction_name', class: '' },
      { label: t('base.amount'), id: 'amount', class: 'text-right py-3 pr-1 xs:pr-4' },
    ]
  }

  if (tableName === 'tips') {
    return [
      { label: t('base.date'), id: 'time', class: '' },
      { label: 'User', id: 'sender_username', class: '' },
      { label: 'Transaction Type', id: 'transaction_name', class: 'hidden md:block' },
      { label: t('base.amount'), id: 'amount', class: 'text-right py-3 pr-1 xs:pr-4' },
    ]
  }

  return [
    { label: t('base.id'), id: 'transaction_id', class: 'hidden md:block' },
    { label: t('base.date'), id: 'time', class: '' },
    { label: t('transaction.state'), id: 'status', class: '' },
    { label: t('base.amount'), id: 'amount', class: 'text-right py-3 pr-1 xs:pr-4' },
  ]
})

const getStatusTextColor = (status: string) => {
  return colorMap[status] || 'text-white'
}

const openMiniProfile = (username: string) => {
  navigateRoute({
    newQueries: {
      name: username,
      modal: 'user',
    }
  })
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

const copyId = (row: Deposit) => {
  copyToClipboard(row.transaction_id)
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
              </template>
            </tr>
          </template>
          <template v-else>
            <template v-if="rows && rows.length > 0">
              <tr
                v-for="(row, index) in rows"
                :key="index"
                :class="[tr, trs[index % 2 + trStrip]]"
              >
                <template
                  v-for="(col, colIdx) in columns"
                  :key="`r_${index}_${col.id}`"
                >
                  <td
                    :class="[td, classes?.td, col?.class || '']"
                    class="py-3"
                  >
                    <template
                      v-if="col.id === 'status'"
                    >
                      <span
                        :class="getStatusTextColor(row.status)"
                        class="text-sm text-paragraph leading-5 truncate capitalize"
                      >
                        {{ row.status }}
                      </span>
                    </template>
                    <template v-else-if="col.id === 'time'">
                      <div class="flex items-center gap-x-1">
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
                            class="w-4 h-4 min-h-4 min-w-4 cursor-copy block md:hidden"
                            name="icon-park-solid:copy"
                            @click="copyId(row)"
                          />
                        </UTooltip>
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
                    <template v-else-if="col.id === 'sender_username'">
                      <JbBlankButton
                        v-if="row.transaction_name === 'Tip received'"
                        class="cursor-pointer hover:text-white duration-150 truncate font-bold"
                        @click="openMiniProfile(row.sender_username)"
                      >
                        {{ row.sender_username }}
                      </JbBlankButton>
                      <JbBlankButton
                        v-else
                        class="cursor-pointer hover:text-white duration-150 truncate font-bold"
                        @click="openMiniProfile(row.receiver_username)"
                      >
                        {{ row.receiver_username }}
                      </JbBlankButton>
                    </template>
                    <template
                      v-else-if="col.id === 'transaction_id'"
                    >
                      <div
                        class="text-paragraph hover:text-white flex items-center gap-x-1"
                      >
                        <div
                          class="text-sm text-paragraph leading-5 truncate capitalize"
                        >
                          {{ row[col.id] }}
                        </div>
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
                    </template>
                    <template v-else>
                      <div class="text-paragraph capitalize truncate">
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
