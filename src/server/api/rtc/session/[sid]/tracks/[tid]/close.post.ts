export default defineEventHandler(async (event) => {
  const SHARE_ROOMS = event.context.cloudflare.env.SHARE_ROOMS // Access the KV binding

  if (!SHARE_ROOMS) {
    return { error: 'KV namespace \'SHARE_ROOMS\' not found in the environment.' }
  }

  const sid = event.context.params?.sid
  if (!sid) {
    return { error: 'No Session ID provided' }
  }
  const tid = event.context.params?.tid
  if (!tid) {
    return { error: 'No Track ID provided' }
  }

  const { roomId } = await readBody(event)
  if (!roomId) {
    return { error: 'No Room ID provided' }
  }

  const config = useRuntimeConfig()

  const value = await SHARE_ROOMS.get(roomId)
  let activeSessions: any = null
  if (value) {
    activeSessions = JSON.parse(value)
    // Update session tracks in memory
    const session = activeSessions?.participants
    if (session && session.tracks.includes(tid)) {
      session.tracks = session.tracks?.filter((track: any) => track !== tid)

      await SHARE_ROOMS.put(roomId, JSON.stringify({
        ...activeSessions,
        participants: {
          sessionId: session.sessionId,
          tracks: session.tracks
        }
      }))
    }
  } else {
    return {
      error: 'No room exists'
    }
  }

  const response = await fetch(`${config.public.RTCUrl}apps/${config.cfRealtimeID}/sessions/${sid}/tracks/close`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${config.cfRealtimeToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tracks: [{ mid: tid }],
      force: true
    })
  })

  if (!response.ok) {
    return { error: 'Failed to close track' }
  }

  return { success: true, error: null }
})
