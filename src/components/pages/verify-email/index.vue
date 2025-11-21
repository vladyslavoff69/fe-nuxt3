<script lang="ts" setup>
import { INSTAGRAM_ICON, TELEGRAM_ICON, TWITTER_X_ICON } from '~/icons'
import { VERIFY_EMAIL_MUTATION } from '~/graphql'

const { showSocial = true, flexRow = false } = defineProps<{
  showSocial?: boolean;
  flexRow?: boolean;
}>()

const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const socialLinks = runtimeConfig.public?.socialLinks as any
const { mutate: verifyMutate, loading, onDone, onError: verifyError } = useMutation(VERIFY_EMAIL_MUTATION)

onDone((re) => {
  if (
    re.data.verifyEmail &&
    re.data.verifyEmail[0] &&
    re.data.verifyEmail[0] === 'User already verified the email'
  ) {
    useGeneralNotify({
      type: 'info',
      title: t('notifications.account-notification'),
      description: re.data.verifyEmail[0]
    })
  }
})

verifyError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message
  })
})

const sendVerifyEmail = async () => {
  await verifyMutate({})
}

const shareLinkClass = `
  rounded-md p-1 inline-flex justify-center items-center w-10 h-10 bg-green-950 backdrop-blur-[7.5px]
`
</script>

<template>
  <div
    class="grid grid-cols-1 w-full mx-auto gap-y-2 sm:gap-y-3 text-center"
    :class="{
      'max-w-md': !flexRow
    }"
  >
    <div class="grid grid-cols-1 gap-y-2 sm:gap-y-3">
      <JbLogo class="w-36 md:w-48 mx-auto" />
      <p class="text-center text-md sm:text-lg text-white font-bold">
        {{ t('auth.verify-email-address') }}
      </p>
    </div>
    <div
      class="items-center justify-center w-full gap-y-2 sm:gap-y-3 mx-auto"
      :class="{
        'grid max-w-xs grid-cols-1': !flexRow,
        'flex flex-col sm:flex-row max-w-[800px]': flexRow,
      }"
    >
      <p class="text-sm col-span-1 leading-none">
        {{ t('account.verification-email-desc') }}
      </p>
      <JButton
        class="px-2! sm:px-4! py-3! col-span-1 sm:min-w-[200px]"
        button-class="px-1!"
        :loading="loading"
        @click="sendVerifyEmail"
      >
        {{ t('account.verify-email') }}
      </JButton>
    </div>
    <div
      v-if="showSocial"
      class="grid grid-cols-1 gap-y-2"
    >
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
          <svg class="text-white cursor-pointer w-[17px] h-[17px]">
            <use :href="INSTAGRAM_ICON" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>
