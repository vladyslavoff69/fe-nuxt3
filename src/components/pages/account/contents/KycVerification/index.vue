<script lang="ts" setup>
import KycLevelOne from '~/components/pages/account/contents/KycVerification/KycLevelOne.vue'
import { AUTH } from '~/constants'

const { isLoggedIn, me } = inject(AUTH)!
const { t } = useI18n()
const tabs = [
  { label: `${t('base.level')} 1`, value: 'level-1' },
  { label: `${t('base.level')} 2`, value: 'level-2', disabled: true },
  { label: `${t('base.level')} 3`, value: 'level-3', disabled: true }
]
const selectedTab = ref('level-1')
</script>

<template>
  <div
    v-if="isLoggedIn && !!me"
    class="flex flex-col gap-y-5"
  >
    <div class="flex flex-col gap-y-2">
      <div class="flex items-center justify-between">
        <h2 class="text-xl sm:text-[22px] font-bold leading-7 sm:leading-8">
          {{ t('account.kyc-verification') }}
        </h2>
        <div class="flex items-center gap-x-0.5 text-red-500">
          <UIcon
            class="w-4 h-4 mb-0.5"
            name="ic:round-warning"
          />
          <span class="text-sm leading-5">
            {{ t('account.action-required') }}
          </span>
        </div>
      </div>
      <p class="text-sm leading-4">
        {{ t('account.kyc-verification-desc') }}
      </p>
    </div>
    <div class="grid grid-cols-1 gap-y-4">
      <JTabs
        v-model="selectedTab"
        :tabs="tabs"
        class="w-full sm:w-auto mr-2"
        width="auto"
      />

      <KycLevelOne v-if="selectedTab === 'level-1'" />
    </div>
  </div>
</template>
