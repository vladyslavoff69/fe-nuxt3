<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import CurrencyColumn from '~/components/molecules/table/details/CurrencyColumn.vue'
import type { BetDetail, GameTransaction } from '~/types'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { BET_DETAIL_QUERY } from '~/graphql'
import { formatLongFloat } from '~/utils'

const {
  rows,
  hiddenCols,
  trStrip = 0,
  loading = false
} = defineProps<{
  rows: GameTransaction[];
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
const { table, thead, tbody, tr, td, th } = useTable()

const columns = [
  { label: t('games.game'), id: 'game', class: 'w-full sm:w-auto' },
  { label: '', id: 'transaction_id', class: 'hidden sm:table-cell' },
  { label: t('base.date'), id: 'date', class: 'w-full sm:w-auto' },
  { label: t('transaction.payout'), id: 'payout', class: 'hidden sm:table-cell w-[calc(50vw-26px)] sm:w-auto pr-4' },
]

const trs = ['bg-transparent', 'bg-green-950']
const showTr = ref(false)
const selTrInd = ref(-1)
const { result, loading: detailLoading, refetch } = useQuery<{
  betDetail: BetDetail
}>(BET_DETAIL_QUERY, { transactionId: rows && rows.length ? rows?.[0]?.transaction_id : 0 })
const betDetail = computed(() => result.value?.betDetail)
const betData = computed(() => betDetail.value?.bet)

const [trParent] = useAutoAnimate({
  duration: 150,
})

const clickTr = (ind: number, tId: ID) => {
  showTr.value = !showTr.value

  if (ind !== selTrInd.value) {
    showTr.value = true
  }

  selTrInd.value = ind

  if (showTr.value) {
    refetch({
      transactionId: tId
    })
  }
}
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
            :key="`${colIdx}_code`"
          >
            <td
              v-if="!hiddenCols?.includes(column.id)"
              class="leading-normal"
              :class="[
                th, classes?.th, column?.class || '',
                {
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
            :key="`${index}_sce`"
            :class="[tr, trs[index % 2]]"
          >
            <template
              v-for="(col, colIdx) in columns"
              :key="`r_${index}_${col.id}`"
            >
              <td
                v-if="!(hiddenCols?.includes(col.id))"
                class="py-3"
                :class="[
                  td, classes?.td, col?.class || ''
                ]"
              >
                <div
                  class="flex items-center"
                  :class="[
                    {'flex-row-reverse justify-start': col.id === 'payout'},
                    ['payout'].includes(col.id) ? 'gap-x-1' : 'gap-x-2 sm:gap-x-3',
                  ]"
                >
                  <template
                    v-if="col.id === 'game'"
                  >
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
                    <template v-if="['payout'].includes(col.id)">
                      <USkeleton
                        class="w-5 h-5 rounded-full"
                        :class="{
                          'bg-green-950': index % 2 === 0,
                          'bg-brand': index % 2 !== 0
                        }"
                      />
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
        <template v-else-if="rows && rows.length > 0">
          <template
            v-for="(row, index) in rows"
            :key="`${index}_bets`"
          >
            <tr :class="[tr, trs[index % 2 + trStrip]]">
              <template
                v-for="(col, colIdx) in columns"
                :key="`rc_${index}_${col.id}`"
              >
                <td
                  v-if="!(hiddenCols?.includes(col.id))"
                  class="py-3"
                  :class="[
                    td, classes?.td, col?.class || ''
                  ]"
                >
                  <div
                    class="flex items-center"
                    :class="[
                      {'flex-row-reverse pr-1': col.id === 'payout'},
                      ['payout'].includes(col.id) ? 'gap-x-1' : 'gap-x-1.5 sm:gap-x-2',
                    ]"
                  >
                    <div
                      v-if="col.id === 'game'"
                      class="cursor-pointer flex items-center font-semibold hover:text-white gap-1"
                      @click="clickTr(index, row.transaction_id)"
                    >
                      {{ row.game }}
                      <UIcon
                        v-if="index === selTrInd && showTr"
                        class="w-5 h-5 min-w-5 min-h-5 sm:hidden"
                        name="solar:square-alt-arrow-up-linear"
                      />
                      <UIcon
                        v-else
                        class="w-5 h-5 min-w-5 min-h-5 sm:hidden"
                        name="solar:square-alt-arrow-down-linear"
                      />
                    </div>

                    <div
                      v-else-if="col.id === 'transaction_id'"
                      class="cursor-pointer sm:flex items-center font-semibold hover:text-white gap-1 hidden"
                      @click="clickTr(index, row.transaction_id)"
                    >
                      {{ t('bets.bet-details') }}
                      <UIcon
                        v-if="index === selTrInd && showTr"
                        class="w-5 h-5 min-w-5 min-h-5"
                        name="solar:square-alt-arrow-up-linear"
                      />
                      <UIcon
                        v-else
                        class="w-5 h-5 min-w-5 min-h-5"
                        name="solar:square-alt-arrow-down-linear"
                      />
                    </div>

                    <template v-else>
                      <template v-if="col.id === 'date'">
                        <span>
                          {{ useDateFormat(new Date(row.issued_at), "DD MMM, YYYY, HH:mm A").value }}
                        </span>
                      </template>
                      <template v-else>
                        <template v-if="col.id === 'payout'">
                          <CurrencyColumn
                            :amount="row[col.id]"
                            :normalized-amount="row.normalized_payout"
                            class="justify-end"
                            :class="{
                              'text-primary': row[col.id] >= row.amount,
                              'text-paragraph': row[col.id] < row.amount
                            }"
                            :currency-code="row.currency_code"
                          />
                        </template>

                        <span
                          v-else
                          class="leading-normal truncate"
                        >{{ row[col.id] }}</span>
                      </template>
                    </template>
                  </div>
                </td>
              </template>
            </tr>
            <tr
              v-if="showTr && selTrInd === index"
              ref="trParent"
              :class="[tr, trs[index % 2 + trStrip]]"
            >
              <template
                v-if="detailLoading"
              >
                <template
                  v-for="(col, colIdx) in columns"
                  :key="`rr_${index}_${col.id}`"
                >
                  <td
                    v-if="!(hiddenCols?.includes(col.id))"
                    class="py-3"
                    :class="[
                      td, classes?.td, col?.class || ''
                    ]"
                  >
                    <div
                      class="flex items-center"
                      :class="[
                        {'flex-row-reverse justify-start': col.id === 'payout'},
                        ['payout'].includes(col.id) ? 'gap-x-1' : 'gap-x-2 sm:gap-x-3',
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
                        <template v-if="['payout'].includes(col.id)">
                          <USkeleton
                            class="w-5 h-5 rounded-full"
                            :class="{
                              'bg-green-950': index % 2 === 0,
                              'bg-brand': index % 2 !== 0
                            }"
                          />
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
              </template>
              <td
                v-else
                :colspan="columns.length - (hiddenCols?.length || 0)"
              >
                <div
                  v-if="betData && betDetail"
                  class="flex flex-col p-2 md:p-4"
                >
                  <div class="grid grid-cols-8 capitalize">
                    <div class="col-span-3 sm:col-span-2 flex flex-col">
                      <span class="font-bold">{{ t('games.bet') }}</span>
                      <CurrencyColumn
                        :amount="Number(betData?.amount)"
                        :normalized-amount="Number(betData?.normalized_amount)"
                        :currency-code="betData?.currency_code"
                        class="text-white"
                      />
                    </div>
                    <div class="col-span-2 sm:col-span-1 flex flex-col">
                      <span class="font-bold">{{ t('games.multiplier') }}</span>
                      <span
                        class="font-semibold"
                        :class="{
                          'text-white': Number(betData?.payout) >= Number(betData?.amount),
                          'text-paragraph': Number(betData?.payout) < Number(betData?.amount)
                        }"
                      >
                        {{ betData?.detail_type?.toLowerCase() === 'casino' ? formatLongFloat(betData.multiplier) : formatLongFloat(betData.bet_multiplier) }}×
                      </span>
                    </div>

                    <div class="col-span-3 sm:col-span-2 flex flex-col">
                      <span class="font-bold">{{ t('transaction.payout') }}</span>
                      <CurrencyColumn
                        :amount="Number(betData?.payout)"
                        :normalized-amount="betData?.normalized_payout"
                        :class="{
                          'text-primary': Number(betData?.payout) >= Number(betData?.amount),
                          'text-neutral-500': Number(betData?.payout) < Number(betData?.amount)
                        }"
                        :currency-code="betData?.currency_code"
                      />
                    </div>

                    <div
                      v-if="betDetail.game?.slug === 'plinko' || betDetail.game?.slug === 'keno'"
                      class="col-span-1 hidden sm:flex flex-col"
                    >
                      <span class="font-bold">
                        {{ t('bets.risk') }}
                      </span>
                      <span class="text-white font-semibold">
                        {{ betData?.bet_conditions?.risk }}
                      </span>
                    </div>

                    <div
                      v-if="betDetail.game?.slug === 'plinko'"
                      class="col-span-1 hidden sm:flex flex-col"
                    >
                      <span class="font-bold">
                        {{ t('bets.row') }}
                      </span>
                      <span class="text-white font-semibold">
                        {{ betData?.bet_conditions?.rows }}
                      </span>
                    </div>

                    <div
                      v-if="betDetail.game?.slug === 'plinko'"
                      class="col-span-1 hidden sm:flex flex-col"
                    >
                      <span class="font-bold">
                        {{ t('bets.max-booster') }}
                      </span>
                      <span class="text-white font-semibold uppercase">
                        {{ betData?.bet_conditions?.maxBooster }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </template>
        <template v-else>
          <tr
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
  </div>
</template>
