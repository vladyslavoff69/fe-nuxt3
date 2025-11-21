<script lang="ts" setup>
import { TRENDING_CHARITIES } from '~/graphql'
import { PREFERENCE } from '~/constants'

const { t } = useI18n()
const { activeFiatCode } = inject(PREFERENCE)!
const { result } = useQuery(
  TRENDING_CHARITIES,
  {
    fiatCurrency: activeFiatCode.value
  }
)

const trendingCharities = computed(() => {
  return result.value?.trendingCharities
})

const onClickCharityCard = (charityId) => {
  navigateRoute({
    path: `/players-charity/${charityId}`
  })
}
</script>

<template>
  <div class="w-full flex flex-col lg:flex-row gap-x-10 justify-between gap-y-4 lg:gap-y-0">
    <div class="flex-1 lg:flex-none flex">
      <JScrollBar next-fade-linear-gradient="none">
        <div class="w-full flex gap-x-4 h-full">
          <div class="grid gap-y-4 rounded-2xl bg-mid-green-transparent-gradient pt-1 px-8 pb-6">
            <NuxtImg
              alt="Checked Box Icon"
              class="w-14 h-auto sm:w-16 sm:h-14"
              loading="lazy"
              src="/assets/img/players-charity/CheckedBoxIcon.png"
            />
            <h3 class="text-lg sm:text-xxl max-w-32 font-bold leading-5 sm:leading-7">
              {{ t('charity.steps-to-donate') }}
            </h3>
          </div>
          <div class="grid rounded-2xl bg-mid-green-transparent-gradient pt-10 px-5 pb-6">
            <h1 class="text-white text-4xl font-bold">
              01
            </h1>
            <div class="grid">
              <h3 class="text-lg font-bold leading-5">
                {{ t('charity.explore-charities') }}
              </h3>
              <p class="font-medium text-base leading-5">
                {{ t('charity.review-initiatives') }}
              </p>
            </div>
          </div>
          <div class="grid rounded-2xl bg-mid-green-transparent-gradient pt-10 px-5 pb-6">
            <h1 class="text-white text-4xl font-bold">
              02
            </h1>
            <div class="grid">
              <h3 class="text-lg font-bold leading-5">
                {{ t('charity.click-select') }}
              </h3>
              <p class="font-medium text-base leading-5">
                {{ t('charity.select-preferred-charity') }}
              </p>
            </div>
          </div>
        </div>
      </JScrollBar>
    </div>
    <div class="flex-1">
      <div class="flex flex-col w-full gap-y-6">
        <h3 class="text-lg sm:text-base font-bold text-center lg:text-left">
          {{ t('charity.this-month-top3') }}
        </h3>
        <JScrollBar
          :content-box-class="['w-full']"
          next-fade-linear-gradient="none"
        >
          <div class="flex flex-1 justify-between gap-x-4 pb-4 sm:p-0">
            <template
              v-for="(charity, i) of trendingCharities"
              :key="i"
            >
              <div
                :class="{
                  'border-r border-r-border': i < 2
                }"
                class="flex-1 flex justify-center pr-4"
                @click="onClickCharityCard(charity.id)"
              >
                <div class="w-full max-w-28 sm:max-w-32 grid gap-y-3">
                  <div class="w-28 sm:w-32 py-1 rounded-md bg-white flex items-center justify-center">
                    <NuxtImg
                      :src="charity.image"
                      alt="Curriculum"
                      class="w-full"
                      loading="lazy"
                    />
                  </div>
                  <div class="grid">
                    <h3 class="text-sm sm:text-base text-paragraph leading-5 sm:leading-6 font-bold">
                      {{ t('charity.donations') }}
                    </h3>
                    <div class="flex items-center justify-between py-1 sm:p-0">
                      <div class="text-lg sm:text-2xl text-white font-bold leading-4 sm:leading-9">
                        {{ charity.totalDonations }}
                      </div>
                      <div class="flex -space-x-3 rtl:space-x-reverse">
                        <template
                          v-for="idx in charity.playersImage"
                          :key="idx"
                        >
                          <template v-if="charity.playersImage[idx]">
                            <NuxtImg
                              :src="charity.playersImage[idx]"
                              class="h-6 w-6 min-w-6 min-h-6"
                              loading="lazy"
                              alt="Junglebet.com"
                            />
                          </template>
                          <template v-else>
                            <UIcon
                              class="h-6 w-6 min-w-6 min-h-6"
                              name="heroicons:user-circle-20-solid"
                            />
                          </template>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </JScrollBar>
      </div>
    </div>
  </div>
</template>
