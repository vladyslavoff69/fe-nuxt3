<script lang="ts" setup>
import { LOADING_ICON } from '~/components/symbols'
import ResultNumber from '~/apps/dice/components/ResultNumber.vue'
import DiceRangeSlider from '~/apps/dice/components/DiceRangeSlider.vue'

const {
  clientSeed = '',
  serverSeed = '',
  nonce = 0,
} = defineProps<{
  clientSeed?: string;
  serverSeed?: string;
  nonce?: number;
}>()

const { t } = useI18n()
const { loading, result, verified } = useVerifyFairness({
  serverSeed: computed(() => serverSeed),
  clientSeed: computed(() => clientSeed),
  nonce: computed(() => nonce),
  count: computed(() => 1),
  range: [0, 100]
})

const verifyResult = computed<number>(() => Number(result.value?.[0] || 50))
</script>

<template>
  <div class="VerifyDice flex items-center justify-center text-center w-full min-h-20 bg-green-950 rounded-md">
    <div
      v-if="verified"
      class="w-full relative flex items-center justify-center flex-col"
    >
      <div class="pointer-events-none w-full">
        <DiceRangeSlider
          :model-value="50"
          :result="true"
        />
      </div>
      <div class="w-full px-3">
        <ResultNumber
          :value="Number(verifyResult.toFixed(2))"
          transaction-id="0"
        />
      </div>
    </div>
    <div
      v-else-if="loading"
      class="flex items-center justify-center h-12"
    >
      <svg
        class="animate-spin w-4 h-4 text-border"
      >
        <use :href="LOADING_ICON" />
      </svg>
    </div>
    <div
      v-else
      class="flex items-center justify-center text-center h-12"
    >
      {{ t('notifications.complete-all-input-desc') }}
    </div>
  </div>
</template>
