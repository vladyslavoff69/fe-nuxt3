<script lang="ts" setup>
import { FACEBOOK_ICON, GOOGLE_ICON } from '~/icons'
import { GET_SOCIAL_URL_QUERY } from '~/graphql'
import { LOGIN } from '~/constants'

const {
  authType = LOGIN,
  disabled = false,
} = defineProps<{
  authType?: string;
  disabled?: boolean;
}>()

const otherLoginOpts = [
  {
    icon: FACEBOOK_ICON,
    class: 'w-[29px] h-[29px]',
    service: 'facebook'
  },
  {
    icon: GOOGLE_ICON,
    class: 'w-[25px] h-[27px]',
    service: 'google'
  },
]

const route = useRoute()
const loading = ref(false)
const affiliateCode = computed(() => (route.query.ref ? String(route.query.ref) : ''))
const { loginByPasskey, loginLoading } = usePasskeyLogin()

const onSocialOAuth = async (provider: string) => {
  loading.value = true
  const { data } = await useAsyncQuery<{
    getSocialContent: {
      url: string;
    };
  }>(GET_SOCIAL_URL_QUERY, {
    provider,
  })

  if (affiliateCode.value !== '') {
    // @ts-ignore
    localStorage.setItem('JUNGLEBET_AFFILIATE_CODE', affiliateCode.value)
  }

  window.location.href = String(data.value?.getSocialContent.url)
}
</script>

<template>
  <div class="flex justify-center gap-x-3 md:gap-x-4">
    <!--    <UTooltip-->
    <!--      v-if="authType === LOGIN"-->
    <!--      :popper="{ arrow: true }"-->
    <!--      :ui="TOOLTIP_CONFIG"-->
    <!--      text="Passkey"-->
    <!--    >-->
    <!--      <JButton-->
    <!--        :disabled="disabled"-->
    <!--        :loading="loading || loginLoading"-->
    <!--        class="p-2.5 w-[45px] h-[45px] bg-form-input! hover:ring-1 hover:ring-highlights text-white hover:text-brand"-->
    <!--        variant="outline"-->
    <!--        @click="loginByPasskey"-->
    <!--      >-->
    <!--        <UIcon-->
    <!--          class="w-7 h-7 min-w-7 min-h-7"-->
    <!--          name="fluent:person-passkey-28-filled"-->
    <!--        />-->
    <!--      </JButton>-->
    <!--    </UTooltip>-->
    <JButton
      v-for="(opt, idx) in otherLoginOpts"
      :key="`r_${idx}-hey-5`"
      :disabled="disabled"
      :loading="loading || loginLoading"
      class="p-2.5 w-[45px] h-[45px] bg-form-input! hover:ring-1 hover:ring-highlights text-white"
      variant="outline"
      @click="onSocialOAuth(opt.service)"
    >
      <svg :class="opt.class">
        <use :href="opt.icon" />
      </svg>
    </JButton>
  </div>
</template>
