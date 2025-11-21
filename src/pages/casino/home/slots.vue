<script lang="ts" setup>
import GameSections from '~/apps/casino/components/game-section/index.vue'
import { HOME_SLOTS_ICON } from '~/components/symbols/casino-home'
</script>

<template>
  <UPage class="w-full">
    <GameSections
      :category-row="{
        categorySlug: 'slots',
        title: 'Slots',
        icon: HOME_SLOTS_ICON
      }"
    />
  </UPage>
</template>
