<script lang="ts" setup>
import { DICE_RESULT_QUERY } from '~/apps/game/graphql'
import type { ID } from '~/types'
import type { DiceGameMatch } from '~/apps/game/types'
import ResultNumber from '~/apps/dice/components/ResultNumber.vue'
import RollInput from '~/components/molecules/inputs/RollInput.vue'
import MultiplierInput from '~/components/molecules/inputs/MultiplierInput.vue'
import ChanceInput from '~/components/molecules/inputs/ChanceInput.vue'
import DiceRangeSlider from '~/apps/dice/components/DiceRangeSlider.vue'
import AnimateSkeleton from '~/apps/game/components/in-house/AnimateSkeleton.vue'

const props = defineProps<{
  id: ID
  name: string,
  classes?: any
}>()

const { t } = useI18n()
const { data } = useAsyncQuery<{ diceResult: DiceGameMatch }>(DICE_RESULT_QUERY, { id: props.id })
const localePath = useLocalePath()
const houseEdge = 1
const v = {
  get gameMatch () {
    return data.value?.diceResult
  },
  get rollOver () {
    return v?.gameMatch?.condition === 'over'
  },
  get target () {
    return v?.gameMatch?.target
  },
  get winChance () {
    return v?.rollOver ? 100 - (v?.target || 0) : v.target
  },
  get multiplier () {
    return Number(((100 - houseEdge) / (v?.winChance || 1)).toFixed(4))
  }
}

const openDiceGame = () => {
  navigateTo(localePath('/casino/games/junglebet/dice'))
}
</script>

<template>
  <div class="w-full flex flex-col gap-y-3 lg:gap-y-4 text-sm bg-green-950 rounded-md p-2 lg:p-3 relative">
    <AnimateSkeleton v-if="!v.gameMatch" />
    <div
      v-else
      class="w-full flex flex-col gap-y-3 lg:gap-y-4"
    >
      <div class="w-full relative flex items-center justify-center flex-col">
        <div class="pointer-events-none w-full">
          <DiceRangeSlider
            :model-value="v.target"
            :result="true"
            :roll-over="v.rollOver"
          />
        </div>
        <div class="w-full px-3">
          <ResultNumber
            :status="v.gameMatch?.status"
            :transaction-id="v.gameMatch?.transactionId"
            :value="v.gameMatch?.result"
          />
        </div>
      </div>

      <div
        :class="[classes?.stats]"
        class="grid grid-cols-3 gap-x-2 font-bold text-sm"
      >
        <div class="col-span-1">
          <label
            class="block mb-1 leading-none"
            for="calculator_multiplier"
          >
            {{ t('bets.target-multiplier') }}
          </label>
          <MultiplierInput
            id="calculator-multiplier"
            :max="9900"
            :min="1.0102"
            :model-value="v.multiplier"
            class-name="pr-6! hover:ring-1 hover:ring-highlights focus:ring-1 focus:ring-highlights pl-2"
            end-icon="right-1.5!"
            readonly
          />
        </div>
        <div class="col-span-1">
          <label
            class="block mb-1 leading-none"
            for="calculator-roll-over"
          >{{ v.gameMatch?.condition ? t('bets.rollover') : t('bets.rollunder') }}</label>
          <RollInput
            id="calculator-roll-over"
            :model-value="(v?.target || 0)"
            class-name="pr-6! hover:ring-1 hover:ring-highlights focus:ring-1 focus:ring-highlights pl-2"
            end-icon="right-1.5!"
          />
        </div>
        <div class="col-span-1">
          <label
            class="block mb-1 leading-none"
            for="calculator-chance"
          >{{ t('games.win-chance') }}</label>
          <ChanceInput
            id="calculator-chance"
            :max="98"
            :min="0.01"
            :model-value="(v?.winChance || 0)"
            class-name="pr-6! hover:ring-1 hover:ring-highlights focus:ring-1 focus:ring-highlights pl-2"
            end-icon="right-1.5!"
            readonly
          />
        </div>
      </div>
    </div>

    <JButton
      class="min-w-24 h-10 w-full block"
      @click="openDiceGame"
    >
      {{ t('games.play') }} {{ props.name }}
    </JButton>
  </div>
</template>
