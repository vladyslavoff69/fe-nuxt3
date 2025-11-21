<script lang="ts" setup>
import CloseButton from '~/components/molecules/button/CloseButton.vue'

const emits = defineEmits<{
  (e: 'close:modal', value: boolean): void;
}>()

const { t } = useI18n()

const onCloseModal = () => {
  emits('close:modal', true)
}

const tierAnswers = [
  'Every Junglebet Affiliate starts with a base commission rate of 12%, with the opportunity to ' +
  'increase this rate based on the lifetime total amount wagered by your referrals. ' +
  'We’ve set our base commission to be extremely competitive with the industry, giving you a strong starting point from day one.',
  '',
  'Your commission percentage scales up based on your referrals’ lifetime cumulative wagering. ' +
  'Once you unlock a higher tier, you keep that rate permanently — no resets, no downgrades.',
  'The more your referrals wager over time, the more you earn. ' +
  'With a structure designed for long-term growth, Junglebet Affiliates are rewarded for performance, not just volume spikes.'
]

const tierStructures = [
  '12% Commission: For $0 – $150,000 wagered',
  '14% Commission: For $150,001 – $2,000,000 wagered',
  '16% Commission: For $2,000,001 – $5,000,000 wagered',
  '18% Commission: For $5,000,001 – $50,000,000 wagered',
  '20% Commission: For $50,000,001 – $100,000,000 wagered',
  '22% Commission: For $100,000,001 – $500,000,000 wagered',
  '24% Commission: For $500,000,001 – $1,000,000,000 wagered',
  '25% Commission: For $1,000,000,001+ wagered',
]
</script>

<template>
  <div class="text-left">
    <div
      class="flex justify-between items-center w-full pb-4"
    >
      <div
        class="text-white font-bold text-xl leading-none! flex items-center gap-x-1"
      >
        <span>{{ t("affiliate.comm-tiers") }}</span>
      </div>
      <CloseButton
        class="w-3 h-3 min-w-3 min-h-3"
        @click="onCloseModal"
      />
    </div>
    <div>
      <NuxtImg
        class="mx-auto max-w-48 mb-4"
        loading="lazy"
        provider="cloudflare"
        src="/84357943-bff3-45a5-534f-4cecbf01d700/sm"
        alt="Commission Share Tiers"
      />
      <div
        v-for="i in 4"
        :key="i"
        class="mb-2 text-sm"
      >
        <div class="flex gap-2.5 text-white">
          <span>{{ t(`affiliate.tiers-${i}`) }}</span>
        </div>
        <div class="flex gap-2.5">
          <span v-if="i !== 2">{{ tierAnswers[(i - 1)] }}</span>
          <ul
            v-else
            class="list-disc pl-7"
          >
            <li
              v-for="j in tierStructures.length"
              :key="j"
              class="text-sm"
            >
              {{ tierStructures[j] }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
