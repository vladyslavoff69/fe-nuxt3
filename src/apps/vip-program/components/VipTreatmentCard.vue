<script lang="ts" setup>
import type { VipTreatment } from '~/apps/vip-program/types'
import type { VipLevel } from '~/types'
import { numberWithCommas } from '~/utils'

defineProps<{
  data: VipTreatment;
  vipLevels: VipLevel[]
}>()

const { t } = useI18n()
</script>
<template>
  <div
    class="
      bg-card-gradient rounded
      transition-all duration-200 hover:-translate-y-2
      p-4 lg:p-5 w-full flex flex-col gap-y-2 lg:gap-y-4 h-full
    "
  >
    <div class="flex items-center justify-center w-full">
      <NuxtImg
        :src="data.image"
        class="w-[76px] h-[76px]"
        alt="VIP Bonus and Benefit"
        loading="lazy"
        provider="cloudflare"
      />
    </div>

    <div class="flex items-center justify-center gap-x-2 flex-1">
      <span class="text-lg lg:text-[22px] leading-none! font-bold text-white">
        {{ data.title }}
      </span>
      <UTooltip
        :content="{ side: 'top' }"
        arrow
        class="w-4 h-4"
      >
        <template #content>
          <div class="flex flex-col gap-0.5 z-1001 w-full h-full px-1.5 py-1">
            <span
              v-if="data.tooltip !== ''"
              class="w-full h-full"
              v-html="data.tooltip"
            />
            <span
              v-else
              class="w-full h-full flex flex-col"
            >
              <span
                v-for="(vLevel, vInd) in vipLevels"
                :key="`${vLevel.id}-${vInd}`"
                class="text-xs"
              >
                {{ numberWithCommas(vLevel.xp_threshold, 0) }} {{ t('base.wagered') }} =
                <span v-if="data.key === 'rankUpBonus'">${{ numberWithCommas(vLevel.rank_up_bonus, 0) }}</span>
                <span v-else>{{ numberWithCommas(vLevel.rakeback, 0) }}%</span>
              </span>
            </span>
          </div>
        </template>
        <span class="flex items-center text-paragraph cursor-help hover:text-white border-b border-dashed border-paragraph pb-0.5">
          <UIcon
            class="w-4 h-4 min-w-4 min-h-4 group-active:scale-95"
            name="material-symbols:help-outline"
          />
        </span>
      </UTooltip>
    </div>

    <div class="text-sm lg:text-base leading-none! lg:leading-tight! h-10 md:h-16 text-center">
      {{ data.description }}
    </div>
  </div>
</template>
