<script lang="ts" setup>
const { initialState = false } = defineProps<{
  initialState?: boolean;
}>()

const contentRef = ref()
const { ready, height } = useElementRect(contentRef)

const state = ref(initialState)
const setState = (v: any) => {
  state.value = v
  transitioning.value = true
}

const transitioning = ref<boolean>(false)
const style = computed(() => {
  if (!ready.value) {
    return {}
  }

  return {
    height: `${height.value}px`,
  }
})

watch(
  () => initialState,
  (value) => {
    state.value = value
  },
)
</script>
<template>
  <div class="JTransitionHeight">
    <div
      :style="style"
      class="overflow-hidden transition-all duration-100 ease-in-out"
      @transitionend="transitioning = false"
      @transitionstart="transitioning = true"
    >
      <div
        ref="contentRef"
        class="p-0"
      >
        <slot
          :set-state="setState"
          :state="state"
          :transitioning="transitioning"
        />
      </div>
    </div>
  </div>
</template>
