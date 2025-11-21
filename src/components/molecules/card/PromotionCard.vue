<script lang="ts" setup>
import { THEME } from '~/constants'
import { CALENDAR_ICON } from '~/components/symbols'
import type { PromoCard } from '~/types/promotion'
import { useRemainingTime } from '~/composables/promos'

const { promoData } = defineProps<{
  promoData: PromoCard
}>()

const { screen } = inject(THEME)!
const validFor = 'CASINO'
const { remainingTime } = useRemainingTime(promoData?.end_date)
const router = useRouter()
const localePath = useLocalePath()
const { t } = useI18n()
</script>

<template>
  <div
    class="w-full xs:w-96 flex flex-col py-2 gap-y-2 transition-all duration-200 hover:-translate-y-2"
    @click="router.push({ path: localePath(`/promotions/${promoData?.slug}`) })"
  >
    <div class="relative aspect-100/52 p-5 pb-2 rounded-md overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full bg-green-950">
        <NuxtImg
          v-if="promoData?.image"
          :src="`${promoData.image}/md`"
          alt="PROMOTION"
          class="w-full"
          loading="lazy"
        />
      </div>
      <div class="w-full h-full relative flex flex-col gap-y-4">
        <div>
          <UBadge
            :size="screen.md ? 'xs' : 'sm'"
            class="w-auto text-center bg-disabled-paragraph items-center justify-center gap-x-0.5 tracking-wider py-2 px-1"
            color="primary"
            variant="solid"
          >
            <svg class="w-3 h-3 min-w-3 min-h-3 text-white">
              <use :href="CALENDAR_ICON" />
            </svg>
            <span
              class="text-xxs uppercase text-white"
            >
              {{ promoData?.time_frame }}
            </span>
          </UBadge>
        </div>
        <div class="flex flex-col gap-y-2">
          <div class="uppercase text-xxl font-extrabold leading-none">
            <h1
              class="leading-6 tracking-primary w-8/12"
            >
              {{ promoData?.name }}
            </h1>
          </div>
          <span
            class="text-sm text-white"
            v-html="promoData?.subHeader"
          />
          <div class="flex items-end justify-between">
            <JButton
              class="w-auto p-2"
              variant="bet-gradient"
            >
              <span class="flex items-center font-extrabold px-0.5">
                <span class="uppercase flex flex-col text-xxs mr-0.5">
                  <span class="leading-1 sm:leading-2">{{ t('promotions.top') }}</span>
                  <span class="leading-1 sm:leading-2">{{ promoData?.promotion_prizes?.length || 1 }}</span>
                </span>
                <span
                  class="text-lg"
                >
                  ${{ promoData?.total_prize }}
                </span>
              </span>
            </JButton>
            <div
              v-if="remainingTime.total"
              :class="{
                'text-error': (1000 * 60 * 60) > remainingTime.total,
                'text-white': (1000 * 60 * 60) <= remainingTime.total
              }"
              class="flex items-center gap-x-1 text-sm p-1 bg-brand rounded-md"
            >
              <span v-if="remainingTime.days">{{ remainingTime?.days }}d</span>
              <span v-if="remainingTime.hours">{{ remainingTime?.hours }}h</span>
              <span v-if="remainingTime.minutes">{{ remainingTime?.minutes }}m</span>
              <span class="inline-block min-w-6">{{ remainingTime?.seconds }}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <UBadge
        v-if="promoData?.valid_for"
        :size="screen.md ? 'xs' : 'sm'"
        class="w-auto text-center text-xxs uppercase bg-disabled-paragraph px-3 h-5 rounded-full py-1"
        color="primary"
        variant="solid"
      >
        <span class="font-bold">{{ validFor }}</span>
      </UBadge>
      <h1
        class="text-lg font-bold leading-5"
      >
        {{ promoData?.caption }}
      </h1>
    </div>
  </div>
</template>
