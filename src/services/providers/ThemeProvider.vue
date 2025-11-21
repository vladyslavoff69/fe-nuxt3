<script lang="ts" setup>
import { THEME } from '~/constants'
import Icons from '~/icons/icons.vue'

const { width, height } = useWindowSize()

const breakpoints = {
  xxs: 350,
  xs: 400,
  sm: 576,
  md: 768,
  lg: 1024,
  lxl: 1198,
  xl: 1280,
  xxl: 1440,
}

const screen = computed(() => ({
  width: width.value,
  height: height.value,
  xxs: width.value >= breakpoints.xxs,
  xs: width.value >= breakpoints.xs,
  sm: width.value >= breakpoints.sm,
  md: width.value >= breakpoints.md,
  lg: width.value >= breakpoints.lg,
  lxl: width.value >= breakpoints.lxl,
  xl: width.value >= breakpoints.xl,
  xxl: width.value >= breakpoints.xxl,
}))

const muteBodyScroll = ref(0)
const setMuteBodyScrollValue = (v: number) => {
  muteBodyScroll.value = v
}

const bodyClass = computed(() => {
  const classes = ['antialiased font-proximanova bg-brand w-full h-full p-0 m-0 text-base text-paragraph']
  if (muteBodyScroll.value > 0) {
    classes.push('overflow-hidden')
  }

  return classes.join(' ')
})

useHead({
  htmlAttrs: {
    class: 'h-full scroll-smooth dark',
  },
  bodyAttrs: {
    class: bodyClass.value,
  },
})

useSeoMeta({
  titleTemplate: '%s',
})

provide(THEME, {
  screen,
  breakpoints,
  muteBodyScroll,
  setMuteBodyScrollValue
})
</script>

<template>
  <div class="bg-brand w-full h-full m-0 p-0 border-0 ring-0">
    <UApp
      :toaster="{
        position: 'top-right',
        class: 'top-14! md:top-18! bottom-auto! z-1005!'
      }"
    >
      <slot />
    </UApp>

    <Icons />
  </div>
</template>
