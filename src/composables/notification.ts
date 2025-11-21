type NOTIFICATION_SCHEMA = {
  type: 'error' | 'success' | 'warning' | 'info',
  title: string,
  description?: any,
  color?: string,
  border?: string,
  background?: string,
  icon?: string,
  timeout?: number
  actions?: any[]
  avatar?: any
  callback?: () => void;
  click?: () => void;
}

const textColors = {
  error: 'text-red-600!',
  success: 'text-primary!',
  warning: 'text-orange-600!',
  info: 'text-paragraph!',
}

export const useGeneralNotify = (
  {
    type,
    title,
    description,
    icon,
    timeout,
    actions,
    avatar,
    callback,
    click
  }: NOTIFICATION_SCHEMA
) => {
  const toast = useToast()
  const iconStr = icon || (type === 'success' ? 'i-heroicons-check-badge' : 'i-heroicons-information-circle-20-solid')

  toast.add({
    title,
    description,
    icon: iconStr,
    duration: timeout !== 0 ? (timeout || 6000) : 0,
    actions: actions || [],
    avatar: avatar || null,
    color: type,
    close: {
      onClick: () => {
        if (typeof callback === 'function') {
          callback()
        }

        if (typeof click === 'function') {
          click()
        }
      }
    },
    ui: {
      title: textColors[type]
    }
  })
}
