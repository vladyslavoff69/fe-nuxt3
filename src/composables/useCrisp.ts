import { Crisp } from 'crisp-sdk-web'
import { AUTH } from '~/constants'

export const useCrisp = () => {
  const runtimeConfig = useRuntimeConfig()
  const { isLoggedIn, me } = inject(AUTH)!

  const chatOpened = ref(false)
  const websiteId = (runtimeConfig?.public?.crispSdkID || '4cdc8e0f-6308-4ed5-983d-4d230d52bf4e')
  if (import.meta.client) {
    Crisp.configure(websiteId, {
      autoload: false
    })
  }

  watch(() => isLoggedIn.value, (v) => {
    if (v) {
      if (!v) {
        return
      }

      if (import.meta.client) {
        // me.value
        Crisp.setTokenId(me.value?.ssoToken)
        Crisp.user.setEmail(me.value?.email || 'Anonymous@junglebet.com')
        Crisp.user.setNickname(me.value?.username || 'Anonymous')
        Crisp.session.setData({
          user_id: me.value?.id,
          plan: me.value?.vip_level_name
        })
        Crisp.load()
      }
    }
  }, { immediate: isLoggedIn.value })

  if (import.meta.client) {
    Crisp.chat.onChatOpened(() => {
      if (isLoggedIn.value && !chatOpened.value) {
        Crisp.message.show('picker', {
          id: (me.value?.id ? String(me.value?.id) : 'free-question-id'),
          text: 'Hello, How can I help you?',
          choices: [
            {
              value: 'bets',
              label: 'Bets',
              selected: false
            },
            {
              value: 'deposits',
              label: 'Deposit',
              selected: false
            },
            {
              value: 'withdrawals',
              label: 'Withdrawals',
              selected: false
            },
            {
              value: 'tech',
              label: 'Tech',
              selected: false
            }
          ]
        })
      }

      chatOpened.value = true
    })
  }

  const toggleChat = () => {
    if (import.meta.client && isLoggedIn.value) {
      if (!Crisp.chat.isChatOpened()) {
        Crisp.chat.open()
      } else {
        Crisp.chat.close()
      }
    }
  }

  return {
    Crisp,
    toggleChat,
  }
}
