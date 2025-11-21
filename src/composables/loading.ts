import { v4 as uuid } from 'uuid'

export const useLoading = (props: { level: number; timeout: number }) => {
  const nuxtApp = useNuxtApp()
  const pageRendering = ref(true)
  const loadings = ref<string[]>([])
  const ready = computed(
    () => !pageRendering.value && loadings.value.length === 0
  )

  const stopStartHook = nuxtApp.hook('page:start', (e) => {
    if (e?.props?.level === props.level) {
      pageRendering.value = true
    }
  })

  const stopFinishHook = nuxtApp.hook('page:finish', (e) => {
    if (e?.props?.level === props.level) {
      setTimeout(() => {
        pageRendering.value = false
      }, props.timeout)
    }
  })

  const addLoading = (maxTimeout = 3000) => {
    const loadingID = uuid()
    loadings.value = [...loadings.value, loadingID]
    const removeLoading = () => {
      loadings.value = loadings.value.filter(l => l !== loadingID)
    }
    // remove loading after max timeout
    setTimeout(() => {
      removeLoading()
    }, maxTimeout)

    return removeLoading
  }

  const useAddLoading = (maxTimeout = 3000) => {
    const loadingID = uuid()

    const add = () => {
      loadings.value = [...loadings.value, loadingID]
      // remove loading after max timeout
      setTimeout(() => {
        remove()
      }, maxTimeout)
    }

    const remove = (timeout = 0) => {
      setTimeout(() => {
        loadings.value = loadings.value.filter(l => l !== loadingID)
        pageRendering.value = !!(loadings.value && loadings.value.length)
      }, timeout)
    }

    const removeAll = (timeout = 0) => {
      setTimeout(() => {
        loadings.value = []
        pageRendering.value = false
      }, timeout)
    }

    return {
      add,
      remove,
      removeAll,
    }
  }

  onBeforeUnmount(() => {
    stopStartHook()
    stopFinishHook()
  })

  onMounted(() => {
    setTimeout(() => {
      pageRendering.value = false
    }, props.timeout)
  })

  return {
    addLoading,
    useAddLoading,
    loadings,
    ready,
  }
}

export const useInitialLoading = (
  loading: Ref<boolean>,
  timeout = 300
): ComputedRef<boolean> => {
  const initialLoading = ref(true)

  const timeoutHandler = setTimeout(() => {
    initialLoading.value = false
  }, timeout)

  onBeforeUnmount(() => {
    clearTimeout(timeoutHandler)
  })

  return computed(() => loading.value || initialLoading.value)
}
