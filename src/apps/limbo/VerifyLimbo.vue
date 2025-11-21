<script lang="ts" setup>
import { LOADING_ICON } from '~/components/symbols'

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
const { loading, verified, first } = useVerifyFairness({
  serverSeed: computed(() => serverSeed),
  clientSeed: computed(() => clientSeed),
  nonce: computed(() => nonce),
  count: computed(() => 1),
})

const HOUSE_EDGE = 0.99
const verifyResult = computed<number>(() => Math.floor(HOUSE_EDGE / (Number(first.value) || 1) * 100) / 100)
</script>

<template>
  <div class="VerifyLimbo flex items-center justify-center text-center w-full min-h-20 bg-green-950 rounded-md">
    <div
      v-if="verified"
      :style="{fontVariantNumeric: 'tabular-nums'}"
      class="text-xl font-bold"
    >
      {{ verifyResult.toFixed(2) }}×
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
