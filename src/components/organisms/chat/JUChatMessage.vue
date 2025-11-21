<script setup lang="ts">
import MessageTxt from '~/components/organisms/chat/MessageTxt.vue'
import MessageBet from '~/components/organisms/chat/MessageBet.vue'
import VipRankImg from '~/components/molecules/table/details/VipRankImg.vue'
import type { ChatMessage } from '~/types'
import { AUTH, CHAT, UNRANKED_VIP } from '~/constants'
import { SHADOW_BAN_MUTATION, SUPPRESS_CHAT_MESSAGE_MUTATION } from '~/graphql'
import { navigateRoute } from '~/utils'

const props = defineProps<{
  chatMessage: ChatMessage | any;
}>()

const emits = defineEmits<{
  (e: 'deleteMessage'): void;
}>()

const { t } = useI18n()
const { ipAddress, me } = inject(AUTH)!
const { isModerator, muteConfirmationVisible, muteConfirmationUsername, chatRoomId, userIps } = inject(CHAT)!

const { mutate: deleteMutate, onDone: onDeleteDone, loading: deleteLoading } = useMutation(
  SUPPRESS_CHAT_MESSAGE_MUTATION
)

const { mutate: banMutate, onDone: onBanDone, loading: banLoading } = useMutation(
  SHADOW_BAN_MUTATION
)

const router = useRouter()
const confirmVisible = ref(false)
const banConfirmVisible = ref(false)
const ipLoading = ref(true)
const userIP = ref()
const localePath = useLocalePath()

const computedMessages = computed(() => collectSegmentMessages(props.chatMessage?.message || ''))

const roleOptionMap: {
  [key in string]: { icon: string; color: string; displayName: string };
} = {
  superadmin: { icon: 'clarity:administrator-line', color: 'bg-[#dc143c]!', displayName: 'SA' },
  admin: { icon: 'clarity:administrator-line', color: 'bg-[#dc143c]!', displayName: 'A' },
  developer: {
    icon: 'ic:round-developer-mode',
    color: 'bg-[#800080]!',
    displayName: 'D',
  },
  moderator: {
    icon: 'material-symbols:add-moderator-outline-rounded',
    color: 'bg-[#1e90ff]!',
    displayName: 'M',
  },
  support: {
    icon: 'material-symbols:help-center',
    color: 'bg-[#000080]!',
    displayName: 'SU'
  },
}

const isSuper = props.chatMessage?.user?.roles?.some(
  (role: any) => role?.name === 'superadmin'
)

const roleItems = [...(props.chatMessage?.user?.roles || [])]
  .filter(role => Object.keys(roleOptionMap).includes(role?.name))
  .filter(role => (isSuper ? role?.name !== 'admin' : true))
  .map(role => ({ ...role, ...roleOptionMap[role?.name || 'player'] }))

const onMessageClick = (e: MouseEvent) => {
  const targetElement = e.target as HTMLElement
  if (targetElement.tagName === 'A') {
    const href = targetElement.getAttribute('href') || ''
    router.push(localePath(href))
    e.preventDefault()
  }
}

const showMuteConfirmation = () => {
  muteConfirmationUsername.value = props.chatMessage?.user?.username
  muteConfirmationVisible.value = true
}

const deleteMessage = () => {
  deleteMutate({
    input: {
      chat_room_id: chatRoomId.value,
      msg_user_identifier: props.chatMessage?.msg_user_identifier,
    },
  })
}

onDeleteDone(() => {
  emits('deleteMessage')
})

const banUser = () => {
  banMutate({
    userId: (props.chatMessage?.user?.id ? Number(props.chatMessage.user.id) : 0),
  })
}

onBanDone(() => {
  emits('deleteMessage')
})

const maskIp = (ip: string) => {
  if (!ip || ip === '') {
    return '--'
  }

  const parts = ip?.split('.')

  if (parts && parts.length > 3) {
    return `*.*.${parts[2]}.${parts[3]}`
  }

  const partsIp6 = ip?.split(':')

  if (partsIp6 && partsIp6.length >= 8) {
    return `*:*:*:${partsIp6[6]}:${partsIp6[7]}`
  }

  if (partsIp6 && partsIp6.length > 4) {
    return `*:*:${partsIp6[2]}::${partsIp6[4]}`
  }

  return '--'
}

const getUserIp = () => {
  if (props.chatMessage?.user?.id) {
    const userId = props.chatMessage.user.id
    if (userId === me.value?.id) {
      ipLoading.value = false
      return maskIp(ipAddress.value)
    }

    const ipFilter = userIps.value?.find(item => item.userId === userId)
    if (ipFilter) {
      ipLoading.value = false

      return maskIp(ipFilter.ip)
    }

    const { data } = useFetch(`/api/kv/ip/${userId}`)

    // @ts-ignore
    if (data.value && data.value?.error) {
      ipLoading.value = false

      userIps.value.push({
        userId,
        ip: '',
      })

      return '--'
    }

    // @ts-ignore
    if (data.value && data.value?.value) {
      userIps.value.push({
        userId,
        // @ts-ignore
        ip: data.value?.value,
      })

      ipLoading.value = false

      // @ts-ignore
      return maskIp(data.value?.value)
    }
  }

  ipLoading.value = false

  return '--'
}

watch(() => userIP.value, (newVal) => {
  if (newVal) {
    ipLoading.value = true
    nextTick(() => {
      ipLoading.value = false
    })
  }
}, { immediate: true })

onMounted(() => {
  userIP.value = getUserIp()
})
</script>

<template>
  <UChatMessage
    variant="solid"
    side="right"
    compact
  >
    <template #content>
      <div
        class="text-xs whitespace-pre-line break-words font-semibold"
        @click="onMessageClick"
      >
        <div
          v-for="(msg, idx) in computedMessages"
          :key="idx"
        >
          <MessageTxt
            v-if="msg?.type === 'text'"
            :content="msg.content"
          />
          <MessageBet
            v-else
            :bet-id="msg.content"
          />
        </div>
      </div>
    </template>
  </UChatMessage>
</template>
