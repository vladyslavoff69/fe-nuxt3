<script lang="ts" setup>
import LazyProviderDetailComponent from '~/apps/casino/components/ProviderDetail.vue'

const route = useRoute()
const slug = computed(() => route.params.slug ? String(route.params.slug) : null)
</script>

<template>
  <UPage class="w-full pt-4 md:pt-5">
    <DelayHydration>
      <LazyProviderDetailComponent :hydrate-when="slug" />
    </DelayHydration>
  </UPage>
</template>
