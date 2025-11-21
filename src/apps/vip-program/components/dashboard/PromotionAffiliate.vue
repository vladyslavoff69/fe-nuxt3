<script lang="ts" setup>
import { AUTH } from '~/constants'
import PromotionAffiliateApplied from '~/apps/vip-program/components/dashboard/PromotionAffiliateApplied.vue'
import PromotionAffiliateForm from '~/apps/vip-program/components/dashboard/PromotionAffiliateForm.vue'

const { me } = inject(AUTH)!
const sponsorCode = computed(() => me.value?.sponsorAffiliates?.sponsorCode)
</script>

<template>
  <div class="bg-green-950 p-4 rounded-md z-10">
    <PromotionAffiliateApplied
      v-if="sponsorCode"
      :sponsor-code="sponsorCode"
    />
    <PromotionAffiliateForm v-else />
  </div>
</template>
