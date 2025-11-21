<script lang="ts" setup>
import { KENO_GAME } from '~/apps/keno/constants'
import { GAME } from '~/constants'
import CurrencyColumn from '~/components/molecules/table/details/CurrencyColumn.vue'

const { instantMode } = inject(GAME)!
const { betCryptoAmount, payoutMultiplier, soundWin, lastBetCryptoCode } = inject(KENO_GAME)!
const betCryptoAmountPlayed = betCryptoAmount.value

onMounted(() => {
  if (instantMode.value) {
    useTimeoutFn(() => {
      soundWin()
    }, 0)
  } else {
    useTimeoutFn(() => {
      soundWin()
    }, 300)
  }
})
</script>

<template>
  <div class="GameResult backdrop-blur-xs">
    <div
      class="
        rounded-md w-36 md:w-56 h-32 md:h-40 relative drop-shadow-flat-lg transition
        border border-gold ease-[cubic-bezier(0.7,0,0.1,1)] scale-100 opacity-100
        duration-300 text-white font-bold bg-bet-gradient
      "
      style="z-index: 10"
    >
      <i
        v-if="!instantMode"
        class="
          absolute z-0 inset-0 rounded-md bg-size-[300%_auto] animate-home-rays bg-bet-gradient
          bg-no-repeat ease-[cubic-bezier(.75,0,.2,1)] transition-all duration-200
          mix-blend-plus-lighter opacity-50
        "
      />
      <div
        class="
          absolute inset-2 text-center rounded-md bg-primary shadow-primary-box
          grid place-content-center place-items-center gap-1 md:gap-3 mb-1
        "
        style="z-index: 0"
      >
        <h5
          :style="{ animationDelay: '0.1s' }"
          class="text-xl md:text-3xl lg:text-3xl font-bold text-shadow"
        >
          {{ payoutMultiplier }}×
        </h5>
        <div
          :style="{ animationDelay: '0.15s' }"
          class="w-8 md:w-16 h-0.5 md:h-1 bg-brand/30"
        />
        <div
          :style="{ animationDelay: '0.3s' }"
          class="flex items-center justify-center"
        >
          <div class="relative flex items-center justify-center gap-2.5">
            <CurrencyColumn
              :amount="betCryptoAmountPlayed * payoutMultiplier"
              :currency-code="lastBetCryptoCode"
              :front="true"
              class="justify-center font-bold text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
