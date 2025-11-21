<script lang="ts" setup>
import { CURRENCY, PREFERENCE, cryptoCurrencyMap } from '~/constants'

const {
  amount = 0,
  normalizedAmount = 0,
  currencyAmount = 0,
  currencyCode = '',
  front = false
} = defineProps<{
  amount?: number,
  normalizedAmount?: number,
  currencyAmount?: number,
  currencyCode?: string;
  front?: boolean;
}>()

const { displayFiatAmount, asCurrentAmount } = inject(CURRENCY)!
const { displayInfiatEnabled, activeFiatCode } = inject(PREFERENCE)!
</script>

<template>
  <span
    class="flex items-center gap-x-1"
    :class="{
      'text-red-600': normalizedAmount < 0 || amount < 0
    }"
  >
    <template v-if="front">
      <UIcon
        v-if="cryptoCurrencyMap[currencyCode]?.iconType === 'ui'"
        :name="cryptoCurrencyMap[currencyCode]?.icon || ''"
        class="w-4 h-4 min-w-4 min-h-4"
      />
      <svg
        v-else-if="cryptoCurrencyMap[currencyCode]?.iconType === 'symbol'"
        class="w-4 h-4 min-w-4 min-h-4"
      >
        <use :href="cryptoCurrencyMap[currencyCode].icon || ''" />
      </svg>
      <UAvatar
        v-else-if="cryptoCurrencyMap[currencyCode]?.iconType === 'logo'"
        :src="cryptoCurrencyMap[currencyCode]?.icon || ''"
        :alt="currencyCode"
        class="w-4 h-4 min-w-4 min-h-4 rounded-full"
        img-class="w-4 h-4"
        size="sm"
      />
      <svg
        v-else
        class="w-4 h-4 min-w-4 min-h-4"
      >
        <use :href="cryptoCurrencyMap[currencyCode]?.icon" />
      </svg>
    </template>
    <span class="truncate font-semibold leading-none">
      <span v-if="(normalizedAmount < 0 || amount < 0) && displayInfiatEnabled">(</span><template v-if="currencyCode !== ''">
        {{
          displayInfiatEnabled
            ? ((activeFiatCode === 'USD' && normalizedAmount)
              ? `$${Math.abs(normalizedAmount)?.toFixed(2)}`
              : displayFiatAmount(asCurrentAmount(Math.abs(amount), currencyCode)))
            : amount?.toFixed(8)
        }}
      </template>
      <template v-else>
        {{
          displayInfiatEnabled
            ? ((activeFiatCode === 'USD' && normalizedAmount)
              ? `$${Math.abs(normalizedAmount).toFixed(2)}`
              : displayFiatAmount(Math.abs(amount)))
            : currencyAmount.toFixed(8)
        }}
      </template><span v-if="(normalizedAmount < 0 || amount < 0) && displayInfiatEnabled">)</span>
    </span>
    <template v-if="!front">
      <UIcon
        v-if="cryptoCurrencyMap[currencyCode]?.iconType === 'ui'"
        :name="cryptoCurrencyMap[currencyCode]?.icon || ''"
        class="w-4 h-4 min-w-4 min-h-4"
      />
      <svg
        v-else-if="cryptoCurrencyMap[currencyCode]?.iconType === 'symbol'"
        class="w-4 h-4 min-w-4 min-h-4"
      >
        <use :href="cryptoCurrencyMap[currencyCode].icon || ''" />
      </svg>
      <UAvatar
        v-else-if="cryptoCurrencyMap[currencyCode]?.iconType === 'logo'"
        :src="cryptoCurrencyMap[currencyCode]?.icon || ''"
        :alt="currencyCode"
        class="w-4 h-4 min-w-4 min-h-4 rounded-full"
        img-class="w-4 h-4"
        size="sm"
      />
      <svg
        v-else
        class="w-4 h-4 min-w-4 min-h-4"
      >
        <use :href="cryptoCurrencyMap[currencyCode]?.icon" />
      </svg>
    </template>
  </span>
</template>
