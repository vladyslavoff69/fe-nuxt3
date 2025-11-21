<script lang="ts" setup>
import { COLOR_KENO_HITS } from '~/icons'

const {
  selected = false,
  opened = false,
  disabled = false,
} = defineProps<{
  tileNumber: number;
  selected?: boolean;
  opened: boolean;
  disabled?: boolean;
}>()
</script>

<template>
  <button
    :class="{
      'pointer-events-none': disabled,
      'opacity-50': disabled && !opened,
    }"
    class="KenoTileSimple relative font-bold rounded-md select-none aspect-square w-full"
    style="padding-top: 100%;"
    type="button"
  >
    <span class="absolute z-10 inset-0 left-0 top-0 rounded-md">
      <span
        :class="{
          'bg-border': !selected && !opened,
          'bg-primary text-white': selected && !opened,
          'bg-bet-gradient text-tile': selected && opened,
        }"
        :style="{
          ...(selected ? {animationDuration: '0.15s'} : {})
        }"
        class="absolute inset-0 left-0 top-0 rounded-md place-content-center grid"
      >
        <span>{{ tileNumber }}</span>
      </span>
    </span>
    <span
      v-if="opened"
      :class="{'bg-green-1000': !selected, 'bg-tile': selected}"
      :style="{
        animationDuration: '0.15s',
      }"
      class="absolute inset-0 left-0 top-0 rounded-md w-full h-full grid place-content-center duration-0"
      style="z-index: 11"
    >
      <span
        v-if="selected"
        class="absolute inset-0 rounded-md bg-bet-gradient overflow-hidden w-full h-full"
      >
        <span class="absolute z-10 inset-0.5 rounded-md bg-border">
          <span class="absolute inset-0.5 grid place-content-center">
            <span class="absolute z-20 text-tile w-full h-full flex items-center justify-center">
              {{ tileNumber }}
            </span>
            <svg class="w-full h-full">
              <use :href="COLOR_KENO_HITS" />
            </svg>
          </span>
        </span>
      </span>
      <span
        v-else
        class="text-error"
        style="z-index: 60"
      >{{ tileNumber }}</span>
    </span>
  </button>
</template>

<style lang="scss">
@keyframes kenoSimpleScaleIn {
  0% {
    transform: scale(0.6);
  }
  100% {
    transform: scale(1);
  }
}

.KenoTileSimple {
  &.animate-scale-in, .animate-scale-in {
    animation: kenoSimpleScaleIn 0.3s cubic-bezier(0.7, 0, 0.1, 1) both;
  }
}
</style>
