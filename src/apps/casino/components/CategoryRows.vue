<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import CasinoCard from '~/components/molecules/card/CasinoCard.vue'
import useSwiperCards from '~/components/molecules/slide/swiper-cards'
import { GAME_SEARCH_QUERY } from '~/graphql'
import SkeletonCasinoCard from '~/components/molecules/skeletons/SkeletonCasinoCard.vue'
import type { CategoryRow } from '~/apps/casino/types'
import { CASINO_SUB_PAGE_GAMES_LIMIT, orderByMaps, POPULAR } from '~/apps/casino/constants'
import { LOBBY_SORT_OPTIONS, THEME } from '~/constants'
import GameImage from '~/components/molecules/game/GameImage.vue'
import SliderNavButtonGroup from '~/components/molecules/slide/SliderNavButtonGroup.vue'
import SortBySelect from '~/components/molecules/selects/SortBySelect.vue'

const { categoryRow } = defineProps<{
  categoryRow: CategoryRow;
}>()

const { t } = useI18n()
const { screen } = inject(THEME)!
const sortBy = ref(POPULAR)
const searchOptions = computed(() => ({
  first: CASINO_SUB_PAGE_GAMES_LIMIT,
  page: 1,
  orderBy: ((categoryRow.categorySlug === 'new' || categoryRow.categorySlug === 'new-releases') ? [orderByMaps[POPULAR]] : [orderByMaps[sortBy.value]]),
  categorySlug: categoryRow.categorySlug
}))

const { result, loading, load, refetch } = useLazyQuery(GAME_SEARCH_QUERY, searchOptions)
const { container, swiper, slidesPerView, onSwiper, init, destroy } = useSwiperCards({
  slidePerSmView: 3,
  default: 104,
  md: 130,
  lg: 150,
  spaceBetween: 8,
})

onMounted(() => {
  init()
  load()
})

onBeforeUnmount(() => {
  destroy()
})

const games = computed(() => {
  return (result.value?.gameSearch?.data || [])
})

watch(
  () => sortBy.value,
  (v) => {
    refetch({
      ...searchOptions.value,
      orderBy: ((categoryRow.categorySlug === 'new' || categoryRow.categorySlug === 'new-releases') ? [orderByMaps[POPULAR]] : [orderByMaps[v]]),
    })
  }, { immediate: true }
)

const cLen = computed(() => screen.value?.lg ? 8 : (screen.value?.md ? 4 : 3))
</script>

<template>
  <div
    ref="container"
    class="flex flex-col gap-y-3 md:gap-y-4 w-full"
  >
    <div
      class="w-full flex-1 flex items-center justify-between mr-0 md:mr-2 relative"
    >
      <div class="flex items-center gap-x-4 sm:gap-x-6 md:gap-x-8 w-full">
        <NuxtLinkLocale
          :to="`/casino/${(!['new-releases', 'new', 'slots', 'live', 'live-casino'].includes(categoryRow.categorySlug) ? 'category' : 'home')}/${(categoryRow.categorySlug === 'new' ? 'new-releases' : categoryRow.categorySlug)}`"
          class="flex items-center gap-x-2 xs:gap-x-3 md:gap-x-4 h-full hover:text-white"
        >
          <svg
            v-if="categoryRow.iconType === 'symbol'"
            class="w-5 h-5 min-w-5 min-h-5 xs:w-6 xs:h-6"
          >
            <use :href="categoryRow.icon" />
          </svg>
          <UIcon
            v-else
            :name="categoryRow.icon"
            class="w-5 h-5 min-w-5 min-h-5 xs:w-6 xs:h-6"
          />
          <span
            class="text-lg font-bold leading-normal text-white"
          >
            {{ categoryRow.title }}
          </span>
        </NuxtLinkLocale>

        <SortBySelect
          v-if="(categoryRow.categorySlug !== 'new' && categoryRow.categorySlug !== 'new-releases')"
          v-model="sortBy"
          :disabled="!games || !games.length"
          :options="LOBBY_SORT_OPTIONS"
          class="w-auto!"
        />
      </div>
      <div
        v-if="games && games.length && games.length > cLen"
        class="items-center gap-x-1 md:gap-x-2 flex-1 ml-auto w-full hidden md:flex"
      >
        <SliderNavButtonGroup
          @click:prev="swiper?.slideTo((swiper?.activeIndex > slidesPerView ? (swiper?.activeIndex - slidesPerView) : 0), 300, true)"
          @click:next="swiper?.slideTo((swiper?.activeIndex + slidesPerView), 300, true)"
        />
      </div>
    </div>

    <ClientOnly>
      <Swiper
        :class="{
          'disabled-swiper': !(games && games.length),
          'disabled-swiper-front': swiper?.activeIndex === 0,
          'disabled-swiper-back': games && (swiper?.activeIndex + cLen) >= (games.length - 1),
        }"
        :free-mode="true"
        :navigation="true"
        :slides-per-view="slidesPerView"
        :space-between="10"
        class="px-1! min-h-[166px]"
        @swiper="onSwiper"
      >
        <template v-if="loading">
          <SwiperSlide
            v-for="(cardIdx, cid) in cLen"
            :key="`Casino-Category-rows-${cid}-${cardIdx}`"
            class="h-full"
          >
            <SkeletonCasinoCard />
          </SwiperSlide>
        </template>
        <template v-else-if="games && games.length">
          <SwiperSlide
            v-for="(card, cdx) in games"
            :key="`${cdx}_${card.slug}_category_slug`"
          >
            <CasinoCard
              :game="card"
              :is-hoverable="screen.lg"
              :title="card?.title"
              size-class="w-full"
            >
              <template #img>
                <GameImage :game="card" />
              </template>
            </CasinoCard>
          </SwiperSlide>
        </template>
        <template v-else>
          <div class="text-paragraph text-xs flex items-center justify-center h-full w-full">
            <span>{{ t('casino.no-registered-games') }}</span>
          </div>
        </template>
      </Swiper>
    </ClientOnly>
  </div>
</template>
