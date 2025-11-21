<script lang="ts" setup>
import { DICE_GAME } from '~/apps/dice/constants'
import ManualBetForm from '~/apps/dice/components/ManualBetForm.vue'
import AutoBetForm from '~/apps/dice/components/AutoBetForm.vue'
import BetFormTab from '~/apps/game/components/in-house/BetFormTab.vue'

const { betMode, isIdle } = inject(DICE_GAME)!
const updateBetMode = (v: 'manual' | 'auto') => {
  betMode.value = v
}
</script>

<template>
  <BetFormTab
    :bet-mode="betMode"
    :is-idle="isIdle"
    @update:bet-mode="updateBetMode"
  >
    <ManualBetForm v-if="betMode === 'manual'" />
    <AutoBetForm v-if="betMode === 'auto'" />
  </BetFormTab>
</template>
