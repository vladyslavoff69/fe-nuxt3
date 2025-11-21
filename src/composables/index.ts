export * from './auth/authentication'
export * from './base'
export * from './charity'
export * from './element'
export * from './fairness'
export * from './fingerprints'
export * from './game'
export * from './loading'
export * from './modal'
export * from './parser'
export * from './policies'
export * from './promos'
export * from './route'
export * from './screenshare/liveStream'
export * from './walletAddress'
export * from './useCrisp'
export * from './useVoiceChat'
export * from './useWebSocket'

export const useTickCallback = (
  callback: () => void,
  tickInterval: number
): {tickCallback: () => void} => {
  let invokedAt = 0

  const tickCallback = () => {
    const now = Date.now()
    if (now - invokedAt >= tickInterval) {
      callback()
      invokedAt = now
    }
  }

  return {
    tickCallback,
  }
}

export const useComputeTimeLeft = (timeLeft: Ref<number>): ComputedRef<{
  fTimeLeft: string, days: number, hours: number, minutes: number, seconds: number
}> => {
  return computed(() => {
    let timeLeftBase = timeLeft.value
    let fTimeLeft = ''
    let days = 0
    let hours = 0
    let minutes = 0
    let seconds = 0
    // seconds
    if (timeLeftBase > 0) {
      seconds = timeLeftBase % 60
      fTimeLeft = `${twoNumbers(seconds)}`
      timeLeftBase = (timeLeftBase - (timeLeftBase % 60)) / 60
    }
    // minutes
    if (timeLeftBase > 0) {
      minutes = timeLeftBase % 60
      fTimeLeft = `${twoNumbers(minutes)}:${fTimeLeft}`
      timeLeftBase = (timeLeftBase - (timeLeftBase % 60)) / 60
    }
    // hours
    if (timeLeftBase > 0) {
      hours = timeLeftBase % 24
      fTimeLeft = `${twoNumbers(hours)}:${fTimeLeft}`
      timeLeftBase = (timeLeftBase - (timeLeftBase % 24)) / 24
    }
    // days
    if (timeLeftBase > 0) {
      days = timeLeftBase
      fTimeLeft = `${timeLeftBase}:${fTimeLeft}`
    }

    return { fTimeLeft, days, hours, minutes, seconds }
  })
}

export const useCountDown = (
  datetime: string | Ref<string>
): {
  timeLeft: Ref<number>;
  timeLeftFormatted: ComputedRef<string>;
  onEndTimeout: (fn: Function) => void;
  timeLeftItems: ComputedRef<{
    fTimeLeft: string;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>;
} => {
  const endCallbacks: Function[] = []
  const endAt = toRef(datetime)
  const timeLeft = ref(0)

  const timeLeftItems: ComputedRef<{
    fTimeLeft: string, days: number, hours: number, minutes: number, seconds: number
  }> = useComputeTimeLeft(timeLeft)

  const onEndTimeout = (fn: Function) => {
    endCallbacks.push(fn)
  }

  const { pause, resume } = useIntervalFn(() => {
    timeLeft.value = Math.max(timeLeft.value - 1, 0)
    if (timeLeft.value <= 0) {
      pause()
      endCallbacks.forEach((fn) => {
        fn()
      })
    }
  }, 1000)

  onBeforeUnmount(() => {
    pause()
  })

  watch(
    () => endAt.value,
    (endAtValue) => {
      pause()
      timeLeft.value = Math.max(
        Math.floor((new Date(endAtValue).getTime() - Date.now()) / 1000),
        0
      )
      resume()
    },
    { immediate: true }
  )

  return {
    timeLeftFormatted: computed(() => timeLeftItems.value.fTimeLeft),
    timeLeft,
    onEndTimeout,
    timeLeftItems,
  }
}

export const useRegionBlock = () => {
  const getRegionData = async () => {
    const re = await fetch('https://www.cloudflare.com/cdn-cgi/trace')

    return (await re.text())?.trim()?.split('\n').reduce((obj, pair) => {
      const paired = pair.split('=')
      obj[paired[0]] = paired[1]

      return obj
    }, {})
  }

  return {
    getRegionData
  }
}

export const useMaintenanceMode = () => {
  const runtimeConfig = useRuntimeConfig()

  const getStatusCheck = async () => {
    const re = await fetch(`${runtimeConfig.public?.graphqlBaseUrl}/data/sports/ping`)

    return await re.json()
  }

  return {
    getStatusCheck
  }
}
