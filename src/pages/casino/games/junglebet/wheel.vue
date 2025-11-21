<script lang="ts" setup>
import PageLoadingProvider from '~/services/providers/pages/PageLoadingProvider.vue'
import WheelStage from '~/apps/wheel/components/WheelStage.vue'
</script>

<template>
  <PageLoadingProvider>
    <WheelStage />
  </PageLoadingProvider>
</template>
