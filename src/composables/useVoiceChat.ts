type User = {
  id: string
  name: string
  sessionId: string
}

type TrackInfo = {
  trackName: string
  sessionId: string
  mid: string
}

export const useVoiceChat = (roomId: string) => {
  const PEER_URL = 'stun:stun.cloudflare.com:3478'
  const localStream = ref<MediaStream | null>(null)
  const remoteStreams = ref<Record<string, MediaStream>>({})
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const peerConnections = ref<Record<string, RTCPeerConnection>>({})
  const isConnected = ref(false)
  const config = useRuntimeConfig()
  const currentRoomId = ref(roomId)
  const currentSessionId = ref()
  const wsShareUrl = config.public?.wsShareUrl || 'wss://signaling.junglebet.workers.dev/ws'
  const WS_URL = `${wsShareUrl}?room=${roomId}`
  const { send, emit, on, disconnect: disconnectWs } = useWebSocket(WS_URL)

  // Initialize the voice chat
  const init = async (userId: any, userName: any, roomId: string) => {
    try {
      currentRoomId.value = roomId

      // Get user media
      localStream.value = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false // Voice chat only, set to true if you want video
      })

      currentSessionId.value = await createCloudflareSession(currentRoomId.value)

      // Create a new Cloudflare session
      currentUser.value = {
        id: userId,
        name: userName,
        sessionId: currentSessionId.value
      }

      // Setup socket events
      try {
        // Handle new user joining
        on('user-joined', async (user: User) => {
          if (user.id === currentUser.value?.id) return

          users.value = [...users.value, user]

          await setupPeerConnection(user)
        })

        // Handle user leaving
        on('user-left', (userId: string) => {
          users.value = users.value.filter(u => u.id !== userId)
          cleanupPeerConnection(userId)
        })

        // Handle track information exchange
        on('track-info', async ({ fromUserId, tracks }: { fromUserId: string, tracks: TrackInfo[] }) => {
          if (!currentUser.value || fromUserId === currentUser.value.id) return

          const user = users.value.find(u => u.id === fromUserId)
          if (!user) return

          await pullTracks(user.sessionId, tracks)
        })

        // Handle existing users when joining
        on('existing-users', (existingUsers: User[]) => {
          users.value = existingUsers.filter(u => u.id !== currentUser.value?.id)
          users.value.forEach(async user => {
            await setupPeerConnection(user)
          })
        })

        // Handle errors
        on('error', (error: string) => {
          console.error('Socket error:', error)
        })

        // Join the room
        send({
          type: 'user-joined',
          payload: {
            roomId,
            userId: currentUser.value.id,
            sessionId: currentSessionId.value
          }
        })

        isConnected.value = true
      } catch (error) {
        console.error('Error initializing audio room:', error)
        return
      }
    } catch (error) {
      console.error('Error initializing voice chat:', error)
      throw error
    }
  }

  // Create a new Cloudflare session
  const createCloudflareSession = async (roomId: string): Promise<string> => {
    // @ts-ignore
    const { sessionId } = await $fetch('/api/rtc/session', {
      method: 'POST',
      body: { roomId }
    })

    return sessionId
  }

  // Set up a peer connection with another user
  const setupPeerConnection = async (user: User) => {
    if (!currentUser.value?.sessionId || !localStream.value) return

    // Create a new peer connection
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: PEER_URL }],
      bundlePolicy: 'max-bundle'
    })

    // Store the connection
    peerConnections.value[user.id] = pc

    // Add local tracks
    const transceivers = localStream.value?.getTracks().map(track =>
      pc.addTransceiver(track, { direction: 'sendonly' })
    )

    // Create offer
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    // @ts-ignore
    const { sessionDescription: answer } = await $fetch(
      `/api/rtc/session/${currentUser.value?.sessionId}/tracks`,
      {
        method: 'POST',
        body: {
          sessionDescription: {
            sdp: offer.sdp,
            type: 'offer'
          },
          tracks: transceivers.map(({ mid, sender }) => ({
            location: 'local',
            mid,
            trackName: sender.track?.id
          }))
        }
      }
    )

    await pc.setRemoteDescription(new RTCSessionDescription(answer))

    // Send track info to the other user via signaling
    const tracksToSend = transceivers.map(({ mid, sender }) => ({
      trackName: sender.track?.id,
      sessionId: currentUser.value!.sessionId,
      mid
    }))

    emit('track-info', {
      toUserId: user.id,
      tracks: tracksToSend
    })

    // Handle remote tracks
    pc.ontrack = (event) => {
      if (!remoteStreams.value[user.id]) {
        remoteStreams.value[user.id] = new MediaStream()
      }

      event.streams[0].getTracks().forEach(track => {
        remoteStreams.value[user.id].addTrack(track)
      })
    }

    // Handle connection state changes
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        cleanupPeerConnection(user.id)
      }
    }
  }

  // Pull tracks from another user's session
  const pullTracks = async (remoteSessionId: string, tracks: TrackInfo[]) => {
    if (!currentUser.value?.sessionId) return

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: PEER_URL }],
      bundlePolicy: 'max-bundle'
    })

    // @ts-ignore
    const { sessionDescription: reAnswer, tracks: reTracks } = await $fetch(
      `/api/rtc/session/${currentUser.value?.sessionId}/tracks`,
      {
        method: 'POST',
        body: {
          tracks: tracks.map(track => ({
            location: 'remote',
            trackName: track.trackName,
            sessionId: remoteSessionId
          }))
        }
      }
    )

    // Set up track handlers before setting remote description
    const trackPromises = reTracks.map(({ mid }: { mid: string }) =>
      new Promise<MediaStreamTrack>((resolve) => {
        pc.ontrack = (event) => {
          if (event.transceiver.mid === mid) {
            resolve(event.track)
          }
        }
      })
    )

    await pc.setRemoteDescription(new RTCSessionDescription(reAnswer))

    // Create answer
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    // Send answer to Cloudflare
    await $fetch(
      `/api/rtc/session/${currentUser.value?.sessionId}/renegotiate`,
      {
        method: 'POST',
        body: {
          sessionDescription: {
            sdp: answer.sdp,
            type: 'answer'
          }
        }
      }
    )

    // Add tracks to remote streams when they arrive
    const receivedTracks = await Promise.all(trackPromises)
    const user = users.value.find(u => u.sessionId === remoteSessionId)
    if (user) {
      if (!remoteStreams.value[user.id]) {
        remoteStreams.value[user.id] = new MediaStream()
      }
      receivedTracks.forEach((track: any) => {
        remoteStreams.value[user.id].addTrack(track)
      })
    }
  }

  // Clean up peer connection when a user leaves
  const cleanupPeerConnection = (userId: string) => {
    const pc = peerConnections.value[userId]
    if (pc) {
      pc.close()
      delete peerConnections.value[userId]
    }

    if (remoteStreams.value[userId]) {
      remoteStreams.value[userId].getTracks().forEach(track => track.stop())
      delete remoteStreams.value[userId]
    }

    users.value = users.value.filter(u => u.id !== userId)
  }

  // Leave the voice chat
  const leave = () => {
    // Close all peer connections
    Object.keys(peerConnections.value).forEach(userId => {
      cleanupPeerConnection(userId)
    })

    // Stop local stream
    if (localStream.value) {
      localStream.value.getTracks().forEach(track => track.stop())
      localStream.value = null
    }

    // Notify others we're leaving
    if (currentUser.value) {
      send({
        type: 'user-left',
        payload: {
          userId: currentUser.value.id
        }
      })
    }

    // Cleanup WebSocket
    disconnectWs()

    // Reset state
    users.value = []
    currentUser.value = null
    isConnected.value = false
  }

  return {
    init,
    leave,
    remoteStreams,
    isConnected
  }
}
