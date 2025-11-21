<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import GameLink from '~/components/molecules/table/details/GameLink.vue'
import CurrencyColumn from '~/components/molecules/table/details/CurrencyColumn.vue'
import VipRankAvatar from '~/components/molecules/table/details/VipRankAvatar.vue'
import { CURRENCY, GAME_MATCH_STATUS } from '~/constants'
import type { Bet } from '~/types'

const { rows, trStrip = 0, loading = false } = defineProps<{
  rows: Bet[] | any[];
  trStrip?: number;
  classes?: {
    td?: string;
    th?: string;
    thead?: string;
  } | undefined;
  loading?: boolean
  hiddenCols?: string[]
}>()

const { t } = useI18n()
const { cryptoCurrencies } = inject(CURRENCY)!
const { table, thead, tbody, tr, td, th } = useTable()
const columns = [
  { label: t('games.game'), id: 'game', class: 'w-[calc(50vw-10px)] sm:w-auto' },
  { label: t('account.user'), id: 'display_name', class: 'hidden sm:table-cell w-36' },
  { label: t('base.time'), id: 'issued_at', class: 'hidden sm:table-cell text-center' },
  { label: t('games.bet-amount'), id: 'amount', class: 'hidden sm:table-cell' },
  { label: t('games.multiplier'), id: 'multiplier', class: 'text-center hidden sm:table-cell' },
  { label: t('transaction.payout'), id: 'payout', class: 'w-[calc(50vw-26px)] sm:w-auto pr-1 sm:pr-4' },
]
const trs = ['bg-transparent', 'bg-green-950']
const { FREE_GAMES } = GAME_MATCH_STATUS
</script>

<template>
  <div class="j-table-container relative">
    <table
      class="w-full table-fixed"
      :class="[table]"
    >
      <thead
        :class="[thead, classes?.thead || '']"
      >
        <tr :class="tr">
          <template
            v-for="(column, colIdx) in columns"
            :key="`${colIdx}_code-mt-1`"
          >
            <td
              v-if="!hiddenCols?.includes(column.id)"
              class="leading-normal"
              :class="[
                th, classes?.th, column?.class || '',
                {
                  'pr-3': column.id === 'game',
                  'px-0!': ['display_name', 'multiplier'].includes(column.id),
                  'pr-1': column.id === 'amount',
                  'text-right': colIdx === columns.length - 1,
                }
              ]"
            >
              {{ column?.label || '' }}
            </td>
          </template>
        </tr>
      </thead>

      <!--TBody-->
      <tbody :class="tbody">
        <template v-if="loading">
          <tr
            v-for="index in 10"
            :key="`${index}_sce-mt-2`"
            :class="[tr, trs[index % 2]]"
          >
            <template
              v-for="(col, colIdx) in columns"
              :key="`r_${index}_${colIdx}-mt-4`"
            >
              <td
                v-if="!hiddenCols?.includes(col.id)"
                class="py-3"
                :class="[
                  td, classes?.td, col?.class || '',
                  {
                    'pr-3': col.id === 'game',
                    'px-0!': ['display_name', 'multiplier'].includes(col.id),
                    'pr-1': col.id === 'amount',
                  }
                ]"
              >
                <div
                  class="flex items-center"
                  :class="[
                    {'flex-row-reverse justify-start': col.id === 'payout'},
                    ['payout', 'amount'].includes(col.id) ? 'gap-x-1' : 'gap-x-2 sm:gap-x-3',
                  ]"
                >
                  <template v-if="col.id === 'game'">
                    <USkeleton
                      class="w-5 h-5 rounded-full"
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
                  </template>
                  <template v-else>
                    <template v-if="['display_name', 'amount', 'payout'].includes(col.id)">
                      <USkeleton
                        class="w-5 h-5 rounded-full"
                        :class="{
                          'bg-green-950': index % 2 === 0,
                          'bg-brand': index % 2 !== 0
                        }"
                      />
                    </template>
                    <template v-if="['multiplier', 'issued_at'].includes(col.id)">
                      <div class="w-full flex-1 flex items-center justify-center">
                        <USkeleton
                          class="w-20 h-6 rounded-full"
                          :class="{
                            'bg-green-950': index % 2 === 0,
                            'bg-brand': index % 2 !== 0
                          }"
                        />
                      </div>
                    </template>
                    <template v-else>
                      <USkeleton
                        class="w-20 h-5"
                        :class="{
                          'bg-green-950': index % 2 === 0,
                          'bg-brand': index % 2 !== 0
                        }"
                      />
                    </template>
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
              :key="`${index}_bets-mtb-4`"
              :class="[tr, trs[index % 2 + trStrip]]"
            >
              <template
                v-for="(col, colIdx) in columns"
                :key="`rc_${index}_${colIdx}-mtb-5`"
              >
                <td
                  v-if="!hiddenCols?.includes(col.id)"
                  class="py-3"
                  :class="[
                    td, classes?.td, col?.class || '',
                    {
                      'pr-3': col.id === 'game',
                      'px-0!': ['display_name', 'multiplier'].includes(col.id),
                      'pr-1': col.id === 'amount',
                    }
                  ]"
                >
                  <div
                    class="flex items-center"
                    :class="[
                      {'flex-row-reverse': col.id === 'payout'},
                      ['payout', 'amount'].includes(col.id) ? 'gap-x-1' : 'gap-x-1.5 sm:gap-x-2',
                      { 'justify-center': col.id === 'issued_at'}
                    ]"
                  >
                    <GameLink
                      v-if="col.id === 'game'"
                      :bet="row"
                      :game="row.game"
                      :match-status="row.match_status"
                      :slug="row.game_slug"
                    />

                    <template v-else>
                      <span
                        v-if="col.id === 'multiplier'"
                        class="w-full flex-1 flex items-center justify-center"
                      >
                        <span
                          class="px-1.5 py-0.5 w-full max-w-24 text-center font-bold inline-block"
                        >
                          <span class="inline-block mr-px">&#x0078;</span>
                          {{ Math.floor(row[col.id] * 10000) / 10000 }}
                        </span>
                      </span>
                      <span v-else-if="col.id === 'issued_at'">
                        {{ useDateFormat(new Date(row.issued_at), "HH:mm A").value }}
                      </span>
                      <template v-else>
                        <template v-if="col.id === 'amount'">
                          <span
                            v-if="FREE_GAMES.includes(row.game_slug)"
                            class="leading-normal truncate font-semibold text-white"
                          >
                            Free
                          </span>
                          <CurrencyColumn
                            v-else
                            :amount="row[col.id]"
                            :normalized-amount="row.normalized_amount"
                            :currency-code="row.currency_code"
                            :front="true"
                          />
                        </template>

                        <VipRankAvatar
                          v-else-if="col.id === 'display_name'"
                          :display-name="row?.display_name"
                          :show-name="true"
                          :username="row?.username"
                          :vip-level-name="row?.vip_level_name"
                        />

                        <div
                          v-else-if="col.id === 'payout'"
                          class="py-1.5 w-full max-w-32 text-center font-bold"
                          :class="{'text-neutral-500': row.payout < row.amount}"
                        >
                          <CurrencyColumn
                            :amount="row[col.id]"
                            :normalized-amount="row.normalized_payout"
                            class="justify-end"
                            :class="{
                              'text-primary': row[col.id] >= row.amount,
                              'text-neutral-500': row[col.id] < row.amount
                            }"
                            :currency-code="row.currency_code"
                          />
                        </div>

                        <span
                          v-else
                          class="leading-normal truncate"
                        >
                          {{ row[col.id] }}
                        </span>
                      </template>
                    </template>
                  </div>
                </td>
              </template>
            </tr>
          </template>
          <tr
            v-else
            :class="[tr]"
          >
            <td
              class="py-3 text-center text-paragraph bg-green-950 italic"
              :class="[td, classes?.td]"
              :colspan="columns.length - (hiddenCols?.length || 0)"
            >
              {{ t('base.no-data') }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div
      v-if="rows?.length < 1"
      class="absolute bottom-0 w-full bg-table-gradient h-[100px]"
    />
  </div>
</template>
