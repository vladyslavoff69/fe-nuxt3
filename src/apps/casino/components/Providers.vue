<script lang="ts" setup>
import GameProviderCard from '~/components/molecules/card/GameProviderCard.vue'
import { HOME_PROVIDERS_ICON } from '~/components/symbols/casino-home'
import SortBySelect from '~/components/molecules/selects/SortBySelect.vue'
import SkeletonGameProviderCard from '~/components/molecules/skeletons/SkeletonGameProviderCard.vue'
import { SORT_OPTIONS, THEME } from '~/constants'
import { NEWEST, POPULAR, providerOrderByMaps } from '~/apps/casino/constants'
import { useGameProvider } from '~/composables/game/useGameProvider'

const { t } = useI18n()
const sortBy = ref(POPULAR)
const { screen } = inject(THEME)!
const cLen = computed(() => (screen.value.lg ? 8 : (screen.value.md ? 4 : 3)))
const sortOptions = computed(() => (SORT_OPTIONS.filter(item => item.value !== NEWEST)))
const {
  gameProvidersLoading,
  gameProviders,
  gameProvidersLoad,
  gameProvidersRefetch,
} = useGameProvider({
  orderBy: [providerOrderByMaps[sortBy.value]]
})

watch(
  () => sortBy.value,
  (_sortBy) => {
    gameProvidersRefetch({
      orderBy: [providerOrderByMaps[_sortBy]]
    })
  },
)

onMounted(() => {
  gameProvidersLoad()
})
</script>

<template>
  <div
    class="flex flex-col gap-y-2 md:gap-y-6"
  >
    <div class="flex flex-1 items-center">
      <div
        class="
          flex-1 flex items-center text-white
          gap-x-2 xs:gap-x-3 md:gap-x-4 h-full
        "
      >
        <svg class="w-5 h-5 min-w-5 min-h-5 xs:w-6 xs:h-6 text-white">
          <use :href="HOME_PROVIDERS_ICON" />
        </svg>
        <span
          class="text-white text-lg font-bold leading-normal"
        >
          {{ t('casino.providers') }}
        </span>
      </div>
      <div>
        <SortBySelect
          v-model="sortBy"
          :options="sortOptions"
        />
      </div>
    </div>
    <div class="grid grid-cols-3 gap-1.5 md:flex md:flex-wrap md:gap-2">
      <template v-if="gameProvidersLoading">
        <SkeletonGameProviderCard
          v-for="cardIdx in cLen"
          :key="`casino-game-skeleton-${cardIdx}`"
        />
      </template>
      <template v-else>
        <template v-if="gameProviders?.length > 0">
          <GameProviderCard
            v-for="(p, pInd) in gameProviders"
            :key="`casino-provider-card-${pInd}-${p?.id}`"
            :game-provider="p"
            class="col-span-1"
          />
        </template>
        <template v-else>
          <div class="text-paragraph text-xs">
            {{ t('casino.no-registered-providers') }}
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
