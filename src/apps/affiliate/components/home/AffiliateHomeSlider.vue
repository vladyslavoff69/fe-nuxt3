<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import NavIndicator from '~/components/molecules/slide/NavIndicator.vue'
import useSwiperCards from '~/components/molecules/slide/swiper-cards'
import { THEME } from '~/constants'
import { GET_AFFILIATE_STATES } from '~/graphql'
import { numberWithCommas } from '~/utils'

const { t } = useI18n()
const { container, swiper: swiperRef, slidesPerView, onSwiper, init, destroy } = useSwiperCards({
  slidePerSmView: 1,
  slidePerLgView: 3,
  default: 241,
  spaceBetween: 8
})

const { result, loading } = useQuery(
  GET_AFFILIATE_STATES,
  {}
)

const affiliateStats = computed(() => (result.value?.affiliateStats))
const { screen } = inject(THEME)!
const currentSlide = computed(() => (swiperRef.value?.activeIndex || 0))
const sliderItems = computed(() => ([
  {
    text: t('affiliate.total_referred'),
    amount: `$${numberWithCommas(affiliateStats.value?.totalReferred)}` || '$0',
  },
  {
    text: t('affiliate.last_24'),
    amount: `$${numberWithCommas(affiliateStats.value?.referredLastDay)}` || '$0',
  },
  {
    text: t('affiliate.affiliate_users'),
    amount: numberWithCommas(affiliateStats.value?.affiliateUsers, 0) || '0',
  },
]))

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  destroy()
})

const clickIndicator = (e: any) => {
  swiperRef.value?.slideTo(e.index || 0)
}
</script>

<template>
  <div
    ref="container"
    class="flex flex-col gap-y-4 w-full lg:pb-10"
  >
    <ClientOnly>
      <Swiper
        :free-mode="true"
        :navigation="false"
        :pagination="{
          clickable: true,
        }"
        :slides-per-view="slidesPerView"
        :space-between="0"
        @swiper="onSwiper"
      >
        <SwiperSlide
          v-for="(item, idx) in sliderItems"
          :key="`${idx}_${item.text}_${item.amount}_affiliate_card`"
        >
          <div
            class="text-center px-4 lg:px-5 w-full flex flex-col gap-y-2 lg:gap-y-2.5 h-full"
            :class="{'lg:border-l-2 lg:border-border': idx > 0}"
          >
            <div
              class="text-primary uppercase font-extrabold text-sm md:text-base leading-[15px] lg:leading-none tracking-primary"
            >
              {{ item.text }}
            </div>
            <div
              class="text-3xl lg:text-4xl leading-tight! font-bold text-white"
            >
              <USkeleton
                v-if="loading"
                class="w-20 h-5 bg-brand"
              />
              <template v-else>
                {{ item.amount }}
              </template>
            </div>
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
        @click-indicator="clickIndicator"
      />
    </div>
  </div>
</template>
