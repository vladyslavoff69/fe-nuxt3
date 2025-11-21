<script lang="ts" setup>
import { UNRANKED_VIP, VIP_LEVEL_MAP } from '~/constants'

const { vipLevelName } = defineProps<{
  vipLevelName?: string;
}>()

const rankImg = computed(() => {
  if (vipLevelName) {
    return VIP_LEVEL_MAP[vipLevelName.toUpperCase()]?.icon
  }

  return VIP_LEVEL_MAP[UNRANKED_VIP]
})
</script>

<template>
  <NuxtImg
    v-if="vipLevelName?.toUpperCase() !== UNRANKED_VIP"
    :alt="vipLevelName"
    :src="`${rankImg}/sm`"
    loading="lazy"
    provider="cloudflare"
  />
</template>
