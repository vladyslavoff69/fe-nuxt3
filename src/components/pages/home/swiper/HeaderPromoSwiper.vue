<script lang="ts" setup>
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import useSwiperCards from '~/components/molecules/slide/swiper-cards'
import NavIndicator from '~/components/molecules/slide/NavIndicator.vue'
import HomePromoMobileCard from '~/components/pages/home/cards/HomePromoMobileCard.vue'
import HomeBannerCard from '~/components/pages/home/cards/HomeBannerCard.vue'
import WheelLaunchBannerCard from '~/components/pages/home/cards/WheelLaunchBannerCard.vue'
import MoonpayBannerCard from '~/components/pages/home/cards/MoonpayBannerCard.vue'
import DailyLaunchBannerCard from '~/components/pages/home/cards/DailyLaunchBannerCard.vue'

const { promosData } = defineProps<{
  promosData: any
}>()

const { container, swiper: swiperRef, onSwiper } = useSwiperCards({
  default: 241,
  spaceBetween: 8
})

const currentSlide = ref(swiperRef.value?.activeIndex || 0)
</script>

<template>
  <div
    ref="container"
    class="w-full h-full flex flex-col gap-y-4 sm:w-5/6"
  >
    <ClientOnly>
      <Swiper
        :autoplay="{
          delay: 5000,
          disableOnInteraction: false,
        }"
        :centered-slides="true"
        :modules="[Autoplay]"
        :pagination="{
          clickable: true,
        }"
        :space-between="8"
        @swiper="onSwiper"
        @slide-change="(e) => {
          currentSlide = e.activeIndex
        }"
      >
        <SwiperSlide
          v-for="(promoData, pInd) in promosData"
          :key="`${pInd}-promo-card-data`"
          class="h-auto!"
        >
          <div v-if="promoData">
            <HomePromoMobileCard :promo-data="promoData" />
          </div>
        </SwiperSlide>
        <SwiperSlide class="h-auto!">
          <div>
            <DailyLaunchBannerCard />
          </div>
        </SwiperSlide>
        <SwiperSlide class="h-auto!">
          <div>
            <WheelLaunchBannerCard />
          </div>
        </SwiperSlide>
        <SwiperSlide class="h-auto!">
          <div>
            <MoonpayBannerCard />
          </div>
        </SwiperSlide>
        <SwiperSlide class="h-auto!">
          <div>
            <HomeBannerCard />
          </div>
        </SwiperSlide>
      </Swiper>
    </ClientOnly>

    <div
      class="flex items-center justify-center gap-x-4"
    >
      <NavIndicator
        :active-index="currentSlide"
        :slide-count="(promosData.length + 4)"
        @click-indicator="e => swiperRef?.slideTo(e.index || 0)"
      />
    </div>
  </div>
</template>
