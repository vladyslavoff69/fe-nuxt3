<script lang="ts" setup>
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { AUTH, CREATE_USER } from '~/constants'
import NavIndicator from '~/components/molecules/slide/NavIndicator.vue'
import useSwiperCards from '~/components/molecules/slide/swiper-cards'

const { isLoggedIn, openAuthModal }: any = inject(AUTH)!
const { t } = useI18n()
const slideCount = ref(3)
const { container, swiper: swiperRef, onSwiper } = useSwiperCards({
  default: 241,
  spaceBetween: 10
})
const currentSlide = ref(swiperRef.value?.activeIndex || 0)
const contents = computed(() => {
  const _contents = [
    { title: t('home.top-banner-msg1-title'), description: t('home.top-banner-msg1-description') },
    { title: t('home.top-banner-msg2-title'), description: t('home.top-banner-msg2-description') },
    { title: t('home.top-banner-msg3-title'), description: t('home.top-banner-msg3-description') },
  ]

  _contents[0].title = _contents[0].title.replace('NO COST TO YOU', '<span class="text-primary">NO COST TO YOU</span>')

  return _contents
})
</script>

<template>
  <div
    ref="container"
    class="w-full flex flex-col gap-y-4 sm:gap-y-5 h-full"
  >
    <ClientOnly>
      <Swiper
        class="min-h-28"
        :autoplay="{
          delay: 5000,
          disableOnInteraction: false,
        }"
        :centered-slides="true"
        :modules="[Autoplay]"
        :pagination="{
          clickable: true,
        }"
        :space-between="10"
        @swiper="onSwiper"
        @slide-change="(e) => {
          currentSlide = e.activeIndex
        }"
      >
        <SwiperSlide
          v-for="(content, i) in contents"
          :key="i"
        >
          <div class="text-start w-full flex flex-col gap-y-4 sm:gap-y-5">
            <h4
              class="
              text-primary uppercase font-extrabold
              text-sm sm:text-base leading-[15px] lg:leading-none
              text-center lg:text-start tracking-primary
              px-7 lg:px-0
            "
            >
              {{ content.description }}
            </h4>
            <h1
              class="text-2xl sm:text-xxl lg:text-3xl text-center lg:text-start leading-6 lg:leading-7! font-extrabold tracking-[0.64px] uppercase"
              v-html="content.title"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
    <div class="w-full md:w-auto h-full">
      <div class="flex lg:inline-flex flex-col-reverse lg:flex-col gap-y-4 sm:gap-y-5 h-full">
        <div
          v-if="!isLoggedIn"
          class="w-full"
        >
          <div class="w-full flex justify-center lg:justify-start gap-2 md:gap-4">
            <JButton
              class="w-[200px] sm:w-[242px] block"
              shape="circle"
              @click="openAuthModal(CREATE_USER)"
            >
              {{ t("home.register-now") }}
            </JButton>
          </div>
        </div>
        <div
          v-else
          class="lg:w-full lg:h-36"
        />
        <!-- desktop and tablet slider nav-->
        <div class="flex items-center justify-center gap-x-4 mt-auto">
          <JbBlankButton
            :class="{
              'text-paragraph cursor-default': currentSlide === 0,
              'text-white': currentSlide > 0
            }"
            class="cursor-pointer hidden lg:flex text-white h-5 items-center"
            @click="swiperRef?.slidePrev()"
          >
            <UIcon
              class="h-5 w-5 min-h-5 min-w-5"
              name="i-heroicons-chevron-left-20-solid"
            />
          </JbBlankButton>
          <NavIndicator
            class="min-w-[100px]"
            :active-index="currentSlide"
            :slide-count="slideCount"
            @click-indicator="(e) => {
              swiperRef?.slideTo(e.index || 0)
            }"
          />
          <JbBlankButton
            :class="{
              'text-paragraph cursor-default': currentSlide + 1 === slideCount,
              'text-white': currentSlide + 1 < slideCount
            }"
            class="cursor-pointer hidden lg:flex text-white h-5 items-center"
            @click="swiperRef?.slideNext()"
          >
            <UIcon
              class="h-5 w-5 min-h-5 min-w-5"
              name="i-heroicons-chevron-right-20-solid"
            />
          </JbBlankButton>
        </div>
      </div>
    </div>
  </div>
</template>
