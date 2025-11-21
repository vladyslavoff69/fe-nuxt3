<script lang="ts" setup>
import PlinkoStage from '~/apps/plinko/components/PlinkoStage.vue'
import PageLoadingProvider from '~/services/providers/pages/PageLoadingProvider.vue'
</script>

<template>
  <PageLoadingProvider>
    <PlinkoStage />
  </PageLoadingProvider>
</template>
