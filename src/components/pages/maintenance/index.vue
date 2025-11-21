<script lang="ts" setup>
import { INSTAGRAM_ICON, TELEGRAM_ICON, TWITTER_X_ICON } from '~/icons'

const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const redirectHome = runtimeConfig.public.redirectHome!
const forcePromo = runtimeConfig.public.forcePromo
const forcePromoCode = runtimeConfig.public.forcePromoCode
const homeUrl = `${redirectHome}${forcePromo ? '?promo=' + forcePromoCode : ''}`
const socialLinks = runtimeConfig.public?.socialLinks as any
const localePath = useLocalePath()
const { getStatusCheck } = useMaintenanceMode()

const shareLinkClass = `
  rounded-md p-1 inline-flex justify-center items-center
  w-10 h-10 bg-green-950 backdrop-blur-[7.5px]
`

let intervalCheck: NodeJS.Timeout
const checkFunc = async () => {
  const check: any = await getStatusCheck()

  if (!check?.timestamp && window.location.pathname !== 'maintenance') {
    window.location.href = localePath('/maintenance')
  } else if (window.location.pathname === 'maintenance') {
    navigateTo(localePath(homeUrl))

    if (intervalCheck) {
      clearInterval(intervalCheck)
    }
  }
}

onMounted(async () => {
  if (intervalCheck) {
    clearInterval(intervalCheck)
  } else {
    intervalCheck = setInterval(checkFunc, 10000)
  }
})

onBeforeUnmount(() => {
  if (intervalCheck) {
    clearInterval(intervalCheck)
  }
})
</script>

<template>
  <div class="grid grid-cols-1 max-w-md w-full mx-auto gap-y-4 text-center">
    <div class="grid grid-cols-1 gap-y-4 sm:gap-y-6">
      <JbLogo class="w-36 md:w-48 mx-auto" />
    </div>
    <div class="grid grid-cols-1 max-w-xs w-full gap-y-3 sm:gap-y-4 mx-auto font-semibold">
      {{ t('base.maintenance') }}
    </div>
    <div class="grid grid-cols-1 gap-y-2">
      <p class="text-sm font-bold">
        {{ t('auth.follow-us-on-social') }}
      </p>
      <div class="flex items-center justify-center gap-x-3">
        <a
          :class="shareLinkClass"
          :href="socialLinks.twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg class="text-white cursor-pointer w-[17px] h-4 min-h-4">
            <use :href="TWITTER_X_ICON" />
          </svg>
        </a>
        <a
          :class="shareLinkClass"
          :href="socialLinks.telegram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg class="text-white cursor-pointer w-[18px] h-[15px]">
            <use :href="TELEGRAM_ICON" />
          </svg>
        </a>
        <a
          :class="shareLinkClass"
          :href="socialLinks.instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg class="text-white cursor-pointer w-[17px] h-[17px]">
            <use :href="INSTAGRAM_ICON" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>
