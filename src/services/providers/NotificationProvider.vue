<script lang="ts" setup>
import { AUTH, NOTIFICATION } from '~/constants'
import { MARK_NOTIFICATIONS_AS_READ_MUTATION, NOTIFICATIONS_QUERY, USER_NOTIFICATION_SUBSCRIPTION } from '~/graphql'
import { type Notification as NotificationDataType, NotificationType, } from '~/types/notification'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const { isLoggedIn } = inject(AUTH)!
const { parseHtmlStringToVNode } = useParseTextToHtml()
const searchOptions = reactive({
  orderBy: [
    {
      column: 'CREATED_AT',
      order: 'DESC',
    },
  ],
  first: 20,
  page: 1,
})
const requestSystemParam = computed(() => {
  return {
    type: [NotificationType.SYSTEM],
    ...searchOptions,
  }
})
const requestUserParam = computed(() => {
  return {
    type: [NotificationType.WALLET, NotificationType.USER],
    ...searchOptions,
  }
})
const {
  loading: systemNotificationsLoading,
  result: systemNotificationsResult,
  refetch: refetchSystemNotifications,
  fetchMore: fetchMoreSystemNotify,
  subscribeToMore: subscribeToMoreSystemNotifications,
  options: systemNotifyOptions,
} = useQuery<{
  userNotification: NotificationDataType;
  notifications: { paginatorInfo: any, data: NotificationDataType[] };
}>(NOTIFICATIONS_QUERY, requestSystemParam.value, {
  fetchPolicy: 'network-only',
  enabled: false
})

const {
  loading,
  result,
  refetch: refetchUserNotifications,
  fetchMore: fetchMoreUserNotify,
  subscribeToMore,
  options: userNotifyOptions,
} = useQuery<{
  userNotification: NotificationDataType;
  notifications: { paginatorInfo: any, data: NotificationDataType[] };
}>(NOTIFICATIONS_QUERY, requestUserParam.value, {
  fetchPolicy: 'network-only',
  enabled: false
})

const allNotifications = computed(() => [
  ...(result.value?.notifications?.data || []),
  ...(systemNotificationsResult.value?.notifications?.data || []),
])
const userNotifications = computed(() => result.value?.notifications?.data || [])
// @ts-ignore
const userNotificationPaginatorInfo = computed(() => result.value?.notifications?.paginatorInfo)
const systemNotifications = computed(() => systemNotificationsResult.value?.notifications?.data || [])
// @ts-ignore
const systemNotificationPaginatorInfo = computed(() => systemNotificationsResult.value?.notifications?.paginatorInfo)
const unreadNotifications = computed(() => allNotifications.value.filter(n => !n.read_at))
const unreadNotificationsNumber = computed(() => unreadNotifications.value.length)
const hasUnreadNotifications = computed(() => unreadNotifications.value.length > 0)
const isLoading = computed(() => (loading.value || systemNotificationsLoading.value))
const selectedTab = ref('user')

const {
  mutate: readNotificationMutate,
  onDone: doneMarkAllAsReadMutation,
} = useMutation(MARK_NOTIFICATIONS_AS_READ_MUTATION)

const refetchAllNotifications = () => {
  refetchUserNotifications()
  refetchSystemNotifications()
}

const fetchMoreSystemNotifications = (page: number) => {
  requestSystemParam.value.page = page
  fetchMoreSystemNotify({
    variables: { ...requestSystemParam.value },
    // @ts-ignore
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult) {
        return previousResult
      }

      return {
        notifications: {
          ...previousResult?.notifications,
          paginatorInfo: {
            ...fetchMoreResult?.notifications?.paginatorInfo,
          },
          data: [
            ...(previousResult?.notifications?.data || []),
            ...(fetchMoreResult?.notifications?.data || []),
          ],
        },
      }
    },
  })
}

const fetchMoreUserNotifications = (page: number) => {
  requestUserParam.value.page = page
  fetchMoreUserNotify({
    variables: { ...requestUserParam.value },
    // @ts-ignore
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult) {
        return previousResult
      }
      return {
        notifications: {
          ...previousResult?.notifications,
          paginatorInfo: {
            ...fetchMoreResult?.notifications?.paginatorInfo,
          },
          data: [
            ...(previousResult?.notifications?.data || []),
            ...(fetchMoreResult?.notifications?.data || []),
          ],
        },
      }
    },
  })
}

const isOpen = computed(() => {
  return route.query.drawer === 'notification'
})
const isOpenMobile = ref(false)

const closeNotification = () => {
  navigateRoute({
    oldQueries: ['drawer']
  })

  isOpenMobile.value = false
}

const openNotification = () => {
  navigateRoute({
    newQueries: { drawer: 'notification' }
  })

  isOpenMobile.value = false
}

doneMarkAllAsReadMutation(async () => {
  closeNotification()
  refetchSystemNotifications()
})

const handleMarkAllAsRead = (notificationsId) => {
  // Mark as read for fetched notifications
  readNotificationMutate({ notificationIds: [...notificationsId] })
}

const subscribeNotification = () => {
  subscribeToMore({
    document: USER_NOTIFICATION_SUBSCRIPTION,
    // @ts-ignore
    updateQuery (prev, { subscriptionData }) {
      if (!subscriptionData.data) {
        return prev
      }

      if (subscriptionData.data?.userNotification?.title === 'WEEKLY_BONUS') {
        return prev
      }

      if (
        subscriptionData.data?.userNotification.notification_type === NotificationType.SYSTEM
      ) {
        return prev
      }

      const vNodeDescription = h('div', {}, parseHtmlStringToVNode(subscriptionData.data?.userNotification?.message || ''))
      useGeneralNotify({
        type: 'success',
        title: subscriptionData.data?.userNotification?.title,
        description: vNodeDescription
      })

      return {
        notifications: {
          ...prev.notifications,
          data: [
            subscriptionData.data?.userNotification,
            ...prev.notifications.data,
          ],
        },
      }
    },
  })

  subscribeToMoreSystemNotifications({
    document: USER_NOTIFICATION_SUBSCRIPTION,
    // @ts-ignore
    updateQuery (prev, { subscriptionData }) {
      if (!subscriptionData.data) {
        return prev
      }

      if (
        subscriptionData.data?.userNotification.notification_type !== NotificationType.SYSTEM
      ) {
        return prev
      }

      const vNodeDescription = h('div', {}, parseHtmlStringToVNode(subscriptionData.data?.userNotification?.message || ''))
      useGeneralNotify({
        type: 'success',
        title: subscriptionData.data?.userNotification?.title,
        description: vNodeDescription,
        timeout: 0,
        callback: () => {
          selectedTab.value = 'global'
          handleMarkAllAsRead([subscriptionData.data?.userNotification?.id])
        }
      })

      return {
        notifications: {
          ...prev.notifications,
          data: [
            subscriptionData.data?.userNotification,
            ...prev.notifications.data,
          ],
        },
      }
    },
  })
}

provide(NOTIFICATION, {
  isOpen,
  isOpenMobile,
  openNotification,
  closeNotification,
  checkHasNotification: refetchAllNotifications,
  unreadNotifications: unreadNotificationsNumber,
  hasNotifications: hasUnreadNotifications,
  fetchMoreSystemNotifications,
  fetchMoreUserNotifications,
  notificationLoading: isLoading,
  notifications: allNotifications,
  selectedTab,
  systemNotifications,
  systemPaginatorInfo: systemNotificationPaginatorInfo,
  userPaginatorInfo: userNotificationPaginatorInfo,
  userNotifications,
})

watch(
  () => isLoggedIn.value,
  (_isLogged) => {
    if (_isLogged) {
      // @ts-ignore
      systemNotifyOptions.enabled = true
      // @ts-ignore
      userNotifyOptions.enabled = true
      subscribeNotification()
    }
  }
)
</script>
<template>
  <slot />
</template>
