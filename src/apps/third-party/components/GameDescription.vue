<script lang="ts" setup>
import { THIRD_PARTY_GAME } from '~/apps/third-party/constants'

const { game } = inject(THIRD_PARTY_GAME)!
const { t } = useI18n()
</script>

<template>
  <div class="game-description w-full h-full">
    <div
      v-if="game"
      class="w-full h-full flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4"
    >
      <div
        v-if="game?.image"
        class="flex flex-col gap-y-2 w-full lg:w-28 min-w-28 h-full items-start md:items-center justify-start"
      >
        <NuxtImg
          :src="game.image"
          class="w-28 h-36 rounded-md"
          loading="lazy"
          alt="Junglebet.com"
        />

        <UBadge
          class="w-28 text-center flex justify-center uppercase leading-normal text-xxs md:text-xs p-1"
          color="primary"
          size="md"
          variant="solid"
        >
          <span class="text-white font-semibold">
            {{ t('games.edge') }}: {{ game.house_edge }}%
          </span>
        </UBadge>
      </div>
      <div
        class="text-sm text-paragraph w-full description-section"
        v-html="game.description"
      />
    </div>
    <div v-else>
      No data exists
    </div>
  </div>
</template>

<style lang="scss">
.description-section {
  h1, h2, h3 {
    font-weight: bold;
    color: #ffffff;
    line-height: 1.5;
    margin-top: 0.5rem;
  }

  h1 {
    font-size: 1.25rem;
  }

  h2 {
    font-size: 1rem;
  }

  ul {
    list-style: disc;
    padding-left: 2rem;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 0.5rem;
  }
}
</style>
