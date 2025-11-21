<script lang="ts" setup>
const {
  modelValue = false,
  rect = '16px',
  error = false
} = defineProps<{
  modelValue: boolean;
  rect?: string;
  error?: boolean;
}>()

const checked = computed<boolean>(() => modelValue)
</script>
<template>
  <span
    :class="{
      'bg-primary border-primary': checked && !error,
      'border-paragraph': !checked,
      'border-red-600': error,
    }"
    :style="{
      width: `${rect}`,
      height: `${rect}`,
    }"
    class="relative rounded border border-solid transition-all duration-200 ease-in-out w-4 h-4 before:bg-primary"
  >
    <svg
      class="svg absolute top-[15%] right-[10%]"
      viewBox="0 0 135 110"
    >
      <path
        :class="{
          'check': checked,
          'stroke-0 fill-none': !checked
        }"
        d="M126.8,14L55.7,85.1L29.2,63.4"
      />
    </svg>
  </span>
</template>
<style scoped>
.svg .check {
  stroke: white;
  fill: none;
  stroke-width: 12;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
  animation: checkSign 0.4s linear forwards;
}

@keyframes check {
  50% {
    transform: scale(1.2);
  }
}

@keyframes draw {
  0% {
    stroke-dashoffset: -400;
  }
  100% {
    stroke-dashoffset: 400;
  }
}

@keyframes checkSign {
  0% {
    stroke-dashoffset: -400;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>
