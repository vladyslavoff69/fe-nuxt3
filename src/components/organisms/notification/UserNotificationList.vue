<script lang="ts" setup>
import UserNotification from './UserNotification.vue'
import UserNotificationSkeleton from './UserNotificationSkeleton.vue'
import { NOTIFICATION } from '~/constants'
import { MARK_NOTIFICATIONS_AS_READ_MUTATION } from '~/graphql'

const { t } = useI18n()
const {
  mutate: readNotificationMutate,
  onDone: doneMarkAllAsReadMutation,
  loading: mutationLoading,
} = useMutation(MARK_NOTIFICATIONS_AS_READ_MUTATION)
const {
  checkHasNotification,
  userNotifications,
  fetchMoreUserNotifications,
  userPaginatorInfo,
  notificationLoading,
} = inject(NOTIFICATION)!

const filteredNotifications = computed(() => userNotifications.value || [])
const unreadNotifications = computed(() => filteredNotifications.value.filter(n => !n.read_at))
const notificationsIds = computed(() => unreadNotifications.value.map(n => n.id))
const loading = computed(() => notificationLoading.value || mutationLoading.value)

doneMarkAllAsReadMutation(async () => {
  checkHasNotification()
})

const handleMarkAllAsRead = () => {
  // Mark as read for fetched notifications
  if (notificationsIds && notificationsIds.value.length > 0) {
    readNotificationMutate({ notificationIds: [...notificationsIds.value] })
  }
}

const handleShowMore = () => {
  fetchMoreUserNotifications(userPaginatorInfo.value.currentPage + 1)
}
</script>
<template>
  <div class="w-full">
    <div
      v-if="loading"
      class="min-h-full w-full"
    >
      <UserNotificationSkeleton
        v-for="i in 8"
        :key="i"
        class="mb-2.5"
      />
    </div>
    <div
      v-if="!loading && filteredNotifications?.length"
      class="flex flex-col gap-5 md:gap-[15px] w-full"
    >
      <div class="flex justify-between w-full font-bold">
        <p class="text-sm text-white">
          {{ t('base.newest') }}
        </p>
        <JbBlankButton
          v-if="unreadNotifications.length"
          class="text-sm hover:text-white duration-150"
          @click="handleMarkAllAsRead"
        >
          {{ t('notifications.mark-all-read') }}
        </JbBlankButton>
      </div>
      <template
        v-for="(data, index) in filteredNotifications"
        :key="index"
      >
        <UserNotification :data="data" />
      </template>
      <template v-if="filteredNotifications.length >= 20">
        <JButton @click="handleShowMore">
          {{ t('base.show-more') }}
        </JButton>
      </template>
    </div>
    <div
      v-if="!filteredNotifications?.length && !loading"
      class="flex flex-col items-center justify-center min-h-[500px] w-full h-full pb-5 gap-y-2"
    >
      <NuxtImg
        class="mx-auto max-w-36"
        loading="lazy"
        provider="cloudflare"
        alt="Junglebet.com"
        src="/e1561a69-e904-4ffe-bae7-0d0a410e0d00/md"
      />
      <p class="italic">
        {{ t('notifications.no-user-notifications') }}
      </p>
    </div>
  </div>
</template>
