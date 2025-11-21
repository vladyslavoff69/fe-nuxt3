<script lang="ts" setup>
import { PLINKO_GAME } from '~/apps/plinko/constants'
import AutoBetForm from '~/apps/plinko/components/AutoBetForm.vue'
import BetFormTab from '~/apps/plinko/components/BetFormTab.vue'
import ManualBetForm from '~/apps/plinko/components/ManualBetForm.vue'
import FreeBetForm from '~/apps/plinko/components/FreeBetForm.vue'

const { betMode, isIdle } = inject(PLINKO_GAME)!

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
    <ManualBetForm
      v-if="betMode === 'manual'"
    />
    <FreeBetForm
      v-else-if="betMode === 'free'"
    />
    <AutoBetForm
      v-else-if="betMode === 'auto'"
    />
  </BetFormTab>
</template>
