<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import CurrencyColumn from '~/components/molecules/table/details/CurrencyColumn.vue'
import VipRankAvatar from '~/components/molecules/table/details/VipRankAvatar.vue'
import { formatLongFloat } from '~/utils'
import type { TopFiveResultData } from '~/types'

const {
  rows,
  loading = false
} = defineProps<{
  rows?: TopFiveResultData[];
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
  { label: t('base.player'), id: 'username', class: 'w-[calc(50vw-10px)] sm:w-auto md:w-1/5' },
  { label: t('base.date'), id: 'created_at', class: 'hidden sm:table-cell md:w-1/5' },
  { label: t('games.bet'), id: 'wagered_currency', class: 'hidden sm:table-cell md:w-1/5' },
  { label: t('games.multiplier'), id: 'bet_multiplier', class: 'text-center hidden sm:table-cell md:w-1/5' },
  {
    label: t('transaction.payout'),
    id: 'currency_amount',
    class: 'w-[calc(50vw-26px)] sm:w-auto md:w-1/5 pr-1 sm:pr-4'
  },
]

const trs = ['bg-brand', 'bg-green-950']
const trs1 = ['bg-green-950', 'bg-brand']
</script>

<template>
  <div class="j-table-container relative w-full">
    <table
      class="w-full"
      :class="[table]"
    >
      <thead
        :class="[thead, classes?.thead || '']"
      >
        <tr :class="tr">
          <td
            v-for="(column, colIdx) in columns"
            :key="`${colIdx}_code-ht`"
            class="leading-normal"
            :class="[
              th, classes?.th, column?.class || '',
              colIdx === columns.length - 1 ? 'text-right' : 'text-center',
              { 'pl-0!': colIdx > 0 }
            ]"
          >
            {{ column?.label || '' }}
          </td>
        </tr>
      </thead>

      <!--TBody-->
      <tbody :class="tbody">
        <template v-if="loading">
          <tr
            v-for="index in 5"
            :key="`${index}_sce-ht-1`"
            :class="[tr, trs1[index % 2]]"
          >
            <template
              v-for="(col, colIdx) in columns"
              :key="`r_${index}_${colIdx}-ht-2`"
            >
              <td
                class="py-3"
                :class="[
                  td, classes?.td, col?.class || '',
                  colIdx === 0 ?
                    '' :
                    (colIdx === columns.length - 1 ? 'text-right' : 'text-center'),
                  { 'pl-0!': colIdx > 0 }
                ]"
              >
                <div
                  class="flex items-center"
                  :class="[
                    {'flex-row-reverse justify-start': col.id === 'currency_amount'},
                    {'justify-center': col.id !== 'username' && col.id !== 'currency_amount'},
                    ['currency_amount', 'wagered_currency'].includes(col.id) ? 'gap-x-1' : 'gap-x-1.5 sm:gap-x-2',
                  ]"
                >
                  <template v-if="['username', 'wagered_currency', 'currency_amount'].includes(col.id)">
                    <USkeleton
                      class="w-5 h-5 rounded-full"
                      :class="{
                        'bg-green-950': index % 2 !== 0,
                        'bg-brand': index % 2 === 0
                      }"
                    />
                  </template>
                  <template v-if="col.id === 'bet_multiplier'">
                    <div class="w-full flex-1 flex items-center justify-center">
                      <USkeleton
                        :class="{
                          'bg-green-950': index % 2 !== 0,
                          'bg-brand': index % 2 === 0
                        }"
                        class="w-20 h-6 rounded-full"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <USkeleton
                      class="w-20 h-5"
                      :class="{
                        'bg-green-950': index % 2 !== 0,
                        'bg-brand': index % 2 === 0
                      }"
                    />
                  </template>
                </div>
              </td>
            </template>
          </tr>
        </template>
        <template v-else>
          <template v-if="rows && rows.length > 0">
            <tr
              v-for="(row, index) in rows"
              :key="`${index}_bets-ht-3`"
              :class="[tr, trs[index % 2]]"
            >
              <td
                class="py-3"
                :class="[td, classes?.td, columns[0]?.class || '']"
              >
                <VipRankAvatar
                  :display-name="row.username"
                  :show-name="true"
                  :username="row.username"
                  :vip-level-name="row.vip_level_name"
                />
              </td>
              <td
                class="py-3 px-0! text-center"
                :class="[td, classes?.td, columns[1]?.class || '']"
              >
                {{ useDateFormat(new Date(row.created_at), "MM/DD/YY").value }}
              </td>
              <td
                class="py-3 px-0!"
                :class="[td, classes?.td, columns[2]?.class || '']"
              >
                <CurrencyColumn
                  :amount="row.wagered_currency"
                  :normalized-amount="row.wagered"
                  :currency-amount="row.wagered_currency"
                  :front="true"
                  :currency-code="row.currency_code"
                  class="justify-center"
                />
              </td>
              <td
                class="py-3 px-0!"
                :class="[td, classes?.td, columns[3]?.class || '']"
              >
                <span class="w-full flex items-center justify-center">
                  <span
                    class="inline-block relative px-1.5 py-0.5 w-full max-w-24 text-center font-bold"
                  >
                    <span class="inline-block mr-0.5">×</span>{{ formatLongFloat(row.bet_multiplier) }}
                  </span>
                </span>
              </td>
              <td
                class="py-3"
                :class="[td, classes?.td, columns[4]?.class || '']"
              >
                <CurrencyColumn
                  :amount="row.currency_amount"
                  :normalized-amount="row.amount"
                  class="justify-end"
                  :class="{
                    'text-primary': row.currency_amount >= row.wagered_currency,
                    'text-ash': row.currency_amount < row.wagered_currency
                  }"
                  :currency-amount="row.currency_amount"
                  :currency-code="row.currency_code"
                />
              </td>
            </tr>
          </template>
          <template v-else>
            <tr
              :class="[tr]"
            >
              <td
                class="py-3 text-center text-paragraph bg-brand italic"
                :class="[td, classes?.td]"
                :colspan="columns.length"
              >
                {{ t('base.no-data') }}
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>
