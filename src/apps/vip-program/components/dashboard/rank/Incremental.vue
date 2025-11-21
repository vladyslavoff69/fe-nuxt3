<script lang="ts" setup>
import type { DualRank } from '~/types'
import { CLAIM_RANKUP_MUTATION } from '~/graphql'
import { numberWithCommas } from '~/utils'

const {t} = useI18n()
const props =
  defineProps<{
    vipRenderData: DualRank;
    claimToken: string;
  }>()

const claimsAvailable = computed(() => props.vipRenderData?.claimsAvailable || 0)
const claimedCount = computed(() => props.vipRenderData?.claimedCount || 0)
const canClaimRankUp = computed(() => props.vipRenderData?.canClaimRankUp || false)

const displayThreatsHold = (p: number) => {
  return `${numberWithCommas(props.vipRenderData.xp, 0)}/${numberWithCommas(props.vipRenderData.xpThreshold + props.vipRenderData.availableXpOnLevel * p, 0)}`
}

const tooltipText25 = computed(() => {
  if (Number(claimsAvailable.value) >= 1 && canClaimRankUp.value && claimedCount.value === 0) {
    return t('vip.click-claim')
  }
  if (Number(claimedCount.value) >= 1) {
    return t('vip.claimed')
  }

  return displayThreatsHold(0.25)
})

const tooltipText50 = computed(() => {
  if (Number(claimsAvailable.value) >= 1 && canClaimRankUp.value && claimedCount.value === 1) {
    return t('vip.click-claim')
  }

  if (Number(claimedCount.value) >= 2) {
    return t('vip.claimed')
  }

  if (claimedCount.value === 0 && claimsAvailable.value >= 2) {
    return t('vip.claim-prev')
  }

  return displayThreatsHold(0.5)
})

const tooltipText75 = computed(() => {
  if (Number(claimsAvailable.value) >= 1 && canClaimRankUp.value && claimedCount.value === 2) {
    return t('vip.click-claim')
  }
  if (Number(claimedCount.value) >= 3) {
    return t('vip.claimed')
  }
  if (claimedCount.value === 0 && claimsAvailable.value >= 3) {
    return t('vip.claim-prev')
  }

  return displayThreatsHold(0.75)
})

const tooltipText100 = computed(() => {
  if (Number(claimsAvailable.value) >= 1 && canClaimRankUp.value && claimedCount.value === 3) {
    return t('vip.click-claim')
  }

  if (Number(claimedCount.value) >= 4) {
    return t('vip.claimed')
  }

  if (claimedCount.value === 0 && claimsAvailable.value >= 4) {
    return t('vip.claim-prev')
  }

  return displayThreatsHold(1)
})

const {
  loading: claimRankupLoading,
  onDone: onClaimRankupDone,
  mutate: claimRankupMutate,
} = useMutation(CLAIM_RANKUP_MUTATION)

const claimRankUp = () => {
  if (claimRankupLoading.value) {
    return
  }
  claimRankupMutate({
    currencyCode: props.claimToken,
  })
}

onClaimRankupDone(() => {
  if (props.vipRenderData.claimInterval === 'incremental') {
    if (claimsAvailable.value > 0 && claimedCount.value === 1) {
      useGeneralNotify({
        type: 'success',
        title: t('vip.claimed-title', {percent: 25}),
        description: t('vip.claimed-text', {order: t('vip.first')}),
      })
    } else if (claimedCount.value === 2) {
      useGeneralNotify({
        type: 'success',
        title: t('vip.claimed-title', {percent: 50}),
        description: t('vip.claimed-text', {order: t('vip.second')}),
      })
    } else if (claimedCount.value === 3) {
      useGeneralNotify({
        type: 'success',
        title: t('vip.claimed-title', {percent: 75}),
        description: t('vip.claimed-text', {order: t('vip.third')}),
      })
    } else {
      useGeneralNotify({
        type: 'success',
        title: t('vip.claimed-full'),
        description: t('vip.claimed-full-text'),
      })
    }
  } else {
    useGeneralNotify({
      type: 'success',
      title: t('vip.claimed-full'),
      description: t('vip.claimed-full-text'),
    })
  }
})
</script>
<template>
  <div
    class="
      flex flex-row justify-between gap-5 rounded
      absolute top-0 left-[calc(20%-25px)] w-[calc(80%+25px)]
    "
  >
    <UTooltip
      :content="{ side: 'top' }"
      arrow
      :text="tooltipText25"
    >
      <JButton
        :disabled="!(Number(claimsAvailable) >= 1 && claimedCount === 0 && canClaimRankUp)"
        :loading="claimRankupLoading"
        class="h-10 w-10"
        :class="{
            'opacity-50!': !(Number(claimsAvailable) >= 1 && claimedCount === 0 && canClaimRankUp)
          }"
        variant="alternative"
        @click="claimRankUp"
      >
        <span
          v-if="Number(claimedCount) < 1"
          class="text-sm"
          :class="{
            'text-gold': (Number(claimsAvailable) >= 1 && claimedCount === 0 && canClaimRankUp)
          }"
        > 25% </span>
        <UIcon
          v-else
          :class="{
              'text-primary!': Number(claimedCount) >= 1,
            }"
          class="w-5 h-5 min-h-5 min-w-5 text-white opacity-50"
          name="material-symbols:check-circle"
        />
      </JButton>
    </UTooltip>
    <UTooltip
      :content="{ side: 'top' }"
      arrow
      :text="tooltipText50"
    >
      <JButton
        :disabled="!(Number(claimsAvailable) >= 1 && canClaimRankUp && claimedCount === 1)"
        :loading="claimRankupLoading"
        :class="{
            'opacity-50!': !(Number(claimsAvailable) >= 1 && claimedCount === 1 && canClaimRankUp)
          }"
        class="h-10 w-10"
        variant="alternative"
        @click="claimRankUp"
      >
        <span
          v-if="Number(claimedCount) < 2"
          class="text-sm"
        > 50% </span>
        <UIcon
          v-else
          :class="{
              'text-primary!': Number(claimedCount) >= 2,
            }"
          class="w-5 h-5 min-h-5 min-w-5 text-white opacity-50"
          name="material-symbols:check-circle"
        />
      </JButton>
    </UTooltip>

    <UTooltip
      :content="{ side: 'top' }"
      arrow
      :text="tooltipText75"
    >
      <JButton
        :disabled="!(Number(claimsAvailable) >= 1 && canClaimRankUp && claimedCount === 2)"
        :loading="claimRankupLoading"
        :class="{
          'opacity-50!': !(Number(claimsAvailable) >= 1 && claimedCount === 2 && canClaimRankUp)
        }"
        class="h-10 w-10"
        variant="alternative"
        @click="claimRankUp"
      >
        <span
          v-if="Number(claimedCount) < 3"
          class="text-sm"
        > 75% </span>
        <UIcon
          v-else
          :class="{
            'text-primary!': Number(claimedCount) >= 3,
          }"
          class="w-5 h-5 min-h-5 min-w-5 text-white opacity-50"
          name="material-symbols:check-circle"
        />
      </JButton>
    </UTooltip>

    <UTooltip
      :content="{ side: 'top' }"
      arrow
      :text="tooltipText100"
    >
      <JButton
        :disabled="
          !(claimsAvailable === 1 && canClaimRankUp && claimedCount === 3)
        "
        :loading="claimRankupLoading"
        :class="{
          'opacity-50!': !(Number(claimsAvailable) >= 1 && claimedCount === 3 && canClaimRankUp)
        }"
        class="h-10 w-10"
        variant="alternative"
        @click="claimRankUp"
      >
        <span
          v-if="Number(claimedCount) < 4"
          class="text-sm"
        > 100% </span>
        <UIcon
          v-else
          :class="{
              'text-primary!': Number(claimedCount) >= 4,
            }"
          class="w-5 h-5 min-h-5 min-w-5 text-white opacity-50"
          name="material-symbols:check-circle"
        />
      </JButton>
    </UTooltip>
  </div>
</template>
