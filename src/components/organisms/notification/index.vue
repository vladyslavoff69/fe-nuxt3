<script lang="ts" setup>
import SystemNotificationList from '~/components/organisms/notification/SystemNotificationList.vue'
import UserNotificationList from '~/components/organisms/notification/UserNotificationList.vue'
import { NOTIFICATION } from '~/constants'
import CloseButton from '~/components/molecules/button/CloseButton.vue'

const { t } = useI18n()
const { closeNotification, selectedTab } = inject(NOTIFICATION)!
const tabs = [
  { label: t('base.global'), value: 'global' },
  { label: t('account.user'), value: 'user' },
]
const currentTab = computed({
  get () {
    return selectedTab.value
  },
  set (v) {
    selectedTab.value = v
  }
})
</script>
<template>
  <div
    class="w-full h-full flex flex-col transition-all duration-200 ease-in-out"
  >
    <div class="sticky top-0">
      <div
        class="flex items-center justify-between px-5 py-4 h-15 bg-brand"
      >
        <div class="font-bold text-white text-lg">
          {{ t('notifications.notifications') }}
        </div>
        <CloseButton
          class="w-4 md:w-4.5 h-4 md:h-4.5"
          @click="closeNotification"
        />
      </div>
      <div class="px-5 pt-4 md:pt-0">
        <UTabs
          v-model="currentTab"
          :items="tabs"
          size="xl"
          :ui="{
            list: 'bg-green-950'
          }"
        >
          <template #default="{ item }">
            <span class="text-center w-full z-1">
              {{ item?.label || '' }}
            </span>
          </template>
        </UTabs>
      </div>
    </div>
    <div class="flex-1 min-h-0 pb-2 bg-brand">
      <JbScrollbar
        class="pr-3.5 flex w-full flex-col p-5 items-start pl-5 h-full pb-5"
      >
        <SystemNotificationList v-if="currentTab === 'global'" />
        <UserNotificationList v-else />
      </JbScrollbar>
    </div>
  </div>
</template>
