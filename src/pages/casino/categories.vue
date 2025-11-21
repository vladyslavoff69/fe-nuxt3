<script lang="ts" setup>
import CategoriesComponent from '~/apps/casino/components/GameCategories.vue'
import CasinoPage from '~/apps/casino/components/CasinoPage.vue'
</script>

<template>
  <UPage class="w-full pt-4 md:pt-5 pl-1.5 pr-2.5 md:pl-0 md:pr-0">
    <CasinoPage>
      <CategoriesComponent />
    </CasinoPage>
  </UPage>
</template>
