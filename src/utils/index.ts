import { GAME_LIST } from '~/constants/games'

export * from './date-time'
export * from './event'
export * from './format'
export * from './graphql'
export * from './messages'
export * from './tools'
export * from './user'
export * from './validator'

export const findGameImage = (slug: string) => {
  return GAME_LIST.find(el => el.slug === slug)?.image || ''
}

export const getGraphicsInfo = () => {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

  if (!gl) {
    return null
  }

  // @ts-ignore
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')

  if (debugInfo) {
    // @ts-ignore
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
    // @ts-ignore
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)

    return {
      vendor,
      renderer
    }
  }

  return null
}

export const getAuthCookie = () => {
  const nuxtApp = useNuxtApp()
  // @ts-ignore
  const clientConfig = nuxtApp.$apollo?.clients?.default

  return useCookie((clientConfig?.tokenName || 'apollo:default.token'), {
    maxAge: 60 * 60 * 24 * 7,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  })
}
