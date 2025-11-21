<script lang="ts" setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { GAME_HISTORY_ICON, PLAYERS_CHARITY_ICON, WALLET_TRANSACTION_ICON } from '~/components/symbols'
import Histories from '~/components/pages/transactions/contents/histories/index.vue'
import GameHistoryForm from '~/components/pages/transactions/contents/GameHistoryForm.vue'
import DonationsData from '~/components/pages/transactions/contents/DonationsData.vue'
import { THEME } from '~/constants'

const { t } = useI18n()
const { sendFingerprint } = useSendFingerprint()
const { screen } = inject(THEME)!
const tabs = [
  { label: t('account.transactions'), value: 'index', iconName: WALLET_TRANSACTION_ICON, iconType: 'symbol' },
  { label: t('account.game-history'), value: 'game-history', iconName: GAME_HISTORY_ICON, iconType: 'symbol' },
  { label: t('charity.donations'), value: 'donations', iconName: PLAYERS_CHARITY_ICON, iconType: 'symbol' }
]

const router = useRouter()
const route = useRoute()

const selectedTab = computed({
  get() {
    return route.query.tabs ? String(route.query.tabs) : 'index'
  },
  set(v) {
    router.push({ path: router.currentRoute.value.path, query: { ...route.query, tabs: v } })
  }
})

const currentTab = computed({
  get() {
    const index = tabs.findIndex((item: any) => item.value === String(route.query.tabs))
    if (index === -1) {
      return 'index'
    }

    return String(route.query.tabs)
  },
  set(v) {
    router.push({ path: router.currentRoute.value.path, query: { ...route.query, tabs: v } })
  }
})

const [tabParent] = useAutoAnimate({
  duration: 150
})

onMounted(async () => {
  await sendFingerprint()
})
</script>

<template>
  <div class="flex flex-col gap-y-2 sm:gap-y-6">
    <div class="flex justify-between">
      <h1 class="text-xl sm:text-xxl font-bold items-center">
        {{ t('account.transactions') }}
      </h1>
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
              <svg
                v-if="item.iconType === 'symbol'"
                class="block text-current w-5 h-5 min-w-5 min-h-5"
              >
                <use :href="item.iconName" />
              </svg>
              {{ item?.label || '' }}
            </div>
          </template>
        </UTabs>
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

        <GameHistoryForm v-if="selectedTab === 'game-history'" />
        <DonationsData v-else-if="selectedTab === 'donations'" />
        <Histories v-else />
      </div>
    </div>
  </div>
</template>
