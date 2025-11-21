<script lang="ts" setup>
import { META } from '~/constants'
import PageLoadingProvider from '~/services/providers/pages/PageLoadingProvider.vue'
import ThirdPartyLayout from '~/apps/third-party/ThirdPartyLayout.vue'

const { inGamePage } = inject(META)!
const route = useRoute()
const slug = computed(() => route.params.slug ? String(route.params.slug) : null)

onMounted(() => {
  inGamePage.value = true

  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

onBeforeUnmount(() => {
  inGamePage.value = false
})
</script>

<template>
  <div
    v-if="slug"
    class="w-full h-full p-0 m-0"
  >
    <PageLoadingProvider>
      <ThirdPartyLayout
        :slug="slug"
      />
    </PageLoadingProvider>
  </div>
  <div
    v-else
    class="w-full h-full p-0 m-0"
  />
</template>
