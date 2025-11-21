<script lang="ts" setup>
import { VIP_LEVELS_SLIDER_DATA } from '~/apps/vip-program/constants'
import { VIP_BONUS_RIBBON_ICON } from '~/icons'
import DetailsModalHeader from '~/components/organisms/header/DetailsModalHeader.vue'
import VipCalculatorModal from '~/apps/vip-program/components/VipCalculatorModal.vue'
import type { VipLevel } from '~/types'
import { formatShortNumber, numberWithCommas } from '~/utils'

const {
  vipLevels = [],
} = defineProps<{
  classes?: {
    td?: string;
    th?: string;
    thead?: string;
  } | undefined;
  vipLevels: VipLevel[];
}>()

const { t } = useI18n()
const { table, thead, tbody, tr, td } = useTable()
const trs = ['bg-transparent', 'bg-green-950']
const trs1 = ['bg-green-950', 'bg-transparent']

const benefits = [
  t('vip.wager'),
  t('vip.rank-up-bonus'),
  t('vip.rake')
]

const benefits1 = [
  t('vip.weekly'),
  t('vip.drip'),
  t('vip.monthly')
]

const tooltips = [
  null, null, 'Bonuses will increase if greater house edge games are played'
]

const tooltips1 = [
  null, 'Drip bonus starts at Wood level 1',
]

const descriptions = ['Estimate My Weekly Bonus', 'Drip Estimator', 'Estimate My Monthly Bonus']
const isOpenCalcModal = ref(false)
const selCalcTab = ref('weekly')
const tabs = ['weekly', 'drip', 'monthly']
const openCalcModal = (sel: string) => {
  isOpenCalcModal.value = true
  selCalcTab.value = sel
}

const onCloseCalcModal = () => {
  isOpenCalcModal.value = false
  selCalcTab.value = 'weekly'
}

const levelBenefits = (level: string) => {
  const vLevels = vipLevels.filter((value: VipLevel) => value.name.toLowerCase().includes(level))
  const totalRankUp = vLevels?.reduce((sum, item: VipLevel) => sum + (item.rank_up_bonus || 0), 0)
  const fRankUp = `$${numberWithCommas(totalRankUp, 0)}`
  if (level === 'wood') {
    return [
      '',
      fRankUp,
      `${vLevels?.[(vLevels.length - 1)]?.rakeback}%`
    ]
  } else {
    return [
      `$${formatShortNumber(vLevels?.[0]?.xp_threshold)}+`,
      fRankUp,
      `${vLevels?.[(vLevels.length - 1)]?.rakeback}%`
    ]
  }
}
</script>

<template>
  <div class="w-full">
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
          <td />
          <td
            v-for="(item, index) in VIP_LEVELS_SLIDER_DATA"
            :key="`vip-td-1-${index}`"
          >
            <div
              class="text-center"
              :class="[item?.color]"
            >
              {{ item?.name }}
            </div>
          </td>
        </tr>
      </thead>
      <!--TBody-->
      <tbody
        :class="tbody"
        class=""
      >
        <tr
          v-for="(item, index) in benefits"
          :key="`bf-vip-1-${index}`"
          :class="[tr, trs[index % 2]]"
        >
          <td
            :class="[td, {
              'text-white': index === 0
            }]"
          >
            <div class="flex items-center gap-0.5">
              <span class="font-bold">
                {{ item }}
              </span>
              <UTooltip
                v-if="tooltips[index]"
                :content="{ side: 'top' }"
                arrow
                class="w-4 h-4"
                :text="tooltips[index]"
              >
                <span class="flex items-center text-paragraph cursor-help hover:text-white border-b border-dashed border-paragraph pb-0.5">
                  <UIcon
                    class="w-4 h-4 min-w-4 min-h-4"
                    name="material-symbols:help-outline"
                  />
                </span>
              </UTooltip>
            </div>
          </td>
          <td
            v-for="(benefit, benefit_index) in VIP_LEVELS_SLIDER_DATA"
            :key="`vip-td-table-${benefit_index}`"
            class="text-center min-w-0 text-sm"
            :class="{
              'text-white': index === 0
            }"
          >
            <div
              v-if="benefit_index === (VIP_LEVELS_SLIDER_DATA.length - 1)"
              class="text-center gap-0.5 text-sm leading-none"
            >
              <template v-if="index === 0">
                {{ levelBenefits(benefit?.name?.toLowerCase())[index] }}
              </template>
              <template v-else-if="index === benefits.length - 1">
                Up to {{ levelBenefits(benefit?.name?.toLowerCase())[index] }}
              </template>
              <template v-else>
                {{ levelBenefits(benefit?.name?.toLowerCase())[index] }}+
              </template>
            </div>
            <div
              v-else
              class="text-center gap-0.5 text-sm leading-none"
            >
              {{ levelBenefits(benefit?.name?.toLowerCase())[index] }}
            </div>
          </td>
        </tr>
        <tr
          v-for="(item, index) in benefits1"
          :key="`bf-vip-1-${index}`"
          :class="[tr, trs1[index % 2]]"
        >
          <td
            :class="td"
          >
            <div class="flex items-center gap-0.5">
              <span class="font-bold">
                {{ item }}
              </span>
              <UTooltip
                v-if="tooltips1[index]"
                :content="{ side: 'top' }"
                arrow
                class="w-4 h-4"
                :text="tooltips1[index]"
              >
                <span class="flex flex-col justify-center text-paragraph cursor-help hover:text-white border-b border-dashed border-b-paragraph">
                  <UIcon
                    class="w-4 h-4 min-w-4 min-h-4 group-active:scale-95"
                    name="material-symbols:help-outline"
                  />
                </span>
              </UTooltip>
            </div>
          </td>
          <td
            :colspan="VIP_LEVELS_SLIDER_DATA.length"
            class="text-center min-w-0 text-sm"
          >
            <div class="flex items-center justify-center gap-0.5 font-semibold">
              <span v-if="index < 2">Based on last 7 days play/wager</span>
              <span v-else>Based on last 30 days play/wager</span>
              <span>-</span>
              <span
                v-if="descriptions[index]"
                class="flex flex-col justify-center text-white underline cursor-pointer"
                @click="openCalcModal(tabs[index])"
              >
                {{ descriptions[index] }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <ClientOnly>
      <UModal
        v-model:open="isOpenCalcModal"
        class="w-11/12 sm:w-[461px] bg-green-950 p-2 sm:p-4"
        :default-open="isOpenCalcModal"
        @update:open="(v) => {
        if (!v) {
          onCloseCalcModal()
        }
      }"
      >
        <template #content>
          <div class="w-full flex flex-col gap-3 sm:gap-4">
            <DetailsModalHeader
              :icon="VIP_BONUS_RIBBON_ICON"
              title="Bonus Estimator"
              @close:details-modal="onCloseCalcModal"
            />

            <VipCalculatorModal :sel-tab="selCalcTab" />
          </div>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
