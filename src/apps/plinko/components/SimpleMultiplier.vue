<script lang="ts" setup>
import { buttonBackgrounds, buttonShadows } from '~/apps/plinko/constants'

const props = defineProps<{
  m: number;
  mItem: number;
  result: number;
  selectedRow: number;
  maxBooster: 'default' | 'left' | 'right';
}>()

const backgrounds = (m: number) => {
  if (props.selectedRow % 2 === 0) {
    return (Math.floor(props.selectedRow / 2) >= m ? (Math.floor(props.selectedRow / 2) - m) : (m - Math.floor(props.selectedRow / 2)))
  } else {
    if (Math.floor(props.selectedRow / 2) >= m) {
      return Math.floor(props.selectedRow / 2) - m
    }

    return m - Math.ceil(props.selectedRow / 2)
  }
}

const buttonBg = (m: number) => {
  if (props.maxBooster !== 'default') {
    if ((props.maxBooster === 'left' && m === 0) || (props.maxBooster === 'right' && m === props.selectedRow)) {
      return 'bg-primary text-white!'
    }
  }

  return buttonBackgrounds[backgrounds(m)]
}

const buttonShadow = (m: number) => {
  if (props.maxBooster !== 'default') {
    if ((props.maxBooster === 'left' && m === 0) || (props.maxBooster === 'right' && m === props.selectedRow)) {
      return 'shadow-plinko-primary'
    }
  }

  return buttonShadows[backgrounds(m)]
}
</script>

<template>
  <div class="w-full flex items-center justify-center">
    <div
      :id="`multiplier-${m}`"
      class="
        multiplier-node h-7 flex items-center justify-center shadow-sm
        ease-[cubic-bezier(.18,.89,.32,1.28)] border-0 ring-0 focus:ring-0 focus:outline-0
        rounded-md text-brand text-[8px] transform w-full max-w-7 min-w-4
      "
      :class="[
        `multiplier-${m}`,
        buttonBg(m),
        buttonShadow(m),
        {'translate-y-2': m === result}
      ]"
    >
      {{ mItem }}
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
