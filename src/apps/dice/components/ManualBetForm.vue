<script lang="ts" setup>
import { PLAYING } from '~/apps/game/constants'
import { DICE_GAME, MANUAL_BET } from '~/apps/dice/constants'
import { AUTH, GAME } from '~/constants'
import BetAmountInput from '~/components/molecules/inputs/BetAmountInput.vue'
import ProfitAmount from '~/apps/game/components/in-house/ProfitAmount.vue'

const { openAuthModal, me, isLoggedIn, openVerifyModal, isNotVerifiedEmail } = inject(AUTH)!
const token = getAuthCookie()
const { updateGameKv } = useRecentGame()
const { betCryptoAmount, targetValue, rollOver, invalid } = inject(DICE_GAME)!
const { betGame, playStatus, isIdle } = inject(MANUAL_BET)!
const { game } = inject(GAME)!
const { onBetKeyStroke } = useGameHotkeys()
const profitAmount = computed<number>(() => {
  return (99 / (100 - (rollOver.value ? targetValue.value : 100 - targetValue.value)) - 1) * betCryptoAmount.value
})
const savedRecent = ref(false)
const { t } = useI18n()

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
    return false
  }

  betGame()

  if (!!game && me.value?.id && token.value && !savedRecent.value) {
    updateGameKv({ game })
    savedRecent.value = true
  }
}

onBetKeyStroke(() => {
  handleFormSubmit()
}, 200)
</script>

<template>
  <form
    class="ManualBetForm flex flex-col-reverse lg:flex-col gap-y-3 lg:gap-y-4"
    @submit.prevent="handleFormSubmit"
  >
    <div class="w-full flex flex-col gap-y-3 lg:gap-y-4">
      <div class="w-full">
        <BetAmountInput
          :lock="playStatus === PLAYING"
          :model-value="betCryptoAmount"
          class-name="h-10! rounded-md flex items-center pl-9 pr-32"
          end-icon="right-2.5!"
          @update:model-value="(val: number) => betCryptoAmount = val"
        />
      </div>

      <ProfitAmount :profit-amount="profitAmount" />
    </div>

    <JButton
      :disabled="invalid"
      :loading="playStatus === PLAYING"
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
