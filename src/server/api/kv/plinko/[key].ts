export default defineEventHandler(async (event) => {
  const key = event.context.params?.key // Get key from the URL
  if (!key) { return { error: 'No key provided' } }

  const PLINKO_PATH = event.context.cloudflare.env.PLINKO_PATH // Access the KV binding

  if (!PLINKO_PATH) {
    return { error: 'KV namespace \'PLINKO_PATH\' not found in the environment.' }
  }

  if (event.node.req.method === 'GET') {
    const value = await PLINKO_PATH.get(key)

    if (value) {
      return { key, value: JSON.parse(value), error: null }
    } else {
      try {
        // Fetch the data from your Cloudflare Worker URL
        const response = await fetch(`https://p.junglebet.com/path?pathId=${key}`)
        if (!response.ok) {
          return {
            key,
            value: null,
            error: 'Not found'
          }
        }

        return {
          key,
          value: await response.json(),
          error: null
        }
      } catch (error) {
        // Handle errors
        return {
          key,
          value: null,
          // @ts-ignore
          error: error?.message
        }
      }
    }
  }

  return {
    key,
    value: null,
    error: 'Invalid method'
  }
})
