<script lang="ts" setup>
interface PlayerRank {
  rank: number;
  player: string;
  charity: string;
  wagered: number;
}

const { rows, trStrip = 0, loading = false } = defineProps<{
  rows: PlayerRank[] | any[];
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
  { label: t('charity.rank'), id: 'rank', class: '' },
  { label: t('base.player'), id: 'player', class: 'hidden sm:table-cell' },
  { label: t('charity.charity'), id: 'charity', class: 'hidden sm:table-cell' },
  { label: t('base.wagered'), id: 'wagered', class: 'text-right py-3 pr-1 xs:pr-4' },
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
            :key="`ctr-10-${colIdx}-pr-1`"
            :class="[
              th, classes?.th, column?.class || ''
            ]"
            class="leading-normal"
          >
            <div
              v-if="column.id === 'wagered'"
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
      <tbody
        :class="tbody"
        class=""
      >
        <template v-if="loading">
          <tr
            v-for="index in 10"
            :key="`ctr-10-${index}-pr-2`"
            :class="[tr, trs[index % 2]]"
          >
            <template
              v-for="(col, colIdx) in columns"
              :key="`r_${index}_${colIdx}-hey-1`"
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
                <div
                  v-else-if="col.id === 'wagered'"
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
                  v-else-if="col.id === 'player'"
                  class="w-full flex items-center gap-x-1"
                >
                  <USkeleton
                    class="w-5 h-5"
                    :class="{
                      'bg-green-950': index % 2 === 0,
                      'bg-brand': index % 2 !== 0
                    }"
                  />
                  <USkeleton
                    class="w-20 h-5"
                    :class="{
                      'bg-green-950': index % 2 === 0,
                      'bg-brand': index % 2 !== 0
                    }"
                  />
                </div>
                <div
                  v-else-if="col.id === 'charity'"
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
              :key="`r_${index}-hey-2`"
              :class="[tr, trs[index % 2 + trStrip]]"
            >
              <template
                v-for="(col, colIdx) in columns"
                :key="`r_${index}_${colIdx}-hey-4`"
              >
                <td
                  :class="[
                    td, classes?.td,
                    col?.class || ''
                  ]"
                  class="py-3"
                >
                  <template
                    v-if="col.id === 'rank'"
                  >
                    <template v-if="[1, 2, 3].includes(row.rank)">
                      <NuxtImg
                        :alt="`rank-${row.rank}`"
                        :src="`/assets/img/players-charity/rank-${row.rank}.png`"
                        class="w-5 h-5"
                        loading="lazy"
                      />
                    </template>
                    <span
                      v-else
                      class="text-sm text-paragraph leading-5 truncate"
                    >
                      {{ row.rank }}th
                    </span>
                  </template>
                  <template v-else-if="col.id === 'player'">
                    <div class="w-full flex items-center gap-x-2 sm:gap-x-3">
                      <UIcon
                        class="w-5 h-5 min-w-5 min-h-5"
                        name="heroicons:user-circle-20-solid"
                      />
                      <span> {{ row?.player || '' }} </span>
                    </div>
                  </template>
                  <template v-else>
                    <span
                      class="text-sm leading-5 truncate"
                    >
                      {{ row[col.id] }}
                    </span>
                  </template>
                </td>
              </template>
            </tr>
          </template>
          <tr
            v-else
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
      </tbody>
    </table>
    <div class="absolute bottom-0 w-full bg-table-gradient h-[100px]" />
  </div>
</template>
