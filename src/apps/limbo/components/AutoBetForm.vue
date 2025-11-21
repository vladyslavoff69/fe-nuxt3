<script lang="ts" setup>
import { FINISHING, PLAYING } from '~/apps/game/constants'
import { AUTO_BET, LIMBO_GAME } from '~/apps/limbo/constants'
import { AUTH, CURRENCY, GAME, PREFERENCE } from '~/constants'
import BetAmountInput from '~/components/molecules/inputs/BetAmountInput.vue'
import IncreaseByInput from '~/components/molecules/inputs/IncreaseByInput.vue'
import CurrencyInput from '~/components/molecules/inputs/CurrencyInput.vue'
import AutoBetButton from '~/apps/game/components/in-house/AutoBetButton.vue'
import NumberOfBetsInput from '~/apps/game/components/in-house/NumberOfBetsInput.vue'
import ProfitAmount from '~/apps/game/components/in-house/ProfitAmount.vue'

const { isLoggedIn, me, openAuthModal, openVerifyModal, isNotVerifiedEmail } = inject(AUTH)!
const { activeCryptoCode } = inject(PREFERENCE)!
const { asOtherAmount, displayOtherAmount, currentCryptoBalance } = inject(CURRENCY)!
const { game, instantMode } = inject(GAME)!
const token = getAuthCookie()
const { updateGameKv } = useRecentGame()
const { invalid, targetValue } = inject(LIMBO_GAME)!
const {
  betCryptoAmount,
  isIdle,
  playStatus,
  startPlay,
  stopPlay,
  onBetGameDone,
  startRound: startPlayRound,
  roundResults,
  numberOfBets,
  stopAmountOnWin,
  stopAmountOnLoss,
  increasePercentOnWin,
  increasePercentOnLoss,
  resetAmountOnLost,
  resetAmountOnWin,
} = inject(AUTO_BET)!

const { onBetKeyStroke } = useGameHotkeys()
const baseBetAmount = ref(betCryptoAmount.value)
const savedRecent = ref(false)
const currentAmount = computed<number>(() =>
  roundResults.value.reduce(
    (previousValue, iRoundResult) =>
      previousValue + iRoundResult.betAmount * (iRoundResult.payoutMultiplier - 1),
    0,
  ),
)

const profitAmount = computed<number>(() => {
  return (targetValue.value - 1) * betCryptoAmount.value
})

const { t } = useI18n()
const numberOfBetsCounting = ref(false)
const { start, stop } = useTimeoutFn(() => {
  startRound()
}, instantMode.value ? 0 : 200, {
  immediate: false
})

const canNextRound = () => {
  if (numberOfBetsCounting.value && numberOfBets.value <= 0) {
    useGeneralNotify({
      type: 'info',
      title: t('bets.autobet-completed'),
      description: t('bets.autobet-completed-desc'),
    })
    return false
  }

  if (currentAmount.value > stopAmountOnWin.value && stopAmountOnWin.value > 0) {
    useGeneralNotify({
      type: 'info',
      title: t('bets.autobet-stopped-on-profit'),
      description: t('bets.autobet-stopped-on-profit-desc'),
    })
    return false
  }

  if (currentAmount.value < -stopAmountOnLoss.value && stopAmountOnLoss.value > 0) {
    useGeneralNotify({
      type: 'info',
      title: t('bets.autobet-stopped-on-loss'),
      description: t('bets.autobet-stopped-on-loss-desc'),
    })
    return false
  }

  if (betCryptoAmount.value > currentCryptoBalance.value) {
    useGeneralNotify({
      type: 'info',
      title: t('bets.autobet-halted'),
      description: t('bets.autobet-halted-desc'),
    })
    return false
  }

  return true
}

const startAutoBet = () => {
  if (!isLoggedIn.value) {
    openAuthModal()
    return
  }

  if (isNotVerifiedEmail.value && betCryptoAmount.value > 0) {
    openVerifyModal()
    return false
  }

  if (invalid.value) {
    return
  }

  if (!isIdle.value) {
    return
  }

  baseBetAmount.value = betCryptoAmount.value
  numberOfBetsCounting.value = numberOfBets.value > 0

  if (!canNextRound()) {
    return
  }

  useGeneralNotify({
    type: 'info',
    title: t('bets.autobet-started'),
    description: t('bets.autobet-started-desc'),
  })

  startPlay()

  if (!!game && me.value?.id && token.value && !savedRecent.value) {
    updateGameKv({ game })
    savedRecent.value = true
  }
}

const stopAutoBetManually = () => {
  stopAutoBet()
  useGeneralNotify({
    type: 'info',
    title: t('bets.autobet-manually-stopped'),
    description: t('bets.autobet-manually-stopped-desc'),
  })
}

const stopAutoBet = () => {
  stop()
  stopPlay()
}

const startRound = () => {
  startPlayRound()
}

const { off } = onBetGameDone(({ data: { limboBetGame } }: any) => {
  // check if user clicked Stop button
  if (playStatus.value !== PLAYING) {
    return
  }

  const { payoutMultiplier } = limboBetGame
  if (playStatus.value === PLAYING) {
    if (payoutMultiplier > 0) {
      betCryptoAmount.value += betCryptoAmount.value * (increasePercentOnWin.value / 100)
      if (resetAmountOnWin.value) {
        betCryptoAmount.value = baseBetAmount.value
      }
    } else {
      betCryptoAmount.value += betCryptoAmount.value * (increasePercentOnLoss.value / 100)
      if (resetAmountOnLost.value) {
        betCryptoAmount.value = baseBetAmount.value
      }
    }
    if (!canNextRound()) {
      stopAutoBet()
      return
    }

    start()
  } else {
    stopAutoBet()
  }
})

onBetKeyStroke(() => {
  if (playStatus.value === FINISHING) {
    return
  }

  if (isIdle.value) {
    startAutoBet()
  } else {
    stopAutoBetManually()
  }
}, 200)

onBeforeUnmount(() => {
  off()
})

watch(() => activeCryptoCode.value, () => {
  if (playStatus.value === PLAYING) {
    stopAutoBetManually()
  }
})
</script>

<template>
  <form
    class="ManualBetForm flex flex-col-reverse lg:flex-col gap-y-3 lg:gap-y-4"
    @submit.prevent="startAutoBet"
  >
    <div class="w-full flex flex-col gap-y-3 lg:gap-y-4">
      <div class="w-full">
        <BetAmountInput
          :model-value="betCryptoAmount"
          :lock="!isIdle"
          class-name="h-10! rounded-md flex items-center pl-9 pr-32"
          end-icon="right-2.5!"
          @update:model-value="(val: number) => betCryptoAmount = val"
        />
      </div>

      <ProfitAmount
        :profit-amount="profitAmount"
        class="hidden md:block"
      />

      <NumberOfBetsInput
        :is-idle="isIdle"
        :number-of-bets="numberOfBets"
        @update:model-value="(val: number | string) => numberOfBets = Number(val)"
      />

      <div class="w-full flex flex-col gap-y-1">
        <label
          class="block text-sm font-bold text-paragraph leading-none"
          for="on-win-input"
        >{{ t('games.on-win') }}</label>
        <IncreaseByInput
          id="on-win-input"
          :model-value="increasePercentOnWin"
          :reset="resetAmountOnWin"
          :lock="!isIdle"
          class-name="pr-6! h-10! hover:ring-1 hover:ring-highlights focus:ring-1 focus:ring-highlights pl-2 lg:pl-3"
          end-icon="right-2! lg:right-3!"
          @update:model-value="(val: number | string) => increasePercentOnWin = Number(val)"
          @update:reset="(val: any) => resetAmountOnWin = val"
        />
      </div>

      <div class="w-full flex flex-col gap-y-1">
        <label
          class="block text-sm font-bold text-paragraph leading-none"
          for="on-loss-input"
        >{{ t('games.on-loss') }}</label>
        <IncreaseByInput
          id="on-loss-input"
          :model-value="increasePercentOnLoss"
          :reset="resetAmountOnLost"
          :lock="!isIdle"
          class-name="pr-6! h-10! hover:ring-1 hover:ring-highlights focus:ring-1 focus:ring-highlights pl-2 lg:pl-3"
          end-icon="right-2! lg:right-3!"
          @update:model-value="(val: number | string) => increasePercentOnLoss = Number(val)"
          @update:reset="(val: any) => resetAmountOnLost = val"
        />
      </div>

      <div class="w-full flex flex-col gap-y-1">
        <div
          class="flex items-center justify-between text-sm font-bold leading-none"
        >
          <span>{{ t('games.stop-on-profit') }}</span>
          <span>{{ displayOtherAmount(asOtherAmount(stopAmountOnWin)) }}</span>
        </div>

        <CurrencyInput
          :model-value="stopAmountOnWin"
          :lock="!isIdle"
          class-name="h-10! rounded-md flex items-center pl-9 disabled:text-white"
          @update:model-value="(val: number) => stopAmountOnWin = Number(val)"
        />
      </div>
      <div class="w-full flex flex-col gap-y-1">
        <div
          class="flex items-center justify-between text-sm font-bold leading-none"
        >
          <span>{{ t('games.stop-on-loss') }}</span>
          <span>{{ displayOtherAmount(asOtherAmount(stopAmountOnLoss)) }}</span>
        </div>

        <CurrencyInput
          :model-value="stopAmountOnLoss"
          :lock="!isIdle"
          class-name="h-10! rounded-md flex items-center pl-9 disabled:text-white"
          @update:model-value="(val: number) => stopAmountOnLoss = Number(val)"
        />
      </div>
    </div>

    <AutoBetButton
      :invalid="invalid"
      :play-status="playStatus"
      @stop:auto-bet-manually="stopAutoBetManually"
    />
  </form>
</template>
