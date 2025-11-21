<script lang="ts" setup>
import { CLOSED_SIDEBAR_WIDTH, OPENED_SIDEBAR_WIDTH, SITE_SETTINGS } from '~/constants'
import LazySidebarInternal from '~/components/organisms/sidebar/SidebarInternal.vue'

const { isSidebarOpen } = inject(SITE_SETTINGS)!
</script>

<template>
  <div
    :class="{
      'px-3': !isSidebarOpen,
      'px-4': isSidebarOpen,
    }"
    :style="{
      width: isSidebarOpen ? OPENED_SIDEBAR_WIDTH : CLOSED_SIDEBAR_WIDTH
    }"
    class="relative h-full text-paragraph bg-navbar shadow-sidebar overflow-x-hidden overflow-y-auto pt-4 lg:pt-5 rounded-md z-20 transition-base duration-150"
  >
    <DelayHydration>
      <LazySidebarInternal hydrate-on-visible />
    </DelayHydration>
  </div>
</template>
