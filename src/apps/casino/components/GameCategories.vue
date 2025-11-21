<script lang="ts" setup>
import { CASINO_HOME } from '~/apps/casino/constants'
import GameCategoryCard from '~/components/molecules/card/GameCategoryCard.vue';
import SkeletonGameProviderCard from '~/components/molecules/skeletons/SkeletonGameProviderCard.vue';
import { THEME } from '~/constants';

const { t } = useI18n()
const { screen } = inject(THEME)!
const cLen = computed(() => (screen.value.lg ? 8 : (screen.value.md ? 4 : 3)))
const { gameCategories, categoriesLoading } = inject(CASINO_HOME)!
const gameCategoriesList = computed(() => gameCategories.value?.filter(gc => gc.enabled) || [])
</script>

<template>
  <div
    class="flex flex-col gap-y-2 md:gap-y-6"
  >
    <div class="flex-1 flex items-center text-white gap-x-2 h-full">
      <UIcon
        class="w-5 h-5 min-w-5 min-h-5 xs:w-6 xs:h-6 text-white"
        name="material-symbols:category"
      />
      <span
        class="text-white text-lg font-bold leading-normal"
      >
        {{ t('games.categories') }}
      </span>
    </div>
    <div class="grid grid-cols-3 gap-1.5 md:flex md:flex-wrap md:gap-2">
      <template v-if="categoriesLoading">
        <SkeletonGameProviderCard
          v-for="cardIdx in cLen"
          :key="`casino-game-skeleton-${cardIdx}`"
        />
      </template>
      <template v-else-if="gameCategoriesList?.length > 0">
        <template
          v-for="(p, pInd) in gameCategoriesList"
          :key="`casino-cateory-card-${pInd}-${p?.id}`"
        >
          <GameCategoryCard
            v-if="p.name"
            class="col-span-1"
            :game-category="p"
          />
        </template>
      </template>
      <template v-else>
        <div class="text-paragraph text-xs">
          {{ t('base.no-data') }}
        </div>
      </template>
    </div>
  </div>
</template>
