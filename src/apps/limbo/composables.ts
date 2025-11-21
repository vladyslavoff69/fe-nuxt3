import { ENDED, FINISHING, INITIAL, PLAYING } from '~/apps/game/constants'
import type { LimboGameMatch, PlayStatus } from '~/apps/game/types'
import { LIMBO_BET_GAME_MUTATION } from '~/apps/game/graphql'
import { CURRENCY, PREFERENCE, SITE_SETTINGS } from '~/constants'
import type { GameHistoryItem } from '~/types'

type BetProps = {
  betCryptoAmount: Ref<number>;
  history: Ref<GameHistoryItem[]>;
  targetValue: Ref<number>;
  betResult: Ref<LimboGameMatch>;
};

export const useManualBet = (props: BetProps) => {
  const {
    betCryptoAmount,
    history,
    targetValue,
    betResult
  } = props
  const { play: soundBet } = useAudio('/assets/audio/game/bet.mp3')
  const { t } = useI18n()
  const { activeCryptoCode, activeFiatCode } = inject(PREFERENCE)!
  const {
    updateUserBalance,
    currentCryptoBalance,
    prevCryptoBalance,
    prevFiatBalance,
    cryptoToUsd,
    usdToFiat
  } = inject(CURRENCY)!
  const { isInHousePlaying } = inject(SITE_SETTINGS)!

  const payoutMultiplier = computed(() => betResult.value.payoutMultiplier)
  const {
    mutate: mutateBet,
    onDone: onBetDone,
    onError: onBetError,
    loading: betLoading,
  } = useMutation<{ limboBetGame: LimboGameMatch }>(LIMBO_BET_GAME_MUTATION)

  const playStatus = computed<PlayStatus>(() => (betLoading.value ? PLAYING : INITIAL))
  // @ts-ignore
  const isIdle = computed(() => [ENDED, INITIAL].includes(playStatus.value))
  const updateToFiat = (balance: number) => {
    return parseFloat((balance * cryptoToUsd.value[activeCryptoCode.value] * usdToFiat.value[activeFiatCode.value]).toFixed(2))
  }

  const betGame = async () => {
    soundBet()
    prevCryptoBalance.value = currentCryptoBalance.value
    prevFiatBalance.value = updateToFiat(currentCryptoBalance.value)
    isInHousePlaying.value = true
    await mutateBet({
      input: {
        currencyCode: activeCryptoCode.value,
        betAmount: betCryptoAmount.value,
        target: targetValue.value,
      },
    })
  }

  onBetDone((result) => {
    const { id, balance, payoutMultiplier, transactionId, result: rollResult } = result.data!.limboBetGame

    betResult.value = {
      ...result.data!.limboBetGame,
      status: payoutMultiplier > 0 ? 'won' : 'lost',
    }

    history.value.push({
      id,
      transactionId,
      status: payoutMultiplier > 0 ? 'won' : 'lost',
      text: `${rollResult.toFixed(2)}×`,
    })

    if (history.value.length > 8) {
      history.value = history.value.slice(-8)
    }

    updateUserBalance(balance, activeCryptoCode.value)
    isInHousePlaying.value = false
  })

  onBetError((error) => {
    const parsedError = parseGraphqlError(error)
    useGeneralNotify({
      type: 'error',
      title: `${t('notifications.failed-bet')} ${t('casino.limbo')}`,
      description: parsedError.message,
    })
    isInHousePlaying.value = false
  })

  return {
    playStatus,
    betCryptoAmount,
    isIdle,
    payoutMultiplier,
    betGame,
    betResult,
    betGameLoading: betLoading,
  }
}

export const useAutoBet = (props: BetProps) => {
  const {
    betCryptoAmount,
    history,
    betResult,
    targetValue
  } = props
  const playStatus = ref<PlayStatus>(INITIAL)
  const { activeCryptoCode, activeFiatCode } = inject(PREFERENCE)!
  const {
    updateUserBalance,
    currentCryptoBalance,
    prevCryptoBalance,
    prevFiatBalance,
    cryptoToUsd,
    usdToFiat
  } = inject(CURRENCY)!
  // @ts-ignore
  const isIdle = computed(() => [ENDED, INITIAL].includes(playStatus.value))
  const updateToFiat = (balance: number) => {
    return parseFloat((balance * cryptoToUsd.value[activeCryptoCode.value] * usdToFiat.value[activeFiatCode.value]).toFixed(2))
  }

  const roundResults = ref<LimboGameMatch[]>([])
  const numberOfBets = ref<number>(0)
  const stopAmountOnWin = ref<number>(0)
  const stopAmountOnLoss = ref<number>(0)
  const increasePercentOnWin = ref<number>(0)
  const increasePercentOnLoss = ref<number>(0)
  const resetAmountOnWin = ref<boolean>(true)
  const resetAmountOnLost = ref<boolean>(true)
  const { t } = useI18n()
  const { isInHousePlaying } = inject(SITE_SETTINGS)!

  const { play: soundBet } = useAudio('/assets/audio/game/bet.mp3')
  const {
    mutate: mutateBetGame,
    loading: betGameLoading,
    onDone: onBetGameDone,
    onError: onBetError,
  } = useMutation<{ limboBetGame: LimboGameMatch }>(LIMBO_BET_GAME_MUTATION)

  const startPlay = async () => {
    playStatus.value = PLAYING
    await startRound()
    soundBet()
  }

  const startRound = async () => {
    prevCryptoBalance.value = currentCryptoBalance.value
    prevFiatBalance.value = updateToFiat(currentCryptoBalance.value)
    isInHousePlaying.value = true
    await mutateBetGame({
      input: {
        currencyCode: activeCryptoCode.value,
        betAmount: betCryptoAmount.value,
        target: targetValue.value,
      },
    })
  }

  const endPlay = () => {
    playStatus.value = INITIAL
    roundResults.value = []
  }

  const stopPlay = () => {
    soundBet()
    if (betGameLoading.value) {
      playStatus.value = FINISHING
    } else {
      endPlay()
    }
  }

  onBetGameDone((result) => {
    const {
      payoutMultiplier,
      id,
      transactionId,
      result: rollResult,
      balance,
    } = result.data!.limboBetGame

    betResult.value = {
      ...result.data!.limboBetGame,
      status: payoutMultiplier > 0 ? 'won' : 'lost',
    }

    roundResults.value.push(betResult.value)

    history.value.push({
      id,
      transactionId,
      status: payoutMultiplier > 0 ? 'won' : 'lost',
      text: `${rollResult.toFixed(2)}×`,
    })

    if (history.value.length > 8) {
      history.value = history.value.slice(-8)
    }

    updateUserBalance(balance, activeCryptoCode.value)
    isInHousePlaying.value = false

    if (numberOfBets.value > 0) {
      numberOfBets.value--
    }

    if (playStatus.value === FINISHING) {
      endPlay()
    }
  })

  onBetError((error) => {
    const parsedError = parseGraphqlError(error)
    useGeneralNotify({
      type: 'error',
      title: `${t('notifications.failed-bet')} ${t('casino.limbo')}`,
      description: parsedError.message,
    })
    playStatus.value = INITIAL
    isInHousePlaying.value = false
  })

  return {
    betCryptoAmount,
    betGameLoading,
    betResult,
    playStatus,
    roundResults,
    isIdle,
    numberOfBets,
    stopAmountOnWin,
    stopAmountOnLoss,
    increasePercentOnWin,
    increasePercentOnLoss,
    resetAmountOnWin,
    resetAmountOnLost,
    startPlay,
    startRound,
    stopPlay,
    onBetGameDone,
  }
}

export const useIncreasingNumber = (
  to: Ref<number>,
  options: { instantMode: Ref<boolean>; interval?: number },
): { current: Ref<number>; loading: Ref<boolean> } => {
  const { instantMode, interval = 5 } = options
  const loading = ref(false)
  const current = ref(1)

  const increaseCurrent = () => {
    const step = (to.value - 1) / 10
    loading.value = true
    const setIntervalInstance: NodeJS.Timeout = setInterval(() => {
      current.value += step
      if (current.value >= to.value) {
        current.value = to.value
        loading.value = false
        clearInterval(setIntervalInstance)
      }
    }, interval)
  }

  watch(
    () => to.value,
    (v) => {
      if (instantMode.value) {
        current.value = v
        return
      }

      current.value = 1
      if (v > 1) {
        increaseCurrent()
      }
    },
  )

  return {
    loading,
    current,
  }
}
