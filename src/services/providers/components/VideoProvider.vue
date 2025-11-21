<script lang="ts" setup>
import { VIDEO_STACK } from '~/constants'

const pausedTime = ref<number>(0)
provide(VIDEO_STACK, {
  pausedTime
})
</script>

<template>
  <div class="h-full">
    <slot />
  </div>
</template>
