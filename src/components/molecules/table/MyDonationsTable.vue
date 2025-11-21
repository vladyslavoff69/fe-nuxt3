<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import type { ID, DateTime } from '~/types/base'
import CurrencyColumn from '~/components/molecules/table/details/CurrencyColumn.vue'

interface DonateRow {
  id: ID;
  user_id: ID;
  currency_code: string;
  status: string;
  amount: number;
  issued_at: DateTime;
  created_at: DateTime;
  updated_at: DateTime;
  normalized_amount: number;
}

const { rows, trStrip = 0, loading = false } = defineProps<{
  rows: DonateRow[] | any[];
  trStrip?: number;
  classes?: {
    td?: string;
    th?: string;
    thead?: string;
  } | undefined;
  loading?: boolean
}>()

const { t } = useI18n()
const { table, thead, tbody, tr, td, th } = useTable()

const columns = [
  { label: t('base.issued_at'), id: 'issued_at', class: '' },
  { label: t('base.status'), id: 'status', class: 'hidden sm:table-cell' },
  { label: t('charity.normalized-amount'), id: 'normalized_amount', class: 'hidden sm:table-cell' },
  { label: t('base.amount'), id: 'amount', class: 'hidden sm:table-cell text-right pr-1 sm:pr-4' },
]

const trs = ['bg-transparent', 'bg-green-950']
</script>

<template>
  <div class="j-table-container relative">
    <table
      :class="table"
      class="w-full table-fixed"
    >
      <thead :class="[thead, classes?.thead || '']">
        <tr :class="tr">
          <td
            v-for="(column, colIdx) in columns"
            :key="colIdx"
            :class="[
              th, classes?.th, column?.class || ''
            ]"
            class="leading-normal"
          >
            <div
              v-if="column.id === 'amount'"
              class="flex items-center justify-end gap-x-1"
            >
              <span>{{ column?.label || '' }}</span>
              <UIcon
                class="w-4 h-4 relative bottom-px"
                name="heroicons:information-circle-20-solid"
              />
            </div>
            <span v-else>{{ column?.label || '' }}</span>
          </td>
        </tr>
      </thead>

      <!--TBody-->
      <tbody :class="tbody">
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
                  v-if="['amount', 'normalized_amount'].includes(col.id)"
                  class="w-full flex justify-end"
                >
                  <USkeleton
                    class="w-8 h-5"
                    :class="{
                      'bg-green-950': index % 2 === 0,
                      'bg-brand': index % 2 !== 0
                    }"
                  />
                </div>
                <div
                  v-else
                  class="w-full flex-1"
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
                  <span v-if="col.id === 'issued_at'">
                    {{ useDateFormat(new Date(row.issued_at), "YYYY/MM/DD, HH:mm A").value }}
                  </span>
                  <CurrencyColumn
                    v-else-if="col.id === 'amount'"
                    :amount="row[col.id]"
                    :normalized-amount="row.normalized_amount"
                    class="justify-end"
                    :class="[
                      {
                        'text-primary': row[col.id] >= row.amount,
                        'text-paragraph': row[col.id] < row.amount
                      }
                    ]"
                    :currency-code="row.currency_code"
                  />
                  <span
                    v-else
                    class="text-sm leading-5 truncate"
                  >
                    {{ row[col.id] }}
                  </span>
                </td>
              </template>
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
        </template>
      </tbody>
    </table>
    <div
      v-if="rows.length < 1"
      class="absolute bottom-0 w-full bg-table-gradient h-[100px]"
    />
  </div>
</template>
