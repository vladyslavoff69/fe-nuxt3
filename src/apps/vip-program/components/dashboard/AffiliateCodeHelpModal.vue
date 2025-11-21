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
        class="text-base gap-2 flex items-center"
      >
        <UIcon
          class="w-5 h-5 cursor-pointer text-paragraph cursor-help hover:text-white"
          name="ic:baseline-question-answer"
        />
        <span class="text-white font-bold">Junglebet Affiliate Program</span>
      </div>
      <CloseButton
        class="w-3 h-3 min-w-3 min-h-3"
        @click="onCloseModal"
      />
    </div>
    <div class="text-white">
      <div class="flex flex-col gap-2.5 text-sm">
        <div class="text-paragraph">
          Make income through our competitive affiliate program by referring players to the site - no caps, the more
          your referrals play, the more you make. Here's how it works:
        </div>
        <div>
          <div>Apply an Affiliate Code</div>
          <div class="text-paragraph">
            When creating an account, you can enter an affiliate code to receive a specified portion of all wagering by
            the player. Keep in mind, once applied an affiliate code is permanent and cannot be changed. Each code shows
            a fixed commission share percentage set by the code creator, which cannot be altered once applied.
          </div>
        </div>
        <div>
          <div>Claiming Commission</div>
          <div class="text-paragraph">
            After linking an affiliate code to your Junglebet account, the 'Claim' button will appear in the affiliate
            section and can be claimed at any time into your main balance for use how you see fit.
          </div>
        </div>
        <div>
          <div>Commission Structure</div>
          <div class="text-paragraph">
            Commission percentages are set by affiliates when a code is created. Higher-tier affiliates are offered more
            attractive percentages on a tiered scale. By having a new registration use your affiliate code, you become
            eligible to receive a portion of the commission based on the percentage set by your referrer.
          </div>
        </div>
        <div>
          <div>Become a Junglebet Partner</div>
          <div class="text-paragraph">
            The system is designed to benefit both users and affiliates. Users can compare different codes based on
            their commission percentages before applying, ensuring they maximize their rewards.
          </div>
        </div>
        <div>
          <div class="text-paragraph">
            Should you have any further questions or would like to discuss an ongoing partnership, please don't hesitate
            to reach out to our support team.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
