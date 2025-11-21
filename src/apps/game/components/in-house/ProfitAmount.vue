<script lang="ts" setup>
import LBitcoinInput from '~/components/molecules/inputs/LBitcoinInput.vue'
import { CURRENCY } from '~/constants'

const props = defineProps<{
  profitAmount: number;
}>()

const { t } = useI18n()
const { asCurrentAmount, asOtherAmount, displayOtherAmount } = inject(CURRENCY)!
</script>

<template>
  <div class="w-full flex flex-col gap-y-1">
    <div class="flex items-center justify-between text-sm font-bold leading-none">
      <span>{{ t('games.profit-on-win') }}</span>
      <span>{{ displayOtherAmount(asOtherAmount(props.profitAmount)) }}</span>
    </div>

    <LBitcoinInput
      :model-value="asCurrentAmount(props.profitAmount)"
      class-name="h-10! rounded-md flex items-center pl-9 disabled:text-white"
      disabled
    />
  </div>
</template>
