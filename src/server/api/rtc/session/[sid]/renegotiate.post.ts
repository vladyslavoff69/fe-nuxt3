export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const sid = event.context.params?.sid
  if (!sid) { return { error: 'No Session ID provided' } }
  const body = await readBody(event)
  if (!body) { return { error: 'No body provided' } }

  const response = await fetch(`${config.public.RTCUrl}apps/${config.cfRealtimeID}/sessions/${sid}/renegotiate`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${config.cfRealtimeToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    return { error: 'Failed to renegotiate' }
  }

  return { success: true, error: null }
})
