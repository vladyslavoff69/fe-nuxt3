<script lang="ts" setup>
import { KENO_GAME, MANUAL_BET } from '~/apps/keno/constants'
import { AUTH, GAME } from '~/constants'
import BetAmountInput from '~/components/molecules/inputs/BetAmountInput.vue'
import type { Risk } from '~/apps/game/types'
import RiskSelect from '~/apps/game/components/in-house/RiskSelect.vue'

const { openAuthModal, me, isLoggedIn, openVerifyModal, isNotVerifiedEmail } = inject(AUTH)!
const token = getAuthCookie()
const { updateGameKv } = useRecentGame()
const { betCryptoAmount, risk, selectedTiles, autoPick, betResult, inAutoPick, invalid } = inject(KENO_GAME)!
const { betGame, isIdle } = inject(MANUAL_BET)!
const { onBetKeyStroke } = useGameHotkeys()
const { game } = inject(GAME)!
const { t } = useI18n()
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

  if (selectedTiles.value?.length === 0 || inAutoPick.value || !isIdle.value) {
    return false
  }

  betGame()

  if (!!game && me.value?.id && token.value && !savedRecent.value) {
    updateGameKv({ game })
    savedRecent.value = true
  }
}

const clearTable = () => {
  betResult.value = null
  selectedTiles.value = []
}

onBetKeyStroke(() => {
  handleFormSubmit()
}, 200)
</script>

<template>
  <form
    class="ManualBetForm flex flex-col-reverse lg:flex-col gap-y-3 lg:gap-y-4 text-sm font-bold"
    @submit.prevent="handleFormSubmit"
  >
    <div class="w-full flex flex-col gap-y-3 lg:gap-y-4">
      <div class="w-full">
        <BetAmountInput
          :lock="!isIdle"
          :model-value="betCryptoAmount"
          class-name="h-10! rounded-md flex items-center pl-9 pr-32"
          end-icon="right-2.5!"
          @update:model-value="(val: number) => betCryptoAmount = val"
        />
      </div>

      <RiskSelect
        :disabled="!isIdle"
        :risk="risk"
        @update:model-value="(v: Risk) => risk = v"
      />
    </div>

    <JbBlankButton
      :disabled="!isIdle"
      class="w-full min-w-full bg-border hover:bg-brand rounded-md h-10"
      @click="autoPick"
    >
      {{ t('games.auto-pick') }}
    </JbBlankButton>

    <JbBlankButton
      :disabled="!isIdle"
      class="w-full min-w-full bg-border hover:bg-brand rounded-md h-10"
      @click="clearTable"
    >
      {{ t('games.clear-table') }}
    </JbBlankButton>

    <JButton
      :disabled="invalid || !selectedTiles.length"
      :loading="!isIdle"
      button-class="h-11!"
      class="w-full min-w-full"
      size="lg"
      type="submit"
      variant="bet-gradient"
    >
      {{ t('games.bet') }}
    </JButton>
  </form>
</template>
