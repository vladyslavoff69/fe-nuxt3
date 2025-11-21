<script lang="ts" setup>
import VipHome from '~/components/pages/vip-program/VipHome.vue'
import { CURRENCY } from '~/constants'
import PageLoader from '~/components/molecules/common/PageLoader.vue'

const { loading } = inject(CURRENCY)!
const { sendFingerprint } = useSendFingerprint()
onMounted(async () => {
  await sendFingerprint()
})
</script>
<template>
  <div class="w-full h-full p-0 m-0">
    <UPage
      v-if="!loading"
      class="w-full pt-4 md:pt-5 pl-1.5 pr-2.5 md:pl-0 md:pr-0"
    >
      <VipHome />
    </UPage>
    <PageLoader v-else />
  </div>
</template>
