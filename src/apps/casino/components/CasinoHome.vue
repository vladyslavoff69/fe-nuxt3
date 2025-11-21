<script lang="ts" setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import LazyCategoryNavigation from '~/apps/casino/components/CategoryNavigation.vue'
import CasinoPage from '~/apps/casino/components/CasinoPage.vue'

const [pageParent] = useAutoAnimate({
  duration: 150,
})
</script>

<template>
  <CasinoPage>
    <div class="grid w-full grid-cols-1 gap-y-3 md:gap-y-4 lg:gap-y-6">
      <DelayHydration>
        <LazyCategoryNavigation hydrate-on-visible />
      </DelayHydration>

      <div
        ref="pageParent"
        class="w-full"
      >
        <NuxtPage />
      </div>
    </div>
  </CasinoPage>
</template>
