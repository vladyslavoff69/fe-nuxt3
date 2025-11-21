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
        <span>Rakeback Bonus</span>
      </div>
      <CloseButton
        class="w-3 h-3 min-w-3 min-h-3"
        @click="onCloseModal"
      />
    </div>
    <div class="text-white">
      <div class="flex flex-col gap-2.5 text-sm">
        <div>
          <div>Claiming Rakeback:</div>
          <ul class="list-disc pl-8 text-paragraph">
            <li>
              Claim Anytime: At Junglebet, players can claim their Rakeback at
              any time! After each claim, there’s only a 2-minute cooldown
              before the next claim can be made. Rakeback continues to
              accumulate during the cooldown, ensuring players are always
              earning.
            </li>
            <li>
              Non-Expiring Rewards: Junglebet’s Rakeback never expires. Players
              can claim it at their convenience, with the assurance that it’s
              always accumulating and ready to be claimed.
            </li>
          </ul>
        </div>
        <div>
          <div>Earning Rakeback:</div>
          <div class="text-paragraph">
            The Rakeback is automatically calculated based on the total amount
            wagered, not the outcome of the game. It’s associated with the house
            edge, which varies for different games but is typically around 3%.
          </div>
        </div>
        <div>
          <div>Increasing Rakeback:</div>
          <div class="text-paragraph">
            The Rakeback percentage increases with the player’s VIP rank, with
            the potential to reach up to 15%. Each advancement in rank results
            in a higher Rakeback percentage, maximizing the rewards for players.
            Detailed information is available in the VIP chart. The Junglebet
            Rakeback Bonus is a continuous reward system designed to give back
            to players regardless of their game outcomes. Every bet contributes
            to your Rakeback, offering a consistent stream of rewards.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
