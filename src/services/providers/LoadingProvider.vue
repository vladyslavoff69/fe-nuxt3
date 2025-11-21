<script lang="ts" setup>
import { v4 as uuid } from 'uuid'
import { SITE_LOADING, SITE_SETTINGS } from '~/constants'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import PageLoader from '~/components/molecules/common/PageLoader.vue'

const { isBodyMounted } = inject(SITE_SETTINGS)!
const initialRendering = ref(true)
const mounted = ref(false)
const loadings = ref<string[]>([])

const ready = computed<boolean>(
  () =>
    !initialRendering.value || (mounted.value && loadings.value.length === 0)
)

const onInitialRendering = (callback: () => void) => {
  if (initialRendering.value && import.meta.client) {
    callback()
  }
}

const addLoading = (maxTimeout = 2000) => {
  const loadingID = uuid()
  loadings.value = [...loadings.value, loadingID]
  const removeLoading = () => {
    loadings.value = loadings.value.filter(l => l !== loadingID)
  }

  // remove loading after max timeout
  useTimeoutFn(() => {
    removeLoading()
  }, maxTimeout)

  return removeLoading
}

const useAddLoading = (maxTimeout = 1000) => {
  const loadingID = uuid()

  const add = () => {
    loadings.value = [...loadings.value, loadingID]
    // remove loading after max timeout
    useTimeoutFn(() => {
      remove(0)
    }, maxTimeout)
  }

  const remove = (timeout = 0) => {
    useTimeoutFn(() => {
      loadings.value = loadings.value.filter(l => l !== loadingID)
    }, timeout)
  }

  const removeAll = (timeout = 0) => {
    useTimeoutFn(() => {
      loadings.value = loadings.value.filter(l => l !== loadingID)
    }, timeout)
  }

  return {
    add,
    remove,
    removeAll,
  }
}

watch(
  () => ready.value,
  (r) => {
    if (r) {
      initialRendering.value = false
    }
  },
  { immediate: true }
)

provide(SITE_LOADING, {
  addLoading,
  useAddLoading,
  mounted,
  ready,
  loadings,
  initialRendering,
  onInitialRendering,
})

onMounted(async () => {
  mounted.value = true
})

const [appParent] = useAutoAnimate({
  duration: 150
})
</script>
<template>
  <div
    ref="appParent"
    class="p-0 w-full h-full m-0"
  >
    <PageLoader v-if="!ready || !isBodyMounted" />
  </div>

  <slot />
</template>
