<script lang="ts" setup>
import ChatBar from '~/components/organisms/chat/ChatBar.vue'
import MuteConfirmation from '~/components/organisms/chat/MuteConfirmation.vue'
import BannedUsers from '~/components/organisms/chat/BannedUsers.vue'
import ChatMessageSkeleton from '~/components/organisms/chat/ChatMessageSkeleton.vue'
import { CHAT } from '~/constants'
import { BASE_CLOSE_ICON } from '~/icons'

const emit = defineEmits<{
  (e: 'update:closeChat'): void;
}>()

const { t } = useI18n()
const { loading: chatRoomsLoading, chatRoomId, muteConfirmationVisible, bannedUsersModalVisible } = inject(CHAT)!
</script>
<template>
  <div class="w-full h-full relative border-r border-r-green-950 z-999">
    <ChatBar
      v-if="chatRoomId"
      class="h-full"
      @close:chat-drawer="emit('update:closeChat')"
    />
    <div
      v-else-if="chatRoomsLoading"
      class="absolute inset-0"
    >
      <div class="flex flex-col h-full">
        <div class="flex-none">
          <div
            class="flex items-center px-5 py-4 lg:h-[90px] md:h-[79px] bg-brand"
          >
            <div class="flex gap-4 items-center w-full">
              <span class="font-medium text-white text-lg">{{ t('chat.chat') }}</span>
              <USkeleton class="h-5 w-40 mr-auto bg-green-950" />
              <JbBlankButton
                class="
                  border-0 duration-150 hover:transform hover:-rotate-90 hover-transition-all
                  hover:ease-in-out hover:text-white text-paragraph hidden lxl:block
                "
                @click="emit('update:closeChat')"
              >
                <svg class="w-4 md:w-4.5 h-4 md:h-4.5">
                  <use :href="BASE_CLOSE_ICON" />
                </svg>
              </JbBlankButton>
            </div>
          </div>
        </div>
        <div class="flex-1 min-h-0">
          <JbScrollbar
            class="h-full p-4"
            height="100%"
            style-type="content"
          >
            <div
              class="flex flex-col justify-end min-h-full gap-3"
            >
              <ChatMessageSkeleton
                v-for="i in 24"
                :key="i"
              />
            </div>
          </JbScrollbar>
        </div>
        <div
          class="flex-none"
        >
          <div class="bg-green-950 p-5">
            <USkeleton class="h-10 w-full bg-green-950" />
          </div>
        </div>
      </div>
    </div>

    <ClientOnly>
      <UModal
        v-model:open="muteConfirmationVisible"
        class="w-11/12 sm:max-w-lg bg-green-950"
        :default-open="muteConfirmationVisible"
        :title="t('chat.mute-confirmation')"
        :close="{
        onClick: () => {
          muteConfirmationVisible = false
        }
      }"
      >
        <template #body>
          <MuteConfirmation />
        </template>
      </UModal>
    </ClientOnly>

    <ClientOnly>
      <UModal
        v-model:open="bannedUsersModalVisible"
        class="w-11/12 sm:max-w-lg bg-green-950"
        :default-open="bannedUsersModalVisible"
        :title="t('chat.muted-user-management')"
        :close="{
        onClick: () => {
          bannedUsersModalVisible = false
        }
      }"
      >
        <template #body>
          <BannedUsers />
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
