import type { ID } from '~/types'
import { ENDED, FINISHING, INITIAL, PLAYING } from '~/apps/game/constants'
import type { PlayStatus, PlinkoFreeGameMatch, PlinkoGameMatch, RiskShort } from '~/apps/game/types'
import { PLINKO_BET_GAME_MUTATION, PLINKO_FREE_BET_GAME_MUTATION } from '~/apps/game/graphql'
import { CURRENCY, GAME, PREFERENCE, SITE_SETTINGS } from '~/constants'
import type { BallV } from '~/apps/plinko/types';

type BetProps = {
  betCryptoAmount: Ref<number>;
  betResult: Ref<PlinkoGameMatch | null>;
  risk: Ref<RiskShort>;
  selectedRow: Ref<number>;
  maxBooster: Ref<'default' | 'left' | 'right'>;
  isOnPlaying: Ref<boolean>;
  lastRequestBall: Ref<BallV>;
  handleBetResult: (result: PlinkoGameMatch) => void
}

type FreeBetProps = {
  freeSpinID: Ref<ID>;
  freeBetsRemaining: Ref<number>;
  betResult: Ref<PlinkoGameMatch | null>;
  risk: Ref<RiskShort>;
  selectedRow: Ref<number>;
  maxBooster: Ref<'default' | 'left' | 'right'>;
  isOnPlaying: Ref<boolean>;
  handleBetResult: (result: PlinkoGameMatch) => void
}

// manual bet
export const useManualBet = (props: BetProps) => {
  const {
    betCryptoAmount,
    betResult,
    risk,
    selectedRow,
    maxBooster,
    isOnPlaying,
    lastRequestBall,
    handleBetResult
  } = props
  const {
    updateUserBalance,
    currentCryptoBalance,
    prevCryptoBalance,
    prevFiatBalance,
    cryptoToUsd,
    usdToFiat
  } = inject(CURRENCY)!
  const { activeCryptoCode, activeFiatCode } = inject(PREFERENCE)!
  const { isInHousePlaying } = inject(SITE_SETTINGS)!
  const { play: soundBet, destroyAudio } = useAudio('/assets/audio/game/bet.mp3')
  const { t } = useI18n()
  const payoutMultiplier = computed(() => betResult.value?.payoutMultiplier || 8)
  const {
    mutate: mutateBet,
    onDone: onBetDone,
    onError: onBetError,
    loading: betLoading
  } = useMutation<{ plinkoBetGame: PlinkoGameMatch }>(PLINKO_BET_GAME_MUTATION, { fetchPolicy: 'no-cache' })

  const playStatus = computed<PlayStatus>(
    () => ((betLoading.value || isOnPlaying.value) ? PLAYING : INITIAL)
  )
  // @ts-ignore
  const isIdle = computed(() => [ENDED, INITIAL].includes(playStatus.value) && !isOnPlaying.value)

  const updateToFiat = (balance: number) => {
    return parseFloat((balance * cryptoToUsd.value[activeCryptoCode.value] * usdToFiat.value[activeFiatCode.value]).toFixed(2))
  }

  const betGame = async (withoutSound = false): Promise<void> => {
    if (!withoutSound) {
      soundBet()
    }

    const balance = Number(currentCryptoBalance.value) - Number(betCryptoAmount.value)
    if (balance < 0) {
      return
    }

    updateUserBalance(balance, activeCryptoCode.value)
    isInHousePlaying.value = true
    prevCryptoBalance.value = balance
    prevFiatBalance.value = updateToFiat(balance)

    await mutateBet({
      input: {
        currencyCode: activeCryptoCode.value,
        betAmount: betCryptoAmount.value,
        rows: selectedRow.value,
        risk: risk.value,
        maxBooster: maxBooster.value,
      }
    })
  }

  onBetDone((result) => {
    const { payoutMultiplier } = result.data!.plinkoBetGame

    betResult.value = {
      ...result.data!.plinkoBetGame,
      status: payoutMultiplier >= 1 ? 'won' : 'lost',
    }

    if (betResult.value?.betAmount === betCryptoAmount.value) {
      lastRequestBall.value = {
        transactionId: betResult.value?.transactionId,
        balance: betResult.value?.balance
      }
    }

    handleBetResult(betResult.value)
  })

  onBetError((error) => {
    const parsedError = parseGraphqlError(error)
    if (parsedError.message && parsedError.message !== 'Please slow down') {
      useGeneralNotify({
        type: 'error',
        title: `${t('notifications.failed-bet')} ${t('casino.plinko')}`,
        description: parsedError.message,
      })

      isInHousePlaying.value = false
    }
  })

  onBeforeUnmount(() => {
    destroyAudio()
    betResult.value = null // Cleanup game state
  })

  return {
    betCryptoAmount,
    betGame,
    betGameLoading: betLoading,
    betResult,
    isIdle,
    payoutMultiplier,
    playStatus,
    onBetDone,
  }
}

// manual bet
export const useFreeBet = (props: FreeBetProps) => {
  const {
    freeSpinID,
    freeBetsRemaining,
    betResult,
    risk,
    selectedRow,
    maxBooster,
    isOnPlaying,
    handleBetResult
  } = props
  const { isInHousePlaying } = inject(SITE_SETTINGS)!
  const { play: soundBet, destroyAudio } = useAudio('/assets/audio/game/bet.mp3')
  const { t } = useI18n()
  const payoutMultiplier = computed(() => betResult.value?.payoutMultiplier || 8)
  const {
    mutate: mutateBet,
    onDone: onBetDone,
    onError: onBetError,
    loading: betLoading
  } = useMutation<{ plinkoFreeSpinMutation: PlinkoFreeGameMatch }>(PLINKO_FREE_BET_GAME_MUTATION)

  const playStatus = computed<PlayStatus>(
    () => ((betLoading.value || isOnPlaying.value) ? PLAYING : INITIAL)
  )
  // @ts-ignore
  const isIdle = computed(() => [ENDED, INITIAL].includes(playStatus.value) && !isOnPlaying.value)
  const betGame = async (withoutSound = false): Promise<void> => {
    if (!withoutSound) {
      soundBet()
    }

    freeBetsRemaining.value -= 1
    if (freeBetsRemaining.value < 0) {
      return
    }

    isOnPlaying.value = true
    await mutateBet({
      input: {
        free_spin_id: Number(freeSpinID.value),
        rows: selectedRow.value,
        risk: risk.value,
        maxBooster: maxBooster.value
      }
    })
  }

  onBetDone((result) => {
    const { payoutMultiplier } = result.data!.plinkoFreeSpinMutation

    betResult.value = {
      ...result.data!.plinkoFreeSpinMutation,
      status: payoutMultiplier >= 1 ? 'won' : 'lost',
    }

    handleBetResult(betResult.value)
  })

  onBetError((error) => {
    const parsedError = parseGraphqlError(error)
    if (parsedError.message && parsedError.message !== 'Please slow down') {
      useGeneralNotify({
        type: 'error',
        title: `${t('notifications.failed-bet')} ${t('casino.plinko')}`,
        description: parsedError.message,
      })

      isInHousePlaying.value = false
      isOnPlaying.value = false
    }
  })

  onBeforeUnmount(() => {
    destroyAudio()
    betResult.value = null // Cleanup game state
  })

  return {
    freeSpinID,
    freeBetsRemaining,
    betGame,
    betGameLoading: betLoading,
    betResult,
    isIdle,
    payoutMultiplier,
    playStatus,
    onBetDone,
  }
}

export const useAutoBet = (props: BetProps) => {
  const {
    betCryptoAmount,
    betResult,
    risk,
    selectedRow,
    maxBooster,
    isOnPlaying,
    lastRequestBall,
    handleBetResult
  } = props
  const { activeCryptoCode, activeFiatCode } = inject(PREFERENCE)!
  const { instantMode } = inject(GAME)!
  const {
    updateUserBalance,
    currentCryptoBalance,
    cryptoToUsd,
    usdToFiat,
    prevCryptoBalance,
    prevFiatBalance,
  } = inject(CURRENCY)!
  const { isInHousePlaying } = inject(SITE_SETTINGS)!
  const roundResults = ref<PlinkoGameMatch[]>([])
  const numberOfBets = ref(0)

  const { t } = useI18n()
  const { play: soundBet, destroyAudio } = useAudio('/assets/audio/game/bet.mp3')
  const {
    mutate: mutateBetGame,
    loading: betGameLoading,
    onDone: onBetDone,
    onError: onBetError,
  } = useMutation<{ plinkoBetGame: PlinkoGameMatch }>(PLINKO_BET_GAME_MUTATION, { fetchPolicy: 'no-cache' })
  const playStatus = ref<PlayStatus>(INITIAL)
  const isIdle = computed(() =>
  // @ts-ignore
    [ENDED, INITIAL].includes(playStatus.value) && !betGameLoading.value && !isOnPlaying.value && !isInHousePlaying.value
  )

  const updateToFiat = (balance: number) => {
    return parseFloat((balance * cryptoToUsd.value[activeCryptoCode.value] * usdToFiat.value[activeFiatCode.value]).toFixed(2))
  }

  const startRound = () => {
    const balance = Number(currentCryptoBalance.value) - Number(betCryptoAmount.value)
    if (balance < 0) {
      return
    }

    updateUserBalance(balance, activeCryptoCode.value)
    prevCryptoBalance.value = balance
    prevFiatBalance.value = updateToFiat(balance)
    isInHousePlaying.value = true

    mutateBetGame({
      input: {
        currencyCode: activeCryptoCode.value,
        betAmount: betCryptoAmount.value,
        rows: selectedRow.value,
        risk: risk.value,
        maxBooster: maxBooster.value,
      },
    })
  }

  const startPlay = async () => {
    playStatus.value = PLAYING
    soundBet()
    startRound()
  }

  const endPlay = () => {
    playStatus.value = INITIAL
    roundResults.value = []
  }

  const stopPlay = () => {
    soundBet()
    if (betGameLoading.value) {
      playStatus.value = FINISHING
    } else if (instantMode.value) {
      endPlay()
    } else {
      endPlay()
    }
  }

  onBetDone((result) => {
    const { payoutMultiplier } = result.data!.plinkoBetGame

    betResult.value = {
      ...result.data!.plinkoBetGame,
      status: payoutMultiplier >= 1 ? 'won' : 'lost',
    }

    if (betResult.value?.betAmount === betCryptoAmount.value) {
      lastRequestBall.value = {
        transactionId: betResult.value?.transactionId,
        balance: betResult.value?.balance
      }
    }

    roundResults.value.push(betResult.value)
    handleBetResult(betResult.value)

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
      title: `${t('notifications.failed-bet')} ${t('casino.plinko')}`,
      description: parsedError.message,
    })

    playStatus.value = INITIAL
    isInHousePlaying.value = false
    isOnPlaying.value = false
  })

  onBeforeUnmount(() => {
    destroyAudio()
    betResult.value = null // Cleanup game state
  })

  return {
    betCryptoAmount,
    betGameLoading,
    isIdle,
    numberOfBets,
    playStatus,
    roundResults,
    startPlay,
    startRound,
    stopPlay,
    onBetDone,
  }
}
