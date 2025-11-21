<script lang="ts" setup>
import VipDashboardMain from '~/apps/vip-program/components/dashboard/VipDashboardMain.vue'
import VipSupportRow from '~/apps/vip-program/components/dashboard/VipSupportRow.vue'

const { t } = useI18n()
const { sendFingerprint } = useSendFingerprint()

onMounted(async () => {
  await sendFingerprint()
})
</script>
<template>
  <div class="vipDashboard grid grid-cols-1 gap-y-4 w-full">
    <h1 class="flex text-xl sm:text-xxl font-bold items-center gap-2 col-span-1">
      <UIcon
        class="h-5 w-5 min-w-5 min-h-5 lg:h-7 lg:w-7"
        name="mdi:crown"
      />
      {{ t("menu.vip") }}
    </h1>
    <VipDashboardMain class="col-span-1" />
    <VipSupportRow class="col-span-1" />
  </div>
</template>
