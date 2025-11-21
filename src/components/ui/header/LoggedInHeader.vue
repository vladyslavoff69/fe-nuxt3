<script lang="ts" setup>
import AccountPopover from '~/components/organisms/header/AccountPopover.vue'
import AccountUtilsBox from '~/components/organisms/header/AccountUtilsBox.vue'
import { DAILY_FREE_SPIN } from '~/constants'
import CountDown from '~/components/molecules/common/CountDown.vue'

const { dailyFreeSpin } = inject(DAILY_FREE_SPIN)!

const isNotExpired = computed(() => Math.max(
  Math.floor((new Date(dailyFreeSpin.value?.daily_spin_next_claim).getTime() - Date.now()) / 1000),
  0
))

const router = useRouter()
const route = useRoute()

const openVipPerks = () => {
  router.push({
    path: router.currentRoute.value.path,
    query: {
      ...route.query,
      modal: 'vip',
      tab: 'dailySpin',
    },
  })
}
</script>

<template>
  <div class="flex items-center justify-end gap-x-1 md:gap-x-3">
    <ClientOnly>
      <div
        class="w-full ml-auto flex items-center bg-transparent sm:bg-brand rounded-md cursor-pointer justify-center"
        :class="{
          'pl-0 sm:pl-1': !!isNotExpired
        }"
        @click="openVipPerks"
      >
        <NuxtImg
          src="9de9f369-80e4-4d91-d805-01cf37b77900/thumb"
          provider="cloudflare"
          loading="lazy"
          alt="Daily Free Spin"
          class="w-10 h-10"
        />
        <NuxtImg
          v-if="dailyFreeSpin.canClaimDailySpins || !isNotExpired"
          alt="Ray"
          class="absolute w-20 h-20 z-1"
          loading="lazy"
          src="/assets/img/games/casino/Rays-animated.svg"
        />
        <CountDown
          v-if="!!isNotExpired"
          :remain-time-string="dailyFreeSpin?.daily_spin_next_claim || ''"
          :day-hidden="true"
          :label-hidden="true"
          font-size="text-xxs sm:text-sm"
          class="w-[127px]! py-1! h-10 items-center hidden sm:flex bg-brand!"
        />
      </div>
    </ClientOnly>

    <div class="w-auto relative">
      <AccountPopover />
    </div>

    <AccountUtilsBox />
  </div>
</template>
