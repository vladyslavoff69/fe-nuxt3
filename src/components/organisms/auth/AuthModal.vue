<script lang="ts" setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import type { TabsItem } from '@nuxt/ui'
import { AUTH, CREATE_USER, EMAIL_VERIFY, FORGOT_PASSWORD, LOGIN, RESET_PASSWORD, TWOFA } from '~/constants'
import LoginForm from '~/components/organisms/auth/form/LoginForm.vue'
import RegisterForm from '~/components/organisms/auth/form/RegisterForm.vue'
import AuthFooter from '~/components/organisms/auth/form/AuthFooter.vue'
import ForgotPassword from '~/components/organisms/auth/form/ForgotPassword.vue'
import ResetPassword from '~/components/organisms/auth/form/ResetPassword.vue'
import TwoFa from '~/components/organisms/auth/form/TwoFa.vue'
import VerifyEmail from '~/components/organisms/auth/form/VerifyEmail.vue'

const { modalVisible } = defineProps<{
  modalVisible: boolean;
}>()

const emits = defineEmits<{
  (e: 'close:loginModal', payload: boolean): void;
}>()

const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const forcePromo = runtimeConfig.public?.forcePromo
const forcePromoCode = runtimeConfig.public?.forcePromoCode
const { authType } = inject(AUTH)!

const items = ref<TabsItem[]>([{
  value: LOGIN,
  label: t('auth.login')
}, {
  value: CREATE_USER,
  label: t('auth.register')
}])

const route = useRoute()
const router = useRouter()
const selectedTab = ref()

const onClickForgotPassword = () => {
  router.replace({
    query: {
      ...route.query,
      type: FORGOT_PASSWORD,
    },
  })
}

const handleModalClose = () => {
  emits('close:loginModal', false)
}

const [tabParent] = useAutoAnimate({
  duration: 150
})

watch(() => authType.value, (v) => {
  if (v && v !== '') {
    selectedTab.value = v
  }
}, { immediate: true })

watch(() => selectedTab.value, (v) => {
  if (v && v !== '') {
    if (v === CREATE_USER && forcePromo) {
      router.push({
        path: router.currentRoute.value.path,
        query: {
          promo: String(forcePromoCode)
        },
      })
    } else {
      router.push({
        path: router.currentRoute.value.path,
        query: {
          ...route.query,
          type: v,
          modal: 'auth',
        },
      })
    }
  }
}, { immediate: true })
</script>

<template>
  <JModal
    :class-name="[
      {
        'md:min-h-[500px] lg:min-h-[555px]': authType === LOGIN || authType === CREATE_USER
      },
      'w-full md:w-[600px] lg:w-[730px] h-full bg-green-950! relative p-4 md:p-5',
    ]"
    :classes="{
      DialogWrapper: 'md:items-start md:pt-20'
    }"
    :is-modal="false"
    :is-open="modalVisible"
    :no-header="false"
    class="flex justify-center items-start md:items-center"
    @close:simple-modal="handleModalClose"
  >
    <div class="w-full md:grid md:grid-cols-11 h-full md:gap-x-5">
      <div
        :class="{
          'md:min-h-[500px] lg:min-h-[555px]': authType === LOGIN || authType === CREATE_USER
        }"
        class="md:col-span-5 w-full hidden md:block h-full"
      >
        <div
          class="
            md:w-[45%] lg:w-[43%] h-full absolute top-0 left-0 rounded-tl-[11.4px] rounded-bl-[11.4px]
            bg-no-repeat bg-cover hidden md:flex justify-center pt-10 md:bg-auth-modal
          "
        >
          <JbLogo class="h-10" />
        </div>
      </div>
      <div
        :class="{
          'md:min-h-[500px] lg:min-h-[555px]': authType === LOGIN || authType === CREATE_USER
        }"
        class="w-full md:col-span-6 h-full"
      >
        <div
          :class="{ 'md:gap-y-4': authType === LOGIN }"
          class="flex flex-col gap-y-3 h-full"
        >
          <h3 class="text-2xl md:text-xxl font-bold text-left">
            <template v-if="authType === RESET_PASSWORD">
              {{ t('auth.create_a_new_password') }}
            </template>

            <template v-else-if="authType === FORGOT_PASSWORD">
              {{ t('auth.forgot_password') }}
            </template>

            <template v-else-if="authType === TWOFA">
              {{ t('auth.login_confirmation') }}
            </template>

            <template v-else-if="authType === EMAIL_VERIFY">
              {{ t('auth.verify-email-address') }}
            </template>
          </h3>

          <div
            :class="{ 'md:gap-y-4': authType === LOGIN }"
            class="flex flex-col gap-y-3 sm:gap-y-2.5 h-full"
          >
            <div
              v-if="authType === LOGIN || authType === CREATE_USER"
              class="w-full"
            >
              <UTabs
                v-model="selectedTab"
                :items="items"
                class="border-transparent!"
                size="xl"
                :ui="{
                  trigger: 'font-bold! text-sm! h-9!'
                }"
              >
                <template #content="{ item }">
                  <div
                    ref="tabParent"
                    class="flex flex-col gap-y-3 md:gap-y-4"
                  >
                    <LoginForm v-if="item.value === LOGIN" />

                    <RegisterForm v-if="item.value === CREATE_USER" />
                  </div>
                </template>
              </UTabs>
            </div>

            <div
              v-if="authType === FORGOT_PASSWORD"
              class="flex flex-col gap-y-3 min-h-28 sm:min-h-30 justify-center"
            >
              <ForgotPassword />
            </div>

            <div
              v-if="authType === RESET_PASSWORD"
              class="flex flex-col gap-y-3 min-h-28 sm:min-h-[300px] justify-center"
            >
              <ResetPassword />
            </div>

            <div
              v-if="authType === TWOFA"
              class="flex flex-col gap-y-3 min-h-[300px]"
            >
              <TwoFa />
            </div>

            <div
              v-if="authType === EMAIL_VERIFY"
              class="flex flex-col gap-y-3 min-h-44 sm:min-h-56 justify-center"
            >
              <VerifyEmail />
            </div>

            <div
              v-if="authType === LOGIN"
              class="flex flex-col gap-y-3"
            >
              <JbBlankButton
                class="block text-sm font-semibold text-center text-paragraph hover:text-white w-full"
                @click="onClickForgotPassword"
              >
                {{ t('auth.forgot_password') }}
              </JbBlankButton>

              <div class="block text-sm text-center text-paragraph">
                {{ t('auth.dont_have_an_account') }}
                <JbBlankButton
                  class="font-bold"
                  @click="selectedTab = CREATE_USER"
                >
                  {{ t('auth.register_an_account') }}
                </JbBlankButton>
              </div>
            </div>

            <AuthFooter class="mt-auto" />
          </div>
        </div>
      </div>
    </div>
  </JModal>
</template>
