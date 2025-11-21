<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'
import { AUTH, EMAIL_VERIFY, TWOFA, } from '~/constants'
import { LOGIN_MUTATION } from '~/graphql'
import { useLocalStorage } from '@vueuse/core'

const { t } = useI18n()
const { emailOrUsername, password, login, loading: meLoading, hideTurnstile, turnstileToken } = inject(AUTH)!
const runtimeConfig = useRuntimeConfig()
const router = useRouter()
const form = reactive({
  emailOrUsername: '',
  password: '',
  turnstileToken: hideTurnstile.value ? undefined : '',
})
const storageUser = useLocalStorage('JB_U_NAME', '')
const storageEmail = useLocalStorage('JB_U_EMAIL', '')

const rules = {
  emailOrUsername: {
    required,
    minLength: minLength(3),
  },
  password: {
    required,
    minLength: minLength(8),
  },
  turnstileToken: {
    required: !hideTurnstile.value,
  },
}
const v$ = useVuelidate(rules, form)
const { onLogin } = useApollo()
const { mutate, loading, onDone, onError, error } = useMutation(LOGIN_MUTATION)
const showPassword = ref(false)
const togglePasswordVisible = () => {
  showPassword.value = !showPassword.value
}

const submitForm = async () => {
  turnstileToken.value = form.turnstileToken

  if (!(await v$.value.$validate()) || loading.value || meLoading.value) {
    return
  }

  if (!hideTurnstile.value && !form.turnstileToken) {
    return
  }

  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  emailOrUsername.value = form.emailOrUsername
  password.value = form.password
  const isEmail = pattern.test(form.emailOrUsername)
  await mutate({
    ...(isEmail ? { email: emailOrUsername.value } : { username: emailOrUsername.value }),
    password: form.password,
    code: '',
    isLogin: runtimeConfig.public.login_tfa
  })
}

const succeedLogin = (username: string, email: string) => {
  useGeneralNotify({
    type: 'success',
    title: greetingMsg(),
    description: `${t('notifications.lets-have-fun')}, ${username}`
  })

  login()

  storageUser.value = username
  storageEmail.value = email
}

onDone(async ({ data }) => {
  await onLogin(data?.login?.token || '')
  succeedLogin(data?.login?.user?.username || '', data?.login?.user?.email || '')
})

onError(({ graphQLErrors }) => {
  const errorCodes = [401, 402, 403]
  const errorMessage = graphQLErrors[0]?.message
  // @ts-ignore
  if (errorCodes.includes(graphQLErrors[0]?.extensions?.errors?.code)) {
    if (
      errorMessage &&
      (
        errorMessage.includes('email') || (
          // @ts-ignore
          graphQLErrors[0]?.extensions?.errors?.code === 402 && errorMessage.includes('The login verification code')
        )
      )
    ) {
      router.push({
        ...router.currentRoute,
        query: {
          type: EMAIL_VERIFY,
          modal: 'auth',
        },
      })
    } else {
      router.push({
        ...router.currentRoute,
        query: {
          type: TWOFA,
          modal: 'auth',
        },
      })
    }
  } else {
    useGeneralNotify({
      type: 'error',
      title: t('notifications.failed-authentication'),
      description: error.value?.message
    })
  }
})
</script>

<template>
  <form
    class="flex flex-col gap-y-3 md:gap-y-4 px-0.5 w-full"
    @submit.prevent="submitForm"
  >
    <div class="w-full">
      <JInput
        :classes="{
          Input: 'bg-form-input border ring-transparent rounded-md px-3 h-auto text-sm'
        }"
        :error="v$.emailOrUsername.$error"
        :model-value="form.emailOrUsername"
        :placeholder="t('auth.username-or-email')"
        @update:model-value="(v: string | number) => form.emailOrUsername = String(v)"
      >
        <template #startIcon>
          <UIcon
            class="w-4 h-4"
            name="i-heroicons-envelope-20-solid"
          />
        </template>
      </JInput>
      <JbInputMessage v-if="v$.emailOrUsername.$error">
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-red-600"
          name="i-heroicons-information-circle-20-solid"
        />
        {{
          v$.emailOrUsername.minLength.$invalid
            ? t('errors.USERNAME_MIN_LENGTH')
            : t('errors.USERNAME_REQUIRED')
        }}
      </JbInputMessage>
    </div>

    <div class="w-full">
      <JInput
        :classes="{
          Input: 'bg-form-input border ring-transparent rounded-md px-3 h-auto text-sm'
        }"
        :error="v$.password.$error"
        :model-value="form.password"
        :placeholder="t('auth.enter-your-password')"
        :type="showPassword ? 'text' : 'password'"
        @update:model-value="(v: string | number) => form.password = String(v)"
        @keyup.enter="submitForm"
      >
        <template #startIcon>
          <UIcon
            class="w-4 h-4"
            name="i-heroicons-lock-closed-20-solid"
          />
        </template>
        <template #endIcon>
          <JbBlankButton
            class="w-4 h-4 flex items-center"
            @click="togglePasswordVisible"
          >
            <template v-if="!showPassword">
              <UIcon
                class="w-4 h-4"
                name="i-heroicons-eye-20-solid"
              />
            </template>
            <template v-else>
              <UIcon
                class="w-4 h-4"
                name="i-heroicons-eye-slash-20-solid"
              />
            </template>
          </JbBlankButton>
        </template>
      </JInput>
      <JbInputMessage v-if="v$.password.$error">
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-red-600"
          name="i-heroicons-information-circle-20-solid"
        />

        {{
          v$.password.minLength.$invalid
            ? t('errors.LOGIN_PASSWORD_MIN_LENGTH')
            : t('errors.PASSWORD_REQUIRED')
        }}
      </JbInputMessage>
    </div>

    <NuxtTurnstile
      v-if="!hideTurnstile"
      v-model="form.turnstileToken"
      :site-key="runtimeConfig.public.turnstileSiteKey"
    />

    <JbInputMessage v-if="v$.turnstileToken.$error">
      <UIcon
        class="w-4 h-4 min-w-4 min-h-4 text-red-600"
        name="i-heroicons-information-circle-20-solid"
      />

      {{ t('auth.turnstile-required') }}
    </JbInputMessage>

    <div class="w-full">
      <JButton
        :disabled="(!hideTurnstile && !form.turnstileToken) || loading || meLoading"
        :loading="loading || meLoading"
        class="w-full py-2.5 box-border"
        type="submit"
        variant="primary"
        @click="submitForm"
      >
        {{ t('auth.login') }}
      </JButton>
    </div>
  </form>
</template>
