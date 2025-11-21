import type { RuntimeConfig } from 'nuxt/schema'
import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev'
import type { ErrorResponse } from '@junglebet/apollo-client'

export default defineNuxtPlugin((nuxtApp: any) => {
  const config: RuntimeConfig = useRuntimeConfig()

  const csrfToken = ref<false | string>(false)
  const authToken = ref<false | string>(false)

  nuxtApp.provide('csrfToken', () => {
    return {
      token: csrfToken,
      onReady: (fn: (token: string) => void) => {
        return watch(
          () => csrfToken.value,
          (token) => {
            if (token) {
              fn(token)
            }
          },
          { immediate: true }
        )
      },
    }
  })

  nuxtApp.provide('authToken', () => {
    return {
      token: authToken,
      onReady: (fn: (token: string) => void) => {
        return watch(
          () => authToken.value,
          (token) => {
            if (token) {
              fn(token)
            }
          },
          { immediate: true }
        )
      },
    }
  })

  const fetchCsrf =
    import.meta.client &&
    fetch(`${config.public.graphqlBaseUrl}/auth/csrf-token`, {
      ...(config.public.credentialsInclude ? { credentials: 'include' } : {}),
    })
      .then(async (res) => {
        const json = await res.clone().json()
        try {
        // @ts-ignore
          csrfToken.value = json['x-csrf-token']
        } catch (e) { /* empty */ }

        return res
      })
      .catch((e) => {
        Promise.reject(e).then(() => {
        })
      })

  const clientConfig = nuxtApp.$apollo!.clients!.default

  // @ts-ignore add csrf header
  nuxtApp.hook('apollo:csrf', async ({ token, client }) => {
    if (client !== 'default') {
      return
    }

    // Check if SSR
    if (import.meta.server) {
      return
    }

    if (csrfToken.value) {
      token.value = csrfToken.value

      return
    }

    // @ts-ignore
    const res = await fetchCsrf?.catch(() => false)
    if (!res) {
      return
    }

    token.value = csrfToken.value
  })

  // decodeURIComponent token which is encoded when to store in cookie manually
  // @ts-ignore
  nuxtApp.hook('apollo:auth', ({ token, client }) => {
    // check if a client is default (app graphql)
    if (client !== 'default') {
      return
    }

    // check if token is already present
    if (token.value) {
      authToken.value = token.value
      return
    }

    const tokenName = (clientConfig?.tokenName || 'apollo:default.token')
    const encodedToken = useCookie(tokenName, {
      maxAge: 60 * 60 * 24 * 7,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    }).value

    if (encodedToken) {
      token.value = decodeURIComponent(encodedToken)
      authToken.value = token.value
    }
  })

  // @ts-ignore
  nuxtApp.hook('apollo:link', ({ context, prevContext, client }) => {
    if (client !== 'default') {
      return
    }

    // no need extra context on SSR
    if (import.meta.server) {
      return
    }

    context.value = {
      ...prevContext,
    }
  })

  nuxtApp.hook('apollo:error', (error: ErrorResponse) => {
    const {
      graphQLErrors,
      operation: { query, extensions, ...operation },
      response,
      networkError,
    } = error

    if (process.env.NODE_ENV === 'development') {
      loadDevMessages()
      loadErrorMessages()
    }

    if (networkError) {
      const isOffline = import.meta.browser && !window.navigator.onLine
      const message = isOffline ? 'You are offline now' : networkError.message
      console.log('NetworkError::', {
        operation: {
          ...operation,
          // @ts-ignore
          query_type: query.definitions[0].operation,
        },
        networkError: {
          ...networkError,
          networkStatus: isOffline ? 'No connection!' : 'Connected',
          message,
          name: networkError.name,
          stack: networkError.stack,
          cause: networkError.cause,
        },
      })
      return
    }

    const { errorHandler } = error.operation.getContext()
    if (errorHandler === 'local') {
      return
    }

    if (networkError) {
      return
    }

    const message = graphQLErrors?.[0].message || response?.errors?.[0].message || 'unexpected'
    if (
      !message.includes('The login verification code') &&
      !message.includes('Please enter the code') &&
      !message.includes('Response not successful')
    ) {
      if (graphQLErrors && graphQLErrors[0].message === 'Unauthenticated.') {
        const apolloCookie = useCookie((clientConfig?.tokenName || 'apollo:default.token'))
        apolloCookie.value = null

        return
      } else {
        return
      }
    }

    if (graphQLErrors && graphQLErrors.length) {
      graphQLErrors.forEach(({ message, extensions, locations, path }) => {
        if (message === 'Unauthenticated.') {
          const apolloCookie = useCookie((clientConfig?.tokenName || 'apollo:default.token'))
          apolloCookie.value = null

          return
        }

        if (
          process.env.NODE_ENV === 'development' &&
          !message.includes('Failed to fetch') &&
          !message.includes('The login verification code') &&
          !message.includes('Invalid Credentials') &&
          !message.includes('Please enter the code') &&
          !message.includes('Response not successful')
        ) {
          console.log('error', `${message} ${JSON.stringify({ locations, path })}`)
        } else {
          return
        }
      })
    }
  })
})
