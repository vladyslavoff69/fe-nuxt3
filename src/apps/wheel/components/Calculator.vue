<script lang="ts" setup>
import { CURRENCY, PREFERENCE } from '~/constants'
import CurrencyColumn from '~/components/molecules/table/details/CurrencyColumn.vue'

const props = defineProps<{
  betAmount: number;
  multiplier: number;
  chance: string;
}>()

const { t } = useI18n()
const { displayInfiatEnabled, activeCryptoCode } = inject(PREFERENCE)!
const { displayOtherAmount, asOtherAmount } = inject(CURRENCY)!
const payout = computed<number>(() => props.betAmount * props.multiplier)
const profitOnWin = computed<number>(() => payout.value - props.betAmount)
</script>

<template>
  <div
    class="w-full px-0 py-1 lg:px-1.5 lg:py-1.5 bg-green-950 rounded-md font-bold text-xs lg:text-sm leading-none md:min-w-[450px]"
  >
    <div class="grid grid-cols-2 gap-1 md:gap-2 lg:gap-4 w-full">
      <div class="col-span-1 flex flex-col gap-y-1">
        <div class="flex justify-between truncate">
          <span>{{ t('games.profit') }}</span>
          <span class="hidden md:block">{{ displayOtherAmount(asOtherAmount(profitOnWin)) }}</span>
        </div>
        <CurrencyColumn
          :amount="profitOnWin"
          :currency-code="activeCryptoCode"
          :front="true"
          class="flex items-center px-2 md:px-3 h-9 bg-brand font-bold rounded-md"
          :class="{
            'text-red-600': profitOnWin < 0 && displayInfiatEnabled,
            'text-white': profitOnWin >= 0 || !displayInfiatEnabled,
          }"
        />
      </div>

      <div class="col-span-1 flex flex-col gap-y-1">
        <span class="block">
          {{ t('base.chance') }}
        </span>
        <div class="flex items-center px-2 md:px-3 h-9 bg-brand text-white font-bold rounded-md">
          {{ props.chance }}
        </div>
      </div>
    </div>
  </div>
</template>
