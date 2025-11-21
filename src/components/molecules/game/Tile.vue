<script lang="ts" setup>

const {
  selected = false,
} = defineProps<{
  selected?: boolean;
}>()
</script>
<template>
  <button
    class="block group relative bg-border rounded-md w-full pt-[100%]"
    style="box-shadow: 0 4.117px 0 0 #152F15;"
    type="button"
  >
    <span
      v-if="selected"
      class="absolute z-10 inset-0 flex items-center justify-center rounded-md bg-primary"
    >
      <span
        class="w-full h-full"
      />
    </span>
  </button>
</template>
