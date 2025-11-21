<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { minLength, required, sameAs } from '@vuelidate/validators'
import { AUTH, LOGIN, } from '~/constants'
import { RESET_PASSWORD_MUTATION } from '~/graphql'
import { CIRCLE_CHECK_ICON } from '~/icons'

const { t } = useI18n()
const { hideTurnstile, turnstileToken } = inject(AUTH)!
const route = useRoute()
const router = useRouter()
const runtimeConfig = useRuntimeConfig()
const token = computed(() => route.query.token ? String(route.query.token) : '')
const emailAddress = computed(() => decodeURIComponent(route.query.email ? String(route.query.email) : ''))
const verifyCode = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')

const rules = {
  password: {
    required,
    minLength: minLength(8),
    checkNumberAndSymbol,
    checkLetters,
  },
  confirmPassword: {
    required,
    sameAs: sameAs(password),
  },
  turnstileToken: {
    required: !hideTurnstile.value
  }
}

const v$ = useVuelidate(rules, {
  password,
  confirmPassword,
  turnstileToken,
})

const showPassword = ref<boolean>(false)

const {
  mutate,
  loading: resetLoading,
  onDone,
  onError,
} = useMutation(RESET_PASSWORD_MUTATION)

const onSubmit = async () => {
  if (!(await v$.value.$validate()) || resetLoading.value) {
    return
  }

  await mutate({
    password: password.value,
    password_confirmation: confirmPassword.value,
    token: token.value,
    email: emailAddress.value,
    code: verifyCode.value,
  })
}

onDone(async ({ data }) => {
  useGeneralNotify({
    type: 'success',
    title: t('notifications.success'),
    description: data?.resetPassword[0]
  })

  await router.push({
    path: router.currentRoute.value.path,
    query: {
      type: LOGIN,
      modal: 'auth',
    },
  })
})

onError((error) => {
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.failed-reset-password'),
    description: parsedError.message
  })
})

const togglePasswordVisible = () => {
  showPassword.value = !showPassword.value
}

const inputClass = 'bg-form-input border border-border rounded-md px-3 h-auto text-sm'
</script>

<template>
  <div
    class="flex flex-col gap-y-3 px-0.5 w-full"
  >
    <div
      class="w-full flex flex-col gap-y-1"
    >
      <p class="text-base font-bold text-white text-left leading-none">
        {{ t('account.new-password') }}
      </p>
      <p class="text-paragraph text-sm text-left leading-normal">
        {{ t('account.must-be-unique-char_symbol') }}
      </p>
      <JInput
        v-model="password"
        :classes="{
          Input: inputClass
        }"
        :error="v$.password.$error"
        :placeholder="t('account.new-password')"
        :type="showPassword ? 'text' : 'password'"
      >
        <template #startIcon>
          <UIcon
            class="w-4 h-4 min-w-4 min-h-4"
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
                name="i-heroicons-eye-20-solid"
              />
            </template>
            <template v-else>
              <UIcon
                name="i-heroicons-eye-slash-20-solid"
              />
            </template>
          </JbBlankButton>
        </template>
      </JInput>
      <JbInputMessage v-if="v$.password.$error && v$.password.required.$invalid">
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-red-600"
          name="i-heroicons-information-circle-20-solid"
        />
        {{
          t('errors.PASSWORD_REQUIRED')
        }}
      </JbInputMessage>
    </div>

    <div
      class="w-full"
    >
      <p class="text-base font-bold text-white text-left">
        {{ t('account.confirm-new-password') }}
      </p>
      <JInput
        v-model="confirmPassword"
        :classes="{
          Input: inputClass
        }"
        :error="v$.confirmPassword.$error"
        :placeholder="t('account.new-password')"
        :type="showPassword ? 'text' : 'password'"
      >
        <template #startIcon>
          <UIcon
            class="w-4 h-4 min-w-4 min-h-4"
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
                name="i-heroicons-eye-20-solid"
              />
            </template>
            <template v-else>
              <UIcon
                name="i-heroicons-eye-slash-20-solid"
              />
            </template>
          </JbBlankButton>
        </template>
      </JInput>
      <JbInputMessage v-if="v$.confirmPassword.$error">
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-red-600"
          name="i-heroicons-information-circle-20-solid"
        />
        {{ t('errors.PASSWORD_NOT_MATCH') }}
      </JbInputMessage>
    </div>

    <div
      v-if="password.length > 0"
      class="w-full"
    >
      <JbInputMessage
        :class="
          !v$.password.minLength.$invalid
            ? 'text-primary'
            : 'text-red-600'
        "
        class="mt-1 text-left"
        type="info"
      >
        <svg
          class="w-3 h-3 min-w-3 min-h-3"
        >
          <use :href="CIRCLE_CHECK_ICON" />
        </svg>
        {{ t('errors.LOGIN_PASSWORD_MIN_LENGTH') }}
      </JbInputMessage>
      <JbInputMessage
        :class="
          !v$.password.checkNumberAndSymbol.$invalid
            ? 'text-primary'
            : 'text-red-600'
        "
        class="mt-1 text-left"
        type="info"
      >
        <svg
          class="w-3 h-3 min-w-3 min-h-3"
        >
          <use :href="CIRCLE_CHECK_ICON" />
        </svg>
        {{ t('errors.PASSWORD_SYMBOL_NUMBER') }}
      </JbInputMessage>
      <JbInputMessage
        :class="
          !v$.password.checkLetters.$invalid
            ? 'text-primary'
            : 'text-red-600'
        "
        class="mt-1 text-left"
        type="info"
      >
        <svg
          class="w-3 h-3 min-w-3 min-h-3"
        >
          <use :href="CIRCLE_CHECK_ICON" />
        </svg>
        {{ t('errors.PASSWORD_LETTERS') }}
      </JbInputMessage>
    </div>

    <NuxtTurnstile
      v-if="!hideTurnstile"
      v-model="turnstileToken"
      :site-key="runtimeConfig.public.turnstileSiteKey"
    />

    <div class="w-full">
      <JButton
        :disabled="(!hideTurnstile && !turnstileToken) || !password"
        :loading="resetLoading"
        class="w-full py-2.5"
        variant="primary"
        @click="onSubmit"
      >
        {{ t('base.submit') }}
      </JButton>
    </div>
  </div>
</template>
