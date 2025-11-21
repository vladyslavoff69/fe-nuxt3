<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { THEME } from '~/constants'
import useSwiperCards from '~/components/molecules/slide/swiper-cards'
import { VIP_TREATMENT_DATA } from '~/apps/vip-program/constants'
import VipTreatmentCard from '~/apps/vip-program/components/VipTreatmentCard.vue'
import type { VipLevel } from '~/types'

defineProps<{ vipLevels: VipLevel[] }>()

const { breakpoints } = inject(THEME)!
const { container, slidesPerView, onSwiper, init, destroy } = useSwiperCards({
  slidePerSmView: 1.2,
  slidePerLgView: 4,
  md: (breakpoints.md / 2 - 10),
  spaceBetween: 16,
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
          v-for="(treatment, idx) in VIP_TREATMENT_DATA"
          :key="`${idx}_promo_card`"
          class="h-auto!"
        >
          <VipTreatmentCard
            :data="treatment"
            :vip-levels="vipLevels"
          />
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
  </div>
</template>
