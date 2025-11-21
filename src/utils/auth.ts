import type { H3Event} from 'h3';
import { getCookie, getHeader } from 'h3'

// Example function to validate tokens (modify based on your needs)
const validateToken = (token: string | null, authToken: string | undefined) => {
  if (!authToken || !token || token === '') {
    return false
  }

  // Replace it with actual validation logic
  return token === authToken // Example: Replace with a real validation check
}

export const requireAuth = async (event: H3Event) => {
  const authorization = getHeader(event, 'authorization')
  if (!authorization) {
    return false
  }

  const token = authorization.replace('Bearer ', '')
  const authToken = getCookie(event, 'JB_AUTH_TOKEN') // Retrieve token from cookies

  if (!validateToken(token, authToken)) {
    return false
  }

  try {
    return !!authToken
  } catch (error) {
    return false
  }
}
