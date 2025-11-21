<script lang="ts" setup>
import VipRankImg from '~/components/molecules/table/details/VipRankImg.vue'
import { AUTH, UNRANKED_VIP, VIP } from '~/constants'
import { VIP_COLORS } from '~/apps/vip-program/constants'
import { numberWithCommas } from '~/utils'

const { t } = useI18n()
const { isLoggedIn, me }: any = inject(AUTH)!
const { vip } = inject(VIP)!

const dualRank = computed(() => {
  return vip.value?.dualRank
})
</script>
<template>
  <div
    v-if="isLoggedIn && !!me && !!vip"
    class="bg-green-950 p-4 rounded-md flex flex-col gap-y-4"
  >
    <div class="text-lg text-white font-bold">
      {{ t('vip.current-rank') }}
    </div>
    <div class="flex flex-col gap-y-3">
      <div class="flex flex-col justify-center items-center gap-y-3">
        <VipRankImg
          :vip-level-name="me?.vip_level_name || UNRANKED_VIP"
          class="rounded-full w-44"
        />
        <div class="text-center">
          <p
            class="text-2xl font-bold"
            :class="VIP_COLORS[me?.vip_level_name]"
          >
            {{ me?.vip_level_name || UNRANKED_VIP }}
          </p>
          <p class="text-sm text-paragraph">
            {{ t('vip.current-xp') }}: {{ numberWithCommas(vip?.xp, 0) }}
          </p>
        </div>
      </div>
    </div>
    <div
      class="w-full"
    >
      <JProgressBar
        :max="100"
        :value="dualRank.percentage"
        class="bg-brand!"
        color="bg-primary-gradient"
      />
      <div class="flex justify-between mt-2.5 text-sm">
        <p>{{ numberWithCommas(dualRank?.xp, 0) }} XP</p>
        <p>
          {{ numberWithCommas(dualRank?.upcomingRank?.xp_threshold, 0) }}
          XP
        </p>
      </div>
    </div>
  </div>
</template>
