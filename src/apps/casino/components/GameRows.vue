<script lang="ts" setup>
import type { Game, ID } from '~/types'
import { THEME } from '~/constants'
import SkeletonCasinoCard from '~/components/molecules/skeletons/SkeletonCasinoCard.vue'
import CasinoCard from '~/components/molecules/card/CasinoCard.vue'
import GameImage from '~/components/molecules/game/GameImage.vue'

const {
  loading = false,
  noDataPlaceholder = '',
  searchId = false,
} = defineProps<{
  loading?: boolean;
  games: Game[];
  noDataPlaceholder?: string;
  searchId?: boolean;
}>()

const emits = defineEmits<{
  (e: 'searchGame', value: ID): void;
}>()

const { t } = useI18n()
const { screen } = inject(THEME)!
const cLen = computed(() => screen.value.lg ? 8 : (screen.value.md ? 4 : 3))

const searchResult = (id: ID) => {
  emits('searchGame', id)
}
</script>

<template>
  <div
    v-if="!loading && games?.length < 1"
    class="text-paragraph text-xs"
  >
    {{ noDataPlaceholder !== '' ? noDataPlaceholder : t('casino.no-registered-games') }}
  </div>
  <UPageColumns v-else>
    <template v-if="loading && games?.length < 1">
      <SkeletonCasinoCard
        v-for="i in cLen"
        :key="`casino-game-rows-${i}`"
        size-class="w-full"
      />
    </template>
    <template v-else-if="games?.length > 0">
      <CasinoCard
        v-for="(card, cdx) in games"
        :key="`${cdx}_${card.slug}-game-rows-slug`"
        :game="card"
        :is-hoverable="screen.lg"
        :search-id="searchId"
        :title="card?.title"
        size-class="w-full"
        @search-game="searchResult"
      >
        <template #img>
          <GameImage :game="card" />
        </template>
      </CasinoCard>
    </template>
  </UPageColumns>
</template>
