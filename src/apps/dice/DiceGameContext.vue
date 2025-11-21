<script lang="ts" setup>
import type { GameHistoryItem } from '~/types'
import type { DiceGameMatch } from '~/apps/game/types'
import { AUTO_BET, DICE_GAME, MANUAL_BET } from '~/apps/dice/constants'
import { useAutoBet, useManualBet } from '~/apps/dice/composables'

const targetValue = ref(50.5)
const betCryptoAmount = ref(0)
const rollOver = ref(true)
const betMode = ref<'manual' | 'auto'>('manual')
const history = ref<GameHistoryItem[]>([])
const betResult = ref<DiceGameMatch>({
  id: '',
  balance: 0,
  betAmount: 0,
  condition: 'over',
  delta: 0,
  nonce: 0,
  payoutMultiplier: 1,
  result: 50,
  status: 'lost',
  target: 50,
  transactionId: '',
})

const { invalid } = useGameValidation(betCryptoAmount)
const autoBetInstance = useAutoBet({
  betCryptoAmount,
  history,
  targetValue,
  rollOver,
  betResult,
})

const manualBetInstance = useManualBet({
  betCryptoAmount,
  history,
  targetValue,
  rollOver,
  betResult,
})

const isIdle = computed(() => betMode.value === 'manual' ? manualBetInstance.isIdle.value : autoBetInstance.isIdle.value)
const { onGameKeyStroke } = useGameHotkeys(betCryptoAmount, { applyDefaults: true, isIdle })

onGameKeyStroke(['q', 'Q'], () => {
  rollOver.value = !rollOver.value
  targetValue.value = 100 - targetValue.value
})

onGameKeyStroke(['w', 'W'], () => {
  if (targetValue.value - 1 < 2) {
    targetValue.value = 2
    return
  }

  targetValue.value = targetValue.value - 1
})

onGameKeyStroke(['e', 'E'], () => {
  if (targetValue.value + 1 > 98) {
    targetValue.value = 98
    return
  }
  targetValue.value = targetValue.value + 1
})

provide(DICE_GAME, {
  betCryptoAmount,
  betMode,
  betResult,
  history,
  invalid,
  isIdle,
  rollOver,
  targetValue,
})

provide(AUTO_BET, autoBetInstance)
provide(MANUAL_BET, manualBetInstance)
</script>

<template>
  <slot />
</template>
