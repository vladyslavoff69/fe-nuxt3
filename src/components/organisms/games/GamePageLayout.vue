<script lang="ts" setup>
import GameDetailsFooter from '~/components/organisms/games/GameDetailsFooter.vue'
import GameTable from '~/apps/casino/components/GameTable.vue'
</script>

<template>
  <div class="flex flex-col gap-4 lg:gap-5 game-page-layout">
    <div class="flex flex-col gap-4 lg:gap-5">
      <div class="w-full h-full">
        <slot />
      </div>

      <GameDetailsFooter />
    </div>

    <GameTable />
  </div>
</template>
