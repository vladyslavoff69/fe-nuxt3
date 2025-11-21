<script lang="ts" setup>
import TopBanner from '~/components/pages/home/TopBanner.vue';
import GameTable from '~/apps/casino/components/GameTable.vue';
import LazyCasinoNavigation from '~/components/pages/home/CasinoNavigation.vue';
import LazyCasinoHome from '~/pages/casino/home/index.vue';
import type { GameCategory } from '~/types';
import { CASINO_CATEGORIES_QUERY } from '~/apps/casino/graphql';
import { CASINO_HOME, orderByMaps } from '~/apps/casino/constants';

const localePath = useLocalePath()
const selTab = ref(localePath('/'))

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
</script>

<template>
  <UPage class="w-full pt-4 md:pt-5 pl-1.5 pr-2.5 md:pl-0 md:pr-0">
    <div class="grid w-full grid-cols-1 gap-y-6 sm:gap-y-7 md:gap-y-8">
      <ClientOnly>
        <TopBanner />
      </ClientOnly>

      <div
        ref="pageParent"
        class="w-full"
      >
        <div class="grid w-full grid-cols-1 gap-y-3 md:gap-y-4 lg:gap-y-6">
          <DelayHydration>
            <LazyCasinoNavigation
              hydrate-on-visible
              @sel-home-tab="v => selTab = v"
            />
          </DelayHydration>

          <div
            ref="pageParent"
            class="w-full"
          >
            <DelayHydration>
              <LazyCasinoHome hydrate-on-visible />
            </DelayHydration>
          </div>
        </div>
      </div>

      <ClientOnly>
        <GameTable :all-bets-first="true" />
      </ClientOnly>
    </div>
  </UPage>
</template>
