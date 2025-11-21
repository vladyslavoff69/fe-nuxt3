<script lang="ts" setup>
import AffiliateInnerPageLayout from '~/apps/affiliate/components/layout/AffiliateInnerPageLayout.vue'
import { CURRENCY } from '~/constants'
import PageLoader from '~/components/molecules/common/PageLoader.vue'

const { loading } = inject(CURRENCY)!
</script>
<template>
  <UPage
    v-if="!loading"
    class="Affiliate w-full pt-4 md:pt-5 pl-1.5 pr-2.5 md:pl-0 md:pr-0"
  >
    <AffiliateInnerPageLayout />
  </UPage>
  <PageLoader v-else />
</template>
