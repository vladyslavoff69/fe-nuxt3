<script lang="ts" setup>
import { LOADING_ICON } from '~/components/symbols'
import WheelPreview from '~/apps/wheel/components/WheelPreview.vue'
import { SEGMENTS } from '~/apps/wheel/constants'

const {
  clientSeed = '',
  serverSeed = '',
  nonce = 0,
  risk = 'low',
  segment = 10,
} = defineProps<{
  clientSeed?: string
  serverSeed?: string
  nonce?: number
  risk: string
  segment: number
}>()

const { t } = useI18n()
const segmentVal = computed(() => segment)
const { loading, result, verified } = useVerifyFairness({
  serverSeed: computed(() => serverSeed),
  clientSeed: computed(() => clientSeed),
  nonce: computed(() => nonce),
  count: computed(() => 1),
  range: [1, segmentVal.value],
  isGenerateIntegers: true,
  additionalIndex: true
})
const verifyResult = computed<number>(() => Number(result.value?.[0]))
const riskValue = computed(() => risk)
const showPreview = ref(true)
const segmentData = computed(() => SEGMENTS.find(s => s.number === segmentVal.value))
const segmentRisk = computed(() => segmentData.value?.risks?.[riskValue.value])
const selectedOrder = computed(() => segmentRisk.value?.order?.[(verifyResult.value - 1)])
const resultValue = computed(() => (segmentRisk.value?.distribution?.[selectedOrder.value || 0]?.multiplicationFactor))
const segmentSize = computed(() => (360 / (segmentRisk.value?.order?.length || 1)))
const targetRotation = computed(() => (segmentSize.value * verifyResult.value - (Math.floor(Math.random() * segmentSize.value))))
const segmentNumbers = { 10: 0, 20: 1, 30: 2, 40: 3, 50: 4 }

watch(() => [risk, segment, result.value, nonce], (v) => {
  showPreview.value = false

  nextTick(() => {
    showPreview.value = true
  })
}, { immediate: true })
</script>

<template>
  <div class="VerifyWheel flex items-center justify-center text-center w-full min-h-20 bg-green-950 rounded-md">
    <div
      v-if="verified"
      class="w-full flex items-center justify-center"
    >
      <ClientOnly>
        <WheelPreview
          v-if="showPreview"
          :risk="riskValue"
          :segment="segmentNumbers[segmentVal]"
          :segment-result-angle="targetRotation"
          :selected-multiplication-factor="resultValue"
          :sel-segment="verifyResult"
        />
      </ClientOnly>
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
