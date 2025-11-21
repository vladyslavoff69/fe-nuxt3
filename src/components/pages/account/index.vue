<script lang="ts" setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import AccountForm from '~/components/pages/account/contents/AccountForm.vue'
import SecurityForm from '~/components/pages/account/contents/SecurityForm.vue'
import PreferencesForm from '~/components/pages/account/contents/PreferencesForm.vue'
import EmailSettings from '~/components/pages/account/contents/EmailSettings.vue'
import LogoutButton from '~/components/ui/header/LogoutButton.vue'
import KycVerification from '~/components/pages/account/contents/KycVerification/index.vue'
import { THEME } from '~/constants'

const { t } = useI18n()
const { screen } = inject(THEME)!
const tabs = [
  { label: t('account.account'), value: 'account', icon: 'heroicons:user-circle-20-solid', iconType: 'ui' },
  { label: t('account.kyc-verification'), value: 'kyc', icon: 'majesticons:settings-cog-check', iconType: 'ui' },
  // { label: t('account.passkey'), value: 'passkey', icon: 'fluent:person-passkey-28-filled', iconType: 'ui' },
  { label: t('account.security'), value: 'security', icon: 'ion:ios-locked', iconType: 'ui' },
  {
    label: t('account.preferences'),
    value: 'preferences',
    icon: 'heroicons:adjustments-horizontal-20-solid',
    iconType: 'ui'
  },
  { label: t('account.email-settings'), value: 'email-settings', icon: 'heroicons:envelope-20-solid', iconType: 'ui' },
]

const router = useRouter()
const route = useRoute()
const selectedTab = computed({
  get () {
    return route.query.tabs ? String(route.query.tabs) : 'account'
  },
  set (v) {
    router.push({ path: router.currentRoute.value.path, query: { ...route.query, tabs: v } })
  }
})

const currentTab = computed({
  get () {
    const index = tabs.findIndex((item: any) => item.value === String(route.query.tabs))
    if (index === -1) {
      return 'account'
    }

    return String(route.query.tabs)
  },
  set (v) {
    router.push({
      path: router.currentRoute.value.path,
      query: {
        ...route.query,
        tabs: v
      }
    })
  }
})

const [tabParent] = useAutoAnimate({
  duration: 150
})

const { sendFingerprint } = useSendFingerprint()

onMounted(async () => {
  await sendFingerprint()
})
</script>

<template>
  <div class="flex flex-col gap-y-2 sm:gap-y-6">
    <div class="flex justify-between">
      <h1 class="text-xl sm:text-xxl font-bold items-center">
        {{ t('account.account-settings') }}
      </h1>
      <LogoutButton
        v-if="!screen.md"
        class="flex"
      />
    </div>
    <div
      class="grid grid-cols-12 h-full w-full md:min-h-[560px]"
    >
      <div
        v-if="screen.lg"
        class="col-span-2 h-full pr-4 border-r border-border"
      >
        <UTabs
          v-model="currentTab"
          :items="tabs"
          orientation="vertical"
          size="xl"
          class="w-full"
          :ui="{
            trigger: 'w-full min-w-40 h-10'
          }"
        >
          <template #default="{ item }">
            <div class="flex items-center gap-x-2 relative cursor-pointer">
              {{ item?.label || '' }}
            </div>
          </template>
        </UTabs>

        <div class="h-px w-full bg-border my-1" />
        <LogoutButton class="flex" />
      </div>

      <div
        ref="tabParent"
        class="
          col-span-12 lg:col-span-10 w-full pl-0 sm:px-4 sm:pb-4
          flex flex-col gap-y-5 sm:gap-y-3 lg:min-h-[calc(100vh-200px)]
        "
      >
        <slot name="header" />

        <div v-if="!screen.lg">
          <JTabs
            v-model="selectedTab"
            :tabs="tabs"
            class="w-full sm:w-auto mr-2"
            width="auto"
          />
        </div>

        <SecurityForm v-if="selectedTab === 'security'" />
        <!--          <PasskeyForm v-else-if="selectedTab === 'passkey'" />-->
        <PreferencesForm v-else-if="selectedTab === 'preferences'" />
        <EmailSettings v-else-if="selectedTab === 'email-settings'" />
        <KycVerification v-else-if="selectedTab === 'kyc'" />
        <AccountForm v-else />
      </div>
    </div>
  </div>
</template>
