<script lang="ts" setup>
import GameRows from '~/apps/casino/components/GameRows.vue'
import SortBySelect from '~/components/molecules/selects/SortBySelect.vue'
import { useGameProvider } from '~/composables/game/useGameProvider'
import { GAME_SEARCH_QUERY } from '~/graphql'
import { CASINO_SUB_PAGE_GAMES_LIMIT, orderByMaps, POPULAR } from '~/apps/casino/constants'
import { MAP_GAME_CATEGORIES, SORT_OPTIONS } from '~/constants'
import type { GameProvider } from '~/types'

const runtimeConfig = useRuntimeConfig()
const casinoOriginal = runtimeConfig.public?.casinoOriginal
const route = useRoute()
const { t } = useI18n()
const categorySlug = computed(() => route.params.slug ? String(route.params.slug) : '')
const selectedGameProvider = ref('')
const sortBy = ref(POPULAR)

const searchOptions = computed(() => ({
  first: CASINO_SUB_PAGE_GAMES_LIMIT,
  page: 1,
  orderBy: [orderByMaps[sortBy.value]],
  categorySlug: categorySlug.value,
  providerSlug: ''
}))

const category = computed(() => MAP_GAME_CATEGORIES[categorySlug.value])
const { result, loading, load, refetch, fetchMore } = useLazyQuery(GAME_SEARCH_QUERY, searchOptions)
const {
  gameProviders,
  gameProvidersLoad,
} = useGameProvider({
  categorySlug: categorySlug.value,
})

onMounted(() => {
  load()

  if (!([casinoOriginal, 'new-releases'].includes(categorySlug.value))) {
    gameProvidersLoad()
  }
})

const games = computed(() => {
  return (result.value?.gameSearch?.data || [])
})

watch(
  () => sortBy.value,
  (v) => {
    refetch({
      ...searchOptions.value,
      orderBy: [orderByMaps[v]]
    })
  },
)

watch(
  () => selectedGameProvider.value,
  (v) => {
    if (!([casinoOriginal, 'new-releases'].includes(categorySlug.value))) {
      refetch({
        ...searchOptions.value,
        providerSlug: v,
      })
    }
  },
)

const formattedGameProviders = computed(() => gameProviders.value?.map((item: GameProvider) => ({
  label: item.name,
  value: item.slug,
})))

const paginatorInfo = computed(() => {
  return result.value?.gameSearch?.paginatorInfo || {}
})

const loadMore = () => {
  fetchMore({
    variables: {
      ...({
        ...searchOptions.value,
        page: paginatorInfo.value?.currentPage + 1,
      }),
    },
    updateQuery: (previousResult, { fetchMoreResult: { gameSearch } }) => {
      return {
        gameSearch: {
          paginatorInfo: {
            ...gameSearch.paginatorInfo,
          },
          data: [
            ...previousResult.gameSearch.data,
            // eslint-disable-next-line no-unsafe-optional-chaining
            ...gameSearch?.data,
          ],
          __typename: gameSearch.__typename,
        },
      }
    },
  })
}
</script>

<template>
  <div
    class="flex flex-col gap-y-2 md:gap-y-4"
  >
    <div class="flex flex-1 items-center">
      <div class="flex-1 flex items-center text-white gap-x-2 xs:gap-x-3 md:gap-x-4 h-full">
        <svg
          v-if="category?.iconType && category.iconType === 'symbol'"
          class="w-5 h-5 min-w-5 min-h-5 xs:w-6 xs:h-6 text-white"
        >
          <use :href="category.icon" />
        </svg>
        <UIcon
          v-else-if="category?.iconType && category.iconType === 'ui'"
          :name="category?.icon || ''"
          class="w-5 h-5 min-w-5 min-h-5 xs:w-6 xs:h-6 text-white"
        />
        <span class="text-white text-lg font-bold leading-normal">
          {{ category?.label ? t(category.label) : '' }}
        </span>
      </div>
      <div class="flex gap-x-3">
        <SortBySelect
          v-model="sortBy"
          :options="SORT_OPTIONS"
        />
        <ClientOnly>
          <JSelect
            v-model="selectedGameProvider"
            :classes="{
              ListboxButton: 'min-w-[100px] ml-auto rounded-md text-xs font-bold px-3 pr-1 py-2 lg:py-2',
              Placeholder: 'text-xs',
              LabelOptLabel: 'text-xs'
            }"
            :has-check-box="false"
            :options="formattedGameProviders"
            :placeholder="t('casino.providers')"
          />
        </ClientOnly>
      </div>
    </div>
    <GameRows
      :games="games"
      :loading="loading"
    />
    <div
      v-if="games?.length"
      class="flex flex-col gap-y-2"
    >
      <div class="text-center text-sm">
        <span>Displaying {{ games?.length }} of {{ paginatorInfo.total }} games</span>
      </div>
      <div class="flex justify-center">
        <JButton
          v-if="paginatorInfo.hasMorePages"
          :loading="loading"
          class="px-5"
          variant="alternative"
          @click="loadMore"
        >
          {{ t('base.load-more') }}
        </JButton>
      </div>
    </div>
  </div>
</template>
