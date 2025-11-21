<script lang="ts" setup>
import PageHeader from '~/components/pages/policies/PageHeader.vue'
import PageLoader from '~/components/molecules/common/PageLoader.vue'
import PageBody from '~/components/pages/policies/PageBody.vue'

const contentData = ref()
const { getJson } = usePolicyContent('kyc')

onMounted(async () => {
  contentData.value = await getJson()
})
</script>

<template>
  <UPage
    v-if="contentData"
    class="w-full pt-4 md:pt-6 pl-1.5 pr-2.5 md:pl-0 md:pr-0"
  >
    <div class="w-full flex flex-col gap-2 md:gap-4">
      <PageHeader :title="contentData.title" />

      <PageBody :content-data="contentData" />
    </div>
  </UPage>
  <PageLoader v-else />
</template>
