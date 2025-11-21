<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { CurrencyItem } from '~/types'
import CurrencyCard from '~/components/molecules/card/CurrencyCard.vue'
import useSwiperCards from '~/components/molecules/slide/swiper-cards'
import SkeletonCurrencyCard from '~/components/molecules/skeletons/SkeletonCurrencyCard.vue'
import SliderNavButtonGroup from '~/components/molecules/slide/SliderNavButtonGroup.vue'
import { HOME_CURRENCY_ICON } from '~/components/symbols'
import { CURRENCY, CUSTOM_CRYPTO_ORDER, PREFERENCE } from '~/constants'

const { orderedCryptoCodes, favoriteCryptoCodes } = inject(PREFERENCE)!
const { cryptoCurrencies, loading } = inject(CURRENCY)!

const { t } = useI18n()
const searchWord = ref('')
const showSearchBox = ref<boolean>(false)
const orderedCryptoItems = computed(() => {
  let _cryptoCurrencies = [...cryptoCurrencies.value]
  if (searchWord.value && searchWord.value !== '') {
    _cryptoCurrencies = _cryptoCurrencies.filter(item => item.code.toLowerCase().includes(searchWord.value.toLowerCase()))
  }

  return _cryptoCurrencies
    .sort((a, b) => {
      const indexA = CUSTOM_CRYPTO_ORDER.indexOf(a.code?.toUpperCase());
      const indexB = CUSTOM_CRYPTO_ORDER.indexOf(b.code?.toUpperCase());

      // If both items are in the custom order, sort by order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only one item is in the custom order, it should come first
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // If neither item is in the custom order, sort alphabetically
      return a.code.localeCompare(b.code);
    })
    .sort((a: CurrencyItem, b: CurrencyItem) => {
      const hasFavoriteA =
      favoriteCryptoCodes.value && favoriteCryptoCodes.value.length > 0
        ? favoriteCryptoCodes.value.filter((fCode: CurrencyItem) => fCode.code === a.code)?.length > 0
        : false
      const hasFavoriteB = favoriteCryptoCodes.value && favoriteCryptoCodes.value.length > 0
        ? favoriteCryptoCodes.value.filter((fCode: CurrencyItem) => fCode.code === b.code)?.length > 0
        : false
      if (hasFavoriteA && !hasFavoriteB) {
        return -1
      } else if (!hasFavoriteA && hasFavoriteB) {
        return 1
      }

      const hasChildrenA = (orderedCryptoCodes.value && orderedCryptoCodes.value.length) ? orderedCryptoCodes.value.includes(a.code) : false
      const hasChildrenB = (orderedCryptoCodes.value && orderedCryptoCodes.value.length) ? orderedCryptoCodes.value.includes(b.code) : false

      if (hasChildrenA && !hasChildrenB) {
        return -1
      } else if (!hasChildrenA && hasChildrenB) {
        return 1
      } else {
        return 0
      }
    })
})

const { container, swiper: swiperRef, slidesPerView, onSwiper, init, destroy } = useSwiperCards({
  default: 241,
  spaceBetween: 8
})

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  destroy()
})

const clearBox = () => {
  showSearchBox.value = false
  searchWord.value = ''
}
</script>

<template>
  <div
    ref="container"
    class="flex flex-col gap-y-2 sm:gap-y-4 w-full"
  >
    <div class="w-full relative sm:w-auto flex-1 flex items-center justify-between">
      <div
        class="flex items-center flex-1 gap-x-2 sm:gap-x-4 text-paragraph hover:text-white"
      >
        <svg
          class="w-5 h-5 min-w-5 min-h-5 xs:w-6 xs:h-6"
        >
          <use :href="HOME_CURRENCY_ICON" />
        </svg>
        <span
          class="text-lg font-bold leading-normal text-white"
        >
          {{ t('currency.live-crypto') }}
        </span>
      </div>
      <div class="flex items-center gap-x-2">
        <div class="flex justify-end relative">
          <JInput
            v-model="searchWord"
            :classes="{
              Input: [
                'rounded-full h-9 sm:h-10 transition-all duration-500 transform pl-10 text-sm',
                showSearchBox ? 'w-48!' : 'w-9! opacity-0!',
              ],
              EndIcon: 'right-0!'
            }"
            :placeholder="t('base.search')"
          >
            <template #startIcon>
              <div
                :class="{
                  'flex items-center': showSearchBox,
                  'hidden': !showSearchBox,
                }"
                class="z-100 w-5 h-5"
              >
                <UIcon
                  class="w-5 h-4 min-w-5 min-h-4"
                  name="heroicons:magnifying-glass-20-solid"
                />
              </div>
            </template>
            <template #endIcon>
              <JButton
                :class="{
                  'flex': showSearchBox,
                  'hidden': !showSearchBox,
                }"
                class="w-9 h-9 sm:w-10 sm:h-10 absolute! right-0 top-0 transition duration-300 transform hover:scale-110"
                shape="circle"
                variant="alternative"
                @click="clearBox"
              >
                <UIcon
                  class="w-5 h-5 min-w-5 min-h-5"
                  name="heroicons:x-mark-20-solid"
                />
              </JButton>
            </template>
          </JInput>
          <JButton
            v-if="!showSearchBox"
            class="w-9 h-9 sm:w-10 sm:h-10 absolute! right-0 top-0 transition rotate--45 duration-300"
            shape="circle"
            variant="alternative"
            @click="showSearchBox = true"
          >
            <UIcon
              class="w-5 h-5 min-w-5 min-h-5"
              name="heroicons:magnifying-glass-20-solid"
            />
          </JButton>
        </div>
        <div
          :class="{
            'hidden!': swiperRef?.slides?.length < 2
          }"
          class="hidden md:block"
        >
          <SliderNavButtonGroup
            @click:prev="swiperRef?.slideTo((swiperRef?.activeIndex > slidesPerView ? (swiperRef?.activeIndex - slidesPerView) : 0), 300, true)"
            @click:next="swiperRef?.slideTo((swiperRef?.activeIndex + slidesPerView), 300, true)"
          />
        </div>
      </div>
    </div>

    <ClientOnly>
      <Swiper
        :data-favorited="(favoriteCryptoCodes.length || 0).toString()"
        :free-mode="true"
        :navigation="true"
        :slides-per-view="slidesPerView"
        :space-between="8"
        :class="{
          'disabled-swiper': !(orderedCryptoItems && orderedCryptoItems.length),
          'disabled-swiper-front': swiperRef?.activeIndex === 0,
          'disabled-swiper-back': orderedCryptoItems && (swiperRef?.activeIndex + slidesPerView) >= (orderedCryptoItems.length - 1),
        }"
        @swiper="onSwiper"
      >
        <template v-if="loading">
          <SwiperSlide
            v-for="idx in 8"
            :key="`key-${idx}-hey-d-28`"
          >
            <SkeletonCurrencyCard />
          </SwiperSlide>
        </template>
        <template v-else>
          <SwiperSlide
            v-for="(currency, idx) in orderedCryptoItems"
            :key="`${idx}_${currency.id}-hey-d-1`"
          >
            <CurrencyCard
              :currency="currency"
            />
          </SwiperSlide>
        </template>
      </Swiper>
    </ClientOnly>
  </div>
</template>
