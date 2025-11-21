<script lang="ts" setup>
interface VueHorizontalData {
  left: number;
  width: number;
  scrollWidth: number;
  hasNext: boolean;
  hasPrev: boolean;
  startX: number;
  startY: number;
  touchScrolling: boolean;
}

const props = defineProps({
  roundClass: { type: String, default: '' },
  button: { type: Boolean, default: false },
  buttonBetween: { type: Boolean, default: true },
  scroll: { type: Boolean, default: true },
  responsive: { type: Boolean, default: false },
  displacement: { type: Number, default: 1.0 },
  snap: { type: String, default: 'start' },
  contentBoxClass: { type: Array, default: () => [] },
  hasAutoScrolling: { type: Boolean, default: false },
  innerContainerClass: { type: String, default: '' },
  getScrollBarRef: { type: Function, default: () => ({}) },
})

const emit = defineEmits(['scroll-debounce', 'prev', 'next', 'scroll'])

const scrollBarRef = ref<HTMLDivElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const contentBoxRef = ref<HTMLDivElement | null>(null)
const left = ref(0)
const width = ref(0)
const scrollWidth = ref(0)
const hasNext = ref(false)
const hasPrev = ref(false)
const startX = ref(0)
const startY = ref(0)
const touchScrolling = ref(false)
const totalCount = ref<number>(1)
let debounceId: ReturnType<typeof setTimeout> | undefined

const children = computed(() => {
  const contentBox = contentBoxRef.value
  if (!contentBox) {
    return [] as any[]
  }
  return contentBox?.children
})

const onTouchStart = (event: TouchEvent): void => {
  startX.value = event.touches[0].clientX
  startY.value = event.touches[0].clientY
  touchScrolling.value = true
}

const onTouchMove = (event: TouchEvent): void => {
  if (!touchScrolling.value) {
    return
  }

  const currentX = event.touches[0].clientX
  const currentY = event.touches[0].clientY

  const diffX = startX.value - currentX
  const diffY = startY.value - currentY

  if (Math.abs(diffX) > Math.abs(diffY)) {
    event.preventDefault()
    const container = containerRef.value as HTMLElement
    if (!container) {
      return
    }
    scrollToLeft(container.scrollLeft + diffX)
  } else {
    touchScrolling.value = false
  }
}

const onTouchEnd = (): void => {
  touchScrolling.value = false
}

const findPrevSlot = (x: number): Element | undefined => {
  const childrenList = children.value
  for (let i = 0; i < childrenList.length; i++) {
    const rect = childrenList[i].getBoundingClientRect()
    if (rect.left <= x && x <= rect.right) {
      return childrenList[i]
    }
    if (x <= rect.left) {
      return childrenList[i]
    }
  }
}

const findNextSlot = (x: number): Element | undefined => {
  const childrenList = children.value
  for (let i = 0; i < childrenList.length; i++) {
    const rect = childrenList[i].getBoundingClientRect()
    if (rect.right <= x) {
      continue
    }
    if (rect.left <= x) {
      return childrenList[i]
    }
    if (x <= rect.left) {
      return childrenList[i]
    }
  }
}

const prev = (): void => {
  emit('prev')

  const container = containerRef.value as HTMLElement
  if (!container) {
    return
  }

  const leftVal = container.getBoundingClientRect().left
  const x = leftVal + (container.clientWidth * -props.displacement)
  const element = findPrevSlot(x)

  if (element) {
    const widthVal = element.getBoundingClientRect().left - leftVal
    scrollToLeft(container.scrollLeft + widthVal)
    return
  }

  const widthVal = container.clientWidth * props.displacement
  scrollToLeft(container.scrollLeft - widthVal)
}

const next = (): void => {
  emit('next')

  const container = containerRef.value as HTMLElement
  if (!container) {
    return
  }

  const leftVal = container.getBoundingClientRect().left
  const x = leftVal + (container.clientWidth * props.displacement)
  const element = findNextSlot(x)

  if (element) {
    const widthVal = element.getBoundingClientRect().left - leftVal
    if (widthVal > 0) {
      scrollToLeft(container.scrollLeft + widthVal)
      return
    }
  }

  const widthVal = container.clientWidth * props.displacement
  scrollToLeft(container.scrollLeft + widthVal)
}

const scrollToIndex = (index: number): void => {
  const childrenList = children.value
  if (childrenList[index]) {
    const container = containerRef.value as HTMLElement
    if (!container) {
      return
    }

    const rect = childrenList[index].getBoundingClientRect()
    const leftVal = rect.left - container.getBoundingClientRect().left
    scrollToLeft(container.scrollLeft + leftVal)
  }
}

const scrollToLeft = (leftVal: number, behavior: 'smooth' | 'auto' = 'smooth'): void => {
  const container = containerRef.value as HTMLElement
  container.scrollTo({ left: leftVal, behavior })
}

const onScroll = (): void => {
  const container = containerRef.value as HTMLElement
  if (!container) {
    return
  }

  emit('scroll', { left: container.scrollLeft })

  clearTimeout(debounceId)
  debounceId = setTimeout(onScrollDebounce, 100)
}

const onScrollDebounce = (): void => {
  refresh((data: VueHorizontalData) => {
    emit('scroll-debounce', data)
  })
}

const calculate = (): VueHorizontalData => {
  const container = containerRef.value as HTMLDivElement
  const firstChild = children.value[0] as HTMLDivElement

  const hasNext = (): boolean => {
    return container?.scrollWidth + 2 > container?.scrollLeft + container?.clientWidth
  }

  const hasPrev = (): boolean => {
    if (!container || container.scrollLeft === 0) {
      return false
    }

    const containerVWLeft = container.getBoundingClientRect().left
    const firstChildLeft = firstChild.getBoundingClientRect().left
    return Math.abs(containerVWLeft - firstChildLeft) >= 2
  }

  return {
    left: container?.scrollLeft || 0,
    width: container?.clientWidth || 0,
    scrollWidth: container?.scrollWidth || 0,
    hasNext: hasNext(),
    hasPrev: hasPrev(),
    startX: startX.value,
    startY: startY.value,
    touchScrolling: touchScrolling.value,
  }
}

const refresh = (callback?: (data: VueHorizontalData) => void): void => {
  setTimeout(() => {
    const data = calculate()
    left.value = data.left
    width.value = data.width
    scrollWidth.value = data.scrollWidth
    hasNext.value = data.hasNext
    hasPrev.value = data.hasPrev
    callback?.(data)
  }, 0)
}

onMounted(() => {
  if (props.hasAutoScrolling) {
    refresh(() => {
      if (scrollWidth.value === width.value) {
        totalCount.value = 3
      } else {
        totalCount.value = 2
      }
      onScrollDebounce()
    })
  } else {
    onScrollDebounce()
  }
  window.addEventListener('resize', onScrollDebounce)
})

onUnmounted(() => {
  window.removeEventListener('resize', onScrollDebounce)
  clearTimeout(debounceId)
})
defineExpose<{
  scrollToIndex: (index: number) => void;
    }>({
      scrollToIndex,
    })
</script>

<template>
  <div
    ref="scrollBarRef"
    class="vue-horizontal relative flex"
  >
    <div
      v-if="button && hasPrev"
      :class="{'v-hl-btn-between': buttonBetween}"
      class="v-hl-btn v-hl-btn-prev"
      role="button"
      @click.stop="prev"
    >
      <slot name="btn-prev">
        <UIcon
          class="w-6 h-6"
          name="i-heroicons-chevron-left-20-solid"
        />
      </slot>
    </div>

    <div
      v-if="button && hasNext"
      :class="{'v-hl-btn-between': buttonBetween}"
      class="v-hl-btn v-hl-btn-next"
      role="button"
      @click.stop="next"
    >
      <slot name="btn-next">
        <UIcon
          class="w-6 h-6"
          name="i-heroicons-chevron-right-20-solid"
        />
      </slot>
    </div>

    <div
      :class="[
        {
          'rounded-tl-0 rounded-bl-0': hasPrev,
          'rounded-tr-0 rounded-br-0': hasNext
        }
      ]"
      class="gradient-container transition-all"
    >
      <div
        ref="containerRef"
        :class="[
          {
            'v-hl-scroll': scroll && !hasAutoScrolling
          },
          roundClass
        ]"
        class="v-hl-container h-full"
        @touchend="onTouchEnd"
        @touchmove="onTouchMove"
        @touchstart="onTouchStart"
        @scroll.passive="onScroll"
      >
        <div
          ref="contentBoxRef"
          class="flex items-center"
          :class="[
            ...contentBoxClass,
            {
              'v-hl-responsive': responsive,
              'v-hl-snap-start': snap === 'start',
              'v-hl-snap-center': snap === 'center',
              'v-hl-snap-end': snap === 'end'
            }
          ]"
        >
          <template v-if="hasAutoScrolling">
            <div
              v-for="idx in totalCount"
              :key="`js-1-${idx}`"
              :class="[
                innerContainerClass,
                {
                  'animate-infinite-scroll': hasAutoScrolling && scrollWidth > width,
                  'w-full': !hasAutoScrolling,
                }
              ]"
            >
              <slot />
            </div>
          </template>
          <template v-else>
            <slot />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gradient-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.v-hl-btn {
  position: absolute;
  align-self: center;
  z-index: 10;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.v-hl-btn-prev {
  left: 0;
}

.v-hl-btn-prev.v-hl-btn-between {
  transform: translateX(-50%);
}

.v-hl-btn-next {
  right: 0;
}

.v-hl-btn-next.v-hl-btn-between {
  transform: translateX(50%);
}

.v-hl-svg {
  width: 40px;
  height: 40px;
  margin: 6px;
  padding: 6px;
  border-radius: 20px;
  box-sizing: border-box;
  background: white;
  color: black;
  fill: currentColor;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.v-hl-container {
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  box-sizing: content-box;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.v-hl-container:not(.v-hl-scroll) {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.v-hl-container:not(.v-hl-scroll)::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

.v-hl-container > * {
  box-sizing: border-box;
  min-height: 1px;
  flex-shrink: 0;
}

.v-hl-scroll {
  overflow-x: auto;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #1D391D;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #1D391D;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
}

.v-hl-snap-start > * {
  scroll-snap-align: start;
}

.v-hl-snap-center > * {
  scroll-snap-align: center;
}

.v-hl-snap-end > * {
  scroll-snap-align: end;
}

.v-hl-responsive > * {
  width: 100%;
  margin-right: 24px;
}

.v-hl-responsive > *:last-child {
  margin-right: 0;
}

@media (min-width: 640px) {
  .v-hl-responsive > * {
    width: calc((100% - 24px) / 2);
  }
}

@media (max-width: 640px) {
  .v-hl-scroll {
    &::-webkit-scrollbar {
      height: 4px;
    }
  }
}

@media (min-width: 768px) {
  .v-hl-responsive > * {
    width: calc((100% - 48px) / 3);
  }
}

@media (min-width: 1024px) {
  .v-hl-responsive > * {
    width: calc((100% - 72px) / 4);
  }
}

@media (min-width: 1280px) {
  .v-hl-responsive > * {
    width: calc((100% - 96px) / 5);
  }
}
</style>
