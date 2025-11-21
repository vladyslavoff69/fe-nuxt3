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
          class="w-5 h-5 cursor-pointer text-paragraph cursor-help hover:text-white"
          name="ic:baseline-question-answer"
        />
        <span>Rank-Up Bonus</span>
      </div>
      <CloseButton
        class="w-3 h-3 min-w-3 min-h-3"
        @click="onCloseModal"
      />
    </div>
    <div class="text-white">
      <div class="flex flex-col gap-2.5 text-sm">
        <div class="text-paragraph">
          Advancing to a new rank brings bigger rewards! Your bonus grows with
          your rank and reflects your gameplay activity. The Rank Up Bonus is
          crafted to make each rank advancement a rewarding journey, adding a
          personalized touch that matches your gameplay style.
        </div>
        <div>
          <div>Claim Styles:</div>
          <ul class="list-disc pl-8 text-paragraph">
            <li>
              25% Milestones: Claim 25% of your bonus at each progression
              milestone as you advance to the next rank.
            </li>
            <li>
              Traditional Mode: Prefer a full payout? Receive the entire bonus
              immediately upon reaching a new rank.
            </li>
            <li>
              Adapt and Customize: Switch your claim default style whenever you
              want. Your selected style takes effect from the next rank,
              allowing for a bonus claiming experience tailored to your preferences.
            </li>
          </ul>
        </div>
        <div>
          <div>Auto-Claim Feature:</div>
          <div class="text-paragraph">
            Any unclaimed bonuses at the time of ranking up will automatically
            be credited to your USDT balance, so you never miss out on what’s
            rightfully yours. Bonus settings has the same text and format as the
            one you provided (in our style of course).
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
