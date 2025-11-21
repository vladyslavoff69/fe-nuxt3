<script lang="ts" setup>
import { BASE_CLOSE_ICON } from '~/icons'

</script>

<template>
  <JbBlankButton
    class="
      duration-150
      hover:transform
      hover:-rotate-90
      hover-transition-all
      hover:ease-in-out
      hover:text-white
    "
  >
    <span class="sr-only">close</span>
    <svg class="w-full h-full">
      <use :href="BASE_CLOSE_ICON" />
    </svg>
  </JbBlankButton>
</template>
