<script lang="ts" setup>
import { WHEEL_GAME } from '~/apps/wheel/constants'
import ManualBetForm from '~/apps/wheel/components/ManualBetForm.vue'
import AutoBetForm from '~/apps/wheel/components/AutoBetForm.vue'
import BetFormTab from '~/apps/game/components/in-house/BetFormTab.vue'

const { betMode, isIdle } = inject(WHEEL_GAME)!

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
