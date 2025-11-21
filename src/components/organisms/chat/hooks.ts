export const useCountDown = (
  datetime: string
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
  const timeLeft = ref(
    Math.max(Math.round((new Date(datetime).getTime() - Date.now()) / 1000), 0)
  )

  const timeLeftItems: ComputedRef<{
    fTimeLeft: string, days: number, hours: number, minutes: number, seconds: number
  }> = useComputeTimeLeft(timeLeft)

  const onEndTimeout = (fn: Function) => {
    endCallbacks.push(fn)
  }

  let interval: NodeJS.Timeout
  onMounted(() => {
    interval = setInterval(() => {
      timeLeft.value = Math.max(timeLeft.value - 1, 0)
      if (timeLeft.value <= 0) {
        clearInterval(interval!)
        endCallbacks.forEach((fn) => {
          fn()
        })
      }
    }, 1000)
  })

  onBeforeUnmount(() => {
    clearInterval(interval!)
  })

  return {
    timeLeftFormatted: computed(() => timeLeftItems.value.fTimeLeft),
    timeLeft,
    onEndTimeout,
    timeLeftItems
  }
}
