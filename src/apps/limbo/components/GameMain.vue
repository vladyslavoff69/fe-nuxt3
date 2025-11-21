<script lang="ts" setup>
import { LIMBO_GAME } from '~/apps/limbo/constants'
import { GAME } from '~/constants'
import { useIncreasingNumber } from '~/apps/limbo/composables'
import Calculator from '~/apps/limbo/components/Calculator.vue'

const { instantMode } = inject(GAME)!
const { isIdle, targetValue, resultNumber, betLoading } = inject(LIMBO_GAME)!
const { play: soundCounter, onEnd } = useAudio('/assets/audio/game/tick.mp3')
const { play: soundWin } = useAudio('/assets/audio/game/win.mp3')
const { current } = useIncreasingNumber(computed(() => betLoading.value ? 1 : resultNumber.value), { instantMode })
const currentColor = computed(() => {
  if (current.value > targetValue.value) {
    return '#259F4F'
  }
  if (current.value < targetValue.value && current.value === resultNumber.value && current.value !== 1) {
    return '#FF512F'
  }
  return '#FFFFFF'
})

watch(() => resultNumber.value, (v) => {
  if (instantMode.value) {
    if (resultNumber.value >= targetValue.value) {
      soundWin()
    }

    return
  }

  if (v) {
    soundCounter()
  }
})

onEnd(() => {
  if (resultNumber.value >= targetValue.value) {
    soundWin()
  }
})

const handleUpdateModel = () => {
  current.value = 1
}
</script>

<template>
  <div class="GameMain h-full flex flex-col items-center">
    <div class="flex-1 w-full max-w-(--breakpoint-pane-main)">
      <div
        class="
          flex flex-col h-full justify-center items-center min-h-(--breakpoint-pane-main-xs)
        "
      >
        <span
          :style="{
            color: currentColor,
            fontVariantNumeric: 'tabular-nums'
          }"
          class="text-6xl lg:text-9xl font-bold flex gap-x-0"
        >
          <span>{{ current.toFixed(2) }}</span>
          <span class="flex-none p-0 m-0 leading-tight">&times;</span>
        </span>
      </div>
    </div>
    <div class="flex-none w-full">
      <Calculator
        v-model="targetValue"
        :lock="!isIdle"
        @update:model-value="handleUpdateModel"
      />
    </div>
  </div>
</template>
