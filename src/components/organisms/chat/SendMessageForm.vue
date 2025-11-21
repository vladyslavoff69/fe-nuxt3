<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { AUTH, CHAT, LOGIN } from '~/constants'
import { SEND_CHAT_MESSAGE_MUTATION } from '~/graphql'
import { CHAT_TEXT_LIMIT_LENGTH } from '~/constants/mock_data'
import { TELEGRAM_ICON } from '~/icons'

const { t } = useI18n()
const { refetch, isLoggedIn } = inject(AUTH)!
const {
  chatRoomId,
  isScrolledUp,
  input,
  userRefOnInput
} = inject(CHAT)!

const { loading, mutate, onDone, onError } = useMutation(
  SEND_CHAT_MESSAGE_MUTATION
)
const router = useRouter()
const height = ref<number>(40)
const textarea: Ref<HTMLTextAreaElement | undefined> = ref()

const updateTextareaHeight = () => {
  let newHeight: number
  if (textarea.value) {
    if (textarea.value.scrollHeight > 84) {
      newHeight = 84
    } else if (textarea.value.scrollHeight < 40) {
      newHeight = 40
    } else {
      newHeight = textarea.value.scrollHeight
    }
    if (input.value === '') {
      newHeight = 40
    }
    height.value = newHeight
  }
}

const onKeypress = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey && !userRefOnInput.value.present) {
    e.preventDefault()

    onSubmit()
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (userRefOnInput.value.present) {
    if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
      e.preventDefault()
    }
  }
}

onDone(() => {
  input.value = ''
})

onError((e) => {
  const parsedError = parseGraphqlError(e)
  useGeneralNotify({
    type: 'error',
    title: t('chat.cant-send-message'),
    description: parsedError.message
  })

  refetch()
})

const onSubmit = () => {
  // check if input is valid
  if (!isLoggedIn.value) {
    router.push({
      ...router.currentRoute,
      query: {
        modal: 'auth',
        tab: LOGIN,
      },
    })
    return
  }

  if (input.value.length === 0) {
    return
  }

  if (input.value.length > CHAT_TEXT_LIMIT_LENGTH) {
    return
  }

  isScrolledUp.value = false
  mutate({
    chat_room_id: chatRoomId.value,
    message: input.value,
    reply_to: '',
  })
}

watch(
  () => input.value,
  () => {
    updateTextareaHeight()
  }
)
</script>
<template>
  <div class="relative">
    <form
      class="flex w-full items-end rounded-lg"
      @submit.prevent="onSubmit"
    >
      <div
        :style="{
          marginRight: height > 40 ? '-2px' : 0,
        }"
        class="relative flex flex-1"
      >
        <textarea
          ref="textarea"
          v-model="input"
          :class="
            height > 40
              ? 'rounded-tr-lg rounded-l-lg rounded-br-none'
              : 'rounded-l-lg rounded-r-none border-r-0'
          "
          :style="{
            height: `${height}px`,
          }"
          class="
            bg-brand pl-3 md:pl-[15px] py-2.5 text-white
            pr-7 text-sm w-full ring-0 ring-border focus:outline-hidden placeholder:text-paragraph
            overflow-y-auto max-h-20 resize-none hover:ring-1 focus:ring-1 hover:ring-primary
          "
          placeholder="Type your message"
          @keydown="onKeydown"
          @keyup="onKeypress"
        />
      </div>
      <JButton
        :loading="loading"
        class="h-10 p-2 rounded-md rounded-bl-none rounded-tl-none"
        @click="onSubmit"
      >
        <svg class="w-4 h-4 text-white">
          <use :href="TELEGRAM_ICON" />
        </svg>
      </JButton>
    </form>
  </div>
</template>
