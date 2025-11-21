<script lang="ts" setup>
import type { Distribution } from '~/apps/game/types'
import Calculator from '~/apps/wheel/components/Calculator.vue'

const props = defineProps<{
  betAmount: number
  segment: number | string
  risk: number | string
  selectedMultiplicationFactor: number
  distribution: Distribution[]
  segmentsCount: number
  hiddenTooltip?: boolean
  tileClass?: string
}>()

const hoveredIndex = ref<number>(-1)

const handleMouseEnter = (ind: number) => {
  if (!props.hiddenTooltip) {
    hoveredIndex.value = ind
  }
}

const handleMouseLeave = () => {
  if (!props.hiddenTooltip) {
    hoveredIndex.value = -1
  }
}
</script>

<template>
  <div class="WheelPayout grid w-full grid-flow-col grid-rows-1 gap-1 md:gap-2 z-101 md:w-[80%] md:mx-auto">
    <template
      v-for="({ multiplicationFactor, color, chances }, index) in distribution"
      :key="index"
    >
      <UTooltip
        :content="{ side: 'top' }"
        arrow
        class="w-full md:w-auto z-101 group"
      >
        <template #content>
          <Calculator
            :bet-amount="betAmount"
            :multiplier="multiplicationFactor"
            :chance="`${chances} / ${segmentsCount}`"
          />
        </template>
        <div
          class="relative flex cursor-help items-center justify-center rounded-md py-2 font-semibold text-white md:py-3 w-full"
          :class="[
             multiplicationFactor === selectedMultiplicationFactor || hoveredIndex === index ? 'z-10' : 'z-0'
          ]"
          :style="`--color: ${color}`"
          @mouseenter="() => handleMouseEnter(index)"
          @mouseleave="handleMouseLeave"
        >
          <div class="absolute inset-0 z-30 overflow-hidden rounded-md">
            <span
              class="absolute inset-0 z-10 flex origin-bottom items-center justify-center bg-(--color) transition-all duration-100"
              :class="{'border border-green-950': multiplicationFactor === 0}"
              :style="
                'clip-path: ' +
                  (multiplicationFactor === selectedMultiplicationFactor || hoveredIndex === index
                    ? 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
                    : 'polygon(0 calc(100% - 0.25rem), 100% calc(100% - 0.25rem), 100% 100%, 0% 100%)')
              "
            >
              <span
                :class="{
                  'text-green-950 font-bold': multiplicationFactor !== 0,
                }"
              >
                {{ multiplicationFactor.toFixed(2) }}×
              </span>
            </span>
          </div>
          <div class="relative z-20">
            <span>{{ multiplicationFactor.toFixed(2) }}×</span>
          </div>
          <i
            class="absolute inset-0 z-10 rounded-md bg-green-950"
            :class="tileClass"
          />
          <i
            class="absolute inset-0 z-0 rounded-md bg-(--color) transition-all duration-75 ease-[cubic-bezier(0,.4,0,1)]"
            :class="
              multiplicationFactor === selectedMultiplicationFactor || hoveredIndex === index
                ? 'animate-cash-center'
                : 'opacity-0'
            "
            style="animation-delay: 0.05s"
          />
        </div>
      </UTooltip>
    </template>
  </div>
</template>

<style scoped lang="scss">
.WheelPayout {
  @keyframes cashCenter {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }

    to {
      transform: scale(1.2);
      opacity: 0;
    }
  }

  .animate-cash-center {
    animation: cashCenter 1s cubic-bezier(0, 0.4, 0, 1) both;
  }
}
</style>
