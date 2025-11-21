<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import PromosCard from '~/components/molecules/card/PromosBannerCard.vue'
import useSwiperCards from '~/components/molecules/slide/swiper-cards'
import NavIndicator from '~/components/molecules/slide/NavIndicator.vue'

import { THEME } from '~/constants'
import { usePromotions } from '~/composables/promos'

const { breakpoints, screen } = inject(THEME)!

const {
  promotions: promotionsData,
} = usePromotions({ promoId: null, category: 'active', enabled: true })

const { container, swiper: swiperRef, slidesPerView, onSwiper, init, destroy } = useSwiperCards({
  slidePerSmView: 1,
  slidePerLgView: 3,
  md: (breakpoints.md / 2 - 10),
  spaceBetween: 16,
})

const currentSlide = ref(swiperRef.value?.activeIndex || 0)
const promotions = computed(() => (promotionsData.value || []))

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  destroy()
})

const onClickIndicator = (e) => {
  swiperRef.value?.slideTo(e.index || 0)
}
</script>

<template>
  <div
    ref="container"
    class="w-full flex flex-col gap-y-3"
  >
    <ClientOnly>
      <Swiper
        :autoplay="{
          delay: 5000,
          disableOnInteraction: false,
        }"
        :free-mode="true"
        :navigation="true"
        :slides-per-view="slidesPerView"
        :space-between="16"
        @swiper="onSwiper"
        @slide-change="(e) => {
          currentSlide = e.activeIndex
        }"
      >
        <SwiperSlide
          v-for="(promotion, idx) in promotions"
          :key="`${idx}_promo_card`"
        >
          <div
            class="
              p-0 bg-card-gradient
              rounded-md transition-all duration-200 hover:-translate-y-2
            "
          >
            <PromosCard
              :promo-data="promotion"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </ClientOnly>

    <div
      v-if="!screen.lg"
      class="flex items-center justify-center lg:justify-start lg:pl-0 gap-x-6"
    >
      <NavIndicator
        :active-index="currentSlide"
        :slide-count="3"
        @click-indicator="onClickIndicator"
      />
    </div>
  </div>
</template>
