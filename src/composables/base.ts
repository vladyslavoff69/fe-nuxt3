import { VIP_LEVEL_MAP } from '~/constants'

export const useGraphqlError = (
  error: Ref<any>
): ComputedRef<{ [key in string]: string }> => {
  return computed(() => {
    const { validation, message } = parseGraphqlError(error.value)
    return {
      message,
      ...validation
    }
  })
}

export const useCountdown = (remainingTime: number) => {
  let remain: number = remainingTime / 1000
  let secs: number = 0
  let minutes: number = 0
  let hours: number = 0
  let days: number = 0

  if (remain > 0) {
    secs = remain % 60
    remain = (remain - secs) / 60
  }

  if (remain > 0) {
    minutes = remain % 60
    remain = (remain - minutes) / 60
  }

  if (remain > 0) {
    hours = remain % 24
    remain = (remain - hours) / 24
  }

  if (remain > 0) {
    days = remain
  }

  return { days, hours, minutes, secs }
}

export const useTwoNumber = (num: number): string | number => {
  return Math.floor(num) < 10 ? `0${num.toFixed(0)}` : num.toFixed(0)
}

export const useVipLevelXp = (vipLevelName: string) => {
  if (vipLevelName && vipLevelName !== '') {
    const index = VIP_LEVEL_MAP[vipLevelName.toUpperCase()]?.index || 0

    if (index > -1) {
      return ((100 / 18) * index).toFixed(2)
    }
  }

  return 0.00
}

export const useCheckImageUrl = async (url: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = url
  })
}
