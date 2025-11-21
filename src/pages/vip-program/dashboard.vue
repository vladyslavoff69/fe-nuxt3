<script lang="ts" setup>
import LazyVipDashboard from '~/components/pages/vip-program/VipDashboard.vue'
import { AUTH, CURRENCY } from '~/constants'
import PageLoader from '~/components/molecules/common/PageLoader.vue'
import VipHome from '~/components/pages/vip-program/VipHome.vue'

const { isLoggedIn } = inject(AUTH)!
const { loading } = inject(CURRENCY)!

const { sendFingerprint } = useSendFingerprint()
onMounted(async () => {
  await sendFingerprint()
})
</script>

<template>
  <UPage
    class="w-full pt-4 md:pt-5 pl-1.5 pr-2.5 md:pl-0 md:pr-0"
  >
    <DelayHydration>
      <VipHome v-if="!isLoggedIn" />
      <LazyVipDashboard
        v-else-if="!loading"
      />
      <PageLoader v-else />
    </DelayHydration>
  </UPage>
</template>
