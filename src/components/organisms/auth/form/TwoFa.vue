<script lang="ts" setup>
import { maxLength, minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { AUTH, THEME } from '~/constants'
import { LOGIN_MUTATION } from '~/graphql'
import VerificationCode from '~/components/molecules/inputs/VerificationCode.vue'

const { t } = useI18n()
const { mutate, loading, onDone, onError } = useMutation(LOGIN_MUTATION)
const { onLogin } = useApollo()
const { emailOrUsername, password, login } = inject(AUTH)!
const { screen } = inject(THEME)!
const verifyCode = ref<string>('')

const updateVerifyCode = async (value: string) => {
  verifyCode.value = value
}

const rules = computed(() => {
  return {
    verifyCode: { required, minLength: minLength(6), maxLength: maxLength(6) },
  }
})

const v$ = useVuelidate(rules, { verifyCode })
const onSubmit = async () => {
  if (!(await v$.value.$validate()) || loading.value) {
    return
  }

  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isEmail = pattern.test(emailOrUsername.value)
  await mutate({
    ...(isEmail ? { email: emailOrUsername.value } : { username: emailOrUsername.value }),
    password: password.value,
    code: verifyCode.value,
  })
}

const invalidNotify = () => {
  useGeneralNotify({
    type: 'error',
    title: t('notifications.incorrect-2fa-code'),
    description: t('errors.TWO_FA_CODE_NOT_MATCH')
  })
}

onDone(async ({ data }) => {
  if (data && data.login) {
    await onLogin(data.login.token)
    useGeneralNotify({
      type: 'success',
      title: greetingMsg(),
      description: `${t('notifications.lets-have-fun')}, ${data.login.user?.username}`
    })
    login()
  } else {
    invalidNotify()
  }
})

onError(() => {
  invalidNotify()
})

watch(() => verifyCode.value, (v) => {
  if (v && v.length === 6) {
    onSubmit()
  }
}, { immediate: true })
</script>

<template>
  <div
    class="w-full flex flex-col gap-y-3 md:gap-y-4 font-semibold text-sm md:text-base px-0.5"
  >
    <p class="text-paragraph text-left">
      {{ t('currency.enter-6-digit-code-confirm-process-google-authenticator') }}
    </p>

    <p class="text-paragraph text-left">
      {{ t('base.verification-code') }}
    </p>

    <div v-if="screen.lg">
      <VerificationCode
        input-class="bg-brand!"
        width="w-full h-auto min-h-12"
        @update:code="updateVerifyCode"
      />
    </div>
    <div v-else>
      <JInput
        v-model="verifyCode"
        :classes="{
          Input: 'w-full bg-divider-dark! px-4 text-sm! border-none! h-11! rounded! text-center'
        }"
        type="text"
      />
    </div>

    <JbInputMessage v-if="v$.verifyCode.$error">
      <UIcon
        class="w-4 h-4 min-w-4 min-h-4 text-red-600"
        name="i-heroicons-information-circle-20-solid"
      />
      {{ t('errors.INVALID_2FA_CODE') }}
    </JbInputMessage>

    <JButton
      :loading="loading"
      class="w-full py-2.5"
      variant="primary"
      @click="onSubmit"
    >
      Submit
    </JButton>
  </div>
</template>
