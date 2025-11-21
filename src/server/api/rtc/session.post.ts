export default defineEventHandler(async (event) => {
  const SHARE_ROOMS = event.context.cloudflare.env.SHARE_ROOMS // Access the KV binding

  if (!SHARE_ROOMS) {
    return { error: 'KV namespace \'SHARE_ROOMS\' not found in the environment.' }
  }

  const config = useRuntimeConfig()
  const { roomId } = await readBody(event)
  if (!roomId) { return { error: 'No Room ID provided' } }

  // Check if session exists for this room
  const value = await SHARE_ROOMS.get(roomId)
  let activeSessions: any = null
  if (value) {
    activeSessions = JSON.parse(value)
    if (activeSessions?.participants?.sessionId && activeSessions?.participants?.sessionId !== '') {
      return {
        sessionId: activeSessions?.participants?.sessionId,
        iceServers: [{ urls: 'stun:stun.cloudflare.com:3478' }],
        existingTracks: activeSessions?.participants?.tracks,
        error: null
      }
    }
  } else {
    return {
      error: 'No room exists'
    }
  }

  // Create new session
  const response = await fetch(`${config.public.RTCUrl}apps/${config.cfRealtimeID}/sessions/new`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.cfRealtimeToken}`,
      'Content-Type': 'application/json'
    }
  })

  // @ts-ignore
  const { sessionId } = await response.json()
  if (activeSessions) {
    await SHARE_ROOMS.put(roomId, JSON.stringify({
      ...activeSessions,
      participants: {
        sessionId,
        tracks: []
      }
    }))
  }

  return {
    sessionId,
    iceServers: [{ urls: 'stun:stun.cloudflare.com:3478' }],
    existingTracks: [],
    error: null
  }
})
