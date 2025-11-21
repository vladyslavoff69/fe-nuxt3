<script lang="ts" setup>
import type { ReloadRank } from '~/types'
import { AUTH, CURRENCY, PREFERENCE, VIP, VIP_DRIP } from '~/constants'
import { ACTIVATE_RELOAD_MUTATION, CLAIM_RELOAD_MUTATION } from '~/graphql'
import UnActivate from '~/apps/vip-program/components/dashboard/reload/UnActivate.vue'
import CountDown from '~/components/molecules/common/CountDown.vue'
import ReloadHelpModal from '~/apps/vip-program/components/dashboard/reload/ReloadHelpModal.vue'
import CountDownInterval from '~/components/molecules/common/CountDownInterval.vue'
import ClaimTokensPopover from '~/apps/vip-program/components/dashboard/ClaimTokensPopover.vue'
import IntervalSelect from '~/apps/vip-program/components/dashboard/reload/IntervalSelect.vue'

const props = defineProps<{
  reload: ReloadRank;
}>()

const { t } = useI18n()
const { vip } = inject(VIP)!
const { isLoggedIn, me }: any = inject(AUTH)!
const { activeCryptoCode, displayInfiatEnabled } = inject(PREFERENCE)!
const { cryptoToUsd, displayFiatAmount, displayCryptoAmount } = inject(CURRENCY)!
const { refetch } = inject(VIP_DRIP)!
const isHelpModalVisible = ref<boolean>(false)
const vipReload = computed(() => props.reload)

const {
  loading: activateReloadLoading,
  onDone: onActivateReloadDone,
  onError: onActivateReloadError,
  error: activateReloadError,
  mutate: activateReloadMutate,
} = useMutation(ACTIVATE_RELOAD_MUTATION)

const {
  loading: claimReloadLoading,
  onDone: onClaimReloadDone,
  onError: onClaimReloadError,
  error: claimReloadError,
  mutate: claimReloadMutate,
} = useMutation(CLAIM_RELOAD_MUTATION)

const claimToken = ref(activeCryptoCode.value || 'BTC')
const claimedVal = ref(0)
const claimValRate = computed(() => vipReload.value.intervalValues?.find(intV => intV.interval === vipReload.value.interval)?.value || 0)
const nextInterval = computed(() => vipReload.value.nextInterval)
const canActivateReload = computed(() => vipReload.value.canActivateReload)
const isExpired = computed(() => vipReload.value.isExpired)
const activationAt = computed(() => vipReload.value.activationAt)
const canClaimReload = computed(() => vipReload.value.canClaimReload)
const canClaims = computed(() => canClaimReload.value && !claimReloadLoading.value)
const isReloadActivated = computed(() => vipReload.value.isReloadActivated)
const fiatTotalClaimed = computed(() => displayFiatAmount(vipReload.value.totalClaimed))
const fiatClaimedVal = computed(() => displayFiatAmount(claimedVal.value))
const fiatClaimVal = computed(() => displayFiatAmount(claimValRate.value))
const isClaimAsWell = ref(false)
/* user have to reach wood 3 and wager 2.5k in last week or the isReloadActivated is set to On */
const canUseDripFeature = computed(() => canActivateReload.value || isReloadActivated.value)
const formattedInterval = computed(() => (
  nextInterval.value === 'TEN_MIN'
    ? '10 minutes'
    : (nextInterval.value === 'ONE_HOUR' ? 'an hour' : (nextInterval.value === 'ONE_DAY' ? 'a day' : nextInterval.value))
))

// @ts-ignore
const cryptoClaimedVal = computed(() => displayCryptoAmount(claimedVal.value / cryptoToUsd.value[claimToken.value], claimToken.value))

const onReFetchReload = () => {
  refetch()
}

const activateReload = async () => {
  if (activateReloadLoading.value) {
    return
  }

  if (canActivateReload.value) {
    await activateReloadMutate({
      interval: nextInterval.value,
    })
  } else {
    useGeneralNotify({
      type: 'error',
      title: t('vip.bonus-req-unmet'),
      description: t('vip.bonus-req-unmet-txt'),
    })
  }
}

const onClaim = async () => {
  if (!canClaims.value) {
    return
  }

  await claimReloadMutate({
    currencyCode: claimToken.value,
  })
}

onActivateReloadDone(() => {
  refetch()
  onClaim()
  isClaimAsWell.value = true
})

onActivateReloadError(() => {
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: activateReloadError.value?.message,
  })
})

onClaimReloadDone(() => {
  if (isClaimAsWell.value) {
    useGeneralNotify({
      type: 'success',
      title: 'Drip Activated and Claimed, Weekly Bonus is Ready!',
      description: `You've successfully claimed your ${formattedInterval.value} interval drip of ${fiatClaimVal.value}. Your weekly bonus is ready!`,
    })
  } else {
    useGeneralNotify({
      type: 'success',
      title: t('vip.drip-claimed'),
      description: t('vip.drip-claimed-txt', {
        nextInterval: formattedInterval.value,
        fiatClaimVal: fiatClaimVal.value,
      }),
    })
  }

  claimedVal.value = claimValRate.value

  refetch()
})

onClaimReloadError(() => {
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: claimReloadError.value?.message,
  })
})

const toggleHelpModal = () => {
  isHelpModalVisible.value = !isHelpModalVisible.value
}

onMounted(() => {
  onReFetchReload()
})
</script>
<template>
  <div
    v-if="isLoggedIn && !!me && !!vip"
    class="h-full"
  >
    <UnActivate
      v-if="!canUseDripFeature"
      :reload="reload"
    />
    <div
      v-else
      class="relative text-sm w-full h-full min-h-[250px] flex flex-col gap-2 md:gap-4"
    >
      <div
        class="flex gap-2 items-center group cursor-pointer"
        @click="toggleHelpModal"
      >
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-paragraph cursor-help hover:text-white"
          name="material-symbols:help-outline"
        />

        <span
          v-if="((!isReloadActivated && canActivateReload) || (!isReloadActivated && !canActivateReload))"
          class="text-white font-bold group-active:scale-95"
        >
          {{ t("vip.activate-drip") }}
        </span>

        <span
          v-else-if="isReloadActivated && !!vipReload.nextLimitClaimDate && !isExpired && !canActivateReload && !!activationAt && !canClaimReload"
          class="text-white font-bold group-active:scale-95"
        >
          Next Claim In
        </span>

        <span
          v-else
          class="text-white font-bold group-active:scale-95"
        >
          Claim Drip Bonus
        </span>
      </div>

      <div
        v-if="(!isReloadActivated && canActivateReload) || (!isReloadActivated && !canActivateReload)"
        class="w-full"
      >
        <IntervalSelect
          :vip-reload="vipReload"
        />
      </div>

      <div
        v-if="isReloadActivated && !!vipReload.nextLimitClaimDate && !isExpired && !canActivateReload && !!activationAt && !canClaimReload"
        class="w-full flex items-center justify-center"
      >
        <CountDownInterval
          v-if="nextInterval === 'TEN_MIN'"
          :remain-time-string="vipReload.nextLimitClaimDate"
          class="w-full max-w-[400px]"
          @timer:end="onReFetchReload"
        />

        <CountDown
          v-else
          :remain-time-string="vipReload.nextLimitClaimDate"
          class="w-full max-w-[400px]"
          @timer:end="onReFetchReload"
        />
      </div>

      <template v-if="!isExpired && isReloadActivated">
        <div
          class="w-full flex items-center justify-center rounded-md font-bold bg-green-950 gap-2 md:gap-4"
        >
          <div class="flex flex-col gap-2 items-center justify-center">
            <span class="text-lg md:text-2xl text-white font-extrabold leading-7 w-full flex items-center justify-center">
              {{ claimValRate > 0 ? Math.round((vipReload?.totalClaimed || 0) / claimValRate) : 0 }}
            </span>

            <div class="flex gap-1.5 items-center justify-center text-xs md:text-sm">
              {{ t('affiliate.claimed') }}
            </div>
          </div>

          <div class="flex flex-col gap-2 items-center justify-center">
            <span class="text-lg md:text-2xl text-white font-extrabold leading-7 w-full flex items-center justify-center">
              {{ fiatTotalClaimed }}
            </span>

            <div class="flex gap-1.5 items-center justify-center text-xs md:text-sm">
              {{ t('base.amount') }} {{ t('affiliate.claimed') }}
            </div>
          </div>
        </div>

        <div
          v-if="!canActivateReload && !!activationAt && canClaimReload"
          class="w-full flex flex-col gap-1 md:gap-2"
        >
          <div class="flex items-center justify-between font-bold w-full">
            <span class="text-sm text-paragraph">
              {{ t('vip.claim-curr') }}
            </span>
            <span
              v-if="!displayInfiatEnabled"
              class="text-sm text-paragraph"
            >
              {{ fiatClaimedVal }}
            </span>
            <span
              v-else
              class="text-sm text-paragraph"
            >
              {{ cryptoClaimedVal }}
            </span>
          </div>
          <div class="w-full">
            <ClaimTokensPopover
              v-model="claimToken"
              :fiat-usd-value="claimValRate"
            />
          </div>
        </div>
      </template>

      <div class="w-full mt-auto flex flex-col gap-1 md:gap-2">
        <template v-if="(!isReloadActivated && canActivateReload) || (!isReloadActivated && !canActivateReload)">
          <JButton
            v-if="canActivateReload && !activateReloadLoading"
            :disabled="!canActivateReload"
            :loading="activateReloadLoading"
            :variant="canActivateReload ? 'primary' : 'outline'"
            class="w-full text-white"
            @click="activateReload"
          >
            <span class="inline-block">
              {{ t('base.activate') }} & {{ t('base.claim') }}
            </span>
          </JButton>
          <JButton
            v-else
            disabled
            variant="outline"
            class="w-full text-white"
          >
            <span class="inline-block">
              {{ t('base.activate') }} & {{ t('base.claim') }}
            </span>
          </JButton>
        </template>

        <JButton
          v-else-if="canClaims && (isReloadActivated || (!isExpired && !canActivateReload && !!activationAt))"
          :disabled="!canClaims"
          :loading="claimReloadLoading"
          :variant="canClaimReload ? 'primary' : 'outline'"
          class="w-full text-white"
          @click="onClaim"
        >
          <span class="inline-block">
            {{ t('vip.claim-drip') }}
          </span>
        </JButton>

        <JButton
          v-else-if="(!isReloadActivated && !canActivateReload && !canClaimReload) || isExpired"
          :disabled="true"
          :loading="claimReloadLoading"
          class="w-full"
          variant="outline"
        >
          <span class="inline-block">
            {{ t('vip.meet-reqs-drip') }}
          </span>
        </JButton>

        <div
          v-if="!!reload.expiresAt && !isExpired"
          class="flex items-center justify-center gap-1 font-bold text-paragraph text-xxs md:text-xs"
        >
          Expires: {{ new Date(String(reload.expiresAt)).toUTCString() }}
        </div>
      </div>
    </div>
    <ClientOnly>
      <UModal
        v-model:open="isHelpModalVisible"
        class="w-11/12 sm:max-w-sm bg-brand p-2 sm:p-4"
        :default-open="isHelpModalVisible"
        @update:open="(v) => {
        if (!v) {
          isHelpModalVisible = false
        }
      }"
      >
        <template #content>
          <ReloadHelpModal @close:modal="toggleHelpModal" />
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
