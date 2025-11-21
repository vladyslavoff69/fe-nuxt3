<script lang="ts" setup>
import CategoriesComponent from '~/apps/casino/components/Categories.vue'
import LazyCasinoPage from '~/apps/casino/components/CasinoPage.vue'

const route = useRoute()
const slug = computed(() => route.params.slug ? String(route.params.slug) : null)
</script>

<template>
  <UPage class="w-full pt-4 md:pt-5 pl-1.5 pr-2.5 md:pl-0 md:pr-0">
    <DelayHydration>
      <LazyCasinoPage :hydrate-when="slug">
        <CategoriesComponent />
      </LazyCasinoPage>
    </DelayHydration>
  </UPage>
</template>
