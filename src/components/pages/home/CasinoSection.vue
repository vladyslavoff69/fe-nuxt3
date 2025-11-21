<script lang="ts" setup>
import { FreeMode, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import CasinoCard from '~/components/molecules/card/CasinoCard.vue'
import SkeletonCasinoCard from '~/components/molecules/skeletons/SkeletonCasinoCard.vue'
import GameImage from '~/components/molecules/game/GameImage.vue'
import SliderNavButtonGroup from '~/components/molecules/slide/SliderNavButtonGroup.vue'
import useSwiperCards from '~/components/molecules/slide/swiper-cards'
import { NEWEST_ICON } from '~/components/symbols'
import { GAME_SEARCH_QUERY } from '~/graphql'
import { HOME_CASINO_CARD_ICON } from '~/components/symbols/casino-home'
import { CASINO_SUB_PAGE_GAMES_LIMIT, NEWEST, orderByMaps, POPULAR } from '~/apps/casino/constants'
import { LOBBY_SORT_OPTIONS, THEME } from '~/constants'
import SortBySelect from '~/components/molecules/selects/SortBySelect.vue'

const { tabs, selected } = defineProps<{
  tabs: any[]
  selected: string
}>()

const { t } = useI18n()
const { screen } = inject(THEME)!
const currentTab = ref(selected || 'new')
const orderColumn = ref<'POPULAR' | 'NEWEST'>(NEWEST)

const searchOptions = computed(() => ({
  categorySlug: currentTab.value,
  first: CASINO_SUB_PAGE_GAMES_LIMIT,
  page: 1,
  orderBy: currentTab.value === 'new' ? [orderByMaps[POPULAR]] : [orderByMaps[orderColumn.value]]
}))

const { result, loading, refetch } = useQuery(
  GAME_SEARCH_QUERY,
  searchOptions
)

const { container, swiper, slidesPerView, onSwiper, init, destroy } = useSwiperCards({
  slidePerSmView: 3,
  default: 104,
  md: 130,
  lg: 150,
  spaceBetween: 10
})

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  destroy()
})

watch(
  () => currentTab.value,
  (v: string) => {
    if (v !== 'new') {
      const options: any = { ...searchOptions.value }
      options.categorySlug = v
      // disable temporary in case slots
      // options.orderBy = [orderByMaps[orderColumn.value]]

      // disable temporary in case slots
      if (v !== 'slots') {
        options.orderBy = [orderByMaps[orderColumn.value]]
      } else {
        options.orderBy = [orderByMaps[POPULAR]]
      }

      refetch({ ...options })
    }
  },
  { immediate: true }
)

const games = computed(() => (result.value?.gameSearch?.data || []))
const cLen = computed(() => screen.value.lg ? 8 : (screen.value.md ? 4 : 3))
</script>

<template>
  <div
    ref="container"
    class="flex flex-col gap-y-2 sm:gap-y-4"
  >
    <div class="w-full lg:w-auto flex-1 flex items-center justify-between mr-0 sm:mr-2 relative">
      <div
        class="
          w-full sm:w-auto flex sm:flex-none items-start sm:items-center flex-col sm:flex-row
          justify-between flex-1 gap-y-2 sm:gap-y-0 gap-x-1 sm:gap-x-6
        "
      >
        <LazyNuxtLinkLocale
          :hydrate-when="!loading && games && games.length"
          class="flex items-center gap-x-2 xs:gap-x-3 sm:gap-x-4 h-9 sm:h-10 text-paragraph hover:text-white"
          to="/"
        >
          <svg
            v-if="selected === 'new'"
            class="w-5 h-5 min-w-5 min-h-5 xs:w-6 xs:h-6"
          >
            <use :href="NEWEST_ICON" />
          </svg>
          <svg
            v-else
            class="w-5 h-5 min-w-5 min-h-5 xs:w-6 xs:h-6"
          >
            <use :href="HOME_CASINO_CARD_ICON" />
          </svg>
          <span class="text-lg font-bold leading-normal text-white">
            {{ selected === 'new' ? t('casino.new-releases') : t("games.casino") }}
          </span>
        </LazyNuxtLinkLocale>

        <SortBySelect
          v-if="selected !== 'new'"
          v-model="orderColumn"
          :disabled="!games || !games.length"
          :options="LOBBY_SORT_OPTIONS"
          class="w-auto! ml-auto absolute right-0 -top-1 sm:hidden"
        />

        <JTabs
          v-if="selected !== 'new'"
          v-model="currentTab"
          :tabs="tabs"
          class="w-full sm:w-auto mr-2"
          width="auto"
        />

        <SortBySelect
          v-if="selected !== 'new'"
          v-model="orderColumn"
          :disabled="!games || !games.length"
          :options="LOBBY_SORT_OPTIONS"
          class="w-auto! hidden sm:block"
        />
      </div>
      <div class="hidden md:block ml-auto">
        <SliderNavButtonGroup
          @click:prev="swiper?.slideTo((swiper?.activeIndex > slidesPerView ? (swiper?.activeIndex - slidesPerView) : 0), 300, true)"
          @click:next="swiper?.slideTo((swiper?.activeIndex + slidesPerView), 300, true)"
        />
      </div>
    </div>

    <div class="w-full">
      <ClientOnly>
        <Swiper
          class="px-1! min-h-[166px]"
          :free-mode="true"
          :modules="[FreeMode, Navigation]"
          :navigation="true"
          :slides-per-view="slidesPerView"
          :space-between="10"
          @swiper="onSwiper"
        >
          <template v-if="loading || !games">
            <SwiperSlide
              v-for="cardIdx in cLen"
              :key="`key-${cardIdx}-hey-26`"
            >
              <SkeletonCasinoCard
                size-class="w-full"
              />
            </SwiperSlide>
          </template>
          <template v-else>
            <SwiperSlide
              v-for="(card, cdx) in games"
              :key="`${cdx}_${card.slug}_slug-hey-27`"
            >
              <CasinoCard
                :game="card"
                :title="card?.title"
                :is-hoverable="screen.lg"
                size-class="w-full"
              >
                <template #img>
                  <GameImage :game="card" />
                </template>
              </CasinoCard>
            </SwiperSlide>
          </template>
        </Swiper>
      </ClientOnly>
    </div>
  </div>
</template>
