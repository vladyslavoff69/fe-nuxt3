<script setup lang="ts">
import NotFound from '~/components/molecules/errors/404.vue'
import Maintenance from '~/components/pages/maintenance/index.vue'
// @ts-ignore
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError
})

const { t } = useI18n()
const isOpenBlock = ref(true)
</script>

<template>
  <div class="bg-brand w-full h-full p-0 m-0 min-h-screen overflow-hidden">
    <div
      class="font-semibold"
    >
      <div v-if="error?.statusCode === 404">
        <NotFound />
      </div>
      <div v-else-if="error?.statusCode === 503">
        <ClientOnly>
          <UModal
            v-model:open="isOpenBlock"
            :default-open="isOpenBlock"
            :dismissible="false"
            class="p-0! m-0! flex items-center justify-center bg-brand h-screen w-screen"
          >
            <template #content>
              <div class="p-0! m-0! flex items-center justify-center bg-brand h-screen w-screen">
                <Maintenance />
              </div>
            </template>
          </UModal>
        </ClientOnly>
      </div>
      <div
        v-else
        class="p-3 bg-brand text-paragraph w-screen min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          class="p-4 bg-green-900 rounded-md flex flex-col gap-2 items-center"
          role="alert"
          aria-live="assertive"
        >
          <div
            class="text-2xl font-bold text-center p-2 text-white bg-brand w-full rounded-md"
            role="heading"
            aria-level="1"
          >
            ERROR {{ error?.statusCode }}
          </div>
          <p class="text-xl">
            {{ t('missing.oops') }}! {{ t('missing.something-went-wrong') }}!
          </p>
          <p
            v-if="String((error?.message || 0))?.includes('Failed to fetch')"
            class="text-lg"
          >
            {{ error?.message }} {{ error?.data }}.
          </p>
          <p
            v-else
            class="text-lg"
          >
            {{ `${error?.message} ${error?.data}` || t('missing.an-unexpected-error') }}
          </p>
          <NuxtLinkLocale
            to="/"
            class="hover:underline hover:text-white border border-primary px-4 py-2 bg-brand rounded-md"
          >
            {{ t('missing.go-back-to-home') }}
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
  </div>
</template>
