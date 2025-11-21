<script lang="ts" setup>
import type { Bet } from '~/types'
import { CURRENCY, PREFERENCE } from '~/constants'
import CurrencyColumn from '~/components/molecules/table/details/CurrencyColumn.vue'
import { formatLongFloat } from '~/utils'

const { betData } = defineProps<{
  betData: Bet,
  absFontSize?: string
}>()

const { t } = useI18n()
const { activeFiatCode, displayInfiatEnabled } = inject(PREFERENCE)!
const { cryptoToFiat } = inject(CURRENCY)!

const calcFiatPrice = (currency: string) => {
  return cryptoToFiat(1, currency, activeFiatCode.value)
}

const isMulti = computed(() => {
  const amount = Number(betData?.amount)
  const payout = Number(betData?.payout)
  const currencyCode = betData?.currency_code || 'BTC'
  const fiatPrice = calcFiatPrice(currencyCode)

  if (displayInfiatEnabled.value) {
    if (amount * fiatPrice > 9999 || payout * fiatPrice > 9999) {
      return true
    }
  } else if (amount > 9999 || payout > 9999) {
    return true
  }

  return false
})
</script>

<template>
  <div class="flex items-center justify-center w-full bg-green-950 rounded-md py-1 text-sm leading-none">
    <div class="w-1/3 flex items-center justify-center flex-col gap-y-1 py-2 px-1.5">
      <span
        :class="[absFontSize || '']"
        class="font-bold"
      >{{ t('games.bet') }}</span>
      <CurrencyColumn
        :amount="Number(betData?.amount)"
        :normalized-amount="Number(betData?.normalized_amount)"
        :class="[absFontSize || '']"
        :currency-code="betData?.currency_code"
        class="justify-center text-white"
      />
    </div>
    <div class="w-1/3 flex items-center justify-center flex-col gap-y-1 py-2 px-1.5 border-l border-border">
      <span
        :class="[absFontSize || '']"
        class="font-bold"
      >
        {{ isMulti ? t('games.multi') : t('games.multiplier') }}
      </span>
      <span
        class="font-semibold"
        :class="[
          {
            'text-white': Number(betData?.payout) >= Number(betData?.amount),
            'text-paragraph': Number(betData?.payout) < Number(betData?.amount)
          },
          absFontSize || ''
        ]"
      >
        {{ betData?.detail_type?.toLowerCase() === 'casino' ? formatLongFloat(betData.multiplier) : formatLongFloat(betData.bet_multiplier) }}×
      </span>
    </div>
    <div class="w-1/3 flex items-center justify-center flex-col gap-y-1 py-2 px-1.5 border-l border-border">
      <span
        class="font-bold"
        :class="[absFontSize || '']"
      >{{ t('transaction.payout') }}</span>
      <CurrencyColumn
        :amount="Number(betData?.payout)"
        :normalized-amount="betData?.normalized_payout"
        class="justify-center"
        :class="[
          {
            'text-primary': Number(betData?.payout) >= Number(betData?.amount),
            'text-neutral-500': Number(betData?.payout) < Number(betData?.amount)
          },
          absFontSize || ''
        ]"
        :currency-code="betData?.currency_code"
      />
    </div>
  </div>
</template>
