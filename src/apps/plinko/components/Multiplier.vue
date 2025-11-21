<script lang="ts" setup>
import { buttonBackgrounds, buttonShadows, COEFFICIENTS, PLINKO_GAME, PLINKO_INIT } from '~/apps/plinko/constants'
import { CONTAINER } from '~/constants'
import Calculator from '~/apps/plinko/components/Calculator.vue'

defineProps<{
  m: number;
  mItem: number;
}>()

const { pinSize, pressed, history, selectedRow, maxBooster } = inject(PLINKO_GAME)!
const { containerScreen } = inject(CONTAINER)!

const chances = computed(() => COEFFICIENTS[selectedRow.value].chances)

const backgrounds = (m: number) => {
  if (selectedRow.value % 2 === 0) {
    return (Math.floor(selectedRow.value / 2) >= m ? (Math.floor(selectedRow.value / 2) - m) : (m - Math.floor(selectedRow.value / 2)))
  } else {
    return Math.floor(selectedRow.value / 2) >= m ? (Math.floor(selectedRow.value / 2) - m) : (m - Math.ceil(selectedRow.value / 2))
  }
}

const buttonBg = (m: number) => {
  if (maxBooster.value !== 'default') {
    if ((maxBooster.value === 'left' && m === 0) || (maxBooster.value === 'right' && m === selectedRow.value)) {
      return 'bg-primary text-white!'
    }
  }

  return buttonBackgrounds[backgrounds(m)]
}

const buttonShadow = (m: number) => {
  if (maxBooster.value !== 'default') {
    if ((maxBooster.value === 'left' && m === 0) || (maxBooster.value === 'right' && m === selectedRow.value)) {
      return 'shadow-plinko-primary'
    }
  }

  return buttonShadows[backgrounds(m)]
}

const pressedIndexes = ref<number[]>([])
const isPressed = computed(() => {
  return (index: number) => pressedIndexes.value.includes(index)
})

watch(
  history,
  () => {
    const index = pressed.value
    if (!pressedIndexes.value.includes(index)) {
      pressedIndexes.value.push(index)
      useTimeoutFn(() => {
        pressedIndexes.value = pressedIndexes.value.filter(
          i => i !== index
        )
      }, 350)
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="w-full flex items-center justify-center">
    <div class="cursor-help w-full">
      <UTooltip
        :content="{ side: 'top' }"
        arrow
        class="w-full"
      >
        <template #content>
          <Calculator
            :chance="chances[m]"
            :multiplier="mItem"
            class="lg:min-w-[410px]"
          />
        </template>
        <div
          :id="`multiplier-${m}`"
          class="
            multiplier-node h-7 flex items-center justify-center shadow-sm ease-[cubic-bezier(.18,.89,.32,1.28)]
            border-0 ring-0 focus:ring-0 focus:outline-0 rounded text-brand text-[8px] lg:text-xs font-bold
            transform w-full duration-300
          "
          :class="[
            `multiplier-${m}`,
            buttonBg(m),
            buttonShadow(m),
            {'pressed': isPressed(m)}
          ]"
          :style="{
            maxWidth: `${containerScreen.md ? ((PLINKO_INIT.width - pinSize) / (selectedRow + 1) - pinSize) : 32}px`
          }"
        >
          {{ mItem }}
        </div>
      </UTooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.multiplier-node {
  &.pressed {
    animation: press 0.15s;
  }

  @keyframes press {
    0%,
    to {
      transform: translate(0);
    }

    50% {
      transform: translateY(30%);
    }
  }
}
</style>
