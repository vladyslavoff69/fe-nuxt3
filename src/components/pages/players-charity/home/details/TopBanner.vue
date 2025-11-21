<script lang="ts" setup>
import { ON_AIR_ICON } from '~/components/symbols'
import { CHARITY_COUNT_DOWN_QUERY } from '~/graphql'
import { AUTH, PREFERENCE, SITE_SETTINGS } from '~/constants'

const router = useRouter()
const { t } = useI18n()
const localePath = useLocalePath()
const { activeFiatCode } = inject(PREFERENCE)!
const { isLoggedIn } = inject(AUTH)!
const { charities } = inject(SITE_SETTINGS)!
const { result, refetch } = useQuery(CHARITY_COUNT_DOWN_QUERY, {
  fiatCurrency: activeFiatCode.value
})

watch(
  () => activeFiatCode.value,
  (_currentFiatCode) => {
    refetch({
      fiatCurrency: _currentFiatCode
    })
  },
  { immediate: true }
)

const topBannerDescriptionTxt = computed(() => {
  return t('charity.top-banner-description-txt').replace('no extra cost to you', '<span class="uppercase font-bold text-primary">no extra cost to you</span>')
})

const countDownData = computed(() => result.value?.charityCountDown || [])
</script>

<template>
  <div class="w-full flex flex-col-reverse sm:flex-row">
    <div class="flex-1 grid gap-y-5">
      <div class="flex flex-col gap-y-4 items-center lg:items-start">
        <div class="grid gap-y-2">
          <h4
            class="
             text-primary uppercase font-extrabold text-center sm:text-left text-sm sm:text-base leading-[15px] lg:leading-none tracking-primary
            "
          >
            {{ t('charity.beyond-games') }}
          </h4>
          <div
            class="
              text-3xl sm:text-xxl lg:text-5xl
              text-center lg:text-start
              leading-7 sm:leading-11
              font-extrabold
              text-white
              tracking-[0.64px]
              uppercase
              flex flex-col
            "
          >
            <span>
              {{ t('charity.top-banner-header-txt1') }}
            </span>
            <span class="text-primary">
              {{ t('charity.charity-donations') }}
            </span>
          </div>
        </div>
        <p
          class="w-full text-sm sm:text-lg text-center sm:text-left font-semibold leading-5!"
          v-html="topBannerDescriptionTxt"
        />
        <div class="grid grid-cols-1 w-full sm:w-96 gap-y-3">
          <div class="flex items-center w-full justify-center sm:justify-start">
            <div class="flex-1 text-center font-extrabold px-4">
              <h2 class="text-lg xs:text-2xl text-white">
                {{ countDownData?.totalDonations || '$0' }}
              </h2>
              <div class="flex justify-center items-center gap-x-2">
                <svg
                  class="block text-red-600 w-4 sm:w-5 h-4"
                >
                  <use :href="ON_AIR_ICON" />
                </svg>
                <span class="text-sm xs:text-base font-bold leading-7 text-nowrap">
                  {{ t('base.junglebet') }} {{ t('charity.donations') }}
                </span>
              </div>
            </div>
            <div
              v-if="isLoggedIn"
              class="flex-1 text-center font-bold px-4 border-l border-l-border"
            >
              <h2 class="text-lg xs:text-2xl text-white">
                {{ countDownData?.totalPlayerDonation || '$0' }}
              </h2>
              <div class="flex justify-center items-center">
                <span class="text-sm xs:text-base font-bold leading-7 text-nowrap">
                  {{ t('charity.claimable-donations') }}
                </span>
              </div>
            </div>
          </div>
          <JButton
            :disabled="charities.length < 1"
            class="w-full block uppercase"
            @click.prevent="router.push({ path: localePath(`/players-charity/${charities[0].id}`) })
            "
          >
            <span class="text-xs sm:text-sm">
              {{ t('base.explore') }}
            </span>
          </JButton>
        </div>
      </div>
    </div>
    <div
      class="
        flex-1
        gap-x-9 sm:gap-y-5 lg:gap-y-0
        flex flex-col sm:flex-row justify-center
      "
    >
      <div class="flex-1 flex justify-center">
        <NuxtImg
          alt="Vote Box"
          class="w-auto h-auto sm:w-56 sm:h-72"
          loading="lazy"
          provider="cloudflare"
          src="44b18500-f6c5-43aa-d1c8-0123ee8c2000/sm"
        />
      </div>
      <div v-if="isLoggedIn">
        <NuxtLinkLocale
          class="mx-auto sm:mx-0 hidden sm:block"
          to="/transactions?account=donations&tabs=donations"
        >
          <span class="flex items-center gap-x-1">
            <UIcon
              class="w-4 h-4"
              name="ion:download-outline"
            />
            <span>{{ t('charity.donation-records') }}</span>
          </span>
        </NuxtLinkLocale>
      </div>
    </div>
  </div>
</template>
