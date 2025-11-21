export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const sid = event.context.params?.sid
  if (!sid) { return { error: 'No Session ID provided' } }

  const body = await readBody(event)

  const response = await fetch(`${config.public.RTCUrl}apps/${config.cfRealtimeID}/sessions/${sid}/tracks/new`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.cfRealtimeToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    return { error: 'Failed to create track' }
  }

  return await response.json()
})
