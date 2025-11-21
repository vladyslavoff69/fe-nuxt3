<script lang="ts" setup>
import LoggedInHeader from '~/components/ui/header/LoggedInHeader.vue'
import LoggedOut from '~/components/organisms/auth/form/LoggedOut.vue'
import WalletGroup from '~/components/organisms/wallets/WalletGroup.vue'
import TransactionModal from '~/components/organisms/wallets/TransactionModal.vue'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import VipModalContent from '~/apps/vip-program/components/modal/VipModalContent.vue'
import { AUTH, CLOSED_SIDEBAR_WIDTH, CURRENCY, OPENED_SIDEBAR_WIDTH, SITE_SETTINGS, THEME, WALLET } from '~/constants'
import { TOP_BAR_HAMBURGER, TOP_BAR_HAMBURGER_1 } from '~/icons'

const { isSidebarOpen, selectedMenuPath, toggleSidebar } = inject(SITE_SETTINGS)!
const { isLoggedIn } = inject(AUTH)!
const { ready: currencyReady } = inject(CURRENCY)!
const { selectedAddress, ready: walletReady } = inject(WALLET)!
const { screen } = inject(THEME)!
const route = useRoute()
const modalType = computed(() => route.query.modal ? String(route.query.modal) : '')
const modalVisible = computed(() =>
  (
    ['wallet', 'enable2fa'].includes(modalType.value) &&
    currencyReady.value &&
    walletReady.value
  )
)

const vipModalVisible = computed(() => route.query.modal === 'vip')
const tab = computed(() => (route.query.tab ? String(route.query.tab) : ''))
const closeWalletModal = () => {
  navigateRoute({
    oldQueries: ['tab', 'currency', 'modal']
  })

  selectedAddress.value = ''
}

const closeVipModal = () => {
  navigateRoute({
    oldQueries: ['tab', 'modal']
  })
}

const handleSidebar = () => {
  if (isSidebarOpen.value) {
    selectedMenuPath.value = ''
  }
  toggleSidebar()
}

const [headerParent] = useAutoAnimate({
  duration: 150
})
</script>

<template>
  <header
    class="
      flex top-0 left-0 items-center fixed z-1002 bg-navbar shadow-header
      w-full backdrop-blur-xs h-(--header-height)
    "
  >
    <div
      ref="headerParent"
      class="hidden md:flex flex-none py-3 md:py-4 h-full items-center"
    >
      <div
        :class="{
          'justify-center': !isSidebarOpen,
          'justify-start pl-8': isSidebarOpen,
        }"
        :style="{
          width: isSidebarOpen ? OPENED_SIDEBAR_WIDTH : CLOSED_SIDEBAR_WIDTH
        }"
        class="flex items-center transition-base duration-150"
      >
        <svg
          v-if="isSidebarOpen"
          class="h-6 w-6 cursor-pointer text-white"
          @click="handleSidebar"
        >
          <use :href="TOP_BAR_HAMBURGER_1" />
        </svg>
        <svg
          v-else
          class="h-6 w-6 cursor-pointer text-white"
          @click="handleSidebar"
        >
          <use :href="TOP_BAR_HAMBURGER" />
        </svg>
      </div>
    </div>

    <UContainer
      class="w-full py-3 md:py-4 px-0! md:px-4! pr-1! md:pr-5! flex items-center justify-center flex-auto"
    >
      <div
        class="
          w-full mx-auto xl:max-w-(--breakpoint-xl) px-1 md:pl-0 md:pr-0
          flex items-center justify-between gap-x-1
        "
      >
        <div class="w-[60px]">
          <NuxtLinkLocale
            to="/"
          >
            <JbLogo
              v-if="!isLoggedIn || screen.md"
              class="h-7 md:w-[156px] md:h-8"
            />
            <JbMobileLogo
              v-else
              class="h-7 md:w-[156px] md:h-8 text-white"
            />
          </NuxtLinkLocale>
        </div>

        <ClientOnly>
          <WalletGroup
            v-if="isLoggedIn"
          />
        </ClientOnly>

        <LoggedOut v-if="!isLoggedIn" />
        <LoggedInHeader v-else />
      </div>
    </UContainer>

    <TransactionModal
      :modal-type="modalType"
      :modal-visible="(isLoggedIn && modalVisible)"
      :tab="tab"
      @close:wallet-modal="closeWalletModal"
    />

    <ClientOnly>
      <UModal
        v-model:open="vipModalVisible"
        :dismissible="false"
        :default-open="vipModalVisible"
        @update:open="(v) => {
        if (!v) {
          closeVipModal()
        }
      }"
      >
        <template #content>
          <VipModalContent @close:modal="closeVipModal" />
        </template>
      </UModal>
    </ClientOnly>
  </header>
</template>
