import { requireAuth } from '~/utils/auth'

export default defineEventHandler(async (event) => {
  const protectedToken: boolean = await requireAuth(event)
  if (!protectedToken) {
    return { error: 'Not authenticated' }
  }

  const key = event.context.params?.key // Get key from the URL
  if (!key) { return { error: 'No key provided' } }

  const CACHE = event.context.cloudflare.env.CACHE // Access the KV binding

  if (!CACHE) {
    return { error: 'KV namespace \'CACHE\' not found in the environment.' }
  }

  if (event.node.req.method === 'GET') {
    const value = await CACHE.get(key)

    return { key, value }
  }

  if (event.node.req.method === 'POST') {
    const body = await readBody(event) // { value: "some data" }
    await CACHE.put(key, body.value)

    return { message: 'Value saved!', key, value: body.value }
  }

  if (event.node.req.method === 'DELETE') {
    await CACHE.delete(key)

    return { message: 'Key deleted!', key }
  }

  return { error: 'Invalid method' }
})
