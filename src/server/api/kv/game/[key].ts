import { requireAuth } from '~/utils/auth'

export default defineEventHandler(async (event) => {
  const protectedToken: boolean = await requireAuth(event)
  if (!protectedToken) {
    return { error: 'Not authenticated' }
  }

  const key = event.context.params?.key // Get key from the URL
  if (!key) { return { error: 'No key provided' } }

  const RECENT_GAME = event.context.cloudflare.env.RECENT_GAME // Access the KV binding

  if (!RECENT_GAME) {
    return { error: 'KV namespace \'RECENT_GAME\' not found in the environment.' }
  }

  if (event.node.req.method === 'GET') {
    const value = await RECENT_GAME.get(key)

    return { key, value }
  }

  if (event.node.req.method === 'POST') {
    const body = await readBody(event) // { value: "some data" }
    await RECENT_GAME.put(key, body.value)

    return { message: 'Value saved!', key, value: body.value }
  }

  if (event.node.req.method === 'DELETE') {
    await RECENT_GAME.delete(key)

    return { message: 'Key deleted!', key }
  }

  return { error: 'Invalid method' }
})
