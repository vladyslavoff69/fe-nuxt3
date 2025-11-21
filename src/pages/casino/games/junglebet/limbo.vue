<script lang="ts" setup>
import LimboStage from '~/apps/limbo/components/LimboStage.vue'
import PageLoadingProvider from '~/services/providers/pages/PageLoadingProvider.vue'
</script>

<template>
  <PageLoadingProvider>
    <LimboStage />
  </PageLoadingProvider>
</template>
