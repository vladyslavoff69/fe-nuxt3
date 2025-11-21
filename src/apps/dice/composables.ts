import { ENDED, FINISHING, INITIAL, PLAYING } from '~/apps/game/constants'
import type { DiceGameMatch, PlayStatus } from '~/apps/game/types'
import { DICE_BET_GAME_MUTATION } from '~/apps/game/graphql'
import { CURRENCY, PREFERENCE, SITE_SETTINGS } from '~/constants'
import type { GameHistoryItem } from '~/types'

type BetProps = {
  betCryptoAmount: Ref<number>;
  history: Ref<GameHistoryItem[]>;
  targetValue: Ref<number>;
  rollOver: Ref<boolean>;
  betResult: Ref<DiceGameMatch>;
}

export const useManualBet = (props: BetProps) => {
  const {
    betCryptoAmount,
    history,
    rollOver,
    targetValue,
    betResult
  } = props
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
  const { play: soundBet } = useAudio('/assets/audio/game/bet.mp3')
  const { t } = useI18n()

  const payoutMultiplier = computed(() => betResult.value?.payoutMultiplier)
  const {
    mutate: mutateBet,
    onDone: onBetDone,
    onError: onBetError,
    loading: betLoading,
  } = useMutation<{ diceBetGame: DiceGameMatch }>(DICE_BET_GAME_MUTATION)

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
        condition: rollOver.value ? 'over' : 'under',
      },
    })
  }

  onBetDone((result) => {
    const { id, balance, payoutMultiplier, transactionId, result: rollResult } = result.data!.diceBetGame

    betResult.value = {
      ...result.data!.diceBetGame,
      status: payoutMultiplier > 0 ? 'won' : 'lost',
    }

    history.value?.push({
      id,
      transactionId,
      status: payoutMultiplier > 0 ? 'won' : 'lost',
      text: rollResult,
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
      title: `Server Error! ${t('notifications.failed-bet')} ${t('casino.dice')}`,
      description: parsedError.message,
    })
    isInHousePlaying.value = false
  })

  return {
    betCryptoAmount,
    betGameLoading: betLoading,
    betResult,
    isIdle,
    payoutMultiplier,
    playStatus,
    betGame,
  }
}

export const useAutoBet = (props: BetProps) => {
  const {
    betCryptoAmount,
    history,
    betResult,
    targetValue,
    rollOver
  } = props
  const playStatus = ref<PlayStatus>(INITIAL)
  const { isInHousePlaying } = inject(SITE_SETTINGS)!
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
  const roundResults = ref<DiceGameMatch[]>([])
  const numberOfBets = ref(0)
  const stopAmountOnWin = ref(0)
  const stopAmountOnLoss = ref(0)
  const increasePercentOnWin = ref(0)
  const increasePercentOnLoss = ref(0)
  const resetAmountOnWin = ref(true)
  const resetAmountOnLost = ref(true)
  const { t } = useI18n()

  const { play: soundBet } = useAudio('/assets/audio/game/bet.mp3')
  const {
    mutate: mutateBetGame,
    loading: betGameLoading,
    onDone: onBetGameDone,
    onError: onBetError,
  } = useMutation<{ diceBetGame: DiceGameMatch }>(DICE_BET_GAME_MUTATION)

  const startRound = async () => {
    prevCryptoBalance.value = currentCryptoBalance.value
    prevFiatBalance.value = updateToFiat(currentCryptoBalance.value)
    isInHousePlaying.value = true
    await mutateBetGame({
      input: {
        currencyCode: activeCryptoCode.value,
        betAmount: betCryptoAmount.value,
        target: targetValue.value,
        condition: rollOver.value ? 'over' : 'under',
      },
    })
  }

  const startPlay = async () => {
    playStatus.value = PLAYING
    await startRound()
    soundBet()
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
      balance,
      transactionId,
      result: rollResult,
    } = result.data!.diceBetGame

    betResult.value = {
      ...result.data!.diceBetGame,
      status: payoutMultiplier > 0 ? 'won' : 'lost',
    }
    roundResults.value?.push(betResult.value)

    history.value?.push({
      id,
      transactionId,
      status: payoutMultiplier > 0 ? 'won' : 'lost',
      text: rollResult,
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
      title: `Server Error! ${t('notifications.failed-bet')} ${t('casino.dice')}`,
      description: parsedError.message,
    })

    playStatus.value = INITIAL
    isInHousePlaying.value = false
  })

  return {
    betCryptoAmount,
    betGameLoading,
    betResult,
    increasePercentOnLoss,
    increasePercentOnWin,
    isIdle,
    numberOfBets,
    playStatus,
    resetAmountOnLost,
    resetAmountOnWin,
    roundResults,
    stopAmountOnLoss,
    stopAmountOnWin,
    onBetGameDone,
    startPlay,
    startRound,
    stopPlay,
  }
}
