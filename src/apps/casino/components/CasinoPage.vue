<script lang="ts" setup>
import TopBanner from '~/components/pages/home/TopBanner.vue'
import GameTable from '~/apps/casino/components/GameTable.vue'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { CASINO_CATEGORIES_QUERY } from '~/apps/casino/graphql'
import { CASINO_HOME, orderByMaps } from '~/apps/casino/constants'
import type { GameCategory } from '~/types'

const {
  result: categoriesData,
  loading: categoriesLoading
} = useQuery<{
  gameCategories: GameCategory[];
}>(
  CASINO_CATEGORIES_QUERY,
  {
    gamesLimit: 20,
    orderBy: [orderByMaps.POPULAR],
  },
  {
    fetchPolicy: 'no-cache'
  }
)
const gameCategories = computed(() => categoriesData.value?.gameCategories || [])

provide(CASINO_HOME, {
  gameCategories,
  categoriesLoading
})

const [pageParent] = useAutoAnimate({
  duration: 100,
})
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-y-6 sm:gap-y-7 md:gap-y-8">
    <ClientOnly>
      <TopBanner />
    </ClientOnly>

    <div
      ref="pageParent"
      class="w-full"
    >
      <slot />
    </div>

    <ClientOnly>
      <GameTable :all-bets-first="true" />
    </ClientOnly>
  </div>
</template>
