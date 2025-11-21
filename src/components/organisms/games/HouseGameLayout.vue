<script lang="ts" setup>
import { CONTAINER, GAME } from '~/constants'

const { containerScreen } = inject(CONTAINER)!
const { theatreMode } = inject(GAME)!
</script>

<template>
  <div
    :class="{'-mt-4 lg:-mt-5': theatreMode && containerScreen.lg}"
    :style="{
      ...(theatreMode && containerScreen.lg ? {
        marginLeft: `calc((100% - ${containerScreen.width}px) / 2)`,
        marginRight: `calc((100% - ${containerScreen.width}px) / 2)`,
      } : {})
    }"
    class="house-game-layout"
  >
    <div
      class="mx-auto"
      :class="{'min-w-(--breakpoint-stage)': theatreMode && containerScreen.lg}"
      :style="{
        ...(theatreMode && containerScreen.lg
          ? { maxWidth: `calc((100vh - 70px) * 1360 / ${containerScreen.height})` }
          : {}),
      }"
    >
      <div
        class="flex gap-4 lg:gap-5"
        :class="{
          'flex-row': containerScreen.lg,
          'flex-col-reverse': !containerScreen.lg,
        }"
      >
        <div
          class="flex-none"
          :class="{
            'w-[340px]': containerScreen.lg,
            'w-full': !containerScreen.lg,
          }"
        >
          <slot name="sidebar" />
        </div>
        <div class="flex-1 min-w-0">
          <slot />
        </div>
        <div
          class="w-0 flex-none -ml-5"
          :class="{
            'min-h-[calc(100vh-var(--header-height)*2.1)]': theatreMode && containerScreen.lg,
            'block': containerScreen.lg,
            'hidden': !containerScreen.lg,
          }"
          :style="{
            paddingTop: !theatreMode ? `calc((100% * ${containerScreen.height}) / ${containerScreen.height * 1.745})` : '0'
          }"
        />
      </div>
    </div>
  </div>
</template>
