import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'
import BugsnagPerformance from '@bugsnag/browser-performance'
import type { RuntimeConfig } from '@nuxt/schema'

export default defineNuxtPlugin((nuxtApp) => {
  const config: RuntimeConfig = useRuntimeConfig()

  if (!config.public.bugsnagApiKey) {
    return
  }

  BugsnagPerformance.start({
    apiKey: String(config.public.bugsnagApiKey),
    appVersion: String(config.public.appVersion) || '1.0.13',
    releaseStage: String(config.public.releaseStage) || 'development',
  })

  // Initialize Bugsnag
  const bugsnagClient = Bugsnag.start({
    apiKey: String(config.public.bugsnagApiKey),
    plugins: [new BugsnagPluginVue()],
    releaseStage: String(config.public.releaseStage) || 'development',
    appVersion: String(config.public.appVersion) || '1.0.13',
    enabledReleaseStages: ['production', 'staging']
  })
  const trace_id = crypto.randomUUID()
  bugsnagClient.addMetadata('trace', { trace_id })

  // Make it globally available in your app
  nuxtApp.provide('bugsnag', bugsnagClient)

  nuxtApp.hook('app:error', (error) => {
    bugsnagClient.notify(error)
  })
})
