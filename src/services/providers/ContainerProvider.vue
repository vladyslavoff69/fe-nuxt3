<script lang="ts" setup>
import { CONTAINER, THEME } from '~/constants'

const props =
  defineProps<{
    providerKey?: string;
  }>()

const el = ref<HTMLDivElement>()
const { breakpoints } = inject(THEME)!
const { width, height, top, left, ready } = useElementRect(el)
const containerScreen = computed(() => {
  return {
    top: top.value,
    left: left.value,
    width: width.value,
    height: height.value,
    sm: width.value >= breakpoints.sm,
    md: width.value >= breakpoints.md,
    lg: width.value >= breakpoints.lg,
    lxl: width.value >= breakpoints.lxl,
    xl: width.value >= breakpoints.xl,
  }
})
provide(props.providerKey || CONTAINER, { containerScreen, ready })
</script>
<template>
  <div
    ref="el"
    class="ContainerProvider w-full h-full"
  >
    <slot />
  </div>
</template>
