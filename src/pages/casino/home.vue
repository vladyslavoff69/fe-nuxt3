<script lang="ts" setup>
import LazyCasinoHome from '~/apps/casino/components/CasinoHome.vue'
</script>

<template>
  <UPage class="w-full pt-4 md:pt-5 pl-1.5 pr-2.5 md:pl-0 md:pr-0">
    <DelayHydration>
      <LazyCasinoHome hydrate-on-visible />
    </DelayHydration>
  </UPage>
</template>
