<script lang="ts" setup>
import { VERIFY_EMAIL_ADDRESS_MUTATION } from '~/graphql'
import PageLoader from '~/components/molecules/common/PageLoader.vue'
import { AUTH } from '~/constants'

const route = useRoute()
const localePath = useLocalePath()
const hash = computed(() => route.query?.hash || null)
const userId = computed(() => route.query?.userId || 0)
const { t } = useI18n()
const verified = ref(false)
const { openVerifyModal } = inject(AUTH)!
const runtimeConfig = useRuntimeConfig()
const redirectHome = runtimeConfig.public.redirectHome!
const forcePromo = runtimeConfig.public.forcePromo
const forcePromoCode = runtimeConfig.public.forcePromoCode
const homeUrl = `${redirectHome}${forcePromo ? '?promo=' + forcePromoCode : ''}`

const {
  mutate,
  loading: sendLoading,
  onDone,
  onError
} = useMutation(VERIFY_EMAIL_ADDRESS_MUTATION)

onDone((response) => {
  if (response.data?.verifyEmailAddress) {
    verified.value = true
    useGeneralNotify({
      type: 'success',
      title: t('notifications.success'),
      description: 'Your email address has been verified!'
    })

    useTimeoutFn(() => {
      location.href = localePath(homeUrl)
    }, 1000)
  } else {
    useTimeoutFn(() => {
      openVerifyModal()
    }, 1000)
  }
})

onError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message
  })

  useTimeoutFn(() => {
    openVerifyModal()
  }, 1000)
})

watch(() => hash.value, (v) => {
  if (v) {
    mutate({
      hash: hash.value,
      userId: Number(userId.value)
    })
  }
}, { immediate: true })

onMounted(() => {
  if (!hash.value) {
    useGeneralNotify({
      type: 'error',
      title: 'Invalid URL',
      description: 'Invalid Hash has been provided'
    })
  }
})
</script>

<template>
  <UPage class="w-full h-full min-h-[calc(100vh-235px)] flex items-center justify-center">
    <PageLoader v-if="sendLoading" />
    <div
      v-else-if="verified"
      class="flex flex-col gap-2 items-center justify-center w-full h-full min-h-[calc(100vh-235px)]"
    >
      <div class="text-xl md:text-2xl font-bold text-primary">
        {{ t('missing.verified-desc') }}
      </div>
      <div class="text-2xl md:text-3xl font-bold text-primary">
        {{ t('missing.thank-you') }}!
      </div>
    </div>
    <div
      v-else
      class="flex flex-col gap-2 items-center justify-center w-full h-full min-h-[calc(100vh-235px)]"
    >
      <div class="text-2xl md:text-3xl font-bold text-error">
        {{ t('missing.verified-failed-desc') }}!
      </div>
    </div>
  </UPage>
</template>
