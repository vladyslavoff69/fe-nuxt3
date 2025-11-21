<script lang="ts" setup>
import { WHEEL_GAME } from '~/apps/wheel/constants'

const { value } = defineProps<{
  value: number
}>()

const { selectedDistribution } = inject(WHEEL_GAME)!
</script>

<template>
  <div class="ResultNumber relative mx-2.5 flex h-14 items-center justify-center md:mx-5">
    <h5
      class="text-3xl font-bold md:text-4xl lg:text-5xl"
      :class="{
        'animate-scale-down text-ash': selectedDistribution?.multiplicationFactor < 1,
        'animate-scale-center': selectedDistribution?.multiplicationFactor >= 1,
      }"
      :style="selectedDistribution?.multiplicationFactor >= 1 ? { color: selectedDistribution?.color } : {}"
    >
      {{ selectedDistribution?.multiplicationFactor?.toFixed(2) }}×
    </h5>
  </div>
</template>

<style scoped lang="scss">
.ResultNumber {
  @keyframes scaleIn {
    0% {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes scaleOut {
    0% {
      transform: scale(1.2);
    }
    to {
      transform: scale(1);
    }
  }

  .animate-scale-center {
    animation: scaleIn 0.25s cubic-bezier(0, 0.47, 0.29, 1.26) both;
  }

  .animate-scale-down {
    animation: scaleOut 0.25s cubic-bezier(0, 0.47, 0.29, 1.26) both;
  }
}
</style>
