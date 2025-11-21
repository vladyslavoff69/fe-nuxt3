<script lang="ts" setup>
import WHEPClient from '~/services/libs/screenshare/WHEPClient'
import initAudioRoom from '~/services/libs/screenshare/audioRoomClient'
import GameTable from '~/apps/casino/components/GameTable.vue'

const route = useRoute()
const audioOn = ref(false)
const audioLoading = ref(false)
const muted = ref(true)
const audioContainer = ref<HTMLDivElement>()
const remoteVideoContainer = ref<HTMLVideoElement>()
const roomId = computed(() => route.params.room ? String(route.params.room) : '')

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

const onToggleMute = () => {
  if (remoteVideoContainer.value) {
    if (muted.value) {
      remoteVideoContainer.value.muted = false
      remoteVideoContainer.value.play().catch(() => {
      })
      muted.value = false
    } else {
      remoteVideoContainer.value.muted = true
      muted.value = true
    }
  }
}

const loadVideo = async () => {
  const { data }: any = await useFetch(`/api/kv/audio-room/${roomId.value}`)

  if (data.value && data.value?.error) {
    useGeneralNotify({
      type: 'error',
      title: 'Failed fetching stream',
      description: data.value?.error,
    })

    return
  }

  if (data.value && data.value?.value) {
    const { playbackUrl } = data.value.value

    const whepClient = new WHEPClient(playbackUrl, remoteVideoContainer.value)
  }
}

watch(() => roomId.value, (v) => {
  if (v && v !== '') {
    loadVideo()
  }
}, { immediate: true })

const { sendFingerprint } = useSendFingerprint()
onMounted(async () => {
  await sendFingerprint()
})
</script>

<template>
  <div class="w-full h-full overflow-auto flex flex-col items-center justify-center gap-2 md:gap-4 p-2 md:p-4">
    <div class="text-xl md:text-3xl w-full text-center font-bold text-white">
      SpinShare View - Room #{{ roomId }}
    </div>

    <div class="w-full lg:max-w-[800px] py-2 md:py-4">
      <video
        ref="remoteVideoContainer"
        controls
        autoplay
        muted
        class="w-full"
      />
    </div>

    <div class="flex items-center justify-center gap-2 md:gap-4">
      <JButton
        class="min-w-28"
        variant="bet-gradient"
        @click="onToggleMute"
      >
        <span
          v-if="muted"
          class="w-full flex items-center justify-center gap-1 md:gap-1.5"
        >
          <UIcon
            class="h-5 w-5 min-w-5 min-h-5 text-red-700"
            name="material-symbols:volume-up-rounded"
          />
          <span class="text-nowrap">Unmute Video</span>
        </span>
        <span
          v-else
          class="w-full flex items-center justify-center gap-1 md:gap-1.5"
        >
          <UIcon
            class="h-5 w-5 min-w-5 min-h-5 text-red-700"
            name="material-symbols:volume-off-rounded"
          />
          <span class="text-nowrap">Mute Video</span>
        </span>
      </JButton>

      <JButton
        class="min-w-28"
        variant="bet-gradient"
        :loading="audioLoading"
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

    <VoiceChat :room-id="roomId" />

    <div
      id="audio-container"
      ref="audioContainer"
      class="hidden"
    />

    <ClientOnly>
      <GameTable
        :all-bets-first="true"
        class="mt-4"
      />
    </ClientOnly>
  </div>
</template>
