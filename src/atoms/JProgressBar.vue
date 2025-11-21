<script lang="ts" setup>
const {
  color = 'bg-transparent',
  max = 1,
  value = 0,
} = defineProps<{
  max: number;
  value: number;
  color?: string
}>()

const width = computed(() => (value / max) * 100)
</script>
<template>
  <div class="flex h-4 md:h-5 bg-green-950 rounded-full">
    <div
      :class="[color]"
      :style="{ width: `${width}%` }"
      class="flex h-full rounded-[inherit] transition duration-200 ease-in-out"
    >
      <slot />
    </div>
  </div>
</template>
