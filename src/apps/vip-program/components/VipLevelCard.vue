<script lang="ts" setup>
import type { VipLevelSlider } from '~/apps/vip-program/types'
import VipRankImg from '~/components/molecules/table/details/VipRankImg.vue'
import { UNRANKED_VIP } from '~/constants'
import type { VipLevel } from '~/types'
import { formatShortNumber } from '~/utils'

const props = defineProps<{
  data: VipLevelSlider;
  vipLevels: VipLevel[];
}>()

const levelData = (levelName: string) => {
  const levelInd = props.vipLevels.findIndex((e: VipLevel) => e.name === levelName)
  const level = props.vipLevels.find((e: VipLevel) => e.name === levelName)
  if (levelInd < props.vipLevels.length - 1) {
    return {
      levelInd,
      level,
      nextLevel: props.vipLevels[(levelInd + 1)]
    }
  }

  return {
    levelInd,
    level,
    nextLevel: null
  }
}
</script>
<template>
  <div
    class="lg:py-5 lg:pt-0 w-full max-w-36 flex flex-col items-center justify-center mx-auto"
  >
    <div class="flex flex-col justify-center items-center mb-4">
      <NuxtImg
        :src="data?.image"
        alt="VIP treatment"
        class="w-6 h-6 lg:w-12 lg:h-12 mb-0.5"
        loading="lazy"
        provider="cloudflare"
      />
      <span
        class="text-white text-sm font-bold"
        :class="[data?.color]"
      >
        {{ data?.name }}
      </span>
    </div>
    <div class="flex flex-col justify-center">
      <div
        v-for="(item, index) in data?.levels"
        :key="`vip-lc-1-${index}`"
        class="mb-2 text-sm"
      >
        <div class="flex gap-2.5 items-center">
          <VipRankImg
            :vip-level-name="item?.levelName || UNRANKED_VIP"
            class="w-4 h-4 md:w-6 md:h-6"
          />
          <span v-if="!levelData(item?.levelName).nextLevel">
            ${{ formatShortNumber((levelData(item?.levelName).level?.xp_threshold || 0)) }} - ထ
          </span>
          <span v-else-if="levelData(item?.levelName).levelInd < (vipLevels.length - 1)">
            ${{ formatShortNumber((levelData(item?.levelName)?.level?.xp_threshold || 0)) }} - ${{ formatShortNumber((levelData(item?.levelName)?.nextLevel?.xp_threshold || 0)) }}
          </span>
          <span v-else>
            ${{ formatShortNumber((levelData(item?.levelName)?.level?.xp_threshold || 0)) }} - ထ
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
