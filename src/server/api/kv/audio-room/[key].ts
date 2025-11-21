import { requireAuth } from '~/utils/auth'

export default defineEventHandler(async (event) => {
  const key = event.context.params?.key // Get key from the URL
  if (!key) { return { error: 'No key provided' } }

  const SHARE_ROOMS = event.context.cloudflare.env.SHARE_ROOMS // Access the KV binding

  if (!SHARE_ROOMS) {
    return { error: 'KV namespace \'SHARE_ROOMS\' not found in the environment.' }
  }

  if (event.node.req.method === 'GET') {
    const value = await SHARE_ROOMS.get(key)

    return { key, value: value ? JSON.parse(value) : null }
  }

  const protectedToken: boolean = await requireAuth(event)
  if (!protectedToken) {
    return { error: 'Not authenticated' }
  }

  if (event.node.req.method === 'POST') {
    const body = await readBody(event) // { value: {publishUrl, playbackUrl, participants} }
    if (body.value) {
      await SHARE_ROOMS.put(key, JSON.stringify(body.value))

      return { message: 'Room saved!', key, value: body.value }
    }

    return { error: 'Invalid Value' }
  }

  if (event.node.req.method === 'DELETE') {
    await SHARE_ROOMS.delete(key)

    return { message: 'Room deleted!', key }
  }

  return { error: 'Invalid method' }
})
