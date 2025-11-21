<script lang="ts" setup>
import { INSTAGRAM_ICON, TELEGRAM_ICON, TWITTER_X_ICON } from '~/icons'
import { GEO_ARRAY } from '~/constants'
import { REGISTER_NEWSLETTER } from '~/graphql'
import type { NewsletterMail } from '~/types'

const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const socialLinks = runtimeConfig.public?.socialLinks as any
const regionData = ref()
const { mutate, loading } = useMutation<{
  registerNewsletter: NewsletterMail
}>(REGISTER_NEWSLETTER)

const email = ref('')
const shareLinkClass = `
  rounded-md p-1 inline-flex justify-center items-center
  w-10 h-10
  bg-green-950 backdrop-blur-[7.5px]
`

const { getRegionData } = useRegionBlock()

const route = useRoute()
const router = useRouter()

let intervalCheck: NodeJS.Timeout
const checkFunc = async () => {
  regionData.value = await getRegionData()
  if (
    GEO_ARRAY.includes(regionData.value?.loc) &&
    !runtimeConfig.public?.whitelistIPs?.includes(regionData.value?.ip) &&
    runtimeConfig.public?.checkRegion
  ) {
    delete route.query.modal

    if (route.query) {
      // @ts-ignore
      const queryVal = Object.keys(route.query).map(key => `${key}=${encodeURIComponent(route.query[key])}`).join('&')
      window.location.href = `${router.currentRoute.value.path}?${queryVal}`
    } else {
      window.location.href = router.currentRoute.value.path
    }

    if (intervalCheck) {
      clearInterval(intervalCheck)
    }
  }
}

const submitEmail = () => {
  if (!email.value || email.value === '' || !regionData.value) {
    return
  }

  mutate({
    input: {
      email: email.value,
      ip: regionData.value?.ip,
      location: regionData.value?.loc,
    }
  })
}

onMounted(() => {
  if (intervalCheck) {
    clearInterval(intervalCheck)
  } else {
    intervalCheck = setInterval(checkFunc, 15000)
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
      <p class="text-center text-md sm:text-lg text-white">
        {{ t('notifications.region-block') }}
      </p>
    </div>
    <div class="grid grid-cols-1 max-w-xs w-full gap-y-3 sm:gap-y-4 mx-auto">
      <p class="text-sm">
        {{ t('policies.region-policy') }}
      </p>
      <JInput
        :classes="{
          Input: 'bg-green-950 border ring-transparent rounded-md px-3 h-auto text-sm'
        }"
        :model-value="email"
        :placeholder="t('account.enter-email')"
      >
        <template #endIcon>
          <JbBlankButton
            :disabled="loading || !email"
            class="text-xs text-white font-bold"
            @click="submitEmail"
          >
            {{ t('base.subscribe-now') }}
          </JbBlankButton>
        </template>
      </JInput>
    </div>
    <div class="grid grid-cols-1 gap-y-2">
      <p class="text-sm">
        {{ t('auth.follow-us-on-social') }}
      </p>
      <div class="flex items-center justify-center gap-x-3">
        <a
          :class="shareLinkClass"
          :href="socialLinks.twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg class="text-white cursor-pointer w-[17px] h-[16px]">
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
          <svg
            class="text-white cursor-pointer w-[17px] h-[17px]"
          >
            <use :href="INSTAGRAM_ICON" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>
