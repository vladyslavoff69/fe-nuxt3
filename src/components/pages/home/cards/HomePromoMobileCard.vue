<script lang="ts" setup>
import type { PromoCard } from '~/types/promotion'
import HomePromoCounter from '~/components/pages/home/cards/HomePromoCounter.vue'

const { promoData } = defineProps<{
  promoData: PromoCard
}>()

const { t } = useI18n()
</script>

<template>
  <div class="w-full h-full rounded-md overflow-hidden aspect-100/52 sm:aspect-100/45 bg-green-950/60">
    <div
      class="relative w-full h-full py-3 px-4 xl:py-5"
      :style="{
        'background': `url(${promoData?.image}/md) no-repeat right center`,
        'background-size': 'cover'
      }"
    >
      <div class="w-full h-full flex flex-col items-stretch gap-1.5 xl:gap-0.5">
        <div class="w-full max-w-[240px] sm:max-w-full">
          <NuxtLinkLocale
            class="w-full"
            :to="`/promotions/${promoData?.slug}`"
          >
            <span class="uppercase text-xxl xl:text-3xl font-extrabold text-white flex items-center gap-1 max-w-[65%] break-words">
              <span>
                {{ promoData?.name }}
                <UIcon
                  class="w-6 h-6 min-w-6 min-h-6"
                  name="i-heroicons-arrow-up-right-20-solid"
                />
              </span>
            </span>
          </NuxtLinkLocale>
        </div>

        <span
          v-if="promoData?.subHeader"
          class="text-sm text-white"
          v-html="promoData?.subHeader"
        />

        <HomePromoCounter
          class="mt-auto max-w-[220px] lg:max-w-full lg:w-2/3 xl:mb-2 justify-between"
          :promo-end-date="promoData?.end_date"
        />

        <div class="w-full">
          <JButton
            class="w-auto p-1"
            button-class="p-1.5! lg:p-2.5!"
            variant="bet-gradient"
          >
            <span class="flex items-center font-extrabold px-0.5 gap-x-0.5">
              <span class="uppercase flex flex-col text-xxs">
                <span class="leading-1 sm:leading-2">{{ t('promotions.top') }}</span>
                <span class="leading-1 sm:leading-2">{{ promoData?.promotion_prizes?.length || 1 }}</span>
              </span>
              <span class="text-md">
                ${{ promoData?.total_prize }}
              </span>
            </span>
          </JButton>
        </div>
      </div>
    </div>
  </div>
</template>
