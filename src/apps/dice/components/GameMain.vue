<script lang="ts" setup>
import { DICE_GAME } from '~/apps/dice/constants'
import { GAME } from '~/constants'
import Calculator from '~/apps/dice/components/Calculator.vue'
import RandomDice from '~/apps/dice/components/RandomDice.vue'
import DiceRangeSlider from '~/apps/dice/components/DiceRangeSlider.vue'

const { instantMode } = inject(GAME)!
const { rollOver, isIdle, targetValue, betResult } = inject(DICE_GAME)!
</script>

<template>
  <div class="GameMain h-full flex flex-col items-center">
    <div class="flex-1 w-full max-w-(--breakpoint-pane-main)">
      <div
        class="flex flex-col gap-y-2 h-full justify-center items-center min-h-(--breakpoint-pane-main-xs) py-5 lg:py-0"
      >
        <DiceRangeSlider
          :audio-tick-interval="40"
          :audio-tick-volume="70"
          :class="{
            'pointer-events-none': !isIdle
          }"
          :model-value="targetValue"
          :roll-over="rollOver"
          class="z-10"
          @update:model-value="v => targetValue = Number(Number(v).toFixed(2))"
        />
        <div class="w-full px-3 lg:px-4 z-1">
          <RandomDice
            :instant-mode="instantMode"
            :result="betResult"
          />
        </div>
      </div>
    </div>
    <div class="flex-none w-full">
      <Calculator
        :lock="!isIdle"
        :model-value="targetValue"
        :roll-over="rollOver"
        @update:model-value="v => targetValue = Number(Number(v).toFixed(2))"
        @update:roll-over="v => rollOver = v"
      />
    </div>
  </div>
</template>
