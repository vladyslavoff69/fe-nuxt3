<script lang="ts" setup>
import AffiliateCampaignSlider from '~/apps/affiliate/components/campaign/AffiliateCampaignSlider.vue'
import AffiliateCreateCampaignModal from '~/apps/affiliate/components/campaign/AffiliateCreateCampaignModal.vue'

const { t } = useI18n()
const isCampaignModalVisible = ref<boolean>(false)
const campaignStates = [
  {
    text: t('affiliate.campaign-hits'),
    value: 0
  },
  {
    text: t('affiliate.referrals'),
    value: 0
  },
  {
    text: t('affiliate.total-deposits'),
    value: 0
  },
  {
    text: t('affiliate.unique-deposits'),
    value: 0
  },
  {
    text: t('affiliate.available'),
    value: 0.000001,
    icon: 'i-cryptocurrency-color-btc'
  },
]

const showCreateModal = () => {
  isCampaignModalVisible.value = true
}

const onCloseModal = () => {
  isCampaignModalVisible.value = false
}
</script>

<template>
  <div>
    <div class="bg-green-950 rounded-md mb-6 flex justify-between px-4 relative overflow-hidden">
      <div class="py-4 relative z-10">
        <JButton
          class="block px-4 w-auto text-white"
          shape="circle"
          @click="showCreateModal"
        >
          {{ t("affiliate.create-new-campaign") }}
        </JButton>
      </div>
      <NuxtImg
        alt="Affiliate campaign"
        class="h-full w-auto absolute right-0 md:right-4"
        loading="lazy"
        provider="cloudflare"
        src="62b8aa8d-65b1-4479-a467-5ff3fd14bb00/sm"
      />
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      <div
        v-for="(state, index) in campaignStates"
        :key="`key-${index}-${state.value}-${state.text}`"
        class="text-center"
      >
        <div class="text-base font-bold text-white">
          {{ state.text }}
        </div>
        <div class="text-sm flex items-center justify-center gap-x-1">
          <UIcon
            v-if="state?.icon"
            :name="state.icon || ''"
          />
          {{ state.value }}
        </div>
      </div>
    </div>
    <div>
      <AffiliateCampaignSlider />
    </div>
    <ClientOnly>
      <UModal
        v-model:open="isCampaignModalVisible"
        class="w-full md:max-w-2xl p-0!"
        :default-open="isCampaignModalVisible"
        @update:open="(v) => {
        if (!v) {
          onCloseModal()
        }
      }"
      >
        <template #content>
          <AffiliateCreateCampaignModal @close:modal="onCloseModal" />
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
