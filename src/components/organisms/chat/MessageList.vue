<script lang="ts" setup>
import ChatMessage from './ChatMessage.vue'
import { AUTH, CHAT } from '~/constants'
import ChatMessageSkeleton from './ChatMessageSkeleton.vue'
import type { ChatMessage as ChatMessageType } from '~/types'
import { CHAT_MESSAGE_SENT_SUBSCRIPTION, CHAT_MESSAGES_QUERY } from '~/graphql'

const { t } = useI18n()
const scrollRef = ref()
const { chatRoomId, isScrolledUp, userIps } = inject(CHAT)!
const { isLoggedIn } = inject(AUTH)!
const newMessageCount = ref<number>(0)

const {
  loading,
  result: chatMsgResult,
  refetch: chatMsgRefetch,
  subscribeToMore,
  options: chatMsgOptions
} = useQuery<{
  getLastChatMessagesByChatRoom: {
    id: string
    messageList: ChatMessageType[]
  };
}>(
  CHAT_MESSAGES_QUERY,
  {
    chat_room_id: chatRoomId.value,
  }, {
    enabled: !!chatRoomId.value && isLoggedIn.value
  }
)

const chatMessages = computed(
  () => chatMsgResult.value?.getLastChatMessagesByChatRoom?.messageList?.filter(m => !m.suppressed) || []
)

const getChatMessageFromDetails = (
  chatMessage: ChatMessageType
): ChatMessageType => ({
  __typename: 'ChatMessage',
  id: chatMessage.id || chatMessage.msg_user_identifier,
  created_at: chatMessage.created_at || '',
  message: chatMessage.message || '',
  msg_user_identifier: chatMessage.msg_user_identifier || '',
  suppressed: chatMessage.suppressed || false,
  reply_to: null,
  user: {
    id: chatMessage.user?.id || '',
    username: chatMessage.user?.username || '',
    active_timeout: chatMessage.user?.active_timeout,
    shadow_banned: chatMessage.user?.shadow_banned,
    vip_level_name: chatMessage.user?.vip_level_name || '',
    roles: chatMessage.user?.roles || [],
    __typename: 'User',
  },
})

const subscribeChatMessages = () => {
  subscribeToMore({
    document: CHAT_MESSAGE_SENT_SUBSCRIPTION,
    variables: {
      chatRoomId: chatRoomId.value,
    },
    updateQuery(prev, { subscriptionData }) {
      // @ts-ignore
      if (!subscriptionData.data || !subscriptionData.data.chatMessageSent) {
        return prev
      }

      if (isScrolledUp.value) {
        newMessageCount.value++
      }

      return {
        getLastChatMessagesByChatRoom: {
          ...prev.getLastChatMessagesByChatRoom,
          messageList: [
            ...prev.getLastChatMessagesByChatRoom?.messageList || [],
            // @ts-ignore
            getChatMessageFromDetails(subscriptionData.data?.chatMessageSent)
          ],
          __typename: 'ChatMessageList',
        },
      }
    },
  })
}

const scrollToBottom = (smooth = false) => {
  let scrollDowned = false
  const downInterval: NodeJS.Timeout = setInterval(() => {
    if (scrollDowned) {
      clearInterval(downInterval)
      return
    }

    if (!scrollDowned && scrollRef.value?.el && scrollRef.value?.el?.scrollHeight) {
      scrollRef.value?.el?.scrollTo({
        top: scrollRef.value?.el?.scrollHeight + 300,
        behavior: smooth ? 'smooth' : 'instant',
      })

      scrollDowned = true
    }
  }, 0)
}

const onScroll = (e: any) => {
  const scrollElement = e.target! as HTMLDivElement
  isScrolledUp.value = scrollElement.scrollTop + scrollElement.clientHeight + 100 <= scrollElement.scrollHeight
}

const handleDeleteMessage = () => {
  chatMsgRefetch({
    chat_room_id: chatRoomId.value,
  })
}

watch(
  () => loading.value,
  (v) => {
    if (!v) {
      scrollToBottom(false)
    }
  },
  { immediate: true }
)

watch(
  () => chatMessages.value,
  () => {
    scrollToBottom(false)
  },
  { immediate: true }
)

watch(
  () => isScrolledUp.value,
  (isScrolledUpValue) => {
    if (!isScrolledUpValue) {
      scrollToBottom(false)
      newMessageCount.value = 0
    }
  }
)

watch(
  () => [isLoggedIn.value, chatRoomId.value],
  (v) => {
    if (v[0] && !!v[1]) {
      // @ts-ignore
      chatMsgOptions.enabled = true
      subscribeChatMessages()
    }
  },
  { immediate: true }
)

onMounted(() => {
  userIps.value = []
  chatMsgRefetch({
    chat_room_id: chatRoomId.value,
  })
  useTimeoutFn(scrollToBottom, 500)
})
</script>
<template>
  <div class="h-full relative bg-brand">
    <JbScrollbar
      v-if="loading"
      class="h-full px-4 py-2 overflow-y-auto overflow-x-hidden"
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
    <template v-else>
      <JbScrollbar
        ref="scrollRef"
        class="h-full p-4 overflow-y-auto overflow-x-hidden"
        height="100%"
        style-type="content"
        :scroll-down="true"
        @scroll="onScroll"
      >
        <UChatMessages class="px-0">
          <ChatMessage
            v-for="chatMessage in chatMessages"
            :key="chatMessage.id"
            :chat-message="chatMessage"
            @delete-message="handleDeleteMessage"
          />
        </UChatMessages>
      </JbScrollbar>

      <div
        v-if="isScrolledUp"
        class="absolute left-1/2 -translate-x-1/2 z-999 w-[240px] bottom-[30px]"
        @click="scrollToBottom(true)"
      >
        <div
          class="
            group cursor-pointer text-white bg-alternative-hover rounded-lg
            border-b border-b-alternative-hover shadow-secondary-box font-medium text-sm
          "
        >
          <div
            class="group-hover:hidden flex items-center justify-center gap-2.5 h-10 duration-150"
          >
            <UIcon
              class="w-4 h-4 min-w-4 min-h-4"
              name="heroicons:pause-20-solid"
            />
            <div class="flex-none">
              {{ t('chat.chat-paused-due-scroll') }}
            </div>
          </div>
          <div
            class="hidden group-hover:flex items-center justify-center gap-2.5 h-10 duration-150"
          >
            <UIcon
              class="text-white w-4 h-5"
              name="heroicons:arrow-down-20-solid"
            />
            <div
              v-if="newMessageCount"
              class="flex-none"
            >
              {{ newMessageCount }} + {{ t('chat.new-messages') }}
            </div>
            <div
              v-else
              class="flex-none"
            >
              {{ t('chat.scroll-to-new-messages') }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
