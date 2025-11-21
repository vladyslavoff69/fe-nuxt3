<script lang="ts" setup>
import { CURRENCY, PREFERENCE } from '~/constants'
import CurrencyColumn from '~/components/molecules/table/details/CurrencyColumn.vue'
import { PLINKO_GAME } from '~/apps/plinko/constants'

const props = defineProps<{
  multiplier: number;
  chance: number;
}>()

const { t } = useI18n()
const { activeCryptoCode } = inject(PREFERENCE)!
const { displayOtherAmount, asOtherAmount } = inject(CURRENCY)!
const { betCryptoAmount } = inject(PLINKO_GAME)!
const payout = computed<number>(() => betCryptoAmount.value * props.multiplier)
const profitOnWin = computed<number>(() => payout.value - betCryptoAmount.value)
</script>

<template>
  <div
    class="
      w-full px-0 py-1 lg:px-1.5 lg:py-1.5 bg-green-950
      rounded-md font-bold text-xs lg:text-sm leading-none
    "
  >
    <div class="grid grid-cols-2 gap-1 md:gap-2 lg:gap-4">
      <div class="col-span-1 flex flex-col gap-y-1">
        <div class="flex justify-between truncate">
          <span>{{ t('games.profit') }}</span>
          <span class="hidden md:block">{{ displayOtherAmount(asOtherAmount(profitOnWin)) }}</span>
        </div>
        <CurrencyColumn
          :amount="profitOnWin"
          :currency-code="activeCryptoCode"
          :front="true"
          class="flex items-center px-2 md:px-3 h-9 bg-brand text-white font-bold rounded-md"
        />
      </div>

      <div class="col-span-1 flex flex-col gap-y-1">
        <span class="block">
          {{ t('base.chance') }}
        </span>
        <div class="flex items-center px-2 md:px-3 h-9 bg-brand text-white font-bold rounded-md">
          {{ props.chance.toFixed(4) }}
        </div>
      </div>
    </div>
  </div>
</template>
