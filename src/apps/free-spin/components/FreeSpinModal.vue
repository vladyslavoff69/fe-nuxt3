<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { email as validEmail, maxLength, minLength, required } from '@vuelidate/validators'
import InputCheckbox from '~/components/molecules/common/InputCheckbox.vue'
import { CIRCLE_CHECK_ICON, FREE_SPIN_ICON, FREE_SPIN_PIN_ICON } from '~/icons'
import { CREATE_USER_MUTATION, FREE_SPIN_MUTATION, SAVE_USER_PREFERENCES_MUTATION } from '~/graphql'
import { AUTH, FREE_SPIN, FS_COLOR_MAP, FS_VALUES, SITE_SETTINGS } from '~/constants'
import TosMessage from '~/components/organisms/auth/form/TosMessage.vue'
import CloseButton from '~/components/molecules/button/CloseButton.vue'
import useFingerprint from '~/composables/auth/useFingerprint'

const props = defineProps<{modalVisible: boolean, isRegistered: boolean}>()

const { fingerprintToken } = inject(SITE_SETTINGS)!
const { t } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const { emailOrUsername, isLoggedIn, freeSpinsCode, me, login, hideTurnstile, turnstileToken, refetch } = inject(AUTH)!
const { myFreeSpins, myFreeBets, isFreeSpinning, updateIsFreeSpinning } = inject(FREE_SPIN)!
const { onLogin } = useApollo()
const runtimeConfig = useRuntimeConfig()
const redirectHome = runtimeConfig.public.redirectHome!
const showPassword = ref<boolean>(false)
const emailErrorString = ref<string>('')
const isEmailError = computed(() => !!emailErrorString.value)
const usernameErrorString = ref<string>('')
const isUsernameError = computed(() => !!usernameErrorString.value)
const isConfirmedError = ref<boolean>(false)

const isModalVisible = ref(props.modalVisible)
const rotation = ref(0)
const sectionAngle = 360 / FS_VALUES.length
const currentSpin = computed(() => myFreeSpins.value && myFreeSpins.value.length > 0 ? myFreeSpins.value[0] : null)
const isRegistering = ref(false)
const registerSubmitting = ref(false)
const isSpinDone = ref(false)

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
const {
  mutate: registerMutate,
  loading: registerLoading,
  onDone: onRegisterDone,
  onError: onRegisterError,
  error
} = useMutation(CREATE_USER_MUTATION)

const {
  mutate: saveUserPreferences,
  loading: savePrefLoading,
} = useMutation(SAVE_USER_PREFERENCES_MUTATION)

const validationForm = async () => {
  if (!(await v$.value.$validate())) {
    return false
  }

  usernameErrorString.value = ''

  return true
}

const openTermsModal = () => {
  router.push(localePath('/tos'))
}

const { mutate, loading, onDone, onError } = useMutation(FREE_SPIN_MUTATION, { fetchPolicy: 'no-cache' })

const spinWheel = async () => {
  if (isFreeSpinning.value) {
    return
  }

  updateIsFreeSpinning(true)
  isFreeSpinning.value = true
  await mutate({
    free_spin_id: currentSpin.value?.id
  })
}

const startRegistering = async () => {
  if (isLoggedIn.value && !!currentSpin.value && currentSpin.value.id) {
    await spinWheel()
  } else {
    if (isRegistering.value) {
      return
    }
    isRegistering.value = true
  }
}

const onCloseModal = async () => {
  if (isFreeSpinning.value) {
    return
  }

  updateIsFreeSpinning(false)
  isFreeSpinning.value = false
  isModalVisible.value = false
  await router.push({
    path: localePath(redirectHome)
  })
}

const goToPlinko = async () => {
  updateIsFreeSpinning(false)
  isFreeSpinning.value = false
  isModalVisible.value = false
  if (router.currentRoute.value.path.includes('casino/games/junglebet/plinko')) {
    location.reload()
  } else {
    await router.push({
      path: localePath('/casino/games/junglebet/plinko')
    })
  }
}

onDone((result) => {
  const spinResult = result.data!.useFreeSpin?.spin_results
  const lastPayout = spinResult.at((spinResult.length - 1))?.payout ?? 0
  const targetIndex = FS_VALUES.indexOf(lastPayout)
  if (targetIndex === -1) {
    updateIsFreeSpinning(false)
    isFreeSpinning.value = false
    return
  }

  const targetAngle = 360 - targetIndex * sectionAngle - sectionAngle / 2
  rotation.value += 5 * 360 + (360 - (rotation.value % 360)) + targetAngle

  if (isLoggedIn.value && !savePrefLoading.value) {
    saveUserPreferences({
      ...me.value?.preferences,
      activeCryptoCode: 'DOGE'
    }, {
      optimisticResponse: {
        saveUserPreferences: {
          __typename: me.value?.__typename || 'User',
          id: me.value?.id || 0,
          preferences: {
            ...me.value?.preferences,
            activeCryptoCode: 'DOGE'
          }
        }
      }
    })
  }

  setTimeout(() => {
    refetch()
    if (isFreeSpinning.value && result.data!.useFreeSpin?.promo_spin < 1) {
      isSpinDone.value = true
      isRegistering.value = false
      registerSubmitting.value = false

      if (!props.isRegistered) {
        useGeneralNotify({
          type: 'success',
          title: t('notifications.welcome'),
          description: `${t('notifications.welcome-to-junglebet')}, ${me.value?.username}`
        })
      }
    }
  }, 3100)
})

onError((error) => {
  updateIsFreeSpinning(false)
  isFreeSpinning.value = false
  const parsedError = parseGraphqlError(error)
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: parsedError.message,
  })
})

const { visitorToken } = await useFingerprint()
const onRegisterSubmit = async () => {
  if (!(await validationForm()) || !form.isConfirmed || (!hideTurnstile && !form.turnstileToken) || registerSubmitting.value) {
    isConfirmedError.value = !form.isConfirmed
    return
  }

  fingerprintToken.value = visitorToken

  turnstileToken.value = form.turnstileToken

  usernameErrorString.value = ''
  emailErrorString.value = ''
  isConfirmedError.value = false
  registerSubmitting.value = true

  const requestParams: any = {
    email: form.email,
    password: form.password,
    username: form.username,
    fingerprint: fingerprintToken.value,
    promotional_code: freeSpinsCode.value,
  }

  await registerMutate(requestParams)
}

const mutationDone = async (token: string) => {
  await onLogin(token)
  login(true)

  const intervalCheck: NodeJS.Timeout = setInterval(async () => {
    if (!isFreeSpinning.value && isLoggedIn.value && !!currentSpin.value && currentSpin.value.id) {
      await spinWheel()
      clearInterval(intervalCheck)
    }
  }, 500)
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

onRegisterDone(({ data }) => {
  try {
    mutationDone(data?.createUser?.token)
  } catch (e) {
    useGeneralNotify({
      type: 'error',
      title: t('notifications.failed-registration'),
      description: t('errors.SOMETHING_WENT_WRONG_RELOAD')
    })
  }
})

onRegisterError(({ graphQLErrors }) => {
  mutationError(graphQLErrors, error.value)
})

const togglePasswordVisible = () => {
  showPassword.value = !showPassword.value
}

const inputClass = 'bg-form-input border ring-transparent rounded-md px-3 h-auto text-sm'

watch(() => isLoggedIn.value, (v) => {
  if (
    v && !isRegistering.value && !isFreeSpinning.value && !loading.value &&
    !isSpinDone.value && !registerSubmitting.value && !props.isRegistered
  ) {
    onCloseModal()
  }
}, { immediate: true })

onMounted(async () => {
  form.email = emailOrUsername.value
})
</script>

<template>
  <ClientOnly>
    <UModal
      v-model:open="isModalVisible"
      :default-open="isModalVisible"
      :close="false"
      :dismissible="false"
      class="w-11/12 md:w-[600px]! md:max-w-[600px]! lg:w-[730px]! lg:max-w-[730px]! bg-green-950 p-6!"
    >
      <template #content>
        <div class="flex justify-between items-center w-full border-0">
          <div
            class="text-white font-bold text-xl leading-none! flex items-center gap-x-1.5"
          >
            <svg
              class="w-6 h-6 min-w-6 min-h-6 text-white"
            >
              <use :href="FREE_SPIN_ICON" />
            </svg>
            <span>Lucky Spin</span>
          </div>
          <CloseButton
            class="w-4 h-4 min-w-4 min-h-4"
            @click="onCloseModal"
          />
        </div>
        <div class="flex flex-col-reverse md:grid md:grid-cols-2 gap-3 md:gap-6 items-center w-full border-0">
          <div class="w-full md:col-span-1">
            <div
              v-if="!isRegistering && !isSpinDone"
              class="flex flex-col justify-center w-full uppercase items-center md:items-start font-bold"
            >
              <div class="text-white text-2xl md:text-3xl leading-none">
                Win up to
              </div>
              <div class="text-4xl md:text-5xl bet-gradient-text leading-none font-extrabold">
                100 Free
              </div>
              <div class="text-4xl md:text-5xl bet-gradient-text leading-none font-extrabold">
                Bets
              </div>
              <div class="text-white text-2xl md:text-3xl leading-none">
                on Plinko
              </div>
            </div>
            <div
              v-else-if="isSpinDone"
              class="flex flex-col justify-center gap-2 md:gap-3 w-full uppercase items-center md:items-start font-bold animate-right-to-left"
            >
              <div
                class="flex flex-col justify-center w-full uppercase items-center md:items-start font-bold"
              >
                <div class="text-white text-2xl md:text-3xl leading-none">
                  You've won
                </div>
                <div class="text-4xl md:text-5xl bet-gradient-text text-nowrap leading-none font-extrabold">
                  {{ myFreeBets }} Free Bets
                </div>
                <div class="text-3xl md:text-4xl bet-gradient-text leading-none font-extrabold">
                  on Plinko
                </div>
              </div>

              <img
                alt=""
                class="w-px h-px opacity-0"
                height="1px"
                src="http://nesionianchadonna.com/conversion.gif"
                width="1px"
              >

              <JButton
                button-class="h-11"
                class="w-full py-2.5 uppercase"
                variant="bet-gradient"
                @click="goToPlinko"
              >
                Claim Prize & Play
              </JButton>
            </div>
            <div
              v-else
              class="flex flex-col justify-center w-full items-center md:items-start animate-right-to-left gap-3"
            >
              <div class="text-white text-xl md:text-2xl font-bold uppercase leading-none">
                Just one step<br>to spin & claim
              </div>
              <div class="flex flex-col gap-y-3 md:gap-y-2.5 px-0.5 w-full overflow-x-hidden">
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
                      v-if="v$.password.minLength.$invalid"
                      class="mt-1 text-left text-red-600"
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
                      v-if="v$.password.checkNumberAndSymbol.$invalid"
                      class="mt-1 text-left text-red-600"
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
                      v-if="v$.password.checkLetters.$invalid"
                      class="mt-1 text-left text-red-600"
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
                    :disabled="(!hideTurnstile && !form.turnstileToken) || !form.isConfirmed || isFreeSpinning || loading || registerLoading || isSpinDone || registerSubmitting"
                    :loading="registerLoading || loading || isFreeSpinning || isSpinDone || registerSubmitting"
                    button-class="h-11"
                    class="w-full py-2.5 uppercase"
                    variant="bet-gradient"
                    @click="onRegisterSubmit"
                  >
                    Register & Spin
                  </JButton>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-2 md:mt-4 w-full md:col-span-1 flex flex-col gap-1 items-center justify-center bg-green-950">
            <div class="wheel-pin w-full relative">
              <svg
                class="absolute -top-[18%] left-1/2 -translate-x-1/2 w-[12%] object-contain z-10"
              >
                <use :href="FREE_SPIN_PIN_ICON" />
              </svg>
              <div
                class="inline-block overflow-hidden rounded-full cursor-pointer transition-transform duration-1000 ease-in-out border-20 border-border w-full shadow-spin-wheel relative"
              >
                <div
                  :style="{transitionDuration: '3s', transform: `rotate(${rotation}deg)` }"
                  class="wheel easing-ease w-full aspect-square relative mx-auto rounded-full overflow-hidden"
                >
                  <div
                    v-for="(value, index) in FS_VALUES"
                    :key="`wheel-${value}-${index}`"
                    :style="{
                    transform: `rotate(${index * sectionAngle}deg) skewY(-38.5714deg)`,
                    background: FS_COLOR_MAP[value]
                  }"
                    class="wheel-item"
                  >
                    <div
                      :style="{ transform: 'skewY(38.5714deg) rotate(25.7143deg)' }"
                      class="content horizontal-content"
                    >
                      <span class="text-white text-4xl font-bold pl-7">{{ value }}</span>
                    </div>
                  </div>
                  <div class="absolute inset-0 w-full h-full aspect-square rounded-full border-[6px] border-green-950/25" />
                </div>

                <div class="absolute w-24 h-24 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square rounded-full border-8 border-white/25">
                  <div
                    :class="!(isFreeSpinning || loading || isRegistering || registerLoading || isSpinDone || registerSubmitting) ? 'animate-cash-center' : 'opacity-0'"
                    class="w-full h-full aspect-square bg-white/25 rounded-full ease-[cubic-bezier(0,.4,0,1)] transition-all duration-75
                "
                  />
                </div>

                <JButton
                  :button-class="`h-20! w-20! rounded-full! ${
                  (!(isFreeSpinning || loading || isRegistering || registerLoading || isSpinDone || registerSubmitting) ? 'animate-button' : 'opacity-0')
                }`"
                  :disabled="isFreeSpinning || loading || isRegistering || registerLoading || isSpinDone || registerSubmitting"
                  :loading="loading || registerLoading || isRegistering || registerSubmitting"
                  class="absolute! top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full uppercase"
                  label-class="text-2xl! leading-none! block! text-center"
                  size="lg"
                  type="submit"
                  variant="bet-gradient"
                  @click="startRegistering"
                >
                  SPIN
                </JButton>
              </div>

              <div
                :style="{transitionDuration: '3s', transform: `rotate(${rotation}deg)` }"
                class="absolute w-full aspect-square rounded-full inset-0 border-4 border-transparent bg-transparent"
              >
                <div
                  v-for="(value, index) in FS_VALUES"
                  :key="`${value}-${index}`"
                  :style="{
                  transform: `rotate(${index * sectionAngle - 0.55 * sectionAngle}deg)`,
                }"
                  class="wheel-item"
                >
                  <div
                    class="content horizontal-content"
                  >
                    <div class="w-3 h-3 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>
            <div class="text-white font-semibold md:hidden">
              1 Free Bet = 1 DOGE
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 items-center w-full">
          <div class="col-span-2 md:col-span-1 flex items-center gap-x-2">
            <a
              class="flex justify-center md:justify-start items-center"
              href="https://junglebet.com/verify"
              rel="noopener noreferrer"
              target="_blank"
            >
              <NuxtImg
                alt="Junglebet.com"
                class="h-9 w-32"
                loading="lazy"
                provider="cloudflare"
                src="542377dd-d3c6-4bb9-72d9-7fd58cdb7b00/thumb"
              />
            </a>
            <div class="text-xs leading-none font-semibold">
              Gaming License No. ALSI-062403005-F16 18+ | Limited time offer |
              <NuxtLinkLocale
                class="hover:text-white"
                to="/tos"
              >
                Terms & Conditions
              </NuxtLinkLocale>
              apply
            </div>
          </div>
          <div class="md:col-span-1 text-white font-semibold hidden md:flex items-center justify-center">
            1 Free Bet = 1 DOGE
          </div>
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.wheel-pin {
  @keyframes cashCenter {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.5);
      opacity: 0;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes gradientButton {
    0% {
      transform: translateX(100%);
    }

    50% {
      transform: translateX(-100%);
    }

    100% {
      transform: translateX(100%);
    }
  }

  .animate-cash-center {
    animation: cashCenter ease-in-out 1.8s infinite;
  }

  .animate-button {
    &:before {
      background: #FFFFFF;
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 100%;
      rotate: 6deg;
      opacity: 0.3;
      animation-duration: 700ms;
      animation: gradientButton ease-in-out 3s infinite;
    }
  }
}

.wheel {
  &.easing-ease {
    transition: transform cubic-bezier(0.65, 0, 0.35, 1);
  }
}

.wheel-item {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 50%;
  transform-origin: bottom left;
}

.wheel .content {
  position: absolute;
  left: -100%;
  width: 200%;
  height: 200%;
  text-align: center;
  padding-top: 20px;
  transform: skewY(30deg) rotate(0);

  &.horizontal-content span {
    display: block;
    transform: rotate(90deg);
  }
}

.bet-gradient-text {
  background: linear-gradient(33deg, rgba(250, 242, 61, 1) 0%, rgba(252, 190, 32, 1) 100%);
  -webkit-background-clip: text !important;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
