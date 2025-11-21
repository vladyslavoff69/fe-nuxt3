<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { THEME } from '~/constants'
import useSwiperCards from '~/components/molecules/slide/swiper-cards'
import { VIP_LEVELS_SLIDER_DATA } from '~/apps/vip-program/constants'
import VipLevelCard from '~/apps/vip-program/components/VipLevelCard.vue'
import type { VipLevel } from '~/types'

defineProps<{ vipLevels: VipLevel[] }>()

const { breakpoints } = inject(THEME)!
const { container, slidesPerView, onSwiper, init, destroy } = useSwiperCards({
  slidePerSmView: 2.5,
  slidePerLgView: 6,
  md: (breakpoints.md / 3 - 10),
  spaceBetween: 1,
})

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  destroy()
})
</script>

<template>
  <div
    ref="container"
    class="w-full"
  >
    <ClientOnly>
      <Swiper
        :free-mode="true"
        :navigation="true"
        :slides-per-view="slidesPerView"
        :space-between="16"
        @swiper="onSwiper"
      >
        <SwiperSlide
          v-for="(level, idx) in VIP_LEVELS_SLIDER_DATA"
          :key="`${idx}_card`"
          class="text-center"
        >
          <VipLevelCard
            :data="level"
            :vip-levels="vipLevels"
          />
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
  </div>
</template>
