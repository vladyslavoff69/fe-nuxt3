<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { email as validEmail, maxLength, minLength, required } from '@vuelidate/validators'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import InputCheckbox from '~/components/molecules/common/InputCheckbox.vue'
import { AUTH, SITE_SETTINGS, } from '~/constants'
import { CIRCLE_CHECK_ICON } from '~/icons'
import { CREATE_USER_MUTATION } from '~/graphql'
import TosMessage from '~/components/organisms/auth/form/TosMessage.vue'
import useFingerprint from '~/composables/auth/useFingerprint'
import LazyTermsOfServiceModal from '~/components/organisms/modals/TermsOfServiceModal.vue'

const { staticAffiliate = false } = defineProps<{
  staticAffiliate?: boolean;
}>()

const { fingerprintToken, languages } = inject(SITE_SETTINGS)!
const { emailOrUsername, affiliateCode, login, hideTurnstile, turnstileToken } = inject(AUTH)!
const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()

const form = reactive({
  email: '',
  username: '',
  password: '',
  language_id: 'en',
  hasCode: false,
  sponsorCode: '',
  isConfirmed: false,
  turnstileToken: hideTurnstile.value ? undefined : '',
})

const rules = {
  email: {
    validEmail,
    required,
    checkAtLetter,
    checkDotLetter,
    minLength: minLength(3),
  },
  username: {
    required,
    minLength: minLength(3),
    maxLength: maxLength(14),
    checkNameLetters,
  },
  password: {
    required,
    minLength: minLength(8),
    checkNumberAndSymbol,
    checkLetters,
  },
  turnstileToken: {
    required: !hideTurnstile.value,
  }
}

const v$ = useVuelidate(rules, form)
const { onLogin } = useApollo()
const runtimeConfig = useRuntimeConfig()
const redirectHome = runtimeConfig.public.redirectHome!
const showPassword = ref<boolean>(false)
const isVisitor = ref<boolean>(false)
const emailErrorString = ref<string>('')
const isEmailError = computed(() => !!emailErrorString.value)
const usernameErrorString = ref<string>('')
const isUsernameError = computed(() => !!usernameErrorString.value)
const isConfirmedError = ref<boolean>(false)
const isSponsorCodeError = ref<boolean>(false)
const { mutate, loading, onDone, onError, error } = useMutation(CREATE_USER_MUTATION)

const modalOverlay = useOverlay()
const termsModal = modalOverlay.create(LazyTermsOfServiceModal)

const validationForm = async () => {
  isSponsorCodeError.value = false
  if (!(await v$.value.$validate())) {
    return false
  }

  if (affiliateCode.value !== '') {
    form.hasCode = true
    // @ts-ignore
    form.sponsorCode = affiliateCode.value
  }

  if (form.hasCode && (!form.sponsorCode || form.sponsorCode === '')) {
    isSponsorCodeError.value = true
    return false
  }

  usernameErrorString.value = ''

  const jSponsorCode = useLocalStorage('JUNGLEBET_AFFILIATE_CODE', '')
  const jbReferrer = useLocalStorage('jbReferrer', '')

  if (jSponsorCode.value !== '' && form.sponsorCode === '') {
    form.hasCode = true
    form.sponsorCode = jSponsorCode.value
    jSponsorCode.value = null
  }

  if (jbReferrer.value !== '' && !isVisitor.value) {
    isVisitor.value = jbReferrer.value === 'Visitor'
    jbReferrer.value = null
  }

  return true
}

const openTermsModal = async () => {
  termsModal.open()
}

const { visitorToken } = await useFingerprint()
const onSubmit = async () => {
  if (!(await validationForm()) || !form.isConfirmed || (!hideTurnstile && !form.turnstileToken)) {
    isConfirmedError.value = !form.isConfirmed
    return
  }

  fingerprintToken.value = visitorToken

  turnstileToken.value = form.turnstileToken

  usernameErrorString.value = ''
  emailErrorString.value = ''
  isConfirmedError.value = false

  const requestParams: any = {
    email: form.email,
    password: form.password,
    username: form.username,
    fingerprint: fingerprintToken.value,
  }

  if (form.sponsorCode && form.sponsorCode !== '') {
    requestParams.sponsorCode = form.sponsorCode
  }

  if (isVisitor.value) {
    requestParams.isVisitor = isVisitor.value
  }

  await mutate(requestParams)
}

const mutationDone = async (token: string, username: string) => {
  await onLogin(token)
  login()

  termsModal.close()

  useGeneralNotify({
    type: 'success',
    title: t('notifications.welcome'),
    description: `${t('notifications.welcome-to-junglebet')}, ${username}. Please select a charity for Junglebet to send a portion of its revenue too`
  })

  await router.push(localePath(redirectHome))
}

const mutationError = (graphQLErrors: any, errorVal: any) => {
  if (
    Array.isArray(graphQLErrors) &&
    graphQLErrors[0]?.extensions?.validation
  ) {
    const validationErrors = graphQLErrors[0]?.extensions?.validation
    if (Array.isArray(validationErrors['input.username'])) {
      usernameErrorString.value = validationErrors['input.username'][0]
    }
  }

  const parsedError = parseGraphqlError(errorVal)
  if (parsedError.message.includes('users_email_unique')) {
    useGeneralNotify({
      type: 'error',
      title: t('notifications.failed-registration'),
      description: 'The email has been taken'
    })
  } else {
    useGeneralNotify({
      type: 'error',
      title: t('notifications.failed-registration'),
      description: parsedError.message
    })
  }
}

onDone(async ({ data }) => {
  try {
    await mutationDone(data?.createUser?.token, data?.createUser?.user?.username)
  } catch (e) {
    useGeneralNotify({
      type: 'error',
      title: t('notifications.failed-registration'),
      description: t('errors.SOMETHING_WENT_WRONG_RELOAD')
    })
  }
})

onError(({ graphQLErrors }) => {
  mutationError(graphQLErrors, error.value)
})

const togglePasswordVisible = () => {
  showPassword.value = !showPassword.value
}

onMounted(() => {
  form.email = emailOrUsername.value

  if (affiliateCode.value !== '') {
    form.hasCode = true
    // @ts-ignore
    form.sponsorCode = affiliateCode.value
  }
})

const inputClass = 'bg-form-input border ring-transparent rounded-md px-3 h-auto text-sm'

const [codeParent] = useAutoAnimate({
  duration: 150
})
</script>

<template>
  <div
    class="flex flex-col gap-y-3 sm:gap-y-2.5 px-0.5 w-full"
  >
    <div class="w-full">
      <JInput
        v-model="form.email"
        :classes="{
          Input: inputClass
        }"
        :error="v$.email.$error || isEmailError"
        :placeholder="t('auth.enter-email-address')"
      >
        <template #startIcon>
          <UIcon
            class="w-4 h-4"
            name="i-heroicons-envelope-20-solid"
          />
        </template>
      </JInput>
      <JbInputMessage v-if="v$.email.$error || isEmailError">
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-red-600"
          name="i-heroicons-information-circle-20-solid"
        />
        {{
          isEmailError
            ? emailErrorString
            : v$.email.checkAtLetter.$invalid
              ? 'Must include @ symbol'
              : v$.email.required.$invalid
                ? t('errors.EMAIL_REQUIRED')
                : t('errors.EMAIL_INVALID')
        }}
      </JbInputMessage>
    </div>

    <div class="w-full">
      <JInput
        v-model="form.username"
        :classes="{
          Input: inputClass
        }"
        :error="v$.username.$error || isUsernameError"
        :placeholder="t('auth.create-username')"
        autocomplete="off"
      >
        <template #startIcon>
          <UIcon
            class="w-4 h-4"
            name="i-heroicons-user-circle-20-solid"
          />
        </template>
      </JInput>
      <JbInputMessage v-if="v$.username.$error || isUsernameError">
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-red-600"
          name="i-heroicons-information-circle-20-solid"
        />
        {{
          v$.username.required.$invalid
            ? t('errors.USERNAME_REQUIRED')
            : v$.username.minLength.$invalid
              ? t('errors.USERNAME_MIN_LENGTH')
              : v$.username.maxLength.$invalid
                ? t('errors.USERNAME_MAX_LENGTH')
                : v$.username.checkNameLetters.$invalid
                  ? t('errors.USERNAME_INVALID')
                  : usernameErrorString
        }}
      </JbInputMessage>
    </div>

    <div class="w-full">
      <JInput
        v-model="form.password"
        :classes="{
          Input: inputClass
        }"
        :placeholder="t('auth.create-password')"
        :type="showPassword ? 'text' : 'password'"
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

      <div v-if="form.password.length > 0">
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
          {{ t('errors.PASSWORD_MIN_LENGTH') }}
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
    </div>

    <JSelect
      v-model="form.language_id"
      :classes="{
        ListboxButton: 'bg-brand! border border-transparent hover:border-highlights rounded-md px-4 py-2.5 pr-2.5! h-auto text-sm',
        StartIcon: 'mr-2',
        ListboxOptions: 'bg-brand!'
      }"
      :options="languages"
      :placeholder="t('base.choose-language')"
      variant="none"
    >
      <template #startIcon>
        <UIcon
          class="w-4 h-4 text-paragraph"
          name="i-ion-globe-outline"
        />
      </template>
    </JSelect>

    <div class="w-full">
      <div class="text-left">
        <InputCheckbox
          v-model="form.isConfirmed"
        >
          <span class="cursor-pointer text-sm leading-none text-paragraph hover:text-white">
            {{ t('auth.confirm-18plus-and-read') }}
            <span
              class="font-bold"
              @click="openTermsModal"
            >
              {{ t('auth.terms-of-service') }}
            </span>
          </span>
        </InputCheckbox>
      </div>
      <template v-if="isConfirmedError">
        <TosMessage />
      </template>
    </div>

    <div
      ref="codeParent"
      class="flex flex-col gap-y-2.5"
    >
      <InputCheckbox
        v-model="form.hasCode"
        :disabled="staticAffiliate"
      >
        <span
          class="cursor-pointer m-0 text-sm text-paragraph hover:text-white"
        >
          {{ staticAffiliate ? t('vip.aff-code') : t('auth.code-optional') }}
        </span>
      </InputCheckbox>
      <JInput
        v-if="form.hasCode || staticAffiliate"
        v-model="form.sponsorCode"
        :classes="{
          Input: inputClass
        }"
        :readonly="staticAffiliate"
        placeholder=""
      />
      <JbInputMessage v-if="isSponsorCodeError">
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-red-600"
          name="i-heroicons-information-circle-20-solid"
        />

        {{ t('errors.ENTER_VALID_CODE') }}
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
        :disabled="(!hideTurnstile && !form.turnstileToken) || !form.isConfirmed"
        :loading="loading"
        class="w-full py-2.5"
        variant="primary"
        @click="onSubmit"
      >
        {{ t('auth.create-account') }}
      </JButton>
    </div>
  </div>
</template>
