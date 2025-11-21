<script lang="ts" setup>
import { useDragHandler, useSliderLine } from './composables'
import { roundNumberByStep } from './utils'

const {
  modelValue,
  min = 0,
  max = 100,
  step = 1,
} = defineProps<{
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
}>()

const emits =
  defineEmits<{
    (e: 'update:modelValue', value: number): void;
  }>()
const localValue = ref<number>(modelValue)
const processPercent = computed<number>(() => {
  const percent: number =
    localValue.value > 100 ? 100 : localValue.value < 0 ? 0 : localValue.value
  return percent / (max + min)
})
const elRef = ref<HTMLDivElement | null>(null)

const { width: elWidth } = useElementRect(elRef)
const { clickOnLine } = useSliderLine({
  lineElementRef: elRef,
  onChange (processX, { event }) {
    const value = calculateValueByProcessX(processX)
    localValue.value = value
    emits('update:modelValue', value)
    startDrag(event, elWidth.value * processPercent.value)
  },
})

const { startDrag } = useDragHandler({
  onChange (processX) {
    const value = calculateValueByProcessX(processX)
    localValue.value = value
    emits('update:modelValue', value)
  },
})

const calculateValueByProcessX = (processX: number): number => {
  const validProcessX = Math.max(Math.min(elWidth.value, processX), 0)
  const process = validProcessX / elWidth.value
  return (
    min + roundNumberByStep((max - min) * process, step)
  )
}

watch(
  () => modelValue,
  (value) => {
    localValue.value = value
  }
)
</script>

<template>
  <div class="RangeSlider">
    <!-- slider rail -->
    <div
      ref="elRef"
      class="relative cursor-pointer"
      @mousedown="clickOnLine($event)"
    >
      <!-- slider base -->
      <div>
        <slot />
      </div>
      <!-- slider process -->
      <div
        :style="{ width: `${processPercent * 100}%` }"
        class="absolute left-0 top-0 h-full"
      >
        <slot name="process" />
      </div>
      <!-- slider dot -->
      <div
        :style="{ left: `${processPercent * 100}%` }"
        class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
        @mousedown="startDrag($event, elWidth * processPercent)"
        @touchstart="startDrag($event, elWidth * processPercent)"
      >
        <slot name="dot" />
      </div>
    </div>
  </div>
</template>
