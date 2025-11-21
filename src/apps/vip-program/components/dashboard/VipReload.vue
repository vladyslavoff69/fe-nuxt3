<script lang="ts" setup>
import ReloadLoader from '~/apps/vip-program/components/dashboard/reload/ReloadLoader.vue'
import ReloadContent from '~/apps/vip-program/components/dashboard/reload/ReloadContent.vue'

const { hideHead = false } = defineProps<{
  hideHead?: boolean;
}>()

const { t } = useI18n()
</script>
<template>
  <div class="bg-green-950 p-4 rounded-md flex flex-col gap-y-4">
    <div
      v-if="!hideHead"
      class="text-lg text-white font-bold"
    >
      {{ t('vip.drip') }}
    </div>
    <ReloadLoader v-slot="{ reload }">
      <ReloadContent :reload="reload" />
    </ReloadLoader>
  </div>
</template>
