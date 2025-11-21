import { requireAuth } from '~/utils/auth';

export default defineEventHandler(async (event) => {
  const protectedToken: boolean = await requireAuth(event)
  if (!protectedToken) {
    return { error: 'Not authenticated' }
  }

  const config = useRuntimeConfig()

  // Create new session
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflareAccountId}/stream/live_inputs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.cloudflareStreamToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      meta: { name: `spinshare-${Date.now()}` },
      recording: { mode: 'off' },
    })
  })

  const data: any = await response.json()
  if (!data?.success) {
    console.error(`Error creating live input: ${JSON.stringify(data?.errors)}`)

    return {
      publishUrl: '',
      playbackUrl: ''
    }
  }

  return {
    publishUrl: data?.result.webRTC.url,
    playbackUrl: data?.result.webRTCPlayback.url,
  }
})
