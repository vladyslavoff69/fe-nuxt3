<script lang="ts" setup>
import type { ReloadRank } from '~/types'
import { AUTH, VIP, VIP_DRIP } from '~/constants'
import CountDown from '~/components/molecules/common/CountDown.vue'

const props = defineProps<{
  reload: ReloadRank;
}>()

const { t } = useI18n()
const { refetch } = inject(VIP_DRIP)!
const vipReload = computed(() => props.reload)
const isReloadActivated = computed(() => vipReload.value.isReloadActivated)
const hasClaimedWeekly = computed(() => vipReload.value.hasClaimedWeekly)
const canClaimWeeklyBonus = computed(() => vipReload.value.canClaimWeeklyBonus)
const isExpired = computed(() => vipReload.value.isExpired)
const { isLoggedIn, me }: any = inject(AUTH)!
const { vip } = inject(VIP)!
</script>
<template>
  <div
    v-if="isLoggedIn && !!me && !!vip && vip?.vipLevel"
    class="flex flex-col items-center justify-center rounded-md gap-4 bg-green-950 h-full"
  >
    <UIcon
      class="w-8 h-8 min-w-8 min-h-8 text-paragraph"
      name="material-symbols:lock"
    />

    <span class="text-white font-bold text-2xl">
      {{ t('vip.locked') }}
    </span>

    <div
      v-if="(!isReloadActivated && !hasClaimedWeekly) || (isExpired && !canClaimWeeklyBonus && hasClaimedWeekly)"
      class="font-bold text-white text-sm text-center"
    >
      {{ t('vip.locked-txt') }}
    </div>

    <CountDown
      v-else
      :remain-time-string="vipReload?.expiresAt || ''"
      class="w-full max-w-[400px]"
      @timer:end="refetch"
    />
  </div>
</template>
