<script lang="ts" setup>
import MessageList from '~/components/organisms/chat/MessageList.vue'
import SendMessageForm from '~/components/organisms/chat/SendMessageForm.vue'
import ChatUserSelect from '~/components/organisms/chat/ChatUserSelect.vue'
import ChatGifSelect from '~/components/organisms/chat/ChatGifSelect.vue'
import Muted from '~/components/organisms/chat/Muted.vue'
import RainModal from '~/components/organisms/chat/RainModal.vue'
import RuleModal from './RuleModal.vue'
import { CHAT_TEXT_LIMIT_LENGTH } from '~/constants/mock_data'
import { CHAT, PREFERENCE } from '~/constants'
import { BASE_CLOSE_ICON } from '~/icons'
import { MESSENGER_ICON, CHAT_RAIN_ICON, RULES_ICON } from '~/components/symbols'

const emits = defineEmits<{
  (e: 'close:chat-drawer'): void;
}>()

const { userRefOnInput, showGifSelect, bannedUsersModalVisible, isModerator, isMuted, input } = inject(CHAT)!
const runtimeConfig = useRuntimeConfig()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const chatRainConf = runtimeConfig.public?.chatRain
const hasChatCommander = computed(() => (runtimeConfig.public?.appEnv !== 'production'))
const { activeCryptoCode } = inject(PREFERENCE)!
const isRainModalOpen = ref<boolean>(false)
const isRulesModalOpen = ref<boolean>(false)
const isCommanderOpen = ref<boolean>(false)
const messageLimitRemaining = computed(() => CHAT_TEXT_LIMIT_LENGTH - input.value.length)

const onShowRainModal = () => {
  isRainModalOpen.value = true

  router.push({
    ...router.currentRoute,
    query: {
      ...route.query,
      currency: activeCryptoCode.value,
    },
  })
}

const openRulesModal = () => {
  isRulesModalOpen.value = true
}

const onCloseRainModal = () => {
  isRainModalOpen.value = false
}

const closeRulesModal = () => {
  isRulesModalOpen.value = false
}
</script>
<template>
  <div>
    <div class="w-full h-full flex flex-col">
      <div class="sticky top-0 z-999">
        <div
          class="flex items-center justify-between py-2.5 md:py-4 md:h-[70px] bg-green-950"
        >
          <div class="flex gap-4 items-center justify-between w-full border-b border-b-green-950 p-4">
            <div class="flex-1 flex gap-x-2 items-center text-white">
              <svg class="w-5 h-5 min-w-5 min-h-5">
                <use :href="MESSENGER_ICON" />
              </svg>
              <span class="text-lg font-bold">{{ t('chat.chat') }}</span>
            </div>

            <div class="flex items-center gap-x-2 relative h-8">
              <JbBlankButton
                v-if="hasChatCommander"
                class="text-paragraph cursor-pointer group-hover:text-white flex items-center"
              >
                <UIcon
                  class="w-5 h-5 min-w-5 min-h-5"
                  name="clarity:command-line"
                />
              </JbBlankButton>
              <JbBlankButton
                v-if="isModerator"
                class="cursor-pointer flex items-center"
                @click="bannedUsersModalVisible = true"
              >
                <UIcon
                  class="w-5 h-6 text-error min-w-5 min-h-6"
                  name="heroicons:user-group-solid"
                />
              </JbBlankButton>
              <JbBlankButton
                class="text-paragraph cursor-pointer group-hover:text-white flex items-center"
                @click="openRulesModal"
              >
                <svg class="w-5 h-5 min-w-5 min-h-5">
                  <use :href="RULES_ICON" />
                </svg>
              </JbBlankButton>
              <JbBlankButton
                class="text-paragraph cursor-pointer group-hover:text-white flex items-center"
                @click="onShowRainModal"
              >
                <svg
                  v-if="chatRainConf === 'rain'"
                  class="w-3.5 h-5 min-w-3 min-h-5"
                >
                  <use :href="CHAT_RAIN_ICON" />
                </svg>
                <UIcon
                  v-else
                  name="mingcute:snow-line"
                  class="w-5 h-5 min-w-5 min-h-5"
                />
              </JbBlankButton>
              <JbBlankButton
                class="
                  duration-150 hover:transform hover:-rotate-90 hover-transition-all
                  hover:ease-in-out hover:text-white flex items-center
                "
                @click="emits('close:chat-drawer')"
              >
                <svg class="w-4 md:w-4.5 h-4 md:h-4.5">
                  <use :href="BASE_CLOSE_ICON" />
                </svg>
              </JbBlankButton>
            </div>
          </div>
        </div>
        <div
          v-if="chatRainConf === 'snow'"
          class="flex items-center justify-center p-2 text-xs relative bg-brand"
        >
          <div class="backdrop-blur-md opacity-60 w-full h-full absolute z-1 inset-0 shadow-header">
            <div class="relative w-full h-full overflow-hidden">
              <div class="snow snow-1" />
              <div class="snow snow-2" />
              <div class="snow snow-3" />
              <div class="snow snow-4" />
            </div>
          </div>
          <div class="uppercase text-white font-bold z-10 flex items-center gap-1">
            <NuxtImg
              src="/d7562785-eb7f-4529-f6b6-e8106d3d1700/sm"
              alt="Christmas Tree"
              class="w-4 h-auto"
              loading="lazy"
              provider="cloudflare"
            />
            <span class="leading-none">{{ t('chat.chat-snow-desc') }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="!isCommanderOpen"
        class="flex-1 min-h-0"
      >
        <MessageList />
      </div>

      <div
        v-if="!isCommanderOpen"
        class="flex-none relative"
      >
        <template v-if="!isMuted">
          <div class="bg-green-950 px-4 pt-4 pr-5 pb-0 md:pb-1 flex flex-col gap-1">
            <SendMessageForm />

            <div
              class="font-bold text-sm text-right"
              :class="{
                'text-error bg-warn-gradient rounded-md px-2': messageLimitRemaining < 0,
                'text-highlights': messageLimitRemaining >= 0,
              }"
            >
              {{ messageLimitRemaining }}
            </div>
          </div>
          <div
            v-if="userRefOnInput.present"
            class="absolute bottom-full inset-x-0"
          >
            <ChatUserSelect :keyword="userRefOnInput.keyword" />
          </div>
          <div
            v-if="showGifSelect"
            class="absolute bottom-full inset-x-0"
          >
            <ChatGifSelect />
          </div>
        </template>
        <div
          v-else
          class="bg-green-950 px-5 py-3"
        >
          <Muted />
        </div>
      </div>
    </div>
    <RainModal
      v-if="isRainModalOpen"
      :modal-visible="isRainModalOpen"
      @closed:rainmodal="onCloseRainModal"
    />
    <RuleModal
      v-if="isRulesModalOpen"
      :modal-visible="isRulesModalOpen"
      @close:rule-modal="closeRulesModal"
    />
  </div>
</template>

<style scoped lang="scss">
@keyframes snowfall-1 {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 0 512px;
  }
}

@keyframes snowfall-2 {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 0 256px;
  }
}

@keyframes snowfall-3 {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 0 128px;
  }
}

@keyframes wind {
  0% {
    left: -48px;
  }
  50% {
    left: 0;
  }
  100% {
    left: -48px;
  }
}

.snow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://imagedelivery.net/PqUPeaOeGAxHB9FZtXllkg/f24306a3-d36d-4658-5a38-f26c4af2ed00/sm');
}

.snow-1 {
  background-size: 256px;
  filter: blur(1px);
  z-index: 3;
  animation: snowfall-1 19s linear infinite, wind 12s ease-in-out infinite;
  animation-delay: -1s;
  opacity: 0.3;
}

.snow-2 {
  background-size: 256px;
  filter: blur(2px);
  z-index: 2;
  animation: snowfall-2 21s linear infinite, wind 18s ease-in-out infinite;
  animation-delay: -2s;
  opacity: 0.3;
}

.snow-3 {
  background-size: 128px;
  filter: blur(2px);
  z-index: 1;
  animation: snowfall-3 20s linear infinite;
  animation-delay: -3s;
  opacity: 0.3;
}

.snow-4 {
  background-size: 128px;
  filter: blur(1px);
  z-index: 0;
  animation: snowfall-3 20s linear infinite;
  animation-delay: -4s;
  opacity: 0.3;
}
</style>
