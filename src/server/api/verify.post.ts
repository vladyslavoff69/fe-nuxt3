export default defineEventHandler(async (event) => {
  const { visitorId } = await readBody(event)

  // Verify with Fingerprint Pro server API
  const response = await $fetch(`https://api.fpjs.io/visitors/${visitorId}`, {
    // @ts-ignore
    headers: {
      'Auth-API-Key': process.env.FINGERPRINT_SECRET
    }
  })

  return {
    // @ts-ignore
    isValid: response.visitorFound,
    // @ts-ignore
    confidence: response.confidence.score
  }
})
