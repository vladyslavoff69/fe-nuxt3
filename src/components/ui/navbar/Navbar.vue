<script lang="ts" setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import SidebarInternal from '~/components/organisms/sidebar/SidebarInternal.vue'
import NotificationContainer from '~/components/organisms/notification/index.vue'
import ChatContainer from '~/components/organisms/chat/ChatContainer.vue'
import SearchPopper from '~/components/ui/navbar/SearchPopper.vue'
import NavBarBottom from '~/components/ui/navbar/NavBarBottom.vue'
import { NOTIFICATION, SITE_SETTINGS, THEME } from '~/constants'

const { selectedNavItem, isMobileSidebarOpen, toggleMobileSidebar } = inject(SITE_SETTINGS)!
const { screen } = inject(THEME)!
const { isOpenMobile: isOpenNotification, closeNotification } = inject(NOTIFICATION)!
const isOpenChatDrawer = ref(false)

const openSlider = computed({
  get () {
    return !screen.value.md && isMobileSidebarOpen.value
  },
  set (v) {
    isMobileSidebarOpen.value = v
  }
})

const onCloseSidebar = () => {
  toggleMobileSidebar()
  selectedNavItem.value = ''
}

const onOpenChatDrawer = () => {
  isOpenChatDrawer.value = true
}

const onCloseChatDrawer = () => {
  isOpenChatDrawer.value = false
}

const toggleSlider = (open: boolean) => {
  openSlider.value = open
  onCloseChatDrawer()
}

const clickLink = () => {
  toggleMobileSidebar()
  onCloseChatDrawer()
}

const [chatParent] = useAutoAnimate({
  duration: 150
})
</script>

<template>
  <div class="fixed z-999 bg-green-950 w-full flex-none top-0 h-auto left-0 right-0">
    <div class="w-full flex-1">
      <ClientOnly>
        <USlideover
          v-if="openSlider"
          v-model:open="openSlider"
          class="top-16 h-[calc(100vh-140px)] pb-9 bg-brand md:max-w-[370px]"
          side="left"
          :close="{ onClick: () => onCloseSidebar() }"
          :ui="{
            content: 'rounded-none!'
          }"
          @update:open="(v) => {
            if (!v) {
              onCloseSidebar()
            }
          }"
        >
          <template #content>
            <div class="w-full h-full">
              <div class="flex items-center justify-between relative gap-x-4 px-2.5 mt-2">
                <SearchPopper class="flex-1" />
                <UButton
                  class="p-0 w-5 h-5 bg-transparent"
                  color="neutral"
                  icon="i-heroicons-x-mark-20-solid"
                  variant="ghost"
                  @click="onCloseSidebar"
                />
              </div>

              <div class="w-full h-full">
                <ClientOnly>
                  <JbScrollbar
                    :scroll-x="false"
                    class="w-full h-full p-3 flex-1"
                    height="100%"
                    style-type="content"
                  >
                    <SidebarInternal
                      @update:link-value="clickLink"
                    />
                  </JbScrollbar>
                </ClientOnly>
              </div>
              <NavBarBottom
                :is-open="isMobileSidebarOpen"
                @open-chart-drawer="isOpenChatDrawer = true"
                @open-mobile-sidebar-panel="onCloseSidebar"
              />
            </div>
          </template>
        </USlideover>
      </ClientOnly>

      <ClientOnly>
        <USlideover
          v-if="!screen.md && isOpenNotification"
          v-model:open="isOpenNotification"
          class="top-16 h-[calc(100vh-140px)] pb-20 bg-brand md:max-w-[370px]"
          side="right"
          :close="{ onClick: () => closeNotification() }"
          @update:open="(v) => {
            if (!v) {
              closeNotification()
            }
          }"
        >
          <template #content>
            <NotificationContainer @update:close-chat="closeNotification" />
          </template>
        </USlideover>
      </ClientOnly>

      <div
        v-if="isOpenChatDrawer"
        ref="chatParent"
        class="w-screen h-[calc(100vh-130px)] z-1000 fixed top-16 bottom-0 left-0 right-0 bg-brand pb-[76px]"
      >
        <ClientOnly>
          <ChatContainer
            @update:close-chat="onCloseChatDrawer"
          />
        </ClientOnly>
      </div>
    </div>

    <div
      v-if="!screen.md"
      class="
        flex flex-col justify-center left-0 bottom-0 items-center fixed z-1001 bg-green-950
        w-full backdrop-blur-xs h-15 flex-none shadow-navbar
      "
    >
      <NavBarBottom
        :is-open="isMobileSidebarOpen"
        @open-chart-drawer="onOpenChatDrawer"
        @open-mobile-sidebar-panel="toggleSlider"
      />
    </div>
  </div>
</template>
