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
        <span>Drip Bonus</span>
      </div>
      <CloseButton
        class="w-3 h-3 min-w-3 min-h-3"
        @click="onCloseModal"
      />
    </div>
    <div class="text-white">
      <div class="flex flex-col gap-2.5 text-sm">
        <div class="text-paragraph">
          The Junglebet's Drip bonus system offers flexibility and strategy,
          enhancing your gaming experience. Plan your claims, select intervals
          at your convenience, and maximize rewards!
        </div>
        <div>
          <div>Access and Activation:</div>
          <div class="text-paragraph">
            Once you reach WOOD 1 VIP Rank and wager over $2,500 in the past
            week, you qualify to activate the Drip. This bonus is calculated
            based on your last seven days of wagering activity and losses.
            Activate to start a 7-day countdown, locking in the bonus amount at
            that time.
          </div>
        </div>
        <div>
          <div>User Interface Details:</div>
          <ul class="list-disc pl-8 text-paragraph">
            <li>
              Total Claimable: Clearly displayed, this shows your bonus amount.
            </li>
            <li>
              Claim Style Settings: Click the settings icon to view and select from the 10-minute interval.
            </li>
            <li>
              Total Claimed: Keep track of the bonus amount you've already
              claimed.
            </li>
          </ul>
        </div>
        <div>
          <div>Claiming and Timing:</div>
          <ul class="list-disc pl-8 text-paragraph">
            <li>
              Drip Timer: A constant 7-day countdown marking the bonus
              duration.
            </li>
            <li>
              Interval Timer: Resets based on your chosen claim interval and
              counts down to your next bonus claim.
            </li>
          </ul>
        </div>
        <div>
          <div>Claim Interval Switching:</div>
          <div class="text-paragraph">
            Want to change your claim style? No problem. Make the switch, and
            it’ll take effect after completing your current interval claim.
          </div>
        </div>
        <div>
          <div>7-Day Cycle & Expiry:</div>
          <div class="text-paragraph">
            Operate within a 7-day cycle governed by the Drip timer. At its
            end, any unclaimed bonus expires. Ensure you claim all bonuses
            before this.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
