<script lang="ts" setup>
import { GAME_POPUP, THEME } from '~/constants'
import { DraggableResizable } from '~/services/libs/draggable-resizable'
import WHIPClient from '~/services/libs/screenshare/WHIPClient'
import initAudioRoom from '~/services/libs/screenshare/audioRoomClient'

const { screen } = inject(THEME)!
const {
  isResizingPopup,
  isStreaming,
  topPopupGameSlug,
  roomId,
  screenStream,
  whipClient,
  audioOn,
  audioLoading,
  audioContainer,
  stopLoading,
  previewContainer,
  setTopPopupGameSlug,
  toggleGameSharePopup,
  onStopLive,
} = inject(GAME_POPUP)!
const { t } = useI18n()

const modalSlug = 'junglebet-game-share-popup'
const gameShareContainer = ref<HTMLDivElement>()
const width = ref<number>(screen.value.md ? 320 : 265)
const height = ref<number>(400)
const left = ref<number>(screen.value.width - width.value - 20)
const top = ref<number>(screen.value.height - height.value - 20)
const maxWidth = ref<number>(320) // popup max width
const maxHeight = ref<number>(height.value) // popup max height
const shareLoading = ref(false)
const shareUrl = ref()
const token = getAuthCookie()
const copyVisible = ref(false)

// Set the current game popup to top priority popup
const handleWindowClick = () => {
  setTopPopupGameSlug(modalSlug)
}

// Popup event handlers
const onResizing = () => {
  isResizingPopup.value = true
}

const onResizeStop = () => {
  isResizingPopup.value = false
}

const onGoLive = async () => {
  shareLoading.value = true
  roomId.value = crypto.randomUUID()
  // @ts-ignore
  const { publishUrl, playbackUrl } = await $fetch('/api/rtc/stream', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.value}`,
    }
  })

  // 1. create room
  try {
    await useFetch(
      `/api/kv/audio-room/${roomId.value}`,
      {
        method: 'POST',
        // @ts-ignore
        body: {
          value: {
            publishUrl,
            playbackUrl,
            participants: {
              sessionId: '',
              tracks: []
            }
          }
        },
        headers: {
          Authorization: `Bearer ${token.value}`,
        }
      }
    )
  } catch (e: any) {
    useGeneralNotify({
      type: 'error',
      title: 'Failed to start room',
      description: e?.message,
    })
    shareLoading.value = false

    return
  }

  // 2. capture screen
  if (
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getDisplayMedia === 'function'
  ) {
    try {
      screenStream.value = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })
    } catch (err: any) {
      useGeneralNotify({
        type: 'error',
        title: 'Screen share failed',
        description: err?.message,
      })
      shareLoading.value = false

      return
    }
  } else {
    useGeneralNotify({
      type: 'error',
      title: 'Screen share failed',
      description: 'Screen sharing is not supported in this browser',
    })
    shareLoading.value = false

    return
  }

  const hiddenVideo: HTMLVideoElement = document.createElement('video')
  hiddenVideo.autoplay = true
  hiddenVideo.muted = true
  hiddenVideo.playsInline = true
  hiddenVideo.style.display = 'none'
  hiddenVideo.srcObject = screenStream.value
  gameShareContainer.value?.appendChild(hiddenVideo)

  // 3. preview in widget
  if (previewContainer.value) {
    previewContainer.value.srcObject = screenStream.value
  }

  whipClient.value = new WHIPClient(publishUrl, hiddenVideo)

  try {
    await whipClient.value?.ingest(screenStream.value)
  } catch (err: any) {
    useGeneralNotify({
      type: 'error',
      title: 'WHIP ingest failed',
      description: err?.message,
    })
    shareLoading.value = false
    return
  }

  shareUrl.value = `${window.location.origin}/live/${roomId.value}`
  shareLoading.value = false
  isStreaming.value = true
}

const onToggleAudio = async () => {
  audioLoading.value = true
  if (roomId.value) {
    if (audioOn.value) {
      if (audioContainer.value) {
        audioContainer.value.innerHTML = ''
      }
      audioOn.value = false
    } else {
      await initAudioRoom(roomId.value)
      audioOn.value = true
    }
  }
  audioLoading.value = false
}

const handleClose = () => {
  onStopLive()

  useFetch(
    `/api/kv/audio-room/${roomId.value}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
      }
    }
  )

  toggleGameSharePopup()
}

const copyToClipBoard = () => {
  navigator.clipboard.writeText(shareUrl.value)
  copyVisible.value = true
  useTimeoutFn(() => {
    copyVisible.value = false
  }, 1000)
}

// To check popup position when user resize window
watch(
  () => screen.value.width,
  (v) => {
    const currentRightPosition = width.value + left.value
    if (currentRightPosition >= v) {
      left.value = screen.value.width - width.value - 20
    }
  }
)
</script>

<template>
  <DraggableResizable
    v-model:h="height"
    v-model:w="width"
    v-model:x="left"
    v-model:y="top"
    :active="true"
    :lock-aspect-ratio="false"
    :max-height="maxHeight"
    :max-width="maxWidth"
    :min-width="width"
    :style="[topPopupGameSlug === modalSlug ? 'z-index: 1006 !important;' : '']"
    class-name="GamePopupRoot"
    handles-type="borders"
    parent="#parent_share_container"
    @resizestop="onResizeStop"
    @resizing="onResizing"
  >
    <div
      class="GameSharePopup bg-brand rounded-md h-full border border-green-950"
      @mousedown="handleWindowClick"
    >
      <div
        id="game_popup_header"
        class="
          GamePopupHeader px-4 py-2.5 flex justify-between
          drag-el cursor-move bg-green-950 rounded-t-sm shadow-md items-center
        "
      >
        <div class="GamePopupTitle text-base text-white flex items-center gap-2 font-bold">
          <UIcon
            class="h-5 w-5 min-w-5 min-h-5"
            name="tabler:shareplay"
          />
          SpinShare
        </div>
        <div class="GamePopupAction flex gap-2.5 cursor-pointer">
          <UTooltip
            :content="{ side: 'top' }"
            arrow
            text="Close"
          >
            <UIcon
              class="h-5 w-5 min-w-5 min-h-5 text-paragraph hover:text-white"
              name="i-heroicons-x-mark-20-solid"
              @click="handleClose"
              @click.stop
            />
          </UTooltip>
        </div>
      </div>

      <div class="w-full h-[calc(100%-45px)] relative">
        <div
          ref="gameShareContainer"
          class="w-full h-full md:p-4 p-2.5 flex flex-col gap-2 md:gap-3"
        >
          <div class="w-full flex flex-col items-center justify-center gap-2 md:gap-3">
            <video
              ref="previewContainer"
              autoplay
              muted
              playsinline
              class="w-full rounded-md"
              :class="{
                'hidden': !isStreaming
              }"
            />
            <JButton
              v-if="!isStreaming"
              class="min-w-28"
              variant="bet-gradient"
              :disabled="shareLoading"
              @click="onGoLive"
            >
              <span class="w-full flex items-center justify-center gap-1 md:gap-1.5">
                <UIcon
                  v-if="!shareLoading"
                  class="h-5 w-5 min-w-5 min-h-5 text-red-700"
                  name="nrk:media-direkte-golive"
                />
                <UIcon
                  v-else
                  class="h-5 w-5 min-w-5 min-h-5"
                  name="fxemoji:hourglassflowingsand"
                />
                <span v-if="!shareLoading">GO LIVE</span>
                <span v-else>Starting...</span>
              </span>
            </JButton>
            <div
              v-else
              class="w-full flex flex-col items-center justify-center gap-2 md:gap-3"
            >
              <div class="w-full flex items-center justify-center gap-2 md:gap-3">
                <JButton
                  class="min-w-28"
                  variant="bet-gradient"
                  :loading="audioLoading || stopLoading || shareLoading"
                  @click="onStopLive"
                >
                  <span class="w-full flex items-center justify-center gap-1 md:gap-1.5">
                    <UIcon
                      class="h-5 w-5 min-w-5 min-h-5 text-red-700"
                      name="material-symbols:stop-circle-outline"
                    />
                    <span>STOP</span>
                  </span>
                </JButton>

                <JButton
                  class="min-w-28"
                  variant="bet-gradient"
                  :loading="audioLoading || stopLoading || shareLoading"
                  @click="onToggleAudio"
                >
                  <span
                    v-if="!audioOn"
                    class="w-full flex items-center justify-center gap-1 md:gap-1.5"
                  >
                    <UIcon
                      class="h-5 w-5 min-w-5 min-h-5 text-red-700"
                      name="bxs:microphone"
                    />
                    <span class="text-nowrap">Join Voice Chat</span>
                  </span>
                  <span
                    v-else
                    class="w-full flex items-center justify-center gap-1 md:gap-1.5"
                  >
                    <UIcon
                      class="h-5 w-5 min-w-5 min-h-5 text-red-700"
                      name="bxs:microphone-off"
                    />
                    <span class="text-nowrap">Leave Voice Chat</span>
                  </span>
                </JButton>
              </div>

              <div
                v-if="shareUrl"
                class="w-full flex flex-col gap-1"
              >
                <div class="w-full font-bold">
                  Share Link:
                </div>
                <div class="w-full flex items-center gap-2 md:gap-4">
                  <a
                    :href="shareUrl"
                    target="_blank"
                    class="break-words underline text-white"
                  >
                    {{ shareUrl }}
                  </a>

                  <UTooltip
                    :text="copyVisible ? `${t('base.copied')}!` : t('base.copy')"
                    :content="{ side: 'top' }"
                    arrow
                  >
                    <div
                      class="cursor-copy text-paragraph hover:text-white flex items-center"
                      @click="copyToClipBoard"
                    >
                      <UIcon
                        class="w-4 h-4 min-h-4 min-w-4 text-paragraph hover:text-white cursor-copy"
                        name="icon-park-solid:copy"
                      />
                    </div>
                  </UTooltip>
                </div>
              </div>

              <div
                id="audio-container"
                ref="audioContainer"
                class="hidden"
              />
            </div>
          </div>
        </div>

        <div
          v-if="isResizingPopup"
          class="absolute inset-0 flex justify-center items-center font-bold"
        />
      </div>
    </div>
  </DraggableResizable>
</template>

<style scoped lang="scss">
.GamePopupRoot {
  position: absolute !important;
  z-index: 1005 !important;
  pointer-events: fill;
  border: none !important;
  height: auto !important;
  max-height: calc(100% - 150px) !important;

  .GameSharePopup {
    overflow: visible;
  }
}
</style>
