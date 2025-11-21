<script lang="ts" setup>
import { GAME_SEARCH_QUERY } from '~/graphql'
import { CASINO_SUB_PAGE_GAMES_LIMIT, NEWEST, orderByMaps, POPULAR } from '~/apps/casino/constants'
import GameRows from '~/apps/casino/components/GameRows.vue'
import SortBySelect from '~/components/molecules/selects/SortBySelect.vue'
import { useGameProvider } from '~/composables/game/useGameProvider'
import { SORT_OPTIONS } from '~/constants'

const { categoryRow } = defineProps<{
  categoryRow: any;
}>()

const runtimeConfig = useRuntimeConfig()
const casinoOriginal = runtimeConfig.public?.casinoOriginal
const { t } = useI18n()
const selectedGameProvider = ref('')
const sortBy = ref(POPULAR)
const searchOptions = computed(() => ({
  first: CASINO_SUB_PAGE_GAMES_LIMIT,
  page: 1,
  orderBy: (categoryRow.categorySlug === 'new' ? [orderByMaps[NEWEST]] : [orderByMaps[sortBy.value]]),
  categorySlug: (categoryRow.categorySlug === 'new' ? '' : categoryRow.categorySlug),
  providerSlug: ''
}))

const { result, loading, load, fetchMore, refetch } = useLazyQuery(GAME_SEARCH_QUERY, searchOptions)
const {
  gameProviders,
  gameProvidersLoad,
} = useGameProvider({ categorySlug: categoryRow.categorySlug })
const paginatorInfo = computed(() => (result.value?.gameSearch?.paginatorInfo || {}))
const games = computed(() => (result.value?.gameSearch?.data || []))

const loadMore = () => {
  const _options = {
    ...searchOptions.value,
    page: paginatorInfo.value?.currentPage + 1,
  }

  fetchMore({
    variables: {
      ..._options,
    },
    updateQuery: (previousResult, { fetchMoreResult: { gameSearch } }) => {
      return {
        gameSearch: {
          paginatorInfo: {
            ...gameSearch.paginatorInfo,
          },
          data: [
            ...previousResult.gameSearch.data,
            ...(gameSearch?.data || []),
          ],
          __typename: gameSearch.__typename,
        },
      }
    },
  })
}

watch(
  () => [sortBy.value, selectedGameProvider.value],
  ([_sortBy, _gameProvider]) => {
    let options = {
      ...searchOptions.value,
      orderBy: [orderByMaps[_sortBy]],
    }

    if (_gameProvider) {
      options = {
        ...options,
        providerSlug: _gameProvider
      }
    }

    refetch(options)
  },
)

const formattedGameProviders = computed(() => gameProviders.value?.map((item: any) => ({
  label: item?.name,
  value: item?.slug,
})))

onMounted(() => {
  load()

  if (!([casinoOriginal, 'new'].includes(categoryRow.categorySlug))) {
    gameProvidersLoad()
  }
})
</script>

<template>
  <div class="grid gap-y-2 md:gap-y-4">
    <div class="flex flex-1 items-center">
      <div class="flex-1 flex items-center text-white gap-x-2 xs:gap-x-3 md:gap-x-4 h-full">
        <svg class="w-5 h-5 min-w-5 min-h-5 xs:w-6 xs:h-6 text-white">
          <use :href="categoryRow.icon" />
        </svg>
        <span class="text-white text-lg font-bold leading-normal">
          {{ categoryRow.title }}
        </span>
      </div>

      <div class="flex gap-x-1 md:gap-x-2">
        <SortBySelect
          v-if="categoryRow.categorySlug !== 'new'"
          v-model="sortBy"
          :options="SORT_OPTIONS"
        />

        <JSelect
          v-if="!([casinoOriginal, 'new'].includes(categoryRow.categorySlug))"
          v-model="selectedGameProvider"
          :classes="{
            ListboxButton: 'min-w-[100px] ml-auto rounded-md text-xs font-bold px-3 pr-1 py-2 lg:py-2',
            Placeholder: 'text-xs',
            LabelOptLabel: 'text-xs'
          }"
          :has-check-box="true"
          :options="formattedGameProviders"
          :placeholder="t('casino.providers')"
          class="hidden md:block"
        />
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
