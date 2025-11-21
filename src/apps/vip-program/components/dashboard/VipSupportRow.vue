<script lang="ts" setup>
import PromotionPrizeCode from '~/apps/vip-program/components/dashboard/PromotionPrizeCode.vue'
import PromotionAffiliate from '~/apps/vip-program/components/dashboard/PromotionAffiliate.vue'
import VipDailySpin from '~/apps/vip-program/components/dashboard/VipDailySpin.vue'
import VipPageFooter from '~/apps/vip-program/components/dashboard/VipPageFooter.vue'

const { t } = useI18n()
const { toggleChat } = useCrisp()
const handleChatButtonClick = () => {
  if (import.meta.client) {
    toggleChat()
  }
}
</script>
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 text-white gap-4">
    <VipDailySpin class="col-span-1" />
    <div class="flex flex-col text-white gap-4 col-span-1">
      <PromotionAffiliate class="w-full" />
      <PromotionPrizeCode class="w-full" />
      <div class="bg-green-950 p-4 rounded-md w-full hidden lg:block">
        <div class="flex flex-col gap-2.5 h-full">
          <div class="flex justify-between">
            <p class="text-sm md:text-base font-bold">
              {{ t('vip.vip-support') }}
            </p>
          </div>
          <p class="text-xs md:text-sm text-paragraph">
            {{ t('vip.vip-support-txt') }}
          </p>
          <JButton
            :block="false"
            class="w-full mt-auto font-bold"
            shape="circle"
            variant="outline"
            @click="handleChatButtonClick"
          >
            {{ t('vip.chat-us') }}
          </JButton>
        </div>
      </div>
    </div>
    <div class="col-span-1">
      <VipPageFooter />
    </div>
  </div>
</template>
