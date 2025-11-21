<script lang="ts" setup>
import type { Bet } from '~/types'
import WheelPreview from '~/apps/wheel/components/WheelPreview.vue'

const props = defineProps<{
  name: string
  betData: Bet
}>()

const v = {
  get gameMatch () {
    return props.betData
  }
}

const { t } = useI18n()
const localePath = useLocalePath()

const openWheelGame = () => {
  navigateTo(localePath('/casino/games/junglebet/wheel'))
}

const segmentNumbers = { 10: 0, 20: 1, 30: 2, 40: 3, 50: 4 }
</script>

<template>
  <div class="w-full flex flex-col gap-y-3 lg:gap-y-4 text-sm bg-green-950 rounded-md p-2 lg:p-3 relative">
    <div
      v-if="v.gameMatch && v.gameMatch?.bet_conditions && v.gameMatch?.final_results"
      class="w-full flex justify-center items-center"
    >
      <WheelPreview
        :risk="v.gameMatch.bet_conditions.risk"
        :segment="segmentNumbers[v.gameMatch.bet_conditions.segments]"
        :segment-result-angle="v.gameMatch.final_results.angle"
        :selected-multiplication-factor="v.gameMatch.final_results.multiplier"
        :sel-segment="v.gameMatch.final_results.segment"
      />
    </div>

    <div
      v-if="v.gameMatch"
      class="w-full grid grid-cols-2 gap-2"
    >
      <div class="flex flex-col gap-y-1 font-bold text-sm col-span-1">
        <label
          class="block leading-none"
        >
          {{ t('casino.segments') }}
        </label>
        <UInput
          v-model="v.gameMatch.bet_conditions.segments"
          class="ring-brand bg-brand font-bold capitalize"
          disabled
          size="sm"
        />
      </div>

      <div class="flex flex-col gap-y-1 font-bold text-sm col-span-1">
        <label
          class="block leading-none"
        >
          {{ t('bets.risk') }}
        </label>
        <UInput
          v-model="v.gameMatch.bet_conditions.risk"
          class="ring-brand bg-brand font-bold capitalize"
          disabled
          size="sm"
        />
      </div>
    </div>

    <JButton
      class="min-w-24 h-10 w-full block"
      @click="openWheelGame"
    >
      {{ t('games.play') }} {{ props.name }}
    </JButton>
  </div>
</template>
