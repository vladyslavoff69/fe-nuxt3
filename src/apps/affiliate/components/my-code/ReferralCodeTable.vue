<script lang="ts" setup>
import type { SponsorCode } from '@/types'
import { useUsdToFiatAmount } from '~/apps/affiliate/hooks'

defineProps<{
  data: SponsorCode[];
  loading: boolean;
}>()

const { t } = useI18n()
const { usdToFiatAmount } = useUsdToFiatAmount()
const { table, thead, tbody, tr, td, th } = useTable()
const columns = computed(() => [
  {
    label: t('affiliate.code'),
    class: 'w-[calc(50vw-10px)] sm:w-auto md:w-1/5',
  },
  { label: t('affiliate.referrals'), class: 'hidden sm:table-cell md:w-1/5 text-center' },
  { label: t('base.wagered'), class: 'hidden sm:table-cell md:w-1/5 text-center' },
  { label: t('affiliate.share'), class: 'hidden sm:table-cell md:w-1/5 text-center' },
  {
    label: t('affiliate.commission'),
    class: 'w-[calc(50vw-26px)] sm:w-auto md:w-1/5 pr-1 sm:pr-4 text-right',
  },
])

const trs = ['bg-brand', 'bg-green-950']

const copiedIndex = ref<number>()
const copyVisible = ref<boolean>(false)
const copyToClipBoard = (index: any, code: string) => {
  const textToCopy = `${window.location.origin}/r/${code}`
  navigator.clipboard.writeText(textToCopy)
  copyVisible.value = true
  copiedIndex.value = index
  useTimeoutFn(() => {
    copyVisible.value = false
    copiedIndex.value = undefined
  }, 1000)
}
</script>
<template>
  <table
    :class="[table]"
    class="w-full"
  >
    <thead :class="[thead]">
      <tr :class="tr">
        <td
          v-for="(column, colIdx) in columns"
          :key="`${colIdx}_${column?.label}_code`"
          :class="
            [
              th,
              column?.class || '',
              colIdx === columns.length - 1
                  ? 'text-right'
                  : 'text-center',
              { 'pl-0!': colIdx > 0 },
            ]
          "
          class="leading-normal"
        >
          {{ column?.label || '' }}
        </td>
      </tr>
    </thead>
    <tbody :class="tbody">
      <template v-if="loading && !data?.length">
        <tr
          v-for="index in 10"
          :key="index"
          :class="[tr, trs[index % 2]]"
          class="px-3"
        >
          <td
            v-for="i in 5"
            :key="i"
            :class="[td, i === 2 ? 'pr-1 md:pr-4' : '']"
            class="py-3 text-center"
          >
            <div :class="{'flex justify-end' : i == 2}">
              <USkeleton
                :class="{
                  'bg-green-950': index % 2 === 0,
                  'bg-brand': index % 2 !== 0
                }"
                class="w-full max-w-44 h-5"
              />
            </div>
          </td>
        </tr>
      </template>
      <template v-else-if="data.length">
        <tr
          v-for="(row, index) in data"
          :key="index"
          :class="[tr, trs[(index+1) % 2]]"
        >
          <td
            :class="[td, columns[0]?.class || '']"
            class="py-3"
          >
            <div class="flex items-center gap-2.5">
              <UTooltip
                :content="{ side: 'top' }"
                arrow
                :text="copyVisible ? `${t('base.copied')}!` : t('base.copy')"
              >
                <div
                  class="cursor-copy text-paragraph hover:text-white flex items-center"
                  @click="copyToClipBoard(index, row.code)"
                >
                  <UIcon
                    class="w-4 h-4 min-h-4 min-w-4 text-paragraph hover:text-white cursor-copy"
                    name="icon-park-solid:copy"
                  />
                </div>
              </UTooltip>
              <span>{{ row.code }}</span>
            </div>
          </td>
          <td
            :class="[td, columns[1]?.class || '']"
            class="py-3 pl-0!"
          >
            {{ row.total_affiliates }}
          </td>
          <td
            :class="[td, columns[2]?.class || '']"
          >
            {{ usdToFiatAmount(row.total_wagered) }}
          </td>
          <td
            :class="[td, columns[3]?.class || '']"
          >
            {{ row.percent_back }}%
          </td>
          <td
            :class="[td, columns[4]?.class || '']"
          >
            {{ usdToFiatAmount(row.total_commission) }}
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
            class="italic py-3 text-center text-paragraph bg-green-950"
          >
            {{ t('base.no-data') }}
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
