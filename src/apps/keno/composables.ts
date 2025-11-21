import { ENDED, FINISHING, INITIAL, PLAYING } from '~/apps/game/constants'
import type { KenoGameMatch, PlayStatus, Risk } from '~/apps/game/types'
import { KENO_BET_GAME_MUTATION } from '~/apps/game/graphql'
import { CURRENCY, GAME, PREFERENCE, SITE_SETTINGS } from '~/constants'
import type { GameHistoryItem } from '~/types'

type BetProps = {
  selectedTiles: Ref<number[]>;
  betCryptoAmount: Ref<number>;
  history: Ref<GameHistoryItem[]>;
  betResult: Ref<KenoGameMatch | null>;
  risk: Ref<Risk>;
  tileNumbers: number[];
  opening: Ref<boolean>;
  onOpeningDone: (fn: Function) => Function;
}

export const useManualBet = (props: BetProps) => {
  const {
    betCryptoAmount,
    history,
    betResult,
    risk,
    selectedTiles,
    opening
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
  const { instantMode } = inject(GAME)!
  const { play: soundBet } = useAudio('/assets/audio/game/bet.mp3')
  const { t } = useI18n()
  const { isInHousePlaying } = inject(SITE_SETTINGS)!

  const payoutMultiplier = computed(() => betResult.value?.payoutMultiplier || 1)
  const {
    mutate: mutateBet,
    onDone: onBetDone,
    onError: onBetError,
    loading: betLoading
  } = useMutation<{ kenoBetGame: KenoGameMatch }>(KENO_BET_GAME_MUTATION)

  const playStatus = computed<PlayStatus>(() => {
    if (betLoading.value || opening.value) {
      return PLAYING
    }

    return INITIAL
  })

  const showResult = computed(
    () => playStatus.value === INITIAL && !opening.value && !!betResult.value && betResult.value?.payoutMultiplier > 1
  )
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
    betResult.value = null
    await mutateBet({
      input: {
        currencyCode: activeCryptoCode.value,
        betAmount: betCryptoAmount.value,
        numbers: selectedTiles.value,
        risk: risk.value,
      },
    })
  }

  onBetDone((result) => {
    const { id, payoutMultiplier, transactionId, balance } = result.data!.kenoBetGame

    betResult.value = {
      ...result.data!.kenoBetGame,
      status: payoutMultiplier > 0 ? 'won' : 'lost',
    }

    if (instantMode.value) {
      history.value?.push({
        id,
        transactionId,
        status: payoutMultiplier > 0 ? 'won' : 'lost',
        text: `${payoutMultiplier.toFixed(2)}×`,
      })

      updateUserBalance(balance, activeCryptoCode.value)

      isInHousePlaying.value = false
    }
  })

  onBetError((error) => {
    const parsedError = parseGraphqlError(error)
    useGeneralNotify({
      type: 'error',
      title: `${t('notifications.failed-bet')} ${t('casino.keno')}`,
      description: parsedError.message,
    })
    isInHousePlaying.value = false
  })

  return {
    betCryptoAmount,
    betGame,
    betGameLoading: betLoading,
    betResult,
    isIdle,
    payoutMultiplier,
    playStatus,
    showResult,
  }
}

export const useAutoBet = (props: BetProps) => {
  const {
    betCryptoAmount,
    history,
    betResult,
    selectedTiles,
    risk,
    opening,
    onOpeningDone
  } = props
  const { instantMode } = inject(GAME)!
  const { isInHousePlaying } = inject(SITE_SETTINGS)!
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
  const isIdle = computed(() => [ENDED, INITIAL].includes(playStatus.value) && !opening.value)
  const updateToFiat = (balance: number) => {
    return parseFloat((balance * cryptoToUsd.value[activeCryptoCode.value] * usdToFiat.value[activeFiatCode.value]).toFixed(2))
  }
  const showResult = computed(() =>
    (betGameLoading.value || opening.value)
      ? false
      // @ts-ignore
      : [PLAYING, FINISHING, ENDED, INITIAL].includes(playStatus.value) && !!betResult.value && betResult.value?.payoutMultiplier > 1
  )
  const roundResults = ref<KenoGameMatch[]>([])
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
  } = useMutation<{ kenoBetGame: KenoGameMatch }>(KENO_BET_GAME_MUTATION)

  const startRound = async () => {
    prevCryptoBalance.value = currentCryptoBalance.value
    prevFiatBalance.value = updateToFiat(currentCryptoBalance.value)
    isInHousePlaying.value = true
    await mutateBetGame({
      input: {
        currencyCode: activeCryptoCode.value,
        betAmount: betCryptoAmount.value,
        numbers: selectedTiles.value,
        risk: risk.value,
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
    } else if (instantMode.value) {
      endPlay()
    } else if (opening.value) {
      playStatus.value = FINISHING
      const remove = onOpeningDone(() => {
        endPlay()
        remove()
      })
    } else {
      endPlay()
    }
  }

  onBetGameDone((result) => {
    const { payoutMultiplier, id, transactionId, balance } = result.data!.kenoBetGame

    betResult.value = {
      ...result.data!.kenoBetGame,
      status: payoutMultiplier > 0 ? 'won' : 'lost',
    }

    roundResults.value.push(betResult.value)

    if (instantMode.value) {
      history.value.push({
        id,
        transactionId,
        status: payoutMultiplier > 0 ? 'won' : 'lost',
        text: `${payoutMultiplier.toFixed(2)}×`
      })

      if (history.value.length > 8) {
        history.value = history.value.slice(-8)
      }

      updateUserBalance(balance, activeCryptoCode.value)
      isInHousePlaying.value = false
    }

    if (numberOfBets.value > 0) {
      numberOfBets.value--
    }

    if (playStatus.value === FINISHING) {
      if (instantMode.value) {
        endPlay()
      } else {
        const remove = onOpeningDone(() => {
          endPlay()
          remove()
        })
      }
    }
  })

  onBetError((error) => {
    const parsedError = parseGraphqlError(error)
    useGeneralNotify({
      type: 'error',
      title: `${t('notifications.failed-bet')} ${t('casino.keno')}`,
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
    showResult,
    stopAmountOnLoss,
    stopAmountOnWin,
    startPlay,
    startRound,
    stopPlay,
    onBetGameDone,
  }
}

export const useAnimationArray = <T>(
  inputArray: Ref<T[]>,
  options: {
    enabled: Ref<boolean>;
    onChange: (tile: T) => void;
    onDone: (tiles: T[]) => void;
    betResult: Ref<KenoGameMatch | null>;
    history: Ref<GameHistoryItem[]>;
  }
): {
  animationArray: Ref<T[]>;
  isActive: Ref<boolean>;
  onDone: (fn: Function) => Function;
} => {
  const animationArray = ref<T[]>([]) as Ref<T[]>
  const { activeCryptoCode } = inject(PREFERENCE)!
  const { isInHousePlaying } = inject(SITE_SETTINGS)!
  const { updateUserBalance } = inject(CURRENCY)!
  let onDoneCallbacks: Function[] = []

  const onDone = (fn: Function): Function => {
    onDoneCallbacks.push(fn)
    return () => {
      onDoneCallbacks = onDoneCallbacks.filter(iFn => iFn !== fn)
    }
  }

  const { pause, resume, isActive } = useIntervalFn(
    () => {
      if (animationArray.value.length < inputArray.value.length) {
        const newItem = inputArray.value[animationArray.value.length]
        animationArray.value.push(newItem)
        options.onChange(newItem)
      } else {
        pause()
        options.onDone(animationArray.value)
        onDoneCallbacks.forEach((fn: Function) => fn())
        //  @ts-ignore
        const { id, payoutMultiplier, transactionId, balance } = options.betResult.value

        useTimeoutFn(() => {
          options.history.value.push({
            id,
            transactionId,
            status: payoutMultiplier > 0 ? 'won' : 'lost',
            text: `${payoutMultiplier.toFixed(2)}×`,
          })

          if (options.history.value.length > 8) {
            options.history.value = options.history.value.slice(-8)
          }

          updateUserBalance(balance, activeCryptoCode.value)
          isInHousePlaying.value = false
        }, 100)
      }
    },
    100,
    { immediate: false }
  )

  watch(
    () => inputArray.value,
    (v) => {
      if (options.enabled.value) {
        animationArray.value = []
        if (v.length) {
          resume()
        }
      } else {
        animationArray.value = v
        if (v.length > 0) {
          options.onDone(animationArray.value)
          onDoneCallbacks.forEach((fn: Function) => fn())
        }
      }
    }
  )

  return {
    isActive,
    animationArray,
    onDone,
  }
}

export const useKenoSounds = () => {
  const { play: soundTile1 } = useAudio('/assets/audio/keno/tile1.mp3')
  const { play: soundTile2 } = useAudio('/assets/audio/keno/tile2.mp3')
  const { play: soundTile3 } = useAudio('/assets/audio/keno/tile3.mp3')
  const { play: soundTile4 } = useAudio('/assets/audio/keno/tile4.mp3')
  const { play: soundTile5 } = useAudio('/assets/audio/keno/tile5.mp3')
  const { play: soundTile6 } = useAudio('/assets/audio/keno/tile6.mp3')
  const { play: soundNegative } = useAudio('/assets/audio/keno/negative.mp3')
  const { play: soundGem } = useAudio('/assets/audio/keno/gem.mp3')
  const { play: soundWin } = useAudio('/assets/audio/keno/win.mp3')

  return {
    soundTile: () => {
      const rand = Math.min(Math.floor(Math.random() * 6), 5);
      [soundTile1, soundTile2, soundTile3, soundTile4, soundTile5, soundTile6][
        rand
      ]()
    },
    soundNegative,
    soundGem: soundWin,
    soundWin: soundGem,
  }
}
