<script lang="ts" setup>
import { LIMBO_GAME } from '~/apps/limbo/constants'
import ManualBetForm from '~/apps/limbo/components/ManualBetForm.vue'
import AutoBetForm from '~/apps/limbo/components/AutoBetForm.vue'
import BetFormTab from '~/apps/game/components/in-house/BetFormTab.vue'

const { betMode, isIdle } = inject(LIMBO_GAME)!

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
