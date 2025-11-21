<script lang="ts" setup>
import { FREE_BET, MANUAL_BET, PLINKO_GAME } from '~/apps/plinko/constants'
import { AUTH, CURRENCY, GAME } from '~/constants'
import BetAmountInput from '~/components/molecules/inputs/BetAmountInput.vue'
import type { RiskShort } from '~/apps/game/types'
import RiskShortSelect from '~/apps/game/components/in-house/RiskShortSelect.vue'
import RowsSelect from '~/apps/plinko/components/RowsSelect.vue'
import MaxBooster from '~/apps/plinko/components/MaxBooster.vue'

const { t } = useI18n()
const { openAuthModal, me, isLoggedIn, openVerifyModal, isNotVerifiedEmail } = inject(AUTH)!
const { hasDroppingBall, betCryptoAmount, risk, selectedRow, invalid, loadingBoard } = inject(PLINKO_GAME)!
const { betGame, isIdle } = inject(MANUAL_BET)!
const { onBetKeyStroke } = useGameHotkeys()
const { currentCryptoBalance } = inject(CURRENCY)!
const { game, instantMode } = inject(GAME)!
const { freeBetsRemaining } = inject(FREE_BET)!
const token = getAuthCookie()
const { updateGameKv } = useRecentGame()
const betClickGameFn = useThrottleFn((withoutSound: boolean) => {
  betGame(withoutSound)
}, 100)
const savedRecent = ref(false)

const handleFormSubmit = (withoutSound = false) => {
  if (!isLoggedIn.value) {
    openAuthModal()
    return false
  }

  if (isNotVerifiedEmail.value && betCryptoAmount.value > 0) {
    openVerifyModal()
    return false
  }

  if (invalid.value) {
    return false
  }

  if (betCryptoAmount.value > currentCryptoBalance.value) {
    useGeneralNotify({
      type: 'info',
      title: 'Bet Halted',
      description: 'Your bet stopped due to insufficient funds.',
    })

    return false
  }

  if (!withoutSound) {
    betClickGameFn(withoutSound)
  } else {
    betGame(withoutSound)
  }

  if (!!game && me.value?.id && token.value && !savedRecent.value) {
    updateGameKv({ game })
    savedRecent.value = true
  }
}

onBetKeyStroke(() => {
  handleFormSubmit(true)
}, 100)

const { start, stop } = useTimeoutFn(() => {
  handleFormSubmit(true)
}, instantMode.value ? 0 : 100, {
  immediate: false
})

const buttonRef = ref<HTMLElement>()

onLongPress(
  // @ts-ignore
  buttonRef.value?.buttonRef,
  () => start,
  {
    delay: 1000
  }
)
</script>

<template>
  <form
    class="ManualBetForm flex flex-col-reverse lg:flex-col gap-y-3 lg:gap-y-4 text-sm font-bold"
    @submit.prevent="() => handleFormSubmit(false)"
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

      <MaxBooster
        :disabled="!isIdle || hasDroppingBall"
      />
    </div>

    <JButton
      v-if="freeBetsRemaining > 0"
      ref="buttonRef"
      :disabled="invalid"
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

    <JButton
      v-else
      ref="buttonRef"
      :disabled="invalid"
      class="w-full min-w-full lg:mt-1"
      button-class="h-11!"
      size="lg"
      type="submit"
      variant="bet-gradient"
      @mouseup="stop"
      @pointerup="stop"
    >
      {{ t('games.bet') }}
    </JButton>
  </form>
</template>
