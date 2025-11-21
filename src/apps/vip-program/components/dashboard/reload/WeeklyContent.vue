<script lang="ts" setup>
import type { ReloadRank } from '~/types'
import { AUTH, CURRENCY, PREFERENCE, VIP, VIP_DRIP } from '~/constants'
import { CLAIM_WEEKLY_MUTATION } from '~/graphql'
import ClaimTokensPopover from '~/apps/vip-program/components/dashboard/ClaimTokensPopover.vue'
import UnActivateWeekly from '~/apps/vip-program/components/dashboard/reload/UnActivateWeekly.vue'
import { useUsdToFiatAmount } from '~/apps/affiliate/hooks'

const props = defineProps<{
  reload: ReloadRank;
}>()

const {
  loading: claimWeeklyLoading,
  onDone: onClaimWeeklyDone,
  onError: onClaimWeeklyError,
  error: claimWeeklyError,
  mutate: claimWeeklyMutate,
} = useMutation(CLAIM_WEEKLY_MUTATION)

const { t } = useI18n()
const { vip } = inject(VIP)!
const { isLoggedIn, me }: any = inject(AUTH)!
const { activeCryptoCode, displayInfiatEnabled } = inject(PREFERENCE)!
const { cryptoToUsd, displayCryptoAmount } = inject(CURRENCY)!
const { refetch, loading }: any = inject(VIP_DRIP)!
const vipReload = computed(() => props.reload)
const { usdToFiatAmount } = useUsdToFiatAmount()
const claimToken = ref(activeCryptoCode.value || 'BTC')
const usdClaimVal = computed(() => vipReload.value.availableWeeklyBonus)
const claimVal = computed(() => usdToFiatAmount(vipReload.value.availableWeeklyBonus))
const isExpired = computed(() => vipReload.value.isExpired)
const activationAt = computed(() => vipReload.value.activationAt)
const canClaimWeeklyBonus = computed(() => vipReload.value.canClaimWeeklyBonus)
const hasClaimedWeekly = computed(() => vipReload.value.hasClaimedWeekly)
const isReloadActivated = computed(() => vipReload.value.isReloadActivated)
const cryptoClaimVal = computed(() => displayCryptoAmount(usdClaimVal.value / cryptoToUsd.value[claimToken.value], claimToken.value))

const onClaim = async () => {
  if (claimWeeklyLoading.value) {
    return
  }
  await claimWeeklyMutate({
    currencyCode: claimToken.value,
  })
}

onClaimWeeklyDone(() => {
  useGeneralNotify({
    type: 'success',
    title: t('notifications.success'),
    description: `${t('vip.weekly-bonus')} ${t('vip.claimed')}`,
  })

  useConfetti()
  refetch()
})

onClaimWeeklyError(() => {
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: claimWeeklyError.value?.message,
  })
})

onMounted(() => {
  refetch()
})
</script>
<template>
  <div
    v-if="isLoggedIn && !!me && !!vip"
    class="h-full"
  >
    <UnActivateWeekly
      v-if="!canClaimWeeklyBonus || !isReloadActivated || hasClaimedWeekly"
      :reload="reload"
    />
    <div
      v-else
      class="text-sm flex flex-col h-full gap-2 md:gap-4"
    >
      <template v-if="!isExpired">
        <div class="flex flex-col items-center justify-center bg-green-950 rounded-md font-bold gap-1 md:gap-2">
          <span class="text-lg md:text-2xl text-white font-extrabold leading-7">
            {{ claimVal }}
          </span>

          <div class="flex gap-1.5 items-center justify-center text-xs md:text-sm">
            {{ t('affiliate.available') }} {{ t('vip.weekly-bonus') }}
          </div>
        </div>

        <div
          v-if="isReloadActivated || (!canClaimWeeklyBonus && !!activationAt)"
          class="w-full flex flex-col gap-1"
        >
          <div
            class="flex items-center justify-between font-bold w-full"
          >
            <span class="text-sm text-paragraph">
              {{ t('vip.claim-curr') }}
            </span>
            <span
              v-if="!displayInfiatEnabled"
              class="text-sm text-paragraph"
            >
              {{ claimVal }}
            </span>
            <span
              v-else
              class="text-sm text-paragraph"
            >
              {{ cryptoClaimVal }}
            </span>
          </div>
          <ClaimTokensPopover
            v-model="claimToken"
            :fiat-usd-value="usdClaimVal"
          />
        </div>
      </template>

      <div class="mt-auto w-full">
        <JButton
          v-if="(isReloadActivated || (!canClaimWeeklyBonus && !!activationAt)) && !isExpired"
          :disabled="!(canClaimWeeklyBonus && !claimWeeklyLoading && !loading)"
          :loading="claimWeeklyLoading || loading"
          :variant="canClaimWeeklyBonus ? 'primary' : 'outline'"
          class="w-full text-white"
          @click="onClaim"
        >
          {{ t('vip.claim') }} {{ t('vip.weekly-bonus') }}
        </JButton>

        <JButton
          v-else-if="(!isReloadActivated && !canClaimWeeklyBonus) || isExpired"
          :disabled="true"
          :loading="claimWeeklyLoading || loading"
          class="w-full"
          variant="outline"
        >
          {{ t('vip.meet-reqs-drip') }}
        </JButton>

        <div
          v-if="reload.expiresAt"
          class="flex items-center justify-center mt-1"
        >
          <span class="text-paragraph text-xxs md:text-xs text-center mr-1">
            {{ t("vip.updates-on") }}:
          </span>
          <span class="text-paragraph font-bold text-xxs md:text-xs">
            {{ new Date(String(reload.expiresAt)).toUTCString() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
