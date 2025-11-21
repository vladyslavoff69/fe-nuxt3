<script lang="ts" setup>
import KenoStage from '~/apps/keno/components/KenoStage.vue'
import PageLoadingProvider from '~/services/providers/pages/PageLoadingProvider.vue'
</script>

<template>
  <PageLoadingProvider>
    <KenoStage />
  </PageLoadingProvider>
</template>
