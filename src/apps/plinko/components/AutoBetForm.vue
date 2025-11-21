<script lang="ts" setup>
import { PLAYING } from '~/apps/game/constants'
import { AUTO_BET, FREE_BET, PLINKO_GAME } from '~/apps/plinko/constants'
import { AUTH, CURRENCY, GAME, PREFERENCE } from '~/constants'
import BetAmountInput from '~/components/molecules/inputs/BetAmountInput.vue'
import AutoBetButton from '~/apps/game/components/in-house/AutoBetButton.vue'
import NumberOfBetsInput from '~/apps/game/components/in-house/NumberOfBetsInput.vue'
import RiskShortSelect from '~/apps/game/components/in-house/RiskShortSelect.vue'
import type { RiskShort } from '~/apps/game/types'
import RowsSelect from '~/apps/plinko/components/RowsSelect.vue'
import MaxBooster from '~/apps/plinko/components/MaxBooster.vue'

const { freeBetsRemaining } = inject(FREE_BET)!
const { isLoggedIn, me, openAuthModal, openVerifyModal, isNotVerifiedEmail } = inject(AUTH)!
const { activeCryptoCode } = inject(PREFERENCE)!
const { currentCryptoBalance } = inject(CURRENCY)!
const { game, instantMode } = inject(GAME)!
const { hasDroppingBall, risk, selectedRow, invalid, loadingBoard } = inject(PLINKO_GAME)!
const {
  betCryptoAmount,
  isIdle,
  numberOfBets,
  playStatus,
  startPlay,
  stopPlay,
  startRound: startPlayRound,
  onBetDone,
} = inject(AUTO_BET)!
const token = getAuthCookie()
const { updateGameKv } = useRecentGame()
const { t } = useI18n()
const { onBetKeyStroke } = useGameHotkeys()
const baseBetAmount = ref(betCryptoAmount.value)
const savedRecent = ref(false)
const numberOfBetsCounting = ref(false)
const { start, stop } = useTimeoutFn(() => {
  startRound()
}, instantMode.value ? 0 : 10, {
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

const stopAutoBet = () => {
  stop()
  stopPlay()
}

const stopAutoBetManually = () => {
  stopAutoBet()
  useGeneralNotify({
    type: 'info',
    title: t('bets.autobet-manually-stopped'),
    description: t('bets.autobet-manually-stopped-desc'),
  })
}

const startRound = () => {
  startPlayRound()
}

onBetKeyStroke(() => {
  if (playStatus.value === 'FINISHING') {
    return
  }

  if (isIdle.value) {
    startAutoBet()
  } else {
    stopAutoBetManually()
  }
}, 150)

const { off } = onBetDone(() => {
  // check if user clicked Stop button
  if (playStatus.value !== PLAYING) {
    return
  }

  if (playStatus.value === PLAYING) {
    if (!canNextRound()) {
      stopAutoBet()
      return
    }

    start()
  } else {
    stopAutoBet()
  }
})

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
    class="ManualBetForm flex flex-col-reverse lg:flex-col gap-y-3 lg:gap-y-4 text-sm font-bold"
    @submit.prevent="startAutoBet"
  >
    <div class="w-full flex flex-col gap-y-3 lg:gap-y-4">
      <div class="w-full">
        <BetAmountInput
          :model-value="betCryptoAmount"
          :lock="!isIdle || loadingBoard || hasDroppingBall"
          class-name="h-10! rounded-md flex items-center pl-9 pr-32"
          end-icon="right-2.5!"
          @update:model-value="(val: number) => betCryptoAmount = val"
        />
      </div>

      <RiskShortSelect
        :disabled="!isIdle || hasDroppingBall"
        :risk="risk"
        @update:model-value="(v: RiskShort) => risk = v"
      />

      <RowsSelect
        :disabled="!isIdle || hasDroppingBall"
        :row="selectedRow"
        @update:model-value="(v: number) => selectedRow = v"
      />

      <NumberOfBetsInput
        :is-idle="isIdle && !loadingBoard && !hasDroppingBall"
        :number-of-bets="numberOfBets"
        @update:model-value="(val: number | string) => numberOfBets = Number(val)"
      />

      <MaxBooster
        :disabled="!isIdle || hasDroppingBall"
      />
    </div>

    <JButton
      v-if="freeBetsRemaining > 0"
      ref="buttonRef"
      :disabled="invalid || loadingBoard"
      class="w-full min-w-full lg:mt-1"
      button-class="!h-11 bg-[#c9ffb2] text-brand"
      size="lg"
      type="submit"
      variant="none"
      @mouseup="stop"
      @pointerup="stop"
    >
      {{ freeBetsRemaining }} Free Bets Left
    </JButton>

    <AutoBetButton
      v-else
      :invalid="invalid || loadingBoard"
      :play-status="playStatus"
      @stop:auto-bet-manually="stopAutoBetManually"
    />
  </form>
</template>
