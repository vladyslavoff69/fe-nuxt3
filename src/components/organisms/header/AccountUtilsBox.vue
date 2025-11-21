<script lang="ts" setup>
import { CHAT, NOTIFICATION, THEME } from '~/constants'

const { isOpen, openChat, closeChat } = inject(CHAT)!
const {
  isOpen: isOpenNotification,
  openNotification,
  closeNotification,
  hasNotifications,
  unreadNotifications,
  isOpenMobile
} = inject(NOTIFICATION)!
const { screen } = inject(THEME)!

const onClickNotify = () => {
  if (screen.value.sm) {
    if (isOpenNotification.value) {
      closeNotification()
    } else {
      openNotification()
    }
  } else {
    isOpenMobile.value = !isOpenMobile.value
  }
}

const onToggleChatPanel = () => {
  if (isOpen.value) {
    closeChat()
  } else {
    openChat()
  }
}

</script>

<template>
  <ul class="list-none flex items-center gap-x-2 lg:gap-x-4">
    <li class="flex items-center">
      <JbBlankButton
        class="w-full h-full flex items-center relative"
        @click="onClickNotify()"
      >
        <UIcon
          :class="{
            'text-yellow-400': hasNotifications
          }"
          class="h-5 w-5 min-h-5 min-w-5"
          name="heroicons:bell-20-solid"
        />
        <span
          v-if="hasNotifications"
          :class="[
            unreadNotifications > 99 ? '-right-3.5' : (unreadNotifications < 10 ? '-right-1' : '-right-2')
          ]"
          class="block min-w-3.5 w-auto text-center px-1 h-3.5 leading-[14px] text-white bg-error rounded-full absolute -top-1 text-xxs"
        >
          {{ unreadNotifications > 99 ? '99+' : unreadNotifications }}
        </span>
      </JbBlankButton>
    </li>
    <li class="hidden md:flex items-center">
      <JbBlankButton
        class="w-full h-full flex items-center"
        @click="onToggleChatPanel"
      >
        <UIcon
          class="h-5 w-5 min-h-5 min-w-5"
          name="heroicons:chat-bubble-left-right-20-solid"
        />
      </JbBlankButton>
    </li>
  </ul>
</template>
