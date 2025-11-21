import { defineNuxtPlugin, useRouter, useRuntimeConfig } from 'nuxt/app'
import type { PostHog } from 'posthog-js';
import posthog from 'posthog-js'
import { nextTick } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  if (config.public.appEnv !== 'local') {
    const posthogClient: PostHog = posthog.init(
      config.public.posthogPublicKey,
      {
        api_host: config.public.posthogHost,
        person_profiles: 'identified_only',
        capture_pageview: false,
        loaded: (ph) => {
          if (import.meta.env.DEV) ph.debug()
        }
      }
    )

    const router = useRouter()
    router.afterEach(to =>
      nextTick(() => {
        posthogClient.capture('$pageview', { current_url: to.fullPath })
      })
    )

    nuxtApp.provide('posthog', posthogClient)
  }
})
