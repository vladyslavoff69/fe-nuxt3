<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import type { Charity } from '~/types/charity'

const { t } = useI18n()
const { rows, trStrip = 0, loading = false } = defineProps<{
  rows: Charity[] | any[];
  trStrip?: number;
  classes?: {
    td?: string;
    th?: string;
    thead?: string;
  } | undefined;
  loading?: boolean
}>()

const emits =
  defineEmits<{
    (e: 'update:count-per-page', value: number): void;
  }>()

const countPerPage = ref(10)
const colorMap: { [key in string]: string } = {
  pending: 'text-white',
  failed: 'text-error',
  processed: 'text-primary',
}

const trs = ['bg-transparent', 'bg-green-950']

const { table, thead, tbody, tr, td, th } = useTable()

const columns = [
  { label: t('base.date'), id: 'date', class: '' },
  { label: t('base.status'), id: 'status', class: '' },
  { label: t('base.amount'), id: 'amount', class: 'text-right py-3 pr-1 xs:pr-4' },
]

const getStatusTextColor = (status: string) => {
  return colorMap[status] || 'text-white'
}
</script>

<template>
  <div
    class="bg-green5 grid gap-y-4"
  >
    <div class="w-full flex justify-end gap-x-2">
      <slot name="table-header" />
      <div class="max-w-[100px]">
        <JSelect
          v-model="countPerPage"
          :classes="{
            ListboxButton: 'bg-green-950 w-full h-[40px] py-2 px-2.5 pr-1! font-bold text-paragraph',
            Placeholder: 'text-xs',
            LabelOptLabel: 'text-xs'
          }"
          :has-check-box="false"
          :options="[
            { label: '10', value: 10 },
            { label: '20', value: 20 },
            { label: '50', value: 50 },
          ]"
          class="mr-2"
          @update:model-value="(_val) => emits('update:count-per-page', _val)"
        />
      </div>
    </div>
    <div class="j-table-container relative w-full overflow-scroll">
      <table
        :class="table"
        class="min-w-(--breakpoint-stage) sm:min-w-full table-fixed"
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
                  <div class="w-full flex-1">
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
                    :class="[
                      td, classes?.td,
                      col?.class || ''
                    ]"
                    class="py-3"
                  >
                    <template
                      v-if="col.id === 'status'"
                    >
                      <span
                        :class="getStatusTextColor(row.status)"
                        class="text-sm text-paragraph leading-5 truncate"
                      >
                        {{ row.status }}
                      </span>
                    </template>
                    <template v-if="col.id === 'date'">
                      <span
                        class="text-sm text-paragraph leading-5 truncate"
                      >
                        {{ useDateFormat(new Date(row.created_at), "YYYY/MM/DD, HH:mm A").value }}
                      </span>
                    </template>
                    <template v-else>
                      <span
                        class="leading-normal truncate"
                      >
                        {{ row[col.id] }}
                      </span>
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
