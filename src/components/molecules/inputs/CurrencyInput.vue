<script lang="ts" setup>
import { CURRENCY, PREFERENCE } from '~/constants'

defineOptions({
  inheritAttrs: false,
})

const { modelValue, lock = false } = defineProps<{
  lock?: boolean;
  modelValue: number | string;
  className?: string;
  endIcon?: string;
}>()

const emits = defineEmits<{
    (e: 'update:modelValue', value: number): void;
  }>()

const { currentCryptoCurrency, currentFiatCurrency, currentCryptoToFiat, asCurrentAmount } = inject(CURRENCY)!
const { displayInfiatEnabled, activeCryptoCode } = inject(PREFERENCE)!
const amountDisplayed = computed(() => asCurrentAmount(Number(modelValue)))
const toCrypto = (amount: number): number => {
  if (displayInfiatEnabled.value) {
    return amount / currentCryptoToFiat.value
  }
  return amount
}

const updateAmount = (val: number | string) => {
  if (Number(val) < 0) {
    val = 0
  }

  emits('update:modelValue', toCrypto(Number(val)))
}

watch(
  () => activeCryptoCode.value,
  async () => {
    emits('update:modelValue', 0)
  }
)
</script>
<template>
  <div class="relative">
    <JInputNumber
      :class-name="className"
      :end-icon="endIcon"
      :model-value="amountDisplayed"
      :lock="lock"
      :step="displayInfiatEnabled ? 0.01 : 0.00000001"
      :to-fixed="modelValue === 0 ? 0 : (displayInfiatEnabled ? 2 : 8)"
      placeholder="0.00000000"
      v-bind="$attrs"
      variant="none"
      @update:model-value="updateAmount"
    >
      <template #startIcon>
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
            <use :href="currentCryptoCurrency.icon || ''" />
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
    </JInputNumber>
  </div>
</template>
