<script lang="ts" setup>
import type { GameHistoryItem } from '~/types'
import type { WheelGameMatch, Risk, Segment, Distribution } from '~/apps/game/types'
import { CURRENCY, GAME, PREFERENCE, SITE_SETTINGS } from '~/constants'
import { AUTO_BET, MANUAL_BET, WHEEL_GAME, SEGMENTS } from '~/apps/wheel/constants'
import { useManualBet, useAutoBet } from '~/apps/wheel/composables'

const { instantMode } = inject(GAME)!
const { isInHousePlaying } = inject(SITE_SETTINGS)!
const { updateUserBalance } = inject(CURRENCY)!
const { activeCryptoCode } = inject(PREFERENCE)!
const lastBetCryptoCode = ref<string>(activeCryptoCode.value ?? 'BTC')
const betCryptoAmount = ref(0)
const segment = ref<Segment>(0)
const risk = ref<Risk>('low')
const selectedMultiplicationFactor = ref<number>(0)
const initialRotationDegree = ref<number>(0)
const segmentResultAngle = ref<number>(0)
const currentRotationAngle = ref<number>(0)
const selectedDistribution = ref<Distribution | null>(null)
const isSpinning = ref(false)
const isLoading = ref(false)
const { play: playWinSound } = useAudio('/assets/audio/game/win.mp3', 100)
const { play: playLostSound } = useAudio('/assets/audio/game/tick.mp3')

const betMode = ref<'manual' | 'auto'>('manual')
const history = ref<GameHistoryItem[]>([])
const betResult = ref<WheelGameMatch>({
  id: '0',
  angle: 0,
  balance: 0,
  betAmount: 0,
  delta: 0,
  nonce: 0,
  payout: 0,
  payoutMultiplier: 0,
  result: 0,
  risk: 'low',
  segment: 1,
  segments: 10,
  status: 'lost',
  transactionId: '0',
})
const { invalid } = useGameValidation(betCryptoAmount)

const resetGame = () => {
  initialRotationDegree.value = 0
  segmentResultAngle.value = 0
  selectedMultiplicationFactor.value = 0
  selectedDistribution.value = null
  currentRotationAngle.value = 0
  isSpinning.value = false
  isLoading.value = false
}

const handleBetResult = (result: WheelGameMatch) => {
  isLoading.value = true
  const { id, angle, payout, transactionId, balance } = result
  selectedDistribution.value = null
  selectedMultiplicationFactor.value = -1
  const selectedRisk = SEGMENTS[segment.value].risks[risk.value]
  const selectedValue = selectedRisk.order[(result.segment - 1)]
  updateUserBalance((balance - payout), activeCryptoCode.value)

  let rotationValue = (360 - (angle + 0.1)) - (currentRotationAngle.value % 360)
  if (rotationValue > 180) {
    rotationValue -= 360
  } else if (rotationValue < -180) {
    rotationValue += 360
  }

  // Add 2 extra spins
  rotationValue += 4 * 360

  // Update the new rotation angle
  let newRotationAngle = currentRotationAngle.value + rotationValue
  const calcAngle = segmentResultAngle.value - newRotationAngle
  if (calcAngle >= 0 && calcAngle <= 360) {
    newRotationAngle += 360
  }

  // Update the rotation degree immediately
  useTimeoutFn(
    () => {
      segmentResultAngle.value = newRotationAngle
      isSpinning.value = true
    },
    instantMode.value ? 0 : 300,
  )

  // Display the result and update this spin's value after the rotation animation is complete
  useTimeoutFn(
    () => {
      selectedDistribution.value = selectedRisk.distribution[selectedValue]
      selectedMultiplicationFactor.value = result.payoutMultiplier
      currentRotationAngle.value = newRotationAngle
      isSpinning.value = false
      isLoading.value = false
      if (result.payoutMultiplier >= 1) {
        playWinSound()
      } else {
        playLostSound()
      }
      updateUserBalance(balance, activeCryptoCode.value)
      isInHousePlaying.value = false

      history.value.push({
        id,
        transactionId,
        status: result.payoutMultiplier >= 1 ? 'won' : 'lost',
        text: `${result.payoutMultiplier.toFixed(2)}×`,
      })

      if (history.value.length > 8) {
        history.value = history.value.slice(-8)
      }

      setTimeout(() => {
        selectedMultiplicationFactor.value = -1
      }, 800)
    },
    instantMode.value ? 0 : 300 + 900,
  )
}

const autoBetInstance = useAutoBet({
  betCryptoAmount,
  segment,
  risk,
  isSpinning,
  isLoading,
  selectedMultiplicationFactor,
  betResult,
  handleBetResult,
})

const manualBetInstance = useManualBet({
  betCryptoAmount,
  segment,
  risk,
  isSpinning,
  isLoading,
  selectedMultiplicationFactor,
  betResult,
  handleBetResult,
})

const isIdle = computed(() => betMode.value === 'manual' ? manualBetInstance.isIdle.value : autoBetInstance.isIdle.value)
useGameHotkeys(betCryptoAmount, { applyDefaults: true, isIdle })

provide(WHEEL_GAME, {
  betCryptoAmount,
  betMode,
  betResult,
  history,
  initialRotationDegree,
  invalid,
  isIdle,
  isLoading,
  isSpinning,
  lastBetCryptoCode,
  risk,
  segmentResultAngle,
  segment,
  selectedDistribution,
  selectedMultiplicationFactor,
})

provide(AUTO_BET, autoBetInstance)
provide(MANUAL_BET, manualBetInstance)

watch(
  () => [segment.value, risk.value],
  () => {
    resetGame()
  },
)
</script>

<template>
  <slot />
</template>
