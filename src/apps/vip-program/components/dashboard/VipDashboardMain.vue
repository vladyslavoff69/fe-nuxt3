<script lang="ts" setup>
import VipCurrentRank from '~/apps/vip-program/components/dashboard/VipCurrentRank.vue'
import VipUpcomingRanks from '~/apps/vip-program/components/dashboard/VipUpcomingRanks.vue'
import VipRankUp from '~/apps/vip-program/components/dashboard/VipRankUp.vue'
import VipRakeback from '~/apps/vip-program/components/dashboard/VipRakeback.vue'
import VipReload from '~/apps/vip-program/components/dashboard/VipReload.vue'
import VipWeekly from '~/apps/vip-program/components/dashboard/VipWeekly.vue'
</script>
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 text-white gap-4">
    <VipCurrentRank />
    <VipUpcomingRanks />
    <VipRankUp />
    <VipRakeback
      :hide-zero-value="true"
    />
    <VipReload />
    <VipWeekly />
  </div>
</template>
