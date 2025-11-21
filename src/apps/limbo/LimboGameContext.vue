<script lang="ts" setup>
import type { GameHistoryItem } from '~/types'
import type { LimboGameMatch } from '~/apps/game/types'
import { AUTO_BET, LIMBO_GAME, MANUAL_BET } from '~/apps/limbo/constants'
import { useAutoBet, useManualBet } from '~/apps/limbo/composables'

const targetValue = ref(2)
const betCryptoAmount = ref(0)
const betMode = ref<'manual' | 'auto'>('manual')
const history = ref<GameHistoryItem[]>([])
const betResult = ref<LimboGameMatch>({
  id: '0',
  balance: 0,
  betAmount: 0,
  delta: 0,
  nonce: 0,
  payoutMultiplier: 1,
  result: 1,
  status: 'lost',
  target: 0,
  transactionId: '0',
})
const resultNumber = computed(() => betResult.value.result)
const { invalid } = useGameValidation(betCryptoAmount)
const autoBetInstance = useAutoBet({
  betCryptoAmount,
  history,
  targetValue,
  betResult,
})

const manualBetInstance = useManualBet({
  betCryptoAmount,
  history,
  targetValue,
  betResult,
})

const isIdle = computed(() => betMode.value === 'manual' ? manualBetInstance.isIdle.value : autoBetInstance.isIdle.value)
useGameHotkeys(betCryptoAmount, { applyDefaults: true, isIdle })
provide(LIMBO_GAME, {
  targetValue,
  betMode,
  betCryptoAmount,
  betResult,
  history,
  invalid,
  isIdle,
  resultNumber,
  betLoading: computed(() => betMode.value === 'manual' ? manualBetInstance.betGameLoading.value : autoBetInstance.betGameLoading.value),
})

provide(AUTO_BET, autoBetInstance)
provide(MANUAL_BET, manualBetInstance)
</script>

<template>
  <slot />
</template>
