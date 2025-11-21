import { requireAuth } from '~/utils/auth'

export default defineEventHandler(async (event) => {
  const key = event.context.params?.key // Get key from the URL
  if (!key) { return { error: 'No key provided' } }

  const USER_IPS = event.context.cloudflare.env.USER_IPS // Access the KV binding

  if (!USER_IPS) {
    return { error: 'KV namespace \'USER_IPS\' not found in the environment.' }
  }

  if (event.node.req.method === 'GET') {
    const value = await USER_IPS.get(key)

    return { key, value }
  }

  const protectedToken: boolean = await requireAuth(event)
  if (!protectedToken) {
    return { error: 'Not authenticated' }
  }

  if (event.node.req.method === 'POST') {
    const body = await readBody(event) // { value: "some data" }
    await USER_IPS.put(key, body.value)

    return { message: 'Value saved!', key, value: body.value }
  }

  if (event.node.req.method === 'DELETE') {
    await USER_IPS.delete(key)

    return { message: 'Key deleted!', key }
  }

  return { error: 'Invalid method' }
})
