import { deleteCookie } from 'h3'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST') {
    deleteCookie(event, 'JB_AUTH_TOKEN') // Clear the auth cookie

    return { message: 'Logout successful' }
  }

  return { error: 'Invalid method' }
})
