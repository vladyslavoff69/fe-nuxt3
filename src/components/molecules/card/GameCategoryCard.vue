<script lang="ts" setup>
import type { GameCategory } from '~/types';

const { gameCategory } = defineProps<{
  gameCategory: GameCategory
}>()
</script>

<template>
  <div
    class="
      bg-green-950 max-w-[165px] w-full px-4 h-16 flex items-center justify-center
      rounded-md transition-all duration-200 hover:-translate-y-2 cursor-pointer
    "
  >
    <NuxtLinkLocale
      :to="`/casino/category/${gameCategory.slug}`"
      class="flex items-center w-full h-full justify-center"
    >
      <div class="font-bold text-white text-nowrap">
        {{ gameCategory.name }}
      </div>
    </NuxtLinkLocale>
  </div>
</template>
