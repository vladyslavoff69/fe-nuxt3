type Size = {
  width: Ref<number>;
  height: Ref<number>;
}

type Rect = Size & {
  top: Ref<number>;
  left: Ref<number>;
  bottom: Ref<number>;
  right: Ref<number>;
}

type RectApplicable = Rect & { ready: Ref<boolean> }

export const useElementRect = (
  elementRef: Ref<HTMLDivElement | null | undefined>
): RectApplicable => {
  const width = ref<number>(
    elementRef.value?.getBoundingClientRect().width || 0
  )
  const height = ref<number>(
    elementRef.value?.getBoundingClientRect().height || 0
  )
  const top = ref<number>(elementRef.value?.getBoundingClientRect().top || 0)
  const left = ref<number>(elementRef.value?.getBoundingClientRect().left || 0)
  const bottom = ref<number>(
    elementRef.value?.getBoundingClientRect().bottom || 0
  )
  const right = ref<number>(
    elementRef.value?.getBoundingClientRect().right || 0
  )

  const ready = ref<boolean>(!!elementRef.value)
  let observer: ResizeObserver | null = null

  const handleResize = ([entry]: ResizeObserverEntry[]) => {
    const rect = entry.target.getBoundingClientRect()
    width.value = rect.width
    height.value = rect.height
    top.value = rect.top
    left.value = rect.left
    bottom.value = rect.bottom
    right.value = rect.right
    ready.value = true
  }

  const cleanup = () => {
    ready.value = false
    observer?.disconnect()
    observer = null
  }

  const stopWatchElement = watch(
    () => elementRef.value,
    (element) => {
      cleanup()

      if (element) {
        observer = new ResizeObserver(handleResize)
        observer.observe(element)
      }
    },
    { immediate: true, flush: 'post' }
  )

  onBeforeUnmount(() => {
    stopWatchElement()
    cleanup()
  })

  return {
    width,
    height,
    top,
    bottom,
    left,
    right,
    ready
  }
}
