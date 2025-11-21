<script setup lang="ts">
import { AUTH } from '~/constants';

const props = defineProps<{
  roomId: string;
}>()

const { isLoggedIn, me } = inject(AUTH)!
const {
  init,
  leave,
  remoteStreams,
  isConnected
} = useVoiceChat(props.roomId)

const joinRoom = async () => {
  const userId = isLoggedIn.value ? me.value?.id : crypto.randomUUID()
  const userName = isLoggedIn.value ? me.value?.username : `Guest-${Math.random().toString(36).slice(2, 9)}`

  try {
    await init(userId, userName, props.roomId)
  } catch (error: any) {
    useGeneralNotify({
      type: 'error',
      title: 'Failed to join room',
      description: error?.message || 'Error joining room'
    })
  }
}

// Update audio elements when remote streams change
watch(remoteStreams, (newStreams) => {
  for (const userId in newStreams) {
    const audioEl = document.querySelector(`audio[ref="audio-${userId}"]`) as HTMLAudioElement
    if (audioEl) {
      audioEl.srcObject = newStreams[userId]
    }
  }
}, { deep: true })

onBeforeUnmount(() => {
  leave()
})
</script>

<template>
  <div class="voice-chat-container">
    <div v-if="!isConnected">
      <button @click="joinRoom">Join Room</button>
    </div>

    <div v-else>
      <button @click="leave">Leave</button>

      <!-- Audio elements for remote streams -->
      <audio
        v-for="(stream, userId) in remoteStreams"
        :key="userId"
        :ref="`audio-${userId}`"
        autoplay
      />
    </div>
  </div>
</template>
<style scoped>
.voice-chat-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.voice-chat-container audio {
  visibility: hidden;
  width: 0;
  height: 0;
}
</style>
