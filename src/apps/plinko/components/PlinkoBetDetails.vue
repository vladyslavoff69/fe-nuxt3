<script lang="ts" setup>
import type { Bet } from '~/types'
import { COEFFICIENTS, LEFT_COEFFICIENTS, RIGHT_COEFFICIENTS } from '~/apps/plinko/constants'
import SimpleMultiplier from '~/apps/plinko/components/SimpleMultiplier.vue'

const props = defineProps<{
  name: string
  betData: Bet
  match: any
}>()

const v = {
  get gameMatch () {
    return props.betData
  }
}

const { t } = useI18n()
const localePath = useLocalePath()
const finalPos = computed(() => props?.match?.game_state?.path?.filter((direction: string) => direction === 'R').length)
const multipliers = computed(() => {
  return props.betData?.bet_conditions?.maxBooster === 'default'
    ? COEFFICIENTS[props.betData?.bet_conditions?.rows][props.betData?.bet_conditions?.risk]
    : (props.betData?.bet_conditions?.maxBooster === 'left'
      ? LEFT_COEFFICIENTS[props.betData?.bet_conditions?.rows][props.betData?.bet_conditions?.risk]
      : RIGHT_COEFFICIENTS[props.betData?.bet_conditions?.rows][props.betData?.bet_conditions?.risk])
})

const openPlinkoGame = () => {
  navigateTo(localePath('/casino/games/junglebet/plinko'))
}
</script>

<template>
  <div class="w-full flex flex-col gap-y-3 lg:gap-y-4 text-sm bg-green-950 rounded-md p-2 lg:p-3 relative">
    <div class="w-full flex justify-center items-center">
      <SimpleMultiplier
        v-for="(mItem, m) in multipliers"
        :key="m"
        :m="m"
        :m-item="mItem"
        :max-booster="betData?.bet_conditions?.maxBooster"
        :result="finalPos"
        :selected-row="betData?.bet_conditions?.rows"
      />
    </div>

    <div
      v-if="v.gameMatch"
      class="w-full flex flex-col gap-y-3 lg:gap-y-4"
    >
      <div class="flex flex-col gap-y-1 font-bold text-sm">
        <label
          class="block leading-none"
        >
          {{ t('bets.row') }}
        </label>
        <UInput
          v-model="v.gameMatch.bet_conditions.rows"
          class="ring-brand bg-brand font-bold capitalize"
          disabled
          size="md"
        />
      </div>

      <div class="flex flex-col gap-y-1 font-bold text-sm">
        <label
          class="block leading-none"
        >
          {{ t('bets.risk') }}
        </label>
        <UInput
          v-model="v.gameMatch.bet_conditions.risk"
          class="ring-brand bg-brand font-bold capitalize"
          disabled
          size="md"
        />
      </div>
    </div>

    <JButton
      class="min-w-24 h-10 w-full block"
      @click="openPlinkoGame"
    >
      {{ t('games.play') }} {{ props.name }}
    </JButton>
  </div>
</template>
