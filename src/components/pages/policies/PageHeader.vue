<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<template>
  <h1 class="px-2 py-2 md:px-4 md:py-4 rounded-md bg-green-950 font-bold text-white text-xl md:text-2xl leading-normal">
    {{ title }}
  </h1>
</template>
