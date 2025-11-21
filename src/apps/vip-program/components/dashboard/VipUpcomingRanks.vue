<script lang="ts" setup>
import VipRankImg from '~/components/molecules/table/details/VipRankImg.vue'
import { AUTH, UNRANKED_VIP, VIP, VIP_LEVEL_MAP } from '~/constants'
import { VIP_COLORS } from '~/apps/vip-program/constants'
import { numberWithCommas } from '~/utils'

const { t } = useI18n()
const { vip } = inject(VIP)!
const { isLoggedIn, me }: any = inject(AUTH)!

const upComingRank = computed(() => {
  return vip.value?.dualRank?.upcomingRank
})
const upComingRankIndex = computed(() => {
  return VIP_LEVEL_MAP[(upComingRank.value?.level_name || UNRANKED_VIP)].index
})
</script>
<template>
  <div
    v-if="isLoggedIn && !!me && !!vip"
    class="bg-green-950 p-4 rounded-md flex flex-col gap-y-4 justify-between"
  >
    <div class="flex flex-col gap-y-4">
      <div class="text-lg text-white font-bold">
        {{ t('vip.ranks') }}
      </div>
      <div class="grid grid-cols-6 gap-3">
        <template
          v-for="(level, key, index) in VIP_LEVEL_MAP"
          :key="index"
        >
          <div
            v-if="index > 0"
            class="flex items-center justify-center"
          >
            <VipRankImg
              v-if="index < upComingRankIndex"
              :vip-level-name="key"
              class="max-w-10"
            />
            <NuxtImg
              v-else
              class="max-w-10 min-w-10 w-full"
              loading="lazy"
              provider="cloudflare"
              alt="Junglebet.com"
              src="b374b8f9-0908-4c9f-a19d-f5f7a6016a00/sm"
            />
          </div>
        </template>
      </div>
    </div>
    <div class="flex flex-col gap-y-4">
      <div>
        <div class="text-lg text-white font-bold">
          {{ t('vip.upcoming-rank') }}
        </div>
      </div>
      <div class="flex gap-3 items-center">
        <div>
          <VipRankImg
            :vip-level-name="upComingRank?.level_name || UNRANKED_VIP"
            class="max-w-10"
          />
        </div>
        <div class="grow">
          <p
            class="mb-1 text-sm font-bold"
            :class="VIP_COLORS[upComingRank?.level_name]"
          >
            {{ upComingRank?.level_name || UNRANKED_VIP }}
          </p>
          <JProgressBar
            :max="100"
            :value="vip?.dualRank?.percentage || 0"
            class="h-2! bg-brand!"
            color="bg-primary-gradient"
          />
          <div class="flex justify-between mt-1 text-sm">
            <p>{{ numberWithCommas(vip?.dualRank?.xp, 0) }} XP</p>
            <p>
              {{ numberWithCommas(vip?.dualRank?.upcomingRank?.xp_threshold, 0) }}
              XP
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
