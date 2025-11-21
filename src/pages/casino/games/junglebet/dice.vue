<script lang="ts" setup>
import PageLoadingProvider from '~/services/providers/pages/PageLoadingProvider.vue'
import DiceStage from '~/apps/dice/components/DiceStage.vue'
</script>

<template>
  <PageLoadingProvider>
    <DiceStage />
  </PageLoadingProvider>
</template>
