import { fpjsPlugin, FingerprintJSPro, type FpjsVueOptions } from '@fingerprintjs/fingerprintjs-pro-vue-v3'
import { defineNuxtPlugin, type Plugin } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  // @ts-ignore
  nuxtApp.vueApp.use(fpjsPlugin as unknown as Plugin,
    {
      loadOptions: {
        apiKey: config.public.fingerprintApiKey,
        endpoint: [
          'https://metrics.junglebet.com',
          FingerprintJSPro.defaultEndpoint
        ],
        scriptUrlPattern: [
          'https://metrics.junglebet.com/web/v<version>/<apiKey>/loader_v<loaderVersion>.js',
          FingerprintJSPro.defaultScriptUrlPattern
        ],
        region: 'eu'
      },
      cacheTimeInSeconds: 3600
    } as FpjsVueOptions
  )
})
