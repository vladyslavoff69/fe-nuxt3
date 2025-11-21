<script lang="ts" setup>
import { PAGE_LOADING } from '~/constants'

const {
  heightWhenLoading = 'min-h-[calc(100vh-var(--header-height)*2.5)]',
  level = 1
} = defineProps<{
  level?: number;
  heightWhenLoading?: string;
}>()

const { addLoading, useAddLoading, ready, loadings } = useLoading({
  level,
  timeout: 1500,
})

const onPageRendering = (callback: () => void) => {
  if (!ready.value && import.meta.client) {
    callback()
  }
}

provide(PAGE_LOADING, { ready, loadings, addLoading, useAddLoading, onPageRendering })
</script>

<template>
  <div
    :class="{ 'overflow-hidden': !ready }"
    class="relative z-1 w-full min-h-[calc(100vh-var(--header-height)*2.05)]"
  >
    <div
      v-show="ready"
    >
      <slot />
    </div>
    <div
      v-if="!ready"
      :class="[heightWhenLoading]"
      class="flex items-center w-full h-full justify-center bg-brand z-20 absolute"
    >
      <CasinoAnimateLogo
        class="max-h-(--breakpoint-logo-height) max-w-(--breakpoint-logo-height) md:max-w-(--breakpoint-logo-width) w-[150px] md:w-[200px] h-full"
      />
    </div>
  </div>
</template>
