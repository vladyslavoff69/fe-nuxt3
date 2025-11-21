<script lang="ts" setup>
import type { Charity } from '~/types/charity'

const { t } = useI18n()
const {
  rows,
  trStrip = 0,
  loading = false
} = defineProps<{
  rows: Charity[] | any[];
  trStrip?: number;
  classes?: {
    td?: string;
    th?: string;
    thead?: string;
  } | undefined;
  loading?: boolean
}>()
const { table, thead, tbody, tr, td, th } = useTable()
const columns = [
  { label: t('charity.rank'), id: 'rank', class: '' },
  { label: t('charity.charity'), id: 'name', class: 'hidden sm:table-cell' },
  { label: t('charity.total-donated'), id: 'totalDonations', class: 'text-center' },
  { label: t('charity.total-users'), id: 'totalPlayers', class: 'text-right py-3 pr-1 sm:pr-4' },
]
const trs = ['bg-transparent', 'bg-green-950']
</script>

<template>
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
            :key="`ctd-8-${colIdx}`"
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
            :key="`ctd-9-${index}`"
            :class="[tr, trs[index % 2]]"
          >
            <template
              v-for="(col, colIdx) in columns"
              :key="`r_${index}_${colIdx}`"
            >
              <td
                :class="[
                  td, classes?.td, col?.class || ''
                ]"
                class="py-3"
              >
                <USkeleton
                  v-if="col.id === 'rank'"
                  class="w-5 h-5"
                  :class="{
                    'bg-green-950': index % 2 === 0,
                    'bg-brand': index % 2 !== 0
                  }"
                />
                <template v-else>
                  <template v-if="['totalDonations', 'totalPlayers'].indexOf(col.id) > -1">
                    <div
                      :class="{
                        'justify-center': col.id === 'totalDonations',
                        'justify-end': col.id === 'totalPlayers'
                      }"
                      class="w-full flex"
                    >
                      <USkeleton
                        class="w-8 h-5"
                        :class="{
                          'bg-green-950': index % 2 === 0,
                          'bg-brand': index % 2 !== 0
                        }"
                      />
                    </div>
                  </template>
                  <template v-if="col.id === 'name'">
                    <div class="w-full flex-1">
                      <USkeleton
                        class="w-20 h-5"
                        :class="{
                          'bg-green-950': index % 2 === 0,
                          'bg-brand': index % 2 !== 0
                        }"
                      />
                    </div>
                  </template>
                </template>
              </td>
            </template>
          </tr>
        </template>
        <template v-else>
          <template v-if="rows && rows.length > 0">
            <tr
              v-for="(row, index) in rows"
              :key="`ctr-10-${index}`"
              :class="[tr, trs[index % 2 + trStrip]]"
            >
              <td
                v-for="(col, colIdx) in columns"
                :key="`r_${index}_${colIdx}_1`"
                :class="[
                  td, classes?.td,
                  col?.class || ''
                ]"
                class="py-3"
              >
                <template
                  v-if="col.id === 'rank'"
                >
                  <NuxtImg
                    v-if="[1, 2, 3].includes(row.rank)"
                    :alt="`rank-${row.rank}`"
                    :src="`/assets/img/players-charity/rank-${row.rank}.png`"
                    class="w-5 h-5"
                    loading="lazy"
                  />
                  <span
                    v-else
                    class="text-sm text-paragraph leading-5 truncate"
                  >
                    {{ row.rank }}th
                  </span>
                </template>
                <span
                  v-else
                  class="leading-normal truncate"
                >
                  {{ row[col.id] }}
                </span>
              </td>
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
    <div class="absolute bottom-0 w-full bg-table-gradient h-[100px]" />
  </div>
</template>
