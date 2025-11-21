<script lang="ts" setup>
import type { ScrollStyleType } from './hooks'
import { useRouteChange } from '@/composables'

const typeClassMap = {
  invisible: 'invisible-scrollbar',
  content: 'content-scrollbar',
}

const {
  height = 'none',
  width = 'none',
  styleType = 'content',
  scrollupOnPage = false,
  scrollX = true,
  scrollY = true,
  scrollDown = false,
} = defineProps<{
  height?: string;
  width?: string;
  styleType?: ScrollStyleType;
  scrollupOnPage?: boolean;
  scrollX?: boolean;
  scrollY?: boolean;
  scrollDown?: boolean;
}>()

const elRef = ref<HTMLDivElement>()
const typeClass = computed(() => typeClassMap[styleType])
const style = computed(() => ({
  ...(height ? { maxHeight: height } : {}),
  ...(width ? { maxWidth: width } : {}),
}))

const { onPathChange } = useRouteChange(computed(() => scrollupOnPage))
onPathChange(() => {
  elRef.value?.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
})

defineExpose<{
  el: Ref<HTMLDivElement | undefined>;
}>({
  el: elRef,
})

onMounted(() => {
  if (scrollDown) {
    elRef.value?.scrollTo({
      top: elRef.value.scrollHeight + 300,
      behavior: 'instant',
    })
  }
})
</script>
<template>
  <div
    ref="elRef"
    :class="[
      typeClass,
      {
        'overflow-x-hidden': !scrollX,
        'overflow-y-hidden': !scrollY,
      }
    ]"
    :style="style"
    class="overflow-auto relative"
  >
    <slot />
  </div>
</template>
<style scoped>
.invisible-scrollbar::-webkit-scrollbar {
  width: 0;
  background-color: transparent;
}

.content-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  border-radius: 10px;
  background-color: #091E09;
  opacity: 0;
}

.content-scrollbar::-webkit-scrollbar-thumb {
  width: 6px;
  height: 6px;
  border-radius: 7px;
  background: #1D391D;
  opacity: 0;
}

.content-sm-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  border-radius: 10px;
  background-color: #091E09;
  opacity: 0;
}

.content-sm-scrollbar::-webkit-scrollbar-thumb {
  width: 4px;
  height: 4px;
  border-radius: 7px;
  background: #1D391D;
  box-shadow: 0 6.1792px 18.5376px rgba(172, 204, 172, 0.27);
  backdrop-filter: blur(2.3172px);
  opacity: 0;
}

.content-scrollbar::-webkit-scrollbar:hover,
.content-scrollbar::-webkit-scrollbar-thumb:hover,
.content-sm-scrollbar::-webkit-scrollbar:hover,
.content-sm-scrollbar::-webkit-scrollbar-thumb:hover {
  opacity: 1;
}
</style>
