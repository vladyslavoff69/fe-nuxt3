<script lang="ts" setup>
import TopBanner from '~/components/pages/players-charity/home/details/TopBanner.vue'
import DonateStepsBanner from '~/components/pages/players-charity/home/details/DonateStepsBanner.vue'
import Table from '~/components/pages/players-charity/home/details/Table.vue'
import Charities from '~/components/pages/players-charity/home/details/Charities.vue'
import NominateSection from '~/components/pages/players-charity/home/details/NominateSection.vue'

const { sendFingerprint } = useSendFingerprint()
onMounted(async () => {
  await sendFingerprint()
})
</script>

<template>
  <div class="flex flex-col gap-y-3 sm:gap-y-14">
    <TopBanner />
    <div class="flex flex-col gap-y-12">
      <DonateStepsBanner />
      <Table />
      <Charities />
    </div>
    <div class="flex flex-col gap-y-6">
      <NominateSection />
    </div>
  </div>
</template>
