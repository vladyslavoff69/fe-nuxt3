<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { maxLength, minLength, required, sameAs } from '@vuelidate/validators'
import copy from 'copy-to-clipboard'
import QrcodeVue from 'qrcode.vue'
import VerificationCode from '~/components/molecules/inputs/VerificationCode.vue'
import { AUTH, THEME } from '~/constants'
import { CONFIRM_QR_MUTATION, DISABLE_TWOFA_MUTATION, MAKE_QR_MUTATION, PASSWORD_CHANGE_MUTATION, } from '~/graphql'
import { CIRCLE_CHECK_ICON } from '~/icons'

const { me, refetch }: any = inject(AUTH)!
const { screen } = inject(THEME)!
const { t } = useI18n()
const { logout } = useLogout()
const inputClass = 'bg-green-950 border border-transparent rounded-md px-3 h-auto text-sm'
const currentPassword = ref<string>('')
const newPassword = ref<string>('')
const tfaPassword = ref<string>('')
const confirmPassword = ref<string>('')

const form = reactive({
  email: me.value?.email
})

const passwordRules = {
  newPassword: {
    required,
    minLength: minLength(8),
    checkLetters,
    checkNumberAndSymbol,
  },
  confirmPassword: {
    required,
    sameAs: sameAs(newPassword),
  },
}

const showPassword = ref({} as any)
const isTooltipVisible = ref<boolean>(false)
const secretKey = ref<string>('')
const urlQrCode = ref<string>('')
const verifyCode = ref<string>('')

const vPassword$ = useVuelidate(passwordRules, {
  newPassword,
  confirmPassword
})
const tfaRules = {
  verifyCode: { required, minLength: minLength(6), maxLength: maxLength(6) },
  password: { required }
}
const vTfa$ = useVuelidate(tfaRules, { verifyCode, password: tfaPassword })

const {
  mutate: resetPasswordMute,
  onDone: onResetPasswordDone,
  onError: onResetPasswordError,
  error: resetPasswordError,
  loading: resettingPassword
} = useMutation(
  PASSWORD_CHANGE_MUTATION
)
const {
  mutate: makeQrMutate,
  onDone: onMakeQrDone
} = useMutation(MAKE_QR_MUTATION)
const {
  mutate: confirmQrMutate,
  loading: confirmQrLoading,
  onDone: onConfirmQrDone,
  onError: onConfirmQrError
} = useMutation(CONFIRM_QR_MUTATION)
const {
  mutate: deactivateMutate,
  loading: deactivateLoading,
  onDone: onDeactivateDone,
  onError: onDeactivateError
} = useMutation(DISABLE_TWOFA_MUTATION)

onMounted(async () => {
  await makeQrMutate()
})

onMakeQrDone(async ({ data }) => {
  secretKey.value = data.makeQr.secret
  urlQrCode.value = data.makeQr.urlQrCode
})

const updateVerifyCode = async (value: string) => {
  verifyCode.value = value
  await vTfa$.value.verifyCode.$validate()
}

const togglePasswordVisible = (type: string) => {
  showPassword.value[type] = !(showPassword.value[type])
}

const inputPassword = async () => {
  await vPassword$.value.newPassword.$validate()
}

const inputConfirmPassword = async () => {
  await vPassword$.value.confirmPassword.$validate()
}

const input2faPassword = async () => {
  await vTfa$.value.password.$validate()
}

onResetPasswordDone(async () => {
  await logout()

  useGeneralNotify({
    type: 'success',
    title: t('notifications.success'),
    description: t('notifications.your-changes-updated')
  })
})

onResetPasswordError(() => {
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: resetPasswordError.value?.message
  })
})

const onResetPassword = async () => {
  if (vPassword$.value.$errors.length > 0) {
    return
  }

  await resetPasswordMute({
    password: newPassword.value,
    password_confirmation: confirmPassword.value
  })
}

// Activate
onConfirmQrDone(async () => {
  await refetch()
})

onConfirmQrError(async () => {
  useGeneralNotify({
    type: 'error',
    title: t('notifications.incorrect-2fa-code'),
    description: t('errors.TWO_FA_CODE_NOT_MATCH'),
  })
})

const onActivate = async () => {
  await confirmQrMutate({
    code: verifyCode.value,
  })
}

onDeactivateDone(async () => {
  useGeneralNotify({
    type: 'success',
    title: t('notifications.two-fa-deactivated'),
    description: t('notifications.you-deactivated-2fa'),
  })
  verifyCode.value = ''
  tfaPassword.value = ''

  await refetch()
})

onDeactivateError(async () => {
  useGeneralNotify({
    type: 'error',
    title: t('notifications.incorrect-2fa-code'),
    description: t('errors.TWO_FA_CODE_NOT_MATCH'),
  })
})

const onDeactivate = async () => {
  await deactivateMutate({
    code: verifyCode.value,
    password: tfaPassword.value,
  })
}

const copyToClipboard = () => {
  copy(secretKey.value)
  isTooltipVisible.value = true
  setTimeout(() => {
    isTooltipVisible.value = false
  }, 1000)
}

const onSubmit2FA = async () => {
  if (!(await vTfa$.value.verifyCode.$validate()) || confirmQrLoading.value || deactivateLoading.value) {
    return
  }

  if (me.value?.enable2fa) {
    if (!(await vTfa$.value.password.$validate())) {
      return
    }
  }

  // eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
  !me.value?.enable2fa ? (await onActivate()) : (await onDeactivate())
}

watch(() => verifyCode.value, (v) => {
  if (v && v.length === 6) {
    onSubmit2FA()
  }
}, { immediate: true })
</script>

<template>
  <div class="grid grid-cols-2 gap-x-6 gap-y-6">
    <div class="col-span-2 lg:col-span-1">
      <div class="grid gap-y-8">
        <div class="grid gap-y-7">
          <div class="grid gap-y-1">
            <div class="text-base font-bold text-white leading-6">
              {{ t('account.email-verification') }}
            </div>
            <p class="text-sm">
              {{ t('account.security-policy-no-email-changes') }}
            </p>
          </div>
          <div>
            <div class="mb-2">
              <span class="text-sm font-bold text-white">{{ t('account.registered-email') }} </span>
            </div>
            <JInput
              v-model="form.email"
              :classes="{
                Input: inputClass
              }"
              :placeholder="t('account.email-phone-number')"
              color="white"
              disabled
            >
              <template #endIcon>
                <div class="flex items-center">
                  <UTooltip
                    :content="{ side: 'top' }"
                    arrow
                    :text="t('account.security-policy-no-email-changes')"
                  >
                    <JbBlankButton
                      class="z-10 duration-150 min-h-6! py-1!"
                      size="sm"
                      type="button"
                      variant="primary"
                    >
                      <UIcon name="heroicons:lock-closed-20-solid" />
                    </JbBlankButton>
                  </UTooltip>
                </div>
              </template>
            </JInput>
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-md font-bold text-white">
            {{ t('account.update-password') }}
          </div>
          <div class="grid gap-y-3">
            <div>
              <JbInputMessage
                :class="
                  !(!vPassword$.newPassword.minLength.$invalid && newPassword)
                    ? 'text-red-600'
                    : 'text-primary'
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
                  !(!vPassword$.newPassword.checkNumberAndSymbol.$invalid && newPassword)
                    ? 'text-red-600'
                    : 'text-primary'
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
                  !(!vPassword$.newPassword.checkLetters.$invalid && newPassword)
                    ? 'text-red-600'
                    : 'text-primary'
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
            <div class="grid gap-y-3">
              <div class="w-full">
                <div class="mb-2">
                  <span class="text-sm font-bold text-white">{{ t('account.current-password') }}</span>
                  <span class="text-red-600">*</span>
                </div>
                <JInput
                  v-model="currentPassword"
                  :classes="{
                    Input: inputClass
                  }"
                  :type="showPassword['current'] ? 'text' : 'password'"
                  disabled
                  placeholder=""
                />
              </div>
              <div class="w-full">
                <div class="mb-2">
                  <span class="text-sm font-bold text-white">{{ t('account.new-password') }} </span>
                  <span class="text-red-600">*</span>
                </div>
                <JInput
                  v-model="newPassword"
                  :classes="{
                    Input: inputClass
                  }"
                  :error="vPassword$.newPassword?.$error"
                  :placeholder="t('account.enter-new-password')"
                  :type="showPassword['new'] ? 'text' : 'password'"
                  @update:model-value="inputPassword"
                >
                  <template #endIcon>
                    <JbBlankButton
                      class="w-4 h-4 flex items-center"
                      @click="togglePasswordVisible('new')"
                    >
                      <template v-if="!showPassword['new']">
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
              </div>
              <div class="w-full">
                <div class="mb-2">
                  <span class="text-sm font-bold text-white">{{ t('account.confirm-password') }} </span>
                  <span class="text-red-600">*</span>
                </div>
                <JInput
                  v-model="confirmPassword"
                  :classes="{
                    Input: inputClass
                  }"
                  :error="vPassword$.confirmPassword?.$error"
                  :placeholder="t('account.confirm-password')"
                  :type="showPassword['confirm'] ? 'text' : 'password'"
                  @update:model-value="inputConfirmPassword"
                >
                  <template #endIcon>
                    <JbBlankButton
                      class="w-4 h-4 flex items-center"
                      @click="togglePasswordVisible('confirm')"
                    >
                      <template v-if="!showPassword['confirm']">
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
                <JbInputMessage v-if="vPassword$.confirmPassword.$error">
                  <UIcon
                    class="w-4 h-4 min-w-4 min-h-4 text-red-600"
                    name="i-heroicons-information-circle-20-solid"
                  />
                  {{ t('errors.PASSWORD_NOT_MATCH') }}
                </JbInputMessage>
              </div>
              <div class="text-xs text-red-600 leading-4">
                {{ t('account.login-again-after-reset-logout-devices') }}
              </div>
              <JButton
                :loading="resettingPassword"
                class="w-full"
                size="lg"
                @click="onResetPassword"
              >
                {{ t('base.save-change') }}
              </JButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-2 lg:col-span-1">
      <div class="grid gap-y-1">
        <div class="text-base font-bold text-white leading-6">
          {{ t('account.set-up-two-factor-authentication') }}
        </div>
        <div class="grid gap-y-4">
          <p class="text-sm">
            {{ t('account.setup-google-authenticator') }}
          </p>
          <div class="rounded-md w-[216px] h-[216px] bg-primary flex items-center justify-center">
            <qrcode-vue
              :background="'transparent'"
              :size="200"
              :value="urlQrCode"
              foreground="white"
              level="H"
              render-as="svg"
            />
          </div>
          <div class="grid gap-y-8">
            <div>
              <div class="mb-2">
                <span class="text-sm font-bold text-white">{{ t('account.secret-key') }}</span>
              </div>
              <JInput
                v-model="secretKey"
                :classes="{
                  Input: inputClass
                }"
                :placeholder="t('account.enter-secret-key')"
              >
                <template #endIcon>
                  <UTooltip
                    v-if="!!secretKey"
                    :content="{ side: 'top' }"
                    arrow
                    :text="isTooltipVisible ? t('base.copied') : t('base.copy')"
                  >
                    <div
                      class="px-3 py-1 rounded-md bg-green-950 cursor-pointer hover:text-white"
                      @click="copyToClipboard"
                    >
                      <UIcon
                        v-if="isTooltipVisible"
                        class="w-4 h-4 min-h-4 text-highlights"
                        name="heroicons:clipboard-document-check"
                      />
                      <UIcon
                        v-else
                        class="w-4 h-4 min-h-4"
                        name="heroicons:clipboard-document"
                      />
                    </div>
                  </UTooltip>
                </template>
              </JInput>
            </div>
            <div class="w-full grid gap-y-6">
              <div class="grid gap-y-2">
                <span class="text-sm font-bold text-white leading-5">{{ t('account.verification-key') }} </span>
                <span class="leading-4 text-sm text-paragraph">
                  {{ t('errors.INVALID_2FA_CODE') }}
                </span>
                <div v-if="screen.lg">
                  <VerificationCode
                    @update:code="updateVerifyCode"
                  />
                </div>
                <div v-else>
                  <JInput
                    v-model="verifyCode"
                    :classes="{
                      Input: 'bg-divider-dark! px-4 text-sm! border-none! h-11! rounded! text-center'
                    }"
                    type="text"
                  />
                </div>
                <div
                  v-if="me?.enable2fa"
                  class="w-full"
                >
                  <div class="mb-2">
                    <span class="text-sm font-bold text-white">{{ t('auth.password') }} </span>
                    <span class="text-red-600">*</span>
                  </div>
                  <JInput
                    v-model="tfaPassword"
                    :classes="{
                      Input: inputClass
                    }"
                    :error="vTfa$.password?.$error"
                    :placeholder="t('auth.enter-your-password')"
                    :type="showPassword['2fa'] ? 'text' : 'password'"
                    @update:model-value="input2faPassword"
                  >
                    <template #endIcon>
                      <JbBlankButton
                        class="w-4 h-4 flex items-center"
                        @click="togglePasswordVisible('2fa')"
                      >
                        <template v-if="!showPassword['2fa']">
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
                </div>
              </div>
              <JButton
                :loading="confirmQrLoading || deactivateLoading"
                class="border border-border"
                variant="transparent"
                @click="onSubmit2FA"
              >
                {{ me?.enable2fa ? t('base.disable') : t('base.enable') }}
              </JButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
