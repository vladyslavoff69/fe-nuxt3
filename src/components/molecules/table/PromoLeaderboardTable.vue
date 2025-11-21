<script lang="ts" setup>
import VipRankAvatar from '~/components/molecules/table/details/VipRankAvatar.vue'
import { AUTH } from '~/constants'

const { t } = useI18n()
const { rows, objective = 'higher_wagered', trStrip = 0, loading = false } = defineProps<{
  rows: any[];
  objective?: string;
  trStrip?: number;
  classes?: {
    td?: string;
    th?: string;
    thead?: string;
  } | undefined;
  loading?: boolean
}>()
const { me } = inject(AUTH)!
const { table, thead, tbody, tr, td, th } = useTable()
const columns = [
  { label: 'Position', id: 'rank', class: '' },
  { label: 'Username', id: 'user', class: 'truncated' },
  (
    objective === 'points'
      ? {
        label: 'Highest Multi',
        id: 'highest_multiplier',
        class: 'text-right pr-1 sm:pr-4 hidden sm:table-cell',
      }
      : {}
  ),
  {
    label: objective === 'highest_multiplier' ? 'Highest Multi' : 'Total Wagered',
    id: objective === 'highest_multiplier' ? 'highest_multiplier' : 'higher_wagered',
    class: objective === 'higher_wagered' ? 'text-right pr-1 sm:pr-4' : (objective === 'points' ? 'hidden sm:table-cell' : ''),
  },
  (
    objective === 'points'
      ? {
        label: 'Total Points',
        id: 'points',
        class: 'text-right pr-1 sm:pr-4',
      }
      : {}
  ),
  { label: 'Prize', id: 'estimated_payout', class: 'text-right py-3 pr-1 sm:pr-4' },
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
      <tbody :class="tbody">
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
                  <div
                    v-if="col?.id && ['higher_wagered', 'estimated_payout'].includes(col?.id)"
                    :class="{
                      'justify-center': col.id === 'higher_wagered',
                      'justify-end': col.id === 'estimated_payout'
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
                  <div
                    v-if="col.id === 'name'"
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
              <template
                v-for="(col, colIdx) in columns"
                :key="`r_${index}_${colIdx}_1`"
              >
                <td
                  :class="[
                    td, classes?.td,
                    col?.class || '',
                    {
                      'text-white!': me && me?.username && me.username === row?.user?.username
                    }
                  ]"
                  class="py-3"
                >
                  <template v-if="col.id === 'rank'">
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
                      class="text-sm leading-5 truncate"
                    >
                      {{ row.rank }}th
                    </span>
                  </template>

                  <VipRankAvatar
                    v-else-if="col.id === 'user'"
                    :display-name="row?.user?.display_name"
                    :show-name="true"
                    :username="row?.user?.username"
                    :vip-level-name="row?.user?.vip_level_name"
                  />

                  <span
                    v-else-if="col.id === 'highest_multiplier'"
                    class="leading-normal"
                  >
                    {{ row[col.id] }}x
                  </span>
                  <span
                    v-else-if="col.id === 'estimated_payout' || col.id === 'higher_wagered'"
                    class="leading-normal truncate"
                  >
                    ${{ row[col.id] }}
                  </span>
                  <span
                    v-else-if="col?.id"
                    class="leading-normal truncate"
                  >
                    {{ row[col.id] }}
                  </span>
                </td>
              </template>
            </tr>
          </template>
          <template v-else>
            <tr :class="[tr]">
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
</template>
