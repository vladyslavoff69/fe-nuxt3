import { ENDED, FINISHING, INITIAL, PLAYING } from '~/apps/game/constants'
import type { WheelGameMatch, PlayStatus, Risk, Distribution } from '~/apps/game/types'
import { WHEEL_BET_GAME_MUTATION } from '~/apps/game/graphql'
import { CURRENCY, PREFERENCE, SITE_SETTINGS } from '~/constants'
import { SEGMENTS } from '~/apps/wheel/constants'

type BetProps = {
  betCryptoAmount: Ref<number>
  betResult: Ref<WheelGameMatch>;
  isSpinning: Ref<boolean>
  isLoading: Ref<boolean>
  risk: Ref<Risk>
  segment: Ref<number>
  selectedMultiplicationFactor: Ref<number>
  handleBetResult: (result: WheelGameMatch) => void
}

export const useManualBet = (props: BetProps) => {
  const {
    betCryptoAmount,
    segment,
    risk,
    isSpinning,
    isLoading,
    selectedMultiplicationFactor,
    betResult,
    handleBetResult,
  } = props

  const { activeCryptoCode, activeFiatCode } = inject(PREFERENCE)!
  const { currentCryptoBalance, prevCryptoBalance, prevFiatBalance, cryptoToUsd, usdToFiat } = inject(CURRENCY)!
  const { play: soundBet } = useAudio('/assets/audio/game/bet.mp3')
  const { t } = useI18n()
  const { isInHousePlaying } = inject(SITE_SETTINGS)!
  const payoutMultiplier = computed(() => betResult.value?.payoutMultiplier || 0)
  const {
    mutate: mutateBet,
    onDone: onBetDone,
    onError: onBetError,
    loading: betLoading
  } = useMutation<{ wheelBetGame: WheelGameMatch }>(WHEEL_BET_GAME_MUTATION)

  const playStatus = computed<PlayStatus>(() => (betLoading.value ? PLAYING : INITIAL))
  // @ts-ignore
  const isIdle = computed(() => !(![ENDED, INITIAL].includes(playStatus.value) || isLoading.value || isSpinning.value || betLoading.value))
  const updateToFiat = (balance: number) => {
    return parseFloat((balance * cryptoToUsd.value[activeCryptoCode.value] * usdToFiat.value[activeFiatCode.value]).toFixed(2))
  }

  const betGame = async () => {
    isLoading.value = true
    soundBet()
    prevCryptoBalance.value = currentCryptoBalance.value
    prevFiatBalance.value = updateToFiat(currentCryptoBalance.value)
    isInHousePlaying.value = true
    selectedMultiplicationFactor.value = -1

    await mutateBet({
      input: {
        currencyCode: activeCryptoCode.value,
        betAmount: betCryptoAmount.value,
        segments: SEGMENTS[segment.value].number,
        risk: risk.value,
      },
    })
  }

  onBetDone((result) => {
    const { payoutMultiplier } = result.data!.wheelBetGame

    betResult.value = {
      ...result.data!.wheelBetGame,
      status: payoutMultiplier >= 1 ? 'won' : 'lost',
    }

    isLoading.value = false
    handleBetResult(result.data!.wheelBetGame)
  })

  onBetError((error) => {
    isSpinning.value = false
    isLoading.value = false
    const parsedError = parseGraphqlError(error)
    useGeneralNotify({
      type: 'error',
      title: `${t('notifications.failed-bet')} ${t('casino.wheel')}`,
      description: parsedError.message,
    })

    isInHousePlaying.value = false
  })

  return {
    betCryptoAmount,
    isIdle,
    payoutMultiplier,
    playStatus,
    betGame,
  }
}

export const useAutoBet = (props: BetProps) => {
  const {
    betCryptoAmount,
    betResult,
    segment,
    risk,
    isSpinning,
    isLoading,
    selectedMultiplicationFactor,
    handleBetResult,
  } = props

  const { activeCryptoCode, activeFiatCode } = inject(PREFERENCE)!
  const { currentCryptoBalance, prevCryptoBalance, prevFiatBalance, cryptoToUsd, usdToFiat } = inject(CURRENCY)!
  const { play: soundBet } = useAudio('/assets/audio/game/bet.mp3')
  const { t } = useI18n()
  const { isInHousePlaying } = inject(SITE_SETTINGS)!
  const playStatus = ref<PlayStatus>(INITIAL)
  const roundResults = ref<WheelGameMatch[]>([])
  const numberOfBets = ref(0)
  const stopAmountOnWin = ref(0)
  const stopAmountOnLoss = ref(0)
  const increasePercentOnWin = ref(0)
  const increasePercentOnLoss = ref(0)
  const resetAmountOnWin = ref(true)
  const resetAmountOnLost = ref(true)

  const updateToFiat = (balance: number) => {
    return parseFloat((balance * cryptoToUsd.value[activeCryptoCode.value] * usdToFiat.value[activeFiatCode.value]).toFixed(2))
  }

  const {
    mutate: mutateBet,
    onDone: onBetGameDone,
    onError: onBetError,
    loading: betLoading
  } = useMutation<{ wheelBetGame: WheelGameMatch }>(WHEEL_BET_GAME_MUTATION)
  // @ts-ignore
  const isIdle = computed(() => !(![ENDED, INITIAL].includes(playStatus.value) || isLoading.value || isSpinning.value || betLoading.value))

  const startRound = async () => {
    isLoading.value = true
    selectedMultiplicationFactor.value = -1
    prevCryptoBalance.value = currentCryptoBalance.value
    prevFiatBalance.value = updateToFiat(currentCryptoBalance.value)
    isInHousePlaying.value = true

    await mutateBet({
      input: {
        currencyCode: activeCryptoCode.value,
        betAmount: betCryptoAmount.value,
        segments: SEGMENTS[segment.value].number,
        risk: risk.value,
      },
    })
  }

  const endPlay = () => {
    playStatus.value = INITIAL
    roundResults.value = []
  }

  const stopPlay = () => {
    soundBet()
    if (betLoading.value) {
      playStatus.value = FINISHING
    } else {
      endPlay()
    }
  }

  const startPlay = async () => {
    playStatus.value = PLAYING
    await startRound()
    soundBet()
  }

  onBetGameDone((result) => {
    const { payoutMultiplier } = result.data!.wheelBetGame

    betResult.value = {
      ...result.data!.wheelBetGame,
      status: payoutMultiplier >= 1 ? 'won' : 'lost',
    }

    roundResults.value.push(betResult.value)

    if (numberOfBets.value > 0) {
      numberOfBets.value--
    }

    if (playStatus.value === FINISHING) {
      endPlay()
    }

    isLoading.value = false
    handleBetResult(result.data!.wheelBetGame)
  })

  onBetError((error) => {
    isSpinning.value = false
    const parsedError = parseGraphqlError(error)
    useGeneralNotify({
      type: 'error',
      title: `${t('notifications.failed-bet')} ${t('casino.wheel')}`,
      description: parsedError.message,
    })

    isLoading.value = false
    isInHousePlaying.value = false
  })

  return {
    playStatus,
    roundResults,
    betCryptoAmount,
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
