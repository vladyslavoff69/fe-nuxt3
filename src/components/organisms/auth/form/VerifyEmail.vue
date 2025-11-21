<script lang="ts" setup>
import { maxLength, minLength, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { AUTH, THEME } from '~/constants'
import { LOGIN_MUTATION, SEND_EMAIL_TWO_FA_MUTATION } from '~/graphql'
import VerificationCode from '~/components/molecules/inputs/VerificationCode.vue'

const { mutate, loading, onDone, onError } = useMutation(LOGIN_MUTATION)
const {
  mutate: sendEmailTwoFaMutate,
  loading: sendingEmail,
  onDone: onDoneSendEmailTwoFa,
  onError: onErrorSendEmailTwoFa,
} = useMutation(SEND_EMAIL_TWO_FA_MUTATION)

const { t } = useI18n()
const { screen } = inject(THEME)!
const { onLogin } = useApollo()
const diffTime = ref<number>(0)
const { emailOrUsername, password, login } = inject(AUTH)!
const verifyCode = ref<string>('')

const updateVerifyCode = async (value: string) => {
  verifyCode.value = value
  await v$.value.$validate()
}

const rules = computed(() => {
  return {
    verifyCode: { required, minLength: minLength(6), maxLength: maxLength(6) },
  }
})

const v$ = useVuelidate(rules, { verifyCode })

const onSubmit = async () => {
  if (!(await v$.value.$validate()) || loading.value || sendingEmail.value) {
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

watch(() => verifyCode.value, (v) => {
  if (v && v.length === 6) {
    onSubmit()
  }
}, { immediate: true })

const invalidNotify = () => {
  useGeneralNotify({
    type: 'error',
    title: t('errors.INCORRECT_VERIFICATION_CODE'),
    description: t('errors.LOGIN_VERIFICATION_CODE_NOT_MATCH'),
  })
}

onDone(async ({ data }) => {
  if (data && data.login) {
    await onLogin(data.login?.token)
    useGeneralNotify({
      type: 'success',
      title: t('notifications.welcome'),
      description: `${t('notifications.lets-have-fun')}, ${data.login?.user.username}`,
    })

    login()
  } else {
    invalidNotify()
  }
})

onError(() => {
  invalidNotify()
})

const onClickResend = () => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isEmail = pattern.test(emailOrUsername.value)
  sendEmailTwoFaMutate({
    ...(isEmail ? { email: emailOrUsername.value } : { username: emailOrUsername.value }),
  })
}

onDoneSendEmailTwoFa(() => {
  if (diffTime.value <= 0) {
    diffTime.value = 60
    const timeInterval: NodeJS.Timeout = setInterval(() => {
      diffTime.value -= 1
      if (diffTime.value === 0) {
        clearInterval(timeInterval)
      }
    }, 1000)
  }
})

onErrorSendEmailTwoFa(({ graphQLErrors }) => {
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: graphQLErrors[0].message,
  })
})
</script>

<template>
  <div
    class="
      w-full flex flex-col gap-y-3 md:gap-y-4
      font-semibold text-sm md:text-base px-0.5
    "
  >
    <p class="text-paragraph text-left">
      Please enter the 6-digit code sent to your email.
    </p>

    <div class="w-full flex flex-col gap-y-1">
      <div class="flex justify-between items-center">
        <span class="text-white font-bold">
          Verification Code
        </span>
        <span
          v-if="diffTime > 0"
          class="text-paragraph text-xs md:text-sm"
        >
          {{ diffTime }}
        </span>
      </div>
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
    </div>

    <JbInputMessage v-if="v$.verifyCode.$error">
      <UIcon
        class="w-4 h-4 min-w-4 min-h-4 text-red-600"
        name="i-heroicons-information-circle-20-solid"
      />
      {{ t('errors.INVALID_2FA_CODE') }}
    </JbInputMessage>

    <div class="text-paragraph flex items-center gap-x-1">
      Didn’t receive the code?
      <JbBlankButton
        :disabled="diffTime > 0"
        class="text-white font-semibold"
        @click="onClickResend"
      >
        Resend Code
      </JbBlankButton>
    </div>

    <JButton
      :loading="loading || sendingEmail"
      class="w-full py-2.5"
      variant="primary"
      @click="onSubmit"
    >
      Submit
    </JButton>
  </div>
</template>
