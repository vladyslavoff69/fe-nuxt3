import { setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST') {
    const body = await readBody(event)

    if (!body.token || body.token === '') {
      return { error: 'Invalid token' }
    }

    // Set the token in an HttpOnly cookie
    setCookie(event, 'JB_AUTH_TOKEN', body.token, {
      httpOnly: true, // Prevent client-side JavaScript access
      secure: process.env.NODE_ENV === 'production', // Send over HTTPS in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 60 * 60 * 24 * 1000, // Token validity in seconds
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1000)
    })

    return { message: 'Login successful' }
  }

  return { error: 'Invalid method' }
})
