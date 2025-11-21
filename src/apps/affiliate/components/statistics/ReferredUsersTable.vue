<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import VipRankAvatar from '~/components/molecules/table/details/VipRankAvatar.vue'
import type { SponsorAffiliate } from '~/types'
import { useUsdToFiatAmount } from '~/apps/affiliate/hooks'

defineProps<{
  loading: boolean;
  sponsorAffiliates: SponsorAffiliate[];
}>()

const { usdToFiatAmount } = useUsdToFiatAmount()
const { table, thead, tbody, tr, td, th } = useTable()

const { t } = useI18n()
const columns = [
  {
    label: t('account.username'),
    class: 'w-[calc(50vw-10px)] sm:w-auto md:w-1/6 pr-1',
  },
  {
    label: t('affiliate.registered'),
    class: 'hidden sm:table-cell sm:w-auto md:w-1/6 text-center pl-0!',
  },
  {
    label: t('affiliate.referred-on'),
    class: 'hidden sm:table-cell  sm:w-auto md:w-1/6 text-center pl-0!',
  },
  {
    label: t('base.wagered'),
    class: 'hidden sm:table-cell sm:w-auto md:w-1/6 text-center pl-0!',
  },
  { label: t('affiliate.commission'), class: 'hidden sm:table-cell md:w-1/6 text-center pl-0!' },
  {
    label: t('affiliate.shared'),
    class: 'w-[calc(50vw-26px)] text-right sm:w-auto md:w-1/6 pr-1 sm:pr-4',
  },
]

const trs = ['bg-brand', 'bg-green-950']
</script>

<template>
  <div class="j-table-container relative w-full">
    <table
      :class="[table]"
      class="w-full"
    >
      <thead :class="[thead]">
        <tr :class="tr">
          <td
            v-for="(column, colIdx) in columns"
            :key="`${colIdx}_code`"
            :class="[
              th,
              column?.class || '',
              colIdx === columns.length - 1
                ? 'text-right'
                : 'text-center',
              { 'pl-0!': colIdx > 0 },
            ]"
            class="leading-normal text-xs"
          >
            {{ column?.label || '' }}
          </td>
        </tr>
      </thead>

      <!--TBody-->
      <tbody :class="tbody">
        <template v-if="loading && !sponsorAffiliates.length">
          <tr
            v-for="index in 10"
            :key="index"
            :class="[tr, trs[index % 2]]"
            class="px-3"
          >
            <td
              v-for="i in 6"
              :key="i"
              :class="[td, i === 2 ? 'pr-1 md:pr-4' : '']"
              class="text-center py-3"
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
        <template v-if="sponsorAffiliates.length">
          <tr
            v-for="(row, index) in sponsorAffiliates"
            :key="`${index}_code`"
            :class="[tr, trs[(index+1) % 2]]"
          >
            <td
              :class="[td, columns[0]?.class || '']"
              class="py-3"
            >
              <VipRankAvatar
                :display-name="row.affiliate?.display_name"
                :show-name="true"
                :username="row.affiliate?.username"
                :vip-level-name="row.affiliate?.vip_level_name"
              />
            </td>
            <td
              :class="[td, columns[1]?.class || '']"
              class="py-3 px-0! text-center"
            >
              {{ row.sponsorCode?.code }}
            </td>
            <td
              :class="[td, columns[2]?.class || '']"
              class="py-3"
            >
              {{
                row.affiliate?.created_at ?
                  useDateFormat(new Date(row.affiliate.created_at), "MM/DD/YY, hh:mm A").value :
                  ''
              }}
            </td>
            <td
              :class="[td, columns[3]?.class || '']"
              class="py-3"
            >
              {{
                usdToFiatAmount(row.affiliate?.total_wagered_as_affiliate || 0)
              }}
            </td>
            <td
              :class="[td, columns[4]?.class || '']"
              class="py-3 text-center"
            >
              {{
                usdToFiatAmount(row.affiliate?.total_commission_generated_as_affiliate || 0)
              }}
            </td>
            <td
              :class="[td, columns[5]?.class || '']"
              class="py-3"
            >
              {{ usdToFiatAmount(row.affiliate?.total_affiliate_cashback_received_as_affiliate || 0) }}
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
              {{ t("base.no-data") }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
