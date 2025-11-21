<script lang="ts" setup>
import { LOADING_ICON } from '~/components/symbols'
import type { Risk, Row } from '~/apps/game/types'
import SimpleMultiplier from '~/apps/plinko/components/SimpleMultiplier.vue'
import { COEFFICIENTS, LEFT_COEFFICIENTS, RIGHT_COEFFICIENTS } from '~/apps/plinko/constants'

const {
  clientSeed = '',
  serverSeed = '',
  nonce = 0,
  risk = 'high',
  rowsCount = 16,
  maxBooster = 'default'
} = defineProps<{
  clientSeed?: string;
  serverSeed?: string;
  nonce?: number;
  risk?: Risk;
  rowsCount: Row;
  maxBooster: 'default' | 'left' | 'right';
}>()

const { t } = useI18n()
const { loading, verified, result } = useVerifyFairness({
  serverSeed: computed(() => serverSeed),
  clientSeed: computed(() => clientSeed),
  nonce: computed(() => nonce),
  count: computed(() => rowsCount),
  additionalIndex: true,
})

/* Getting proper index after getting floats */
const verifyResult = computed(() => result.value.reduce(
  (partialSum, a) => Number(partialSum) + (Math.floor(Number(a) * 100) % 2 === 0 ? 0 : 1), 0) as number
)
const multipliers = computed(() => {
  return maxBooster === 'default'
    ? COEFFICIENTS[rowsCount][risk]
    : (maxBooster === 'left'
      ? LEFT_COEFFICIENTS[rowsCount][risk]
      : RIGHT_COEFFICIENTS[rowsCount][risk])
})
</script>

<template>
  <div class="VerifyKeno flex items-center justify-center text-center w-full min-h-20 bg-green-950 rounded-md">
    <div
      v-if="verified"
      class="mx-auto"
    >
      <div class="w-full flex justify-center items-center gap-0.5">
        <SimpleMultiplier
          v-for="(mItem, m) in multipliers"
          :key="m"
          :m="m"
          :m-item="mItem"
          :max-booster="maxBooster"
          :result="verifyResult"
          :selected-row="rowsCount"
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
