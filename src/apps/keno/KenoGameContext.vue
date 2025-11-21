<script lang="ts" setup>
import type { GameHistoryItem } from '~/types'
import type { KenoGameMatch, Risk } from '~/apps/game/types'
import { GAME, PREFERENCE } from '~/constants'
import { AUTO_BET, KENO_GAME, MANUAL_BET } from '~/apps/keno/constants'
import { useAnimationArray, useAutoBet, useKenoSounds, useManualBet } from '~/apps/keno/composables'

const { instantMode } = inject(GAME)!
const { activeCryptoCode } = inject(PREFERENCE)!

const { soundTile, soundGem, soundNegative, soundWin } = useKenoSounds()
const betCryptoAmount = ref(0)
const lastBetCryptoCode = ref<string>(activeCryptoCode.value || 'USDC')
const betMode = ref<'manual' | 'auto'>('manual')
const risk = ref<Risk>('low')
const history = ref<GameHistoryItem[]>([])
const tileNumbers = Array.from(Array(40).keys()).map((_v, index) => index + 1)
const selectedTiles = ref<number[]>([])
const betResult = ref<KenoGameMatch | null>(null)
const resultNumbers = computed(() => betResult.value?.result || [])
const {
  animationArray: openedTiles,
  isActive: opening,
  onDone: onOpeningDone
} = useAnimationArray(
  resultNumbers,
  {
    enabled: computed(() => !instantMode.value),
    onChange (tile) {
      if (selectedTiles.value?.includes(tile)) {
        soundGem()
      } else {
        soundNegative()
      }
    },
    onDone () {
      if (instantMode.value) {
        if (betResult.value!.payoutMultiplier > 1) {
          soundGem()
        } else {
          soundNegative()
        }
      }

      // @ts-ignore
      lastBetCryptoCode.value = activeCryptoCode.value
    },
    history,
    betResult,
  }
)

const { resume: resumeAutoPick, pause: pauseAutoPick, isActive: inAutoPick } = useIntervalFn(() => {
  if (selectedTiles.value?.length === 10) {
    pauseAutoPick()
    return
  }
  const unselectedTiles = tileNumbers.filter(t => !selectedTiles.value?.includes(t))
  const randIndex = Math.min(Math.floor(Math.random() * unselectedTiles.length), unselectedTiles.length - 1)
  selectedTiles.value?.push(unselectedTiles[randIndex])
  soundTile()
}, 100, { immediate: false })

const { invalid } = useGameValidation(betCryptoAmount)

const autoPick = () => {
  selectedTiles.value = []
  betResult.value = null
  resumeAutoPick()
}

const autoBetInstance = useAutoBet({
  betCryptoAmount,
  betResult,
  history,
  opening,
  risk,
  selectedTiles,
  tileNumbers,
  onOpeningDone,
})

const manualBetInstance = useManualBet({
  opening,
  tileNumbers,
  selectedTiles,
  betCryptoAmount,
  history,
  betResult,
  risk,
  onOpeningDone
})

const isIdle = computed(() => betMode.value === 'manual' ? manualBetInstance.isIdle.value : autoBetInstance.isIdle.value)
const { onGameKeyStroke } = useGameHotkeys(betCryptoAmount, { applyDefaults: true, isIdle })

onGameKeyStroke(['q', 'Q'], () => {
  autoPick()
})

onGameKeyStroke(['w', 'W'], () => {
  selectedTiles.value = []
  betResult.value = null
})

provide(KENO_GAME, {
  betCryptoAmount,
  betMode,
  betResult,
  history,
  inAutoPick,
  invalid,
  isIdle,
  lastBetCryptoCode,
  openedTiles,
  opening,
  resultNumbers,
  risk,
  selectedTiles,
  payoutMultiplier: computed(() => betResult.value?.payoutMultiplier || 1),
  playStatus: computed(() => betMode.value === 'manual' ? manualBetInstance.playStatus.value : autoBetInstance.playStatus.value),
  showResult: computed(() => betMode.value === 'manual' ? manualBetInstance.showResult.value : autoBetInstance.showResult.value),
  tileNumbers,
  soundWin,
  autoPick,
  onOpeningDone,
})

provide(AUTO_BET, autoBetInstance)
provide(MANUAL_BET, manualBetInstance)

watch(() => betMode.value, () => {
  betResult.value = null
})
</script>

<template>
  <slot />
</template>
