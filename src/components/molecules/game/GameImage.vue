<script lang="ts" setup>
import type { Game } from '~/types'
import { findGameImage } from '~/utils'

const { game } = defineProps<{
  game: Game;
}>()
</script>

<template>
  <div
    v-if="game"
    class="w-full h-full bg-card-gradient flex items-center justify-center relative min-h-[150px]"
  >
    <NuxtImg
      v-if="game.image"
      :alt="`${game.title} by ${game.gameProvider?.display_name}`"
      :src="game.image"
      class="rounded-sm w-full h-full min-h-[150px]"
      loading="lazy"
    />
    <NuxtImg
      v-else-if="!!findGameImage(game.slug)"
      :alt="`${game.title} by ${game.gameProvider?.display_name}`"
      :src="findGameImage(game.slug)"
      class="rounded-sm w-full h-full min-h-[150px]"
      loading="lazy"
      provider="cloudflare"
    />
  </div>
</template>
