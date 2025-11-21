<script lang="ts" setup>
import { Application, Assets, extensions, ExtensionType, Sprite, Texture } from 'pixi.js'
import type { GameHistoryItem } from '~/types'
import type { PlinkoGameMatch, RiskShort } from '~/apps/game/types'
import { AUTH, CURRENCY, FREE_SPIN, GAME, PREFERENCE, SITE_SETTINGS } from '~/constants'
import type { BallPath, PegAni, PegAniBody, PegBody, PlinkoBall, RippleAni, BallV } from '~/apps/plinko/types'
import {
  AUDIO_CONFIGS,
  AUTO_BET,
  COEFFICIENTS,
  FREE_BET,
  LEFT_COEFFICIENTS,
  MANUAL_BET,
  MULTIPLIER_OPTIONS,
  PLINKO_BALL_TEXTURES,
  PLINKO_GAME,
  PLINKO_INIT,
  RIGHT_COEFFICIENTS,
  RIPPLE_CIRCLE_BASE64
} from '~/apps/plinko/constants'
import { useAutoBet, useFreeBet, useManualBet } from '~/apps/plinko/composables'
import { FREE_SPIN_QUERY } from '~/apps/game/graphql'
import DailySpinResultModal from '~/apps/free-spin/components/DailySpinResultModal.vue'

// Add image delivery extension
extensions.add({
  extension: ExtensionType.LoadParser,
  test: (url: string) => url.startsWith('https://imagedelivery.net'),
  async load (src: string) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(Texture.from(img))
      img.onerror = reject
      img.src = src
    })
  },
})

const {
  updateUserBalance, refetchBalances, prevCryptoBalance, prevFiatBalance, cryptoToUsd, usdToFiat
} = inject(CURRENCY)!
const { isLoggedIn, me, refetch } = inject(AUTH)!
const { myFreeBets, cancelFreeBets } = inject(FREE_SPIN)!
const { activeCryptoCode, activeFiatCode } = inject(PREFERENCE)!
const { instantMode } = inject(GAME)!
const { isInHousePlaying } = inject(SITE_SETTINGS)!
const betCryptoAmount = ref(0)
const lastBetCryptoCode = ref<string>(activeCryptoCode.value ?? 'BTC')
const betMode = ref<'manual' | 'auto' | 'free'>('manual')
const maxBooster = ref<'default' | 'left' | 'right'>('default')
const risk = ref<RiskShort>('low')
const loadingBoard = ref<boolean>(false)
const openResultModal = ref<boolean>(false)
const isOnPlaying = ref<boolean>(false)
const selectedRow = ref<number>(PLINKO_INIT.startRow)
const betResult = ref<PlinkoGameMatch | null>(null)
const { invalid } = useGameValidation(betCryptoAmount)

/* Start game wrapper */
let gameApp: Application
const plinkoEl = ref<HTMLDivElement | null>(null)
const pressed = ref<number>(-1)
const history = ref<GameHistoryItem[]>([])
const multipliers = computed(() => {
  return maxBooster.value === 'default'
    ? COEFFICIENTS[selectedRow.value][risk.value]
    : (maxBooster.value === 'left' ? LEFT_COEFFICIENTS[selectedRow.value][risk.value] : RIGHT_COEFFICIENTS[selectedRow.value][risk.value])
})
const ballSize = computed<number>(() => (PLINKO_INIT.ball + (PLINKO_INIT.totalRows - selectedRow.value) / 2.5))
const pinSize = computed<number>(() => (PLINKO_INIT.pin + (PLINKO_INIT.totalRows - selectedRow.value) / 2.5))
const pinGap = computed<number>(() => (PLINKO_INIT.innerWidth / selectedRow.value))
let ballTextures: any
const ballTexture = computed(() => (ballTextures?.[`${risk.value}Texture`]))
let texture: any
let pinTexture: any
const freeSpinID = ref()
const freeBetsRemaining = ref(0)
const freeBetsAmount = ref(0)
const lastRequestBall = ref<BallV>({
  transactionId: '',
  balance: 0
})
const enabledFree = computed(() => !!freeSpinID.value)
const { refetch: freeSpinRefetch } = useQuery(
  FREE_SPIN_QUERY,
  { id: Number(freeSpinID.value) },
  { enabled: enabledFree.value }
)

let ballsAry: PlinkoBall[] = []
let pathAry: BallPath[][][] = []
let pinPositions: BallPath[][] = []
let pinBodies: PegBody[] = []
let rippleBodies: PegAniBody[] = []
let ballIndex: number = -1
const rippleScaleMultiplier = computed(() => (1.5 - ((selectedRow.value - 8) * 0.0375)))
const hasDroppingBall = computed<boolean>(() => (ballsAry && ballsAry.length > 0))

/* Load & define game audio */
const { play: playLowAudio1 } = useAudio(AUDIO_CONFIGS.low[0])
const { play: playLowAudio2 } = useAudio(AUDIO_CONFIGS.low[1])
const { play: playLowAudio3 } = useAudio(AUDIO_CONFIGS.low[2])
const { play: playMediumAudio1 } = useAudio(AUDIO_CONFIGS.medium[0])
const { play: playMediumAudio2 } = useAudio(AUDIO_CONFIGS.medium[1])
const { play: playHighAudio1 } = useAudio(AUDIO_CONFIGS.high[0])
const { play: playHighAudio2 } = useAudio(AUDIO_CONFIGS.high[1])

const audioMappings = [
  playLowAudio1, playLowAudio2, playLowAudio3, playMediumAudio1,
  playMediumAudio2, playMediumAudio2, playHighAudio1, playHighAudio1, playHighAudio2
]

const playBetAudio = (m: number, selectedRow: number) => {
  if (Math.floor(selectedRow / 2) >= m) {
    audioMappings[(Math.floor(selectedRow / 2) - m)]()
  } else if (selectedRow % 2 === 0) {
    audioMappings[(m - Math.floor(selectedRow / 2))]()
  } else {
    audioMappings[(m - Math.ceil(selectedRow / 2))]()
  }
}

const updateToFiat = (balance: number) => {
  return parseFloat((balance * cryptoToUsd.value[activeCryptoCode.value] * usdToFiat.value[activeFiatCode.value]).toFixed(2))
}

// bet history
const handleHistory = (ball: any) => {
  history.value.push({
    id: `${ballIndex}-${ball.transactionId}`,
    transactionId: ball.transactionId,
    status: ball.multiplier >= 1 ? 'won' : 'lost',
    text: `${ball.multiplier.toFixed(2)}×`,
    isFree: betMode.value === 'free'
  })

  if (history.value.length > 7) {
    history.value = history.value.slice(-7)
  }
}

// finish drop done
const onDropDone = async (finalPos, v) => {
  playBetAudio(finalPos, selectedRow.value)

  handleHistory({
    multiplier: multipliers.value[finalPos],
    transactionId: v.transactionId
  })

  pressed.value = finalPos
  const droppedBalance = (ballsAry?.length || 0) * Number(betCryptoAmount.value)
  prevCryptoBalance.value = (v.balance - droppedBalance)
  prevFiatBalance.value = updateToFiat(prevCryptoBalance.value)

  if (!hasDroppingBall.value) {
    updateUserBalance(lastRequestBall.value.balance, activeCryptoCode.value)
    prevCryptoBalance.value = lastRequestBall.value.balance
    prevFiatBalance.value = updateToFiat(lastRequestBall.value.balance)
    isInHousePlaying.value = false

    if (betMode.value === 'free' && freeSpinID.value) {
      await freeSpinRefetch({
        id: Number(freeSpinID.value)
      })

      refetch()

      if (freeBetsRemaining.value < 1) {
        cancelFreeBets.value = true
        openResultModal.value = true
      }
    }

    refetchBalances()
    isOnPlaying.value = false
  }
}

const onCloseResultModal = () => {
  betMode.value = 'manual'
  openResultModal.value = false
}

/**
 * Dropping balls by path and detect if it reached out to the multiplier section.
 */
const updatePos = () => {
  if (ballsAry && ballsAry.length) {
    isOnPlaying.value = true
    // Implement ball dropping animation and trigger ripple effect of the balls.
    ballsAry.forEach((ball: PlinkoBall, index: number) => {
      if (ball.sprite.visible && ball.pathIndex < ball.path.length) {
        ball.sprite.position.x = ball.path[ball.pathIndex].x
        ball.sprite.position.y = ball.path[ball.pathIndex++].y

        const posXStart = ball.sprite.position.x + ballSize.value
        const posYStart = ball.sprite.position.y + ballSize.value
        for (let i = 0; i < pinPositions.length; i++) {
          // Calculate posEnvY only once for each i to avoid redundant calculations
          const posEnvYStart = pinPositions[i][0].y + pinSize.value
          if (posYStart <= (posEnvYStart + pinSize.value * 2) && (posYStart + ballSize.value * 2) >= posEnvYStart) {
            for (let j = 0; j < pinPositions[i].length; j++) {
              // Calculate posEnvX only once for each j to avoid redundant calculations
              const posEnvXStart = pinPositions[i][j].x + pinSize.value
              if (posXStart <= (posEnvXStart + pinSize.value * 2) && (posXStart + ballSize.value * 2) >= posEnvXStart) {
                if (!pinBodies[i][j].pulse) {
                  let rippleSprite: Sprite
                  if (!rippleBodies[i][j].sprite) {
                    rippleSprite = new Sprite(texture)
                    rippleBodies[i][j].sprite = rippleSprite
                    gameApp.stage.addChild(rippleSprite)
                  } else {
                    rippleSprite = rippleBodies[i][j].sprite
                  }

                  rippleSprite.anchor.set(0.5)
                  rippleSprite.position.set(pinPositions[i][j].x, pinPositions[i][j].y)
                  rippleSprite.scale = 1
                  rippleSprite.alpha = 0.2
                  rippleSprite.visible = true
                  rippleBodies[i][j].time = new Date().getTime()
                  pinBodies[i][j].pulse = true
                }

                break
              }
            }

            break
          }
        }
      }

      // Handle when ball dropping animation finished
      if (ball.pathIndex >= ball.path.length && ball.sprite.visible) {
        ball.sprite.visible = false
        ball.sprite.off('pointerdown')
        ball.sprite.off('pointerdowncapture')
        ball.sprite.destroy()
        // @ts-ignore
        gameApp.stage.removeChild(ball, true)
        ballsAry?.splice(index, 1)
        ball.sprite = null
        onDropDone(ball.pos, ball.v)
      }
    })
  }
}

// dropping balls
const handleBetResult = (v: PlinkoGameMatch) => {
  const finalPos: number = v.result.filter(direction => direction === 'R').length

  if (ballTexture.value && pathAry.length && pathAry[finalPos]) {
    isInHousePlaying.value = betMode.value !== 'free'
    isOnPlaying.value = true
    ballIndex++

    if (instantMode.value) {
      ballsAry?.push({
        sprite: null,
        path: [],
        pathIndex: 0,
        pos: finalPos,
        v: {
          transactionId: v.transactionId,
          balance: v.balance
        }
      })

      ballsAry?.splice(0, 1)

      onDropDone(finalPos, v)
    } else {
      const dIndex: number = Math.floor(Math.random() * pathAry[finalPos].length)
      const selPos: BallPath[] = pathAry[finalPos][dIndex]
      const sprite: Sprite = new Sprite(ballTexture.value)
      sprite.anchor.set(0.5)
      sprite.width = ballSize.value * 2
      sprite.height = ballSize.value * 2
      sprite.visible = true
      sprite.position.x = selPos[0].x
      sprite.position.y = -pinGap.value
      gameApp.stage.addChild(sprite)

      ballsAry?.push({
        sprite,
        path: selPos,
        pathIndex: 0,
        pos: finalPos,
        v: {
          transactionId: v.transactionId,
          balance: v.balance
        }
      })
    }
  }
}

// init pegs
const initPins = () => {
  pinBodies = []
  pinPositions = []
  rippleBodies = []

  let cols = PLINKO_INIT.startPins
  for (let i = 0; i < selectedRow.value; i++) {
    const rowPinBodies: PegAni[] = Array.from({ length: cols }, () => {
      const sprite: Sprite = new Sprite(pinTexture)
      sprite.anchor.set(0.5)
      sprite.width = pinSize.value * 2
      sprite.height = pinSize.value * 2

      return {
        sprite,
      }
    })

    const rowBallPositions = Array.from({ length: cols }, (_, j) => ({
      x: ((selectedRow.value - i) * pinGap.value) / 2 + pinGap.value * j,
      y: i * pinGap.value,
    }))

    rippleBodies[i] = []
    pinBodies[i] = []
    pinPositions.push(rowBallPositions)

    rowPinBodies.forEach((pin, j) => {
      pin.sprite.position.set(rowBallPositions[j].x, rowBallPositions[j].y)
      pinBodies[i][j] = { pulse: false }
      rippleBodies[i][j] = { sprite: null, time: null }

      gameApp.stage.addChild(pin.sprite)
    })

    cols++
  }

  // setup pins container
  gameApp.stage.scale.set(1)
  gameApp.stage.position.set(
    (gameApp.screen.width - gameApp.stage.width - MULTIPLIER_OPTIONS[selectedRow.value].x) / 2,
    (gameApp.screen.height - gameApp.stage.height) / 2 + pinGap.value * 0.5,
  )
}

// Load dropping paths
const loadPath = async () => {
  pathAry = []
  const { data } = await useFetch(`/api/kv/plinko/${selectedRow.value}`)
  // @ts-ignore
  if (data.value?.error) {
    return
  }

  // @ts-ignore
  if (data.value && data.value?.key) {
    // @ts-ignore
    if (data.value?.value && data.value?.value !== '') {
      // @ts-ignore
      pathAry = data.value?.value || []
    }
  }
}

// run ripple
const runPulse = () => {
  if (rippleBodies && rippleBodies.length) {
    const now = new Date().getTime()
    rippleBodies.forEach((ripples: RippleAni[], i: number) => {
      ripples.forEach((ripple: RippleAni, j: number) => {
        if (!pinBodies[i][j].pulse && ripple.sprite) {
          ripple.sprite.visible = false
        }

        if (!ripple.sprite || !pinBodies[i][j].pulse) {
          ripple.time = null
          return
        }

        const delta = now - (ripple.time || 0)
        if (delta > 300) {
          ripple.sprite.alpha = 0
          ripple.sprite.scale = 1
          ripple.sprite.visible = false
          ripple.time = null
          pinBodies[i][j].pulse = false
          return
        }

        ripple.sprite.scale = (1 - Math.abs((delta / 300) * 2 - 1)) * rippleScaleMultiplier.value
      })
    })
  }
}

const run = () => {
  runPulse()

  requestAnimationFrame(run)
}

// Draw Game Board
const drawGameBoard = async () => {
  pinPositions = []
  ballsAry = []
  pressed.value = -1

  initPins()

  await loadPath()

  gameApp.ticker.add(updatePos)
  gameApp.ticker.add(updatePos)
  run()
}

// init pixi app
const initGameApp = async (el: HTMLElement) => {
  gameApp = new Application()
  await gameApp.init({
    width: PLINKO_INIT.width,
    height: PLINKO_INIT.height,
    backgroundColor: PLINKO_INIT.backgroundColor,
    antialias: PLINKO_INIT.antialias,
    resolution: PLINKO_INIT.resolution,
  })

  el.appendChild(gameApp.canvas)

  await drawGameBoard()
}

/**
 * Load ball textures and path
 **/
const loadAssets = async () => {
  const textureArr: any = []
  Object.entries(PLINKO_BALL_TEXTURES).forEach(([risk, url]) => {
    const alias = `${risk}Texture`
    textureArr.push(alias)
    Assets.add({
      alias,
      src: url,
    })
  })

  const [ballTexturesResult, rippleTextureResult] = await Promise.all([
    Assets.load(textureArr),
    Assets.load(RIPPLE_CIRCLE_BASE64)
  ])

  ballTextures = ballTexturesResult
  pinTexture = ballTextures?.pinTexture
  texture = rippleTextureResult
}

// Clear render for init
const clearRender = async () => {
  // @ts-ignore
  cancelAnimationFrame(run)
  if (!hasDroppingBall.value && gameApp.ticker) {
    gameApp.ticker.remove(updatePos)
  }

  if (gameApp.stage) {
    while (gameApp.stage.children[0]) {
      gameApp.stage.children[0].removeAllListeners()
      gameApp.stage.children[0].destroy({ children: true })
      if (gameApp.stage.children[0]) {
        // @ts-ignore
        gameApp.stage.removeChild(gameApp.stage.children[0], true)
      }
    }

    if (rippleBodies) {
      for (let i = 0; i < rippleBodies.length; i++) {
        for (let j = 0; j < rippleBodies[i].length; j++) {
          if (rippleBodies[i][j].sprite) {
            rippleBodies[i][j].sprite.removeAllListeners()
            await rippleBodies[i][j].sprite.destroy({ children: true })
            // @ts-ignore
            gameApp.stage.removeChild(rippleBodies[i][j], true)
            rippleBodies[i][j].sprite = null
          }
        }
      }
    }

    gameApp.stage.removeChildren()
  }

  ballsAry = []
  pathAry = []
  pressed.value = -1
  ballIndex = -1
  pinBodies = []
  pinPositions = []
  rippleBodies = []
  isOnPlaying.value = false
}

watch(() => selectedRow.value,
  async (value, oldValue) => {
    if (oldValue && value !== oldValue) {
      loadingBoard.value = true

      await clearRender()
      await drawGameBoard()

      loadingBoard.value = false
    }
  }, { immediate: true }
)

onBeforeUnmount(async () => {
  await clearRender()
  if (!hasDroppingBall.value && gameApp.ticker) {
    gameApp.ticker.remove(updatePos)
  }
})

onMounted(async () => {
  loadingBoard.value = true
  await loadAssets()

  if (plinkoEl.value) {
    await initGameApp(plinkoEl.value)

    gameApp.ticker.speed = 3
    gameApp.ticker.minFPS = 9
    gameApp.ticker.maxFPS = 90
    // gameApp.ticker.deltaMS = 0.001
    // gameApp.ticker.elapsedMS = 0.001

    loadingBoard.value = false
  } else {
    loadingBoard.value = false
  }
})

const autoBetInstance = useAutoBet({
  betCryptoAmount,
  betResult,
  risk,
  selectedRow,
  maxBooster,
  isOnPlaying,
  lastRequestBall,
  handleBetResult
})

const manualBetInstance = useManualBet({
  betCryptoAmount,
  betResult,
  risk,
  selectedRow,
  maxBooster,
  isOnPlaying,
  lastRequestBall,
  handleBetResult
})

const freeBetInstance = useFreeBet({
  freeSpinID,
  freeBetsRemaining,
  betResult,
  risk,
  selectedRow,
  maxBooster,
  isOnPlaying,
  handleBetResult
})

const isIdle = computed(() =>
  betMode.value === 'manual'
    ? manualBetInstance.isIdle.value
    : (betMode.value === 'free' ? freeBetInstance.isIdle.value : autoBetInstance.isIdle.value)
)
const playStatus = computed(() =>
  betMode.value === 'manual'
    ? manualBetInstance.playStatus.value
    : (betMode.value === 'free' ? freeBetInstance.playStatus.value : autoBetInstance.playStatus.value)
)
useGameHotkeys(betCryptoAmount, { applyDefaults: true, isIdle })

watch(() => betMode.value, () => {
  betResult.value = null
})

watch(() => isLoggedIn.value, (v) => {
  if (v && !!me.value && me.value.remaining_free_spins && me.value.remaining_free_spins.length) {
    if (myFreeBets.value > 0) {
      betMode.value = 'free'
    }

    const freeSpins = me.value.remaining_free_spins[(me.value.remaining_free_spins.length - 1)]
    freeSpinID.value = freeSpins.id
    freeBetsRemaining.value = myFreeBets.value
    freeBetsAmount.value = myFreeBets.value
  }
}, { immediate: true })

provide(PLINKO_GAME, {
  ballSize,
  betCryptoAmount,
  betMode,
  betResult,
  hasDroppingBall,
  history,
  invalid,
  isIdle,
  lastBetCryptoCode,
  loadingBoard,
  maxBooster,
  multipliers,
  pinSize,
  playStatus,
  plinkoEl,
  pressed,
  risk,
  selectedRow
})

provide(AUTO_BET, autoBetInstance)
provide(MANUAL_BET, manualBetInstance)
provide(FREE_BET, {
  ...freeBetInstance,
  freeBetsAmount
})
</script>

<template>
  <slot />

  <DailySpinResultModal
    v-if="openResultModal"
    :modal-visible="openResultModal"
    @close:modal="onCloseResultModal"
  />
</template>
