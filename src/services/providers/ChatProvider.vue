<script lang="ts" setup>
import { AUTH, CHAT } from '~/constants'
import { CHAT_ROOM_USER_SEARCH_QUERY, CHAT_ROOMS_QUERY } from '~/graphql'
import type { ChatMessage, ChatRoom, ChatRoomUser } from '~/types'

const route = useRoute()
const { me, isLoggedIn } = inject(AUTH)!
const isScrolledUp = ref<boolean>(false)
const chatRoomId = ref(1)
const input = ref<string>('')
const muteConfirmationUsername = ref<string>('')
const muteConfirmationVisible = ref<boolean>(false)
const bannedUsersModalVisible = ref<boolean>(false)
const isModerator = computed(
  () => !!me.value?.roles?.some(role => [
    'superadmin', 'admin', 'developer', 'moderator'
  ].includes(role?.name?.toLowerCase()))
)

// @ts-ignore
const isMuted = computed(() => !!(me.value && me.value?.active_timeout?.due_datetime))

const userRefOnInput = computed<{
  present: boolean;
  keyword: string;
}>(() => {
  const regex = /@(?<keyword>[^@\s\r]*)$/
  const matches = input.value.match(regex)
  if (matches) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      keyword: matches.groups?.keyword!,
      present: true,
    }
  }

  return {
    keyword: '',
    present: false,
  }
})

const replyingTo = ref<ChatMessage | null>(null)
const showGifSelect = ref<boolean>(false)
const {
  loading: chatRoomsLoading,
  result: chatRoomResult,
  options: chatRoomOpt
} = useQuery<{ chatRooms: ChatRoom[] }>(
  CHAT_ROOMS_QUERY, {},
  {
    fetchPolicy: 'cache-and-network',
    enabled: isLoggedIn.value
  }
)

const chatRooms = computed(
  () =>
    chatRoomResult.value?.chatRooms.map(r => ({ ...r, id: Number(r.id) })).filter(ch => ch.slug === 'EN') ||
    []
)

const { result, options, refetch: roomUsersRefetch } = useQuery<{
  chatRoomUserSearch: ChatRoomUser[];
}>(CHAT_ROOM_USER_SEARCH_QUERY, {
  input: {
    keyword: '',
    chat_room_id: chatRoomId.value,
  },
  limit: 100,
}, {
  enabled: false
})

const chatRoomUsers = computed(
  () =>
    result.value?.chatRoomUserSearch.map(chatRoomUser => chatRoomUser.user) ||
    []
)

const isOpen = computed(() => (route.query.drawer && String(route.query.drawer) === 'chat') || false)

const closeChat = () => {
  navigateRoute({
    oldQueries: ['drawer']
  })
}

const openChat = () => {
  navigateRoute({
    newQueries: { drawer: 'chat' }
  })
}

const mockData = ref<any[]>([])
const userIps = ref<any[]>([])

watch(
  () => chatRooms.value,
  (v) => {
    if (v && v.length && v[0].id !== 0) {
      chatRoomId.value = Number(v[0].id)
    }
  },
  { immediate: true }
)

watch(
  () => isLoggedIn.value,
  (v) => {
    if (v) {
      // @ts-ignore
      chatRoomOpt.enabled = true

      nextTick(() => {
        // @ts-ignore
        options.enabled = true
      })
    }
  },
  { immediate: true }
)

watch(
  () => userRefOnInput.value,
  (v) => {
    if (v && v?.keyword !== '' && v?.keyword.length >= 2) {
      roomUsersRefetch({
        input: {
          keyword: v?.keyword,
          chat_room_id: chatRoomId.value,
        },
        limit: 100,
      })
    }
  },
  { immediate: true }
)

provide(CHAT, {
  isOpen,
  openChat,
  closeChat,
  loading: chatRoomsLoading,
  isModerator,
  chatRoomId,
  isScrolledUp,
  input,
  chatRoomUsers,
  chatRooms,
  userRefOnInput,
  replyingTo,
  showGifSelect,
  muteConfirmationVisible,
  muteConfirmationUsername,
  bannedUsersModalVisible,
  isMuted,
  mockData,
  userIps,
  roomUsersRefetch,
})
</script>

<template>
  <slot />
</template>
