<script lang="ts" setup>
import { PLAYING } from '~/apps/game/constants'
import { LIMBO_GAME, MANUAL_BET } from '~/apps/limbo/constants'
import { AUTH, GAME } from '~/constants'
import BetAmountInput from '~/components/molecules/inputs/BetAmountInput.vue'
import ProfitAmount from '~/apps/game/components/in-house/ProfitAmount.vue'

const { openAuthModal, me, isLoggedIn, openVerifyModal, isNotVerifiedEmail } = inject(AUTH)!
const { betCryptoAmount, targetValue, invalid } = inject(LIMBO_GAME)!
const { betGame, playStatus, isIdle } = inject(MANUAL_BET)!
const { onBetKeyStroke } = useGameHotkeys()
const { game } = inject(GAME)!
const token = getAuthCookie()
const { updateGameKv } = useRecentGame()
const profitAmount = computed<number>(() => ((targetValue.value - 1) * betCryptoAmount.value))
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
          :model-value="betCryptoAmount"
          :lock="playStatus === PLAYING"
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
