<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import useSwiperCards from '~/components/molecules/slide/swiper-cards'
import type { ProvidersRow } from '~/apps/casino/types'
import { useGameProvider } from '~/composables/game/useGameProvider'
import { THEME } from '~/constants'
import GameProviderCard from '~/components/molecules/card/GameProviderCard.vue'
import SkeletonGameProviderCard from '~/components/molecules/skeletons/SkeletonGameProviderCard.vue'
import SliderNavButtonGroup from '~/components/molecules/slide/SliderNavButtonGroup.vue'

const { providerRow } = defineProps<{
  providerRow: ProvidersRow;
}>()

const { screen } = inject(THEME)!
const { t } = useI18n()
const cLen = computed(() => screen.value?.lg ? 8 : (screen.value?.md ? 4 : 3))
const {
  gameProvidersLoading,
  gameProviders,
  gameProvidersLoad,
} = useGameProvider({})

const { container, swiper, slidesPerView, onSwiper, init, destroy } = useSwiperCards({
  default: 153,
  spaceBetween: 8,
})

onBeforeUnmount(() => {
  destroy()
})

onMounted(() => {
  init()
  gameProvidersLoad()
})
</script>

<template>
  <div
    ref="container"
    class="flex flex-col gap-y-3 md:gap-y-4"
  >
    <div class="w-full lg:w-auto flex-1 flex items-center justify-between relative">
      <div class="flex w-full md:w-auto items-center text-white">
        <NuxtLinkLocale
          class="h-full inline-flex items-center gap-x-2 sm:gap-x-3 md:gap-x-4 text-paragraph hover:text-white"
          to="/casino/providers"
        >
          <svg
            v-if="providerRow.iconType === 'symbol'"
            class="w-6 h-6 min-w-6 min-h-6"
          >
            <use :href="providerRow.icon" />
          </svg>
          <UIcon
            v-else
            :name="providerRow.icon"
            class="w-6 h-6 min-w-6 min-h-6"
          />
          <span class="text-lg font-bold leading-normal text-white">
            {{ providerRow.title }}
          </span>
        </NuxtLinkLocale>
      </div>
      <div
        v-if="gameProviders && gameProviders.length && gameProviders.length > cLen"
        class="hidden md:block w-auto"
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
          'disabled-swiper': !(gameProviders && gameProviders.length),
          'disabled-swiper-front': swiper?.activeIndex === 0,
          'disabled-swiper-back': gameProviders && (swiper?.activeIndex + cLen) >= (gameProviders.length - 1),
        }"
        :free-mode="true"
        :navigation="true"
        :slides-per-view="slidesPerView"
        :space-between="8"
        @swiper="onSwiper"
      >
        <template v-if="gameProvidersLoading">
          <SwiperSlide
            v-for="cardIdx in cLen"
            :key="`casino-provider-rows-${cardIdx}`"
          >
            <SkeletonGameProviderCard />
          </SwiperSlide>
        </template>
        <template v-else>
          <template v-if="gameProviders?.length > 0">
            <SwiperSlide
              v-for="(p, pInd) in gameProviders"
              :key="`casino-provider-games-${pInd}-${p?.id}`"
            >
              <GameProviderCard
                :game-provider="p"
                class="mr-2"
              />
            </SwiperSlide>
          </template>
          <template v-else>
            <div class="text-paragraph text-xs">
              {{ t('casino.no-registered-providers') }}
            </div>
          </template>
        </template>
      </Swiper>
    </ClientOnly>
  </div>
</template>
