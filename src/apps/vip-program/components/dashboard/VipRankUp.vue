<script lang="ts" setup>
import { useMutation } from '@vue/apollo-composable'
import ClaimTokensPopover from './ClaimTokensPopover.vue'
import { SETUP_RANKUP_MUTATION } from '~/graphql'
import { AUTH, CURRENCY, PREFERENCE, THEME, UNRANKED_VIP, VIP } from '~/constants'
import type { ClaimInterval } from '~/types'
import VipRankImg from '~/components/molecules/table/details/VipRankImg.vue'
import LazyIncremental from '~/apps/vip-program/components/dashboard/rank/Incremental.vue'
import RankUpHelpModal from '~/apps/vip-program/components/dashboard/rank/RankUpHelpModal.vue'
import CloseButton from '~/components/molecules/button/CloseButton.vue'
import { numberWithCommas } from '~/utils'

const { t } = useI18n()
const { vip } = inject(VIP)!
const { isLoggedIn, me }: any = inject(AUTH)!
const { screen } = inject(THEME)!
const dualRank = computed(() => (vip.value?.dualRank))
const { activeCryptoCode, displayInfiatEnabled, activeFiatCode } = inject(PREFERENCE)!
const { cryptoToUsd, usdToFiat, displayFiatAmount, displayCryptoAmount } = inject(CURRENCY)!
const nextClaimInterval = ref<ClaimInterval>(dualRank.value?.nextClaimInterval)
const claimToken = ref<string>(activeCryptoCode.value || 'BTC')
const isSettingsOpen = ref<boolean>(false)
const isHelpModalVisible = ref<boolean>(false)
const TYPE_OPTIONS = [
  { value: 'incremental', label: t('vip.auto') },
  { value: 'traditional', label: t('vip.manual') }
]
const fiatBonusValue = computed(() => displayFiatAmount(usdToFiat.value[activeFiatCode.value] * (dualRank.value?.bonusPerClaim || 0)))
const cryptoBonusValue = computed(() =>
  displayCryptoAmount(
    (dualRank.value?.bonusPerClaim || 0) / cryptoToUsd.value[claimToken.value],
    claimToken.value,
  ),
)
const canClaimRankUp = computed(() => dualRank.value?.canClaimRankUp || false)

const {
  loading: setupRankupLoading,
  onDone: onSetupRankupDone,
  onError: onSetupRankupError,
  mutate: setupRankupMutate,
} = useMutation(SETUP_RANKUP_MUTATION)

const openSettings = () => {
  isSettingsOpen.value = true
}

const handleSubmit = async () => {
  if (setupRankupLoading.value) {
    return
  }
  await setupRankupMutate({
    interval: nextClaimInterval.value,
  })
}

onSetupRankupDone(({ data }) => {
  if (nextClaimInterval.value === 'incremental') {
    isSettingsOpen.value = false
    useGeneralNotify({
      type: 'success',
      title: t('vip.incremental-success'),
      description: t('vip.incremental-success-txt')
    })
  }
  if (nextClaimInterval.value === 'traditional') {
    isSettingsOpen.value = false
    useGeneralNotify({
      type: 'success',
      title: t('vip.traditional-success'),
      description: t('vip.traditional-success-txt')
    })
  }
  nextClaimInterval.value = data.setupRankup.nextClaimInterval
})

onSetupRankupError(() => {
  useGeneralNotify({
    type: 'error',
    title: t('notifications.error'),
    description: t('errors.SOMETHING_WENT_WRONG')
  })
})

const openHelpModal = () => {
  isHelpModalVisible.value = true
}

const onCloseModal = () => {
  isHelpModalVisible.value = false
  isSettingsOpen.value = false
}
</script>
<template>
  <div
    v-if="isLoggedIn && !!me && !!vip"
    class="bg-green-950 p-4 rounded-md flex flex-col gap-y-4"
  >
    <div class="flex items-center w-full justify-between">
      <NuxtLinkLocale
        class="mr-2.5 cursor-pointer group text-lg"
        @click="openHelpModal"
      >
        <div class="flex items-center gap-2.5 group-active:scale-95 font-bold">
          <span class="text-white">
            {{ t("vip.rank-up-bonus") }}
          </span>
          <UIcon
            class="w-4 h-4 min-w-4 min-h-4 text-paragraph cursor-help hover:text-white"
            name="material-symbols:help-outline"
          />
        </div>
      </NuxtLinkLocale>
      <NuxtLinkLocale
        class="cursor-pointer group text-lg"
        @click="openSettings"
      >
        <div class="inline-block group-active:scale-95">
          <UIcon
            class="w-4 h-4 min-w-4 min-h-4 text-paragraph cursor-help hover:text-white"
            name="material-symbols:settings"
          />
        </div>
      </NuxtLinkLocale>
    </div>
    <div
      v-if="canClaimRankUp"
      class="w-full flex flex-col gap-2.5"
    >
      <div class="flex justify-between text-sm text-paragraph">
        <span class="font-bold">
          {{ screen.md ? t('vip.bonus-claim-curr') : t('vip.claim-curr') }}
        </span>
        <span class="font-bold">
          {{ displayInfiatEnabled ? cryptoBonusValue : fiatBonusValue }}
        </span>
      </div>
      <div class="w-full bg-midnight-express-color rounded-md">
        <ClaimTokensPopover
          v-model="claimToken"
          :fiat-usd-value="dualRank?.bonusPerClaim"
        />
      </div>
    </div>
    <div class="w-full relative">
      <JProgressBar
        :max="100"
        :value="(dualRank?.percentage || 0)"
        class="rounded-lg! border-none! h-10! bg-brand!"
        color="bg-border"
      >
        <span class="flex items-center justify-end text-white text-sm w-full font-semibold pr-2">
          {{ Math.round((dualRank?.percentage || 0) * 10) / 10 }}%
        </span>
      </JProgressBar>
      <DelayHydration>
        <LazyIncremental
          v-if="dualRank?.claimInterval !== 'traditional'"
          class="z-1"
          :claim-token="claimToken"
          :vip-render-data="dualRank"
          hydrate-on-visible
        />
      </DelayHydration>
    </div>
    <div class="flex justify-between text-sm">
      <div class="flex items-center gap-1">
        <VipRankImg
          :vip-level-name="dualRank?.vipLevel || UNRANKED_VIP"
          class="rounded-full w-4"
        />
        {{ numberWithCommas(dualRank?.xp, 0) }} XP
      </div>
      <div class="flex items-center gap-1">
        <VipRankImg
          :vip-level-name="dualRank?.upcomingRank?.level_name || UNRANKED_VIP"
          class="rounded-full w-4"
        />
        {{ numberWithCommas(dualRank?.upcomingRank?.xp_threshold, 0) }}
        XP
      </div>
    </div>
    <ClientOnly>
      <UModal
        v-model:open="isHelpModalVisible"
        class="w-11/12 sm:w-[400px] bg-brand p-2 sm:p-4"
        :default-open="isHelpModalVisible"
        @update:open="(v) => {
        if (!v) {
          onCloseModal()
        }
      }"
      >
        <template #content>
          <RankUpHelpModal @close:modal="onCloseModal" />
        </template>
      </UModal>
    </ClientOnly>
    <ClientOnly>
      <UModal
        v-model:open="isSettingsOpen"
        class="w-11/12 sm:w-[400px] bg-brand p-2 sm:p-4"
        :default-open="isSettingsOpen"
        @update:open="(v) => {
        if (!v) {
          onCloseModal()
        }
      }"
      >
        <template #content>
          <div class="text-left">
            <div class="flex justify-between items-center w-full border-b border-border pb-4 mb-4">
              <div class="text-base gap-2 font-bold flex items-center">
                <UIcon
                  class="w-5 h-5 text-paragraph cursor-help hover:text-white"
                  name="material-symbols:settings-rounded"
                />
                <span class="text-white">
                {{ t('vip.rank-up-setting') }}
              </span>
              </div>
              <CloseButton
                class="w-3 h-3 min-w-3 min-h-3"
                @click="onCloseModal"
              />
            </div>
            <div class="text-sm flex flex-col gap-2.5">
              <div class="text-white font-bold">
                {{ t('vip.claim-style') }}
              </div>
              <URadioGroup
                v-model="nextClaimInterval"
                default-value="incremental"
                :items="TYPE_OPTIONS"
                color="primary"
              />
              <JButton
                :disabled="!!setupRankupLoading"
                :loading="setupRankupLoading"
                class="text-white"
                type="submit"
                @click="handleSubmit"
              >
                {{ t('base.save') }}
              </JButton>
            </div>
          </div>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>
