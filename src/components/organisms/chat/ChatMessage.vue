<script lang="ts" setup>
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
  <div
    :class="{
      'flex gap-x-2': chatMessage?.reply_to
    }"
  >
    <div
      v-if="chatMessage.reply_to"
    >
      <UIcon
        class="w-4 h-4 -rotate-130 relative bottom-px text-border"
        name="ion:md-redo"
      />
    </div>
    <div
      class="flex-1 relative group rounded-lg bg-green-950 duration-150 p-3"
      :class="{
        'max-w-[calc(100%-24px)]': chatMessage?.reply_to
      }"
    >
      <div
        v-if="chatMessage && chatMessage.user"
        class="flex flex-col gap-y-2"
      >
        <div class="flex items-center justify-between">
          <JbBlankButton
            class="group flex items-center gap-x-1"
            @click="
              navigateRoute({
                newQueries: {
                  modal: 'user',
                  name: chatMessage?.user?.username
                }
              })
            "
          >
            <VipRankImg
              :vip-level-name="chatMessage?.user?.vip_level_name || UNRANKED_VIP"
              class="w-5 h-5 min-w-5 min-h-5"
            />
            <span
              class="text-sm font-bold leading-5"
              :class="{
                'text-white': (!chatMessage?.user?.shadow_banned || (chatMessage?.user?.shadow_banned && !isModerator)),
                'text-disabled-paragraph': (chatMessage?.user?.shadow_banned && isModerator),
              }"
            >
              {{ chatMessage?.user?.username }}
            </span>
            <UBadge
              v-for="(role, rI) in roleItems"
              :key="`${role?.name}-${rI}`"
              size="xs"
              class="w-4 h-4 text-center flex items-center justify-center"
              :class="[role?.color]"
              variant="solid"
            >
              <span
                class="text-3xs font-bold tracking-card-chip text-white uppercase leading-none py-px"
                :title="role?.name?.toUpperCase()"
              >
                {{ role?.displayName }}
              </span>
            </UBadge>
          </JbBlankButton>
          <div class="flex items-center gap-1 h-full">
            <span
              v-if="isModerator"
              class="text-xs font-bold text-white flex items-center mr-1"
            >
              <span v-if="userIP && !ipLoading">
                {{ userIP }}
              </span>
              <UIcon
                v-else
                class="w-5 min-w-5"
                name="svg-spinners:3-dots-fade"
              />
            </span>
            <ClientOnly>
              <UPopover
                v-if="isModerator"
                class="hidden sm:flex items-center w-full sm:w-auto"
              >
                <JbBlankButton
                  class="items-center w-5 h-5 min-w-5 min-h-5 flex group"
                >
                  <UIcon
                    class="w-5 h-5 min-w-5 min-h-5 hover:text-white"
                    name="zondicons:dots-horizontal-triple"
                  />
                </JbBlankButton>
                <template #content>
                  <div
                    class="max-w-[397px] max-h-[350px] overflow-y-auto p-2 flex flex-col gap-2"
                  >
                    <JbBlankButton
                      v-if="!chatMessage?.user?.active_timeout?.due_datetime"
                      class="group flex items-center gap-x-1 text-sm font-bold"
                      @click="showMuteConfirmation"
                    >
                      <UIcon
                        class="group-active:scale-95 w-5 h-5 min-w-5 min-h-5"
                        name="material-symbols:volume-off"
                      />
                      Mute
                    </JbBlankButton>
                    <JbBlankButton
                      class="group flex items-center gap-x-1 text-sm font-bold"
                      @click="banConfirmVisible = true"
                    >
                      <UIcon
                        class="w-5 h-5 min-w-5 min-h-5"
                        name="ion:ban"
                      />
                      {{ !chatMessage?.user?.shadow_banned ? 'Shadow Ban' : 'Shadow UnBan' }}
                    </JbBlankButton>
                    <JbBlankButton
                      class="group flex items-center gap-x-1 text-sm font-bold text-error hover:text-white"
                      @click="confirmVisible = true"
                    >
                      <UIcon
                        class="w-5 h-5 min-w-5 min-h-5"
                        name="material-symbols:delete-outline"
                      />
                      Delete
                    </JbBlankButton>
                  </div>
                </template>
              </UPopover>
            </ClientOnly>
            <JbBlankButton
              v-if="isModerator && !chatMessage?.user?.active_timeout?.due_datetime"
              class="group flex items-center sm:hidden"
              @click="showMuteConfirmation"
            >
              <UIcon
                class="group-active:scale-95 w-5 h-5 min-w-5 min-h-5"
                name="material-symbols:volume-off"
              />
            </JbBlankButton>
            <JbBlankButton
              v-if="isModerator"
              class="group flex items-center sm:hidden"
              @click="banConfirmVisible = true"
            >
              <UIcon
                class="w-5 h-5 min-w-5 min-h-5"
                name="ion:ban"
              />
            </JbBlankButton>
            <JbBlankButton
              v-if="isModerator"
              class="group flex items-center sm:hidden"
              @click="confirmVisible = true"
            >
              <UIcon
                class="w-5 h-5 min-w-5 min-h-5 text-error"
                name="material-symbols:delete-outline"
              />
            </JbBlankButton>
          </div>
        </div>
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
      </div>
    </div>

    <ClientOnly>
      <UModal
        v-model:open="banConfirmVisible"
        class="w-11/12 sm:max-w-[300px]"
        :default-open="banConfirmVisible"
        :title="`${!chatMessage?.user?.shadow_banned ? 'Shadow Ban' : 'Shadow UnBan'} ${t('base.confirmation')}`"
        :close="{
        onClick: () => {
          banConfirmVisible = false
        }
      }"
      >
        <template #body>
          <div class="flex flex-col gap-4">
            <p class="text-lg text-center text-white">
              {{ t('notifications.delete-confirmation') }}
            </p>
            <div class="flex justify-center">
              <JButton
                size="sm"
                class="h-8 py-1"
                :loading="banLoading"
                @click="banUser"
              >
                {{ !chatMessage?.user?.shadow_banned ? 'Shadow Ban' : 'Shadow UnBan' }}
              </JButton>
            </div>
          </div>
        </template>
      </UModal>
    </ClientOnly>

    <ClientOnly>
      <UModal
        v-model:open="confirmVisible"
        :default-open="confirmVisible"
        class="w-11/12 sm:max-w-[300px]"
        :title="`Delete ${t('base.confirmation')}`"
        :close="{
        onClick: () => {
          confirmVisible = false
        }
      }"
      >
        <template #body>
          <div class="flex flex-col gap-4">
            <p class="text-lg text-center text-white">
              {{ t('notifications.delete-confirmation') }}
            </p>
            <div class="flex justify-center">
              <JButton
                size="sm"
                class="h-8 py-1"
                :loading="deleteLoading"
                @click="deleteMessage"
              >
                {{ t('base.delete') }}
              </JButton>
            </div>
          </div>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
