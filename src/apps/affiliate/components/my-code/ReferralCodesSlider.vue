<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import useSwiperCards from '~/components/molecules/slide/swiper-cards'
import { THEME } from '~/constants'
import ReferralCodesSliderItem from '~/apps/affiliate/components/my-code/ReferralCodesSliderItem.vue'
import CommissionTiersModal from '~/apps/affiliate/components/my-code/CommissionTiersModal.vue'

defineProps<{
  slides: any;
  loading: boolean;
}>()

const { container, slidesPerView, onSwiper, init, destroy } = useSwiperCards({
  slidePerSmView: 1.2,
  default: 200,
  md: 200,
  lg: 200,
  spaceBetween: 8
})

const { screen } = inject(THEME)!
const isModalVisible = ref<boolean>(false)
const cLen = computed(() => screen.value?.lg ? 8 : (screen.value?.md ? 4 : 3))

const openModal = () => {
  isModalVisible.value = true
}

const onCloseModal = () => {
  isModalVisible.value = false
}

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
    class="flex flex-col gap-y-2 md:gap-y-4"
  >
    <ClientOnly>
      <Swiper
        :free-mode="true"
        :navigation="true"
        :slides-per-view="slidesPerView"
        :space-between="8"
        @swiper="onSwiper"
      >
        <template v-if="loading">
          <SwiperSlide
            v-for="cardIdx in cLen"
            :key="cardIdx"
          >
            <div
              class="
                flex flex-col justify-between rounded-md bg-green-950 border-2 border-green-950
                text-center md:h-[100px] h-20 md:gap-1 md:py-5 py-4
              "
            >
              <USkeleton
                class="h-5 md:h-7 mx-5 bg-brand"
              />
              <USkeleton
                class="h-4 md:h-4 mx-5 bg-brand"
              />
            </div>
          </SwiperSlide>
        </template>
        <template v-else>
          <SwiperSlide
            v-for="(data, index) in slides"
            :key="`${index}`"
          >
            <ReferralCodesSliderItem
              :item="data"
              @open-modal="openModal"
            />
          </SwiperSlide>
        </template>
      </Swiper>
    </ClientOnly>
    <ClientOnly>
      <UModal
        v-model:open="isModalVisible"
        :default-open="isModalVisible"
        class="w-11/12 sm:max-w-[416px] bg-brand p-2 sm:p-4"
        @update:open="(v) => {
        if (!v) {
          onCloseModal()
        }
      }"
      >
        <template #content>
          <CommissionTiersModal @close:modal="onCloseModal" />
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
