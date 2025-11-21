import SimplePeer from './simplepeer.min'
import type { RuntimeConfig } from 'nuxt/schema'

/**
 * Initialize and join a WebRTC audio room via Cloudflare Workers DO signaling.
 * @param {string} roomId - Unique room identifier
 */
export default async function initAudioRoom(roomId: string) {
  const config: RuntimeConfig = useRuntimeConfig()
  const wsShareUrl = config.public?.wsShareUrl || 'wss://signaling.junglebet.workers.dev/ws'
  const WS_URL = `${wsShareUrl}?room=${roomId}`
  const PEER_URL = 'stun:stun.cloudflare.com:3478'
  const ws = new WebSocket(WS_URL)
  const peers = {} // Map<clientId, SimplePeer>
  let localStream: MediaStream

  /**
   * Utility: add an <audio> element for a remote stream
   */
  function addAudio(stream: MediaStream, id: string) {
    const audio: HTMLAudioElement = document.createElement('audio')
    audio.id = `audio-${id}`
    audio.srcObject = stream
    audio.autoplay = true // attempt autoplay
    audio.muted = true // ensure it’s not muted
    audio.controls = false
    // @ts-ignore
    audio.playsInline = true
    // do NOT use display:none — use visibility:hidden + size zero
    audio.style.visibility = 'hidden'
    audio.style.width = '0'
    audio.style.height = '0'

    document.querySelector('#audio-container')?.appendChild(audio)

    // explicit play() inside the user gesture
    audio
      .play()
      .then(() => {
        audio.muted = false
      })
      .catch(err => console.warn('Audio play was prevented:', err))
  }

  /**
   * Remove the <audio> element when a user leaves.
   */
  function removeAudio(id: string) {
    const el: HTMLElement | null = document.getElementById(`audio-${id}`)
    if (el) {
      el.remove()
    }
  }

  // Capture local audio and set up WebSocket handlers
  await (async () => {
    if (import.meta.client) {
      if (
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === 'function'
      ) {
        try {
          localStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        } catch (err: any) {
          useGeneralNotify({
            type: 'error',
            title: 'Failed to get local audio',
            description: err?.message,
          })
        }
      } else {
        useGeneralNotify({
          type: 'error',
          title: 'Failed to get local audio',
          description: 'Voice chat is not supported in this browser.',
        })
        return
      }

      ws.addEventListener('open', () => {
        console.log('Connected to signaling DO')
      })

      ws.addEventListener('message', ({ data }) => {
        const msg = JSON.parse(data)

        switch (msg.type) {
        case 'user-joined': {
          const userId = msg.clientId
          const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream: localStream,
            config: { iceServers: [{ urls: PEER_URL }] }
          })
          peer.on('signal', (signal) => {
            ws.send(JSON.stringify({ type: 'signal', to: userId, data: signal }))
          })
          peer.on('stream', remoteStream => addAudio(remoteStream, userId))
          peers[userId] = peer
          break
        }
        case 'signal': {
          const { from, data: signalData } = msg
          let peer = peers[from]
          if (!peer) {
            peer = new SimplePeer({
              initiator: false,
              trickle: false,
              stream: localStream,
              config: { iceServers: [{ urls: PEER_URL }] }
            })
            peer.on('signal', (reply: any) => {
              ws.send(JSON.stringify({ type: 'signal', to: from, data: reply }))
            })
            peer.on('stream', (remoteStream: any) => addAudio(remoteStream, from))
            peers[from] = peer
          }
          peer.signal(signalData)
          break
        }
        case 'user-left': {
          const userId: string = msg.clientId
          if (peers[userId]) {
            peers[userId].destroy()
            delete peers[userId]
            removeAudio(userId)
          }
          break
        }
        }
      })
    }
  })()
}
