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
        <span>Referral Commission Share</span>
      </div>
      <CloseButton
        class="w-3 h-3 min-w-3 min-h-3"
        @click="onCloseModal"
      />
    </div>
    <div class="text-white">
      <div class="flex flex-col gap-2.5 text-sm">
        <div class="text-paragraph">
          When using an affiliate code, you’ll see the commission share
          percentage set by the affiliate who created it. This fixed rate is
          displayed during confirmation before the code is applied to your
          Junglebet account. For example, if an affiliate sets a 50% ‘back to
          referral’ rate and earns $100 in commission from your gaming, you’ll
          receive a $50 return. Commission rates can differ among affiliates.
        </div>
        <div>
          <div>Commission calculations are transparent:</div>
          <ul class="list-disc pl-8 text-paragraph">
            <li>
              Casino: Commission = (House Edge × Total Wagered) × Commission %
            </li>
            <li>
              Shared commission: Shared Commission = Commission × Code Sharing %
            </li>
          </ul>
        </div>
        <div class="text-paragraph">
          Commissions are earned in the same currency as your bets, based on
          your preferences. You can claim your commission share anytime, without
          a cooldown, depending on your betting activity.
        </div>
      </div>
    </div>
  </div>
</template>
