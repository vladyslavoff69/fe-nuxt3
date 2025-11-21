<script lang="ts" setup>
import { WHEEL_GAME, MANUAL_BET } from '~/apps/wheel/constants'
import { AUTH, GAME } from '~/constants'
import BetAmountInput from '~/components/molecules/inputs/BetAmountInput.vue'
import type { RiskShort, Segment } from '~/apps/game/types'
import RiskShortSelect from '~/apps/game/components/in-house/RiskShortSelect.vue'
import SegmentSelect from '~/apps/wheel/components/SegmentSelect.vue'

const { t } = useI18n()
const { openAuthModal, me, isLoggedIn, openVerifyModal, isNotVerifiedEmail } = inject(AUTH)!
const { invalid, segment, risk } = inject(WHEEL_GAME)!
const { instantMode } = inject(GAME)!
const { betCryptoAmount, betGame, isIdle } = inject(MANUAL_BET)!
const { onBetKeyStroke } = useGameHotkeys()
const token = getAuthCookie()
const { updateGameKv } = useRecentGame()
const { game } = inject(GAME)!
const savedRecent = ref(false)
const handleFormSubmit = () => {
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

  if (!isIdle.value) {
    return
  }

  betGame()

  if (!!game && me.value?.id && token.value && !savedRecent.value) {
    updateGameKv({ game })
    savedRecent.value = true
  }
}

onBetKeyStroke(() => {
  if (isIdle.value) {
    handleFormSubmit()
  }
}, instantMode.value ? 100 : 900)
</script>

<template>
  <form
    class="ManualBetForm flex flex-col-reverse lg:flex-col gap-y-3 lg:gap-y-4 text-sm font-bold"
    @submit.prevent="handleFormSubmit"
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

      <RiskShortSelect
        :disabled="!isIdle"
        :risk="risk"
        @update:model-value="(v: RiskShort) => risk = v"
      />

      <SegmentSelect
        :disabled="!isIdle"
        :segment="segment"
        @update:model-value="(v: Segment) => segment = v"
      />
    </div>

    <JButton
      :disabled="invalid"
      :loading="!isIdle"
      class="w-full min-w-full"
      button-class="h-11!"
      size="lg"
      type="submit"
      variant="bet-gradient"
    >
      {{ t('games.bet') }}
    </JButton>
  </form>
</template>
