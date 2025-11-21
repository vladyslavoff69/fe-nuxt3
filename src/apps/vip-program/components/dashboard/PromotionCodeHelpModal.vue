<script lang="ts" setup>
import CloseButton from '~/components/molecules/button/CloseButton.vue'

const emits = defineEmits<{
  (e: 'close:modal', value: boolean): void;
}>()

const onCloseModal = () => {
  emits('close:modal', true)
}
</script>

<template>
  <div class="text-left">
    <div
      class="flex justify-between items-center w-full border-b border-border pb-4 mb-4"
    >
      <div
        class="text-base text-white gap-2 font-bold flex items-center"
      >
        <UIcon
          class="w-5 h-5 text-paragraph cursor-help hover:text-white"
          name="ic:baseline-question-answer"
        />
        <span>Promotion Codes</span>
      </div>
      <CloseButton
        class="w-3 h-3 min-w-3 min-h-3"
        @click="onCloseModal"
      />
    </div>
    <div class="text-white">
      <div class="flex flex-col gap-2.5 text-sm">
        <div>
          <div>Unlocking Rewards:</div>
          <div class="text-paragraph">
            Use the designated Promo Code box on the promotions page as your
            gateway to diverse rewards, including bonus credits and exclusive
            gaming privileges.
          </div>
        </div>
        <div>
          <div>Where to Find Codes:</div>
          <div class="text-paragraph">
            Promo codes are released through various channels such as live chat,
            social media, and newsletters. Stay connected and be proactive to
            get your hands on these rewarding codes.
          </div>
        </div>
        <div>
          <div>Redeeming Process:</div>
          <div class="text-paragraph">
            Enter the promo code into the Promo Code box and hit ‘Redeem’ to
            instantly claim your reward on Junglebet.
          </div>
        </div>
        <div>
          <div>Usage Limitations and Criteria:</div>
          <div class="text-paragraph">
            Each promo code is designed for one-time use and must be redeemed
            within a specified period. Some codes may have specific criteria,
            such as a minimum rank or a minimum amount wagered in the past week,
            to be eligible for redemption.
          </div>
        </div>
        <div>
          <div>Stay Engaged:</div>
          <div class="text-paragraph">
            Actively participate and keep an eye on our communication channels.
            This ensures you won’t miss out on any promo codes and the enhanced
            gaming experiences they bring on Junglebet.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
