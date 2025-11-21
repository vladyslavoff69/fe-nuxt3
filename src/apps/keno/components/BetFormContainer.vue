<script lang="ts" setup>
import { KENO_GAME } from '~/apps/keno/constants'
import ManualBetForm from '~/apps/keno/components/ManualBetForm.vue'
import AutoBetForm from '~/apps/keno/components/AutoBetForm.vue'
import BetFormTab from '~/apps/game/components/in-house/BetFormTab.vue'

const { betMode, isIdle } = inject(KENO_GAME)!

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
