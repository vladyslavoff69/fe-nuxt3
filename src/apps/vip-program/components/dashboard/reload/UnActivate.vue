<script lang="ts" setup>
import type { ReloadRank } from '~/types'
import { AUTH, VIP } from '~/constants'

defineProps<{
  reload: ReloadRank;
}>()

const { t } = useI18n()
const { isLoggedIn, me }: any = inject(AUTH)!
const { vip } = inject(VIP)!
</script>
<template>
  <div
    v-if="isLoggedIn && !!me && !!vip && vip?.vipLevel"
    class="flex flex-col items-center justify-center rounded-md gap-2 md:gap-4 bg-green-950 h-full"
  >
    <UIcon
      class="w-8 h-8 min-w-8 min-h-8 text-paragraph"
      name="material-symbols:lock"
    />

    <span class="text-white font-bold text-2xl">
      {{ t('vip.locked') }}
    </span>

    <div class="text-center">
      <div class="flex items-center">
        <UIcon
          :class="vip?.vipLevel?.order >= 2 ? 'text-primary' : 'text-disabled-paragraph'"
          class="w-5 h-5 min-w-5 min-h-5"
          name="material-symbols:check-circle"
        />
        <span
          :class="vip?.vipLevel?.order >= 2 ? 'text-white' : 'text-disabled-paragraph'"
          class="ml-2"
        >
          {{ t('vip.drip-req1') }}
        </span>
      </div>

      <div class="flex items-center">
        <UIcon
          class="w-5 h-5 min-w-5 min-h-5 text-primary"
          name="material-symbols:check-circle"
        />
        <span
          class="ml-2 text-white"
        >
          {{ t('vip.drip-req2') }}
        </span>
      </div>
    </div>

    <div class="font-bold text-white text-sm text-center">
      {{ t('vip.locked-txt') }}
    </div>

    <div class="p-3 sm:p-4 bg-form-input rounded-md w-full flex flex-col gap-y-2.5 text-sm">
      <div
        v-for="i in 3"
        :key="i"
        class="flex items-center gap-0.5"
      >
        <UIcon
          class="w-4 h-4 min-w-4 min-h-4 text-primary"
          name="material-symbols:add"
        />
        <span class="text-xs sm:text-sm text-nowrap">{{ t(`vip.drip-note${i}`) }}</span>
      </div>
    </div>
  </div>
</template>
