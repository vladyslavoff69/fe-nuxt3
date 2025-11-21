<script lang="ts" setup>
import GameRows from '~/apps/casino/components/GameRows.vue'
import SortBySelect from '~/components/molecules/selects/SortBySelect.vue'
import CasinoPage from '~/apps/casino/components/CasinoPage.vue'
import SearchPopper from '~/apps/casino/components/details/SearchPopper.vue'
import { GAME_PROVIDER_QUERY, GAME_SEARCH_QUERY } from '~/graphql'
import { CASINO_SUB_PAGE_GAMES_LIMIT, POPULAR, providerOrderByMaps } from '~/apps/casino/constants'
import { SORT_OPTIONS } from '~/constants'
import { HOME_PROVIDERS_ICON } from '~/components/symbols/casino-home'

const { t } = useI18n()
const route = useRoute()
const providerSlug = computed(() => route.params.slug ? String(route.params.slug) : '')
const sortBy = ref(POPULAR)
const { sendFingerprint } = useSendFingerprint()
const searchOptions = computed(() => {
  const _options: any = {
    first: CASINO_SUB_PAGE_GAMES_LIMIT,
    page: 1,
    orderBy: [providerOrderByMaps[sortBy.value]],
  }

  _options.providerSlug = providerSlug.value

  return _options
})

const { result, loading, load, refetch, fetchMore } = useLazyQuery(GAME_SEARCH_QUERY, searchOptions)
const { result: gameProviderData, load: loadGameProvider } = useLazyQuery(GAME_PROVIDER_QUERY, {
  slug: providerSlug.value,
})

const gameProvider = computed(() => (gameProviderData.value?.gameProvider))
const games = computed(() => (result.value?.gameSearch?.data || []))
const paginatorInfo = computed(() => (result.value?.gameSearch?.paginatorInfo || {}))

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
  () => sortBy.value,
  (_sortBy) => {
    refetch(searchOptions.value)
  },
)

onMounted(async () => {
  load()
  loadGameProvider()
  await sendFingerprint()
})
</script>

<template>
  <CasinoPage>
    <div
      class="grid grid-cols-1 gap-y-2 md:gap-y-4"
    >
      <div class="flex items-start md:items-center relative">
        <div
          class="
            flex-1 flex flex-col md:flex-row items-center h-full gap-2 relative
          "
        >
          <div class="flex w-full md:w-auto items-center gap-x-2 xs:gap-x-3 md:gap-x-4 text-white h-10">
            <svg class="w-5 h-5 min-w-5 min-h-5 xs:w-6 xs:h-6 text-white">
              <use :href="HOME_PROVIDERS_ICON" />
            </svg>
            <span
              class="text-white text-lg font-bold leading-normal"
            >
              {{ gameProvider?.name }}
            </span>
          </div>
          <SearchPopper
            class="w-full md:w-64"
            result-panel="top-24 md:top-12"
          />
        </div>
        <div class="absolute top-0 right-0 flex items-center gap-x-2 z-102">
          <SortBySelect
            v-model="sortBy"
            :options="SORT_OPTIONS"
            class="w-auto!"
          />
        </div>
      </div>
      <GameRows
        :games="games"
        :loading="loading"
      />
      <div
        v-if="games?.length"
        class="grid grid-cols-1 gap-y-2"
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
  </CasinoPage>
</template>
