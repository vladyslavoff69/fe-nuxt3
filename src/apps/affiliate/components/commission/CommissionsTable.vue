<script lang="ts" setup>
import CurrencyColumn from '~/components/molecules/table/details/CurrencyColumn.vue'
import type { SponsorCommissionsByCurrency } from '~/types'

defineProps<{
  commissions: SponsorCommissionsByCurrency[];
  loading: boolean;
}>()

const { t } = useI18n()
const { table, thead, tbody, tr, td, th } = useTable()

const columns = [
  {
    label: t('affiliate.commission'),
    class: 'w-[calc(50vw-10px)] sm:w-auto md:w-1/5',
  },
  {
    label: t('affiliate.commission-shared'),
    class: 'hidden sm:table-cell md:w-1/5 text-center pl-0!',
  },
  {
    label: t('affiliate.claimed'),
    class: 'hidden sm:table-cell md:w-1/5 text-center pl-0!',
  },
  {
    label: t('affiliate.claimable'),
    class: 'w-[calc(50vw-26px)] sm:w-auto md:w-1/5 pr-1 sm:pr-4',
  },
]

const trs = ['bg-brand', 'bg-green-950']
</script>

<template>
  <div class="j-table-container relative w-full">
    <table :class="[table]">
      <thead :class="[thead]">
        <tr :class="tr">
          <td
            v-for="(column, colIdx) in columns"
            :key="`${colIdx}_${column?.label}_code`"
            class="leading-normal"
            :class="[
              th, column?.class || '',
              colIdx === columns.length - 1
                ? 'text-right'
                : 'text-center',
              { 'pl-0!': colIdx > 0 }
            ]"
          >
            {{ column?.label || '' }}
          </td>
        </tr>
      </thead>

      <!--TBody-->
      <tbody :class="tbody">
        <template v-if="loading && !commissions?.length">
          <tr
            v-for="ind in 10"
            :key="ind"
            class="px-3"
            :class="[tr, trs[ind % 2]]"
          >
            <td
              v-for="i in 4"
              :key="i"
              :class="[td, i === 2 ? 'pr-1 md:pr-4' : '']"
              class="text-center py-3"
            >
              <div :class="{ 'flex justify-end': i == 2 }">
                <USkeleton
                  :class="{
                    'bg-green-950': ind % 2 === 0,
                    'bg-brand': ind % 2 !== 0
                  }"
                  class="w-full max-w-44 h-5"
                />
              </div>
            </td>
          </tr>
        </template>
        <template v-else-if="!loading && commissions?.length">
          <tr
            v-for="(row, index) in commissions"
            :key="`${index}_comm`"
            :class="[tr, trs[(index + 1) % 2]]"
          >
            <td
              :class="[td, columns[0]?.class || '']"
              class="py-3"
            >
              <CurrencyColumn
                :amount="row.total_commission"
                :currency-code="row.currency.code"
                :front="true"
                class="justify-start"
              />
            </td>
            <td
              :class="[td, columns[1]?.class || '']"
              class="py-3 px-0! text-center"
            >
              <CurrencyColumn
                :amount="row.total_affiliate_commission"
                :currency-code="row.currency.code"
                :front="true"
                class="justify-center"
              />
            </td>
            <td
              :class="[td, columns[2]?.class || '']"
              class="py-3 px-0! text-center"
            >
              <CurrencyColumn
                :amount="row.sponsor_commission_claimed"
                :currency-code="row.currency.code"
                :front="true"
                class="justify-center"
              />
            </td>
            <td
              :class="[td, columns[3]?.class || '']"
              class="py-3"
            >
              <CurrencyColumn
                :amount="row.sponsor_commission_claimable"
                :currency-code="row.currency.code"
                :front="true"
                class="justify-end"
              />
            </td>
          </tr>
        </template>
        <template v-else>
          <tr
            :class="[tr]"
          >
            <td
              :class="[td]"
              :colspan="columns.length"
              class="py-3 text-center text-paragraph bg-brand italic"
            >
              {{ t("affiliate.no-commissions") }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
