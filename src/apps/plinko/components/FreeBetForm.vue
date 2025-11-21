<script lang="ts" setup>
import { FREE_BET, PLINKO_GAME } from '~/apps/plinko/constants'
import { AUTH, CURRENCY, FREE_SPIN, GAME, PREFERENCE } from '~/constants'
import type { RiskShort } from '~/apps/game/types'
import RiskShortSelect from '~/apps/game/components/in-house/RiskShortSelect.vue'
import RowsSelect from '~/apps/plinko/components/RowsSelect.vue'
import MaxBooster from '~/apps/plinko/components/MaxBooster.vue'

const { t } = useI18n()
const { cancelFreeBets, myFreeBets, isDailySpin } = inject(FREE_SPIN)!
const { openAuthModal, me, isLoggedIn, openVerifyModal, isNotVerifiedEmail } = inject(AUTH)!
const { hasDroppingBall, betCryptoAmount, risk, selectedRow, invalid, betMode } = inject(PLINKO_GAME)!
const { betGame, isIdle, freeBetsRemaining } = inject(FREE_BET)!
const { onBetKeyStroke } = useGameHotkeys()
const {
  currentCryptoToFiat,
  currentCryptoBalance,
  currentCryptoCurrency,
  currentFiatCurrency,
  displayFiatAmount,
  displayCurrentCryptoAmount
} = inject(CURRENCY)!
const { displayInfiatEnabled } = inject(PREFERENCE)!
const { game, instantMode } = inject(GAME)!
const token = getAuthCookie()
const { updateGameKv } = useRecentGame()
const betClickGameFn = useThrottleFn((withoutSound: boolean) => {
  betGame(withoutSound)
}, 100)
const savedRecent = ref(false)
const freeTotalWon = computed(() =>
  !!me.value && me.value.remaining_free_spins && me.value.remaining_free_spins.length
    ? me.value.remaining_free_spins[(me.value.remaining_free_spins.length - 1)].total_won
    : 0
)
const fiatAmount = computed(() => parseFloat((freeTotalWon.value * currentCryptoToFiat.value).toFixed(10)))

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

const cancelFree = () => {
  cancelFreeBets.value = true
  betMode.value = 'manual'
}

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
      <div class="w-full cursor-not-allowed flex flex-col gap-y-1">
        <span class="text-sm font-bold leading-none">
          {{ t('base.amount') }} {{ t('games.won') }}
        </span>
        <div class="flex items-center gap-x-2 px-3 py-2 h-10 bg-brand/80 rounded-md">
          <UIcon
            v-if="!isDailySpin"
            name="i-cryptocurrency-color:doge"
            class="w-5 h-5 min-h-5 min-w-5"
          />
          <template v-else>
            <div
              v-if="displayInfiatEnabled"
              class="flex items-center"
            >
              <UIcon
                v-if="currentFiatCurrency?.iconType === 'ui'"
                :name="currentFiatCurrency?.icon"
                class="w-5 h-5 min-h-5 min-w-5"
              />
              <svg
                v-else-if="currentFiatCurrency?.iconType === 'symbol'"
                class="w-5 h-5 min-h-5 min-w-5"
              >
                <use :href="currentFiatCurrency?.icon" />
              </svg>
              <UAvatar
                v-else
                :alt="currentFiatCurrency?.name"
                :src="currentFiatCurrency?.logo"
                class="w-5 h-5 min-h-5 min-w-5"
                img-class="w-5 h-5"
                size="sm"
              />
            </div>
            <div
              v-else-if="!displayInfiatEnabled"
              class="flex items-center"
            >
              <UIcon
                v-if="currentCryptoCurrency?.iconType === 'ui'"
                :name="currentCryptoCurrency?.icon"
                class="w-5 h-5 min-h-5 min-w-5"
              />
              <svg
                v-else-if="currentCryptoCurrency?.iconType === 'symbol'"
                class="w-5 h-5 min-h-5 min-w-5"
              >
                <use :href="currentCryptoCurrency?.icon" />
              </svg>
              <UAvatar
                v-else
                :alt="currentCryptoCurrency?.name"
                :src="currentCryptoCurrency?.logo"
                class="w-5 h-5 min-h-5 min-w-5"
                img-class="w-5 h-5"
                size="sm"
              />
            </div>
          </template>
          <span>
            {{ !displayInfiatEnabled ? displayCurrentCryptoAmount(freeTotalWon) : displayFiatAmount(fiatAmount) }}
          </span>
        </div>
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
      :disabled="invalid || myFreeBets <= 0 || freeBetsRemaining <= 0"
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
      :disabled="invalid || myFreeBets <= 0 || freeBetsRemaining <= 0"
      class="w-full min-w-full lg:mt-1"
      button-class="h-11!"
      size="lg"
      type="submit"
      variant="bet-gradient"
      @mouseup="stop"
      @pointerup="stop"
    >
      Free {{ t('games.bet') }}
    </JButton>
    <div class="flex items-center justify-end">
      <JbBlankButton
        class="p-0 leading-none"
        @click="cancelFree"
      >
        {{ t('base.cancel') }}
      </JbBlankButton>
    </div>
  </form>
</template>
