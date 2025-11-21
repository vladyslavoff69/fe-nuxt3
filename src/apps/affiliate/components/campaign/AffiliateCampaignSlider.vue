<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import NavIndicator from '~/components/molecules/slide/NavIndicator.vue'
import SliderNavButtonGroup from '~/components/molecules/slide/SliderNavButtonGroup.vue'
import useSwiperCards from '~/components/molecules/slide/swiper-cards'
import { THEME } from '~/constants'

const { screen } = inject(THEME)!
const { container, swiper: swiperRef, onSwiper } = useSwiperCards({
  default: 241,
  spaceBetween: 8
})
const currentSlide = computed(() => {
  return swiperRef.value?.activeIndex || 0
})

const { t } = useI18n()
const selectedCurrency = ref('BTC')

const tempCampaignState = computed(() => [
  {
    text: t('affiliate.campaign-hits'),
    value: 0,
  },
  {
    text: t('affiliate.referrals'),
    value: 0,
  },
  {
    text: t('affiliate.total-deposits'),
    value: 0,
  },
  {
    text: t('affiliate.available-commission'),
    value: 0,
  },
  {
    text: t('affiliate.total-commission'),
    value: 0,
  },
  {
    text: t('affiliate.unique-deposits'),
    value: 0,
  },
  {
    text: t('affiliate.commission-rate'),
    value: 0,
  },
])

const sliderItems = computed(() => [
  {
    name: 'Campaign Name 1',
    state: tempCampaignState.value,
  },
  {
    name: 'Campaign Name 2',
    state: tempCampaignState.value,
  },
  {
    name: 'Campaign Name 3',
    state: tempCampaignState.value,
  },
])
</script>

<template>
  <div
    ref="container"
    class="flex flex-col gap-y-4 w-full lg:pb-10"
  >
    <ClientOnly>
      <Swiper
        :centered-slides="true"
        :navigation="false"
        :pagination="{
          clickable: true,
        }"
        :space-between="0"
        @swiper="onSwiper"
      >
        <SwiperSlide
          v-for="(item, idx) in sliderItems"
          :key="`${idx}_${item?.name}_affiliate_card_campaign_slider`"
        >
          <div class="bg-green-950 rounded-md w-full">
            <div
              class="p-4 flex justify-between items-center border-b border-border"
            >
              <div class="text-white font-bold">
                {{ item?.name }}
              </div>
              <div class="max-w-[200px]">
                <JSelect
                  v-model="selectedCurrency"
                  :classes="{
                    ListboxButton:
                      'bg-green-950 h-10 py-2 px-2.5 pr-1! font-bold text-paragraph',
                    Placeholder: 'text-xs',
                    LabelOptLabel: 'text-xs',
                  }"
                  :has-check-box="false"
                  :options="[
                    {
                      label: '0.00001',
                      value: 'BTC',
                      icon: 'i-cryptocurrency-color-btc',
                      iconType: 'ui'
                    },
                    {
                      label: '0.00441',
                      value: 'ETH',
                      icon: 'i-cryptocurrency-color-eth',
                      iconType: 'ui'
                    },
                  ]"
                  class="ml-2"
                />
              </div>
            </div>
            <div class="flex flex-col-reverse lg:flex-col">
              <div
                class="p-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
              >
                <div
                  v-for="(state, index) in item.state"
                  :key="`${index}_${state.text}_${ state.value }`"
                  class="text-left text-sm"
                >
                  <div class="font-bold text-white">
                    {{ state.text }}
                  </div>
                  <div>{{ state.value }}</div>
                </div>
              </div>
              <div class="text-left px-4 my-4">
                <p class="text-left mb-2.5 text-white">
                  {{ t("affiliate.copy-link") }}
                </p>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div
                    class="flex-1 md:flex-none flex items-center bg-green-950 ring-1 ring-border rounded-md px-4 h-11"
                  >
                    <div class="relative">
                      <div
                        class="absolute w-full h-full z-1 cursor-not-allowed"
                      />
                      <div class="block text-paragraph text-sm">
                        <span>junglebet.com/usercode</span>
                      </div>
                    </div>
                    <JbBlankButton class="ml-auto">
                      <UIcon
                        class="h-4 w-4 min-w-4 min-h-4 text-paragraph hover:text-white cursor-copy"
                        name="ion:copy-sharp"
                      />
                    </JbBlankButton>
                  </div>
                  <div class="flex items-center gap-x-2">
                    <span class="text-sm">
                      {{ t("affiliate.share") }}
                    </span>
                    <div class="flex gap-1">
                      <div class="p-1">
                        <UIcon
                          class="h-5 w-5 text-white"
                          name="simple-icons:facebook"
                        />
                      </div>
                      <div class="p-1">
                        <UIcon
                          class="h-5 w-5 text-white"
                          name="simple-icons:x"
                        />
                      </div>
                      <div class="p-1">
                        <UIcon
                          class="h-5 w-5 text-white"
                          name="simple-icons:instagram"
                        />
                      </div>
                      <div class="p-1">
                        <UIcon
                          class="h-5 w-5 text-white"
                          name="simple-icons:youtube"
                        />
                      </div>
                      <div class="p-1">
                        <UIcon
                          class="h-5 w-5 text-white"
                          name="simple-icons:twitch"
                        />
                      </div>
                      <div class="p-1">
                        <UIcon
                          class="h-5 w-5 text-white"
                          name="simple-icons:tiktok"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
        :slide-count="sliderItems.length"
        @click-indicator="
          (e) => {
            swiperRef?.slideTo(e.index || 0);
          }
        "
      />
    </div>
    <div
      v-else
      class="flex items-center justify-end"
    >
      <div :class="{ 'hidden!': sliderItems.length < 2 }">
        <SliderNavButtonGroup
          @click:prev="swiperRef?.slidePrev()"
          @click:next="swiperRef?.slideNext()"
        />
      </div>
    </div>
  </div>
</template>
