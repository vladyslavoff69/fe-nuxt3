<script lang="ts" setup>
const props = defineProps<{
  value: number;
  status?: string;
  transactionId?: string;
}>()
</script>

<template>
  <div class="result-number relative w-full h-11 flex items-center">
    <div
      :style="{left: `${props.value}%`}"
      class="absolute w-16 h-11 -translate-x-1/2 transition flex items-end justify-center"
    >
      <div
        class="
          rotate-45 absolute left-1/2 -translate-x-1/2 top-1 w-4 h-4
          rounded-md bg-paragraph bg-clip-padding
        "
      />
      <p
        :class="{
          'text-paragraph': props.status === 'draw',
          'text-primary': props.status === 'won' || props.transactionId === '0',
          'text-red-600': !(props.status === 'draw' || props.status === 'won' || props.transactionId === '0')
        }"
        class="items-baseline transition-all item-center text-sm font-bold"
      >
        {{ props.value?.toFixed(2) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.transition {
  transition-property: left;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
}
</style>
