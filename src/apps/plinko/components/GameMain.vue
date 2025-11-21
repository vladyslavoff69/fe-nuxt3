<script lang="ts" setup>
import { MULTIPLIER_OPTIONS, PLINKO_GAME, PLINKO_INIT } from '~/apps/plinko/constants'
import { CONTAINER } from '~/constants'
import Multiplier from '~/apps/plinko/components/Multiplier.vue'

const { plinkoEl, pinSize, selectedRow, loadingBoard, multipliers } = inject(PLINKO_GAME)!
const { containerScreen } = inject(CONTAINER)!
const mOptions = computed(() => MULTIPLIER_OPTIONS[selectedRow.value])
</script>

<template>
  <div class="GameMain h-full w-full font-bold">
    <div
      class="mx-auto w-full h-full max-w-(--breakpoint-pane-tile) lg:max-w-(--breakpoint-pane-main) flex flex-col items-center"
      :class="[
        {
          'xl:max-w-(--breakpoint-pane-tile-lg)': containerScreen.height > 800,
          'relative': loadingBoard,
        }
      ]"
    >
      <div
        id="plinko"
        ref="plinkoEl"
        class="
          plinko-container w-full h-full
          flex justify-end items-center flex-col-reverse
          max-w-(--breakpoint-container-xs) md:max-w-[680px] mx-auto
        "
      >
        <div
          v-show="!loadingBoard"
          class="flex justify-center items-end mx-auto h-7 max-w-full"
          :class="{
            'gap-0.5 lg:gap-2': selectedRow < 12 && selectedRow > 9,
            'gap-1 lg:gap-2.5': selectedRow < 10,
            'lg:gap-1.5': selectedRow > 11 && selectedRow < 14,
            'lg:gap-1': selectedRow === 14,
            'lg:gap-0.5': selectedRow > 14
          }"
          :style="{
            width: containerScreen.md ? `${(PLINKO_INIT.width + pinSize * mOptions.w)}px` : 'calc(100% - 30px)'
          }"
        >
          <Multiplier
            v-for="(mItem, m) in multipliers"
            :key="m"
            :m="m"
            :m-item="mItem"
          />
        </div>
      </div>
      <div
        v-if="loadingBoard"
        class="absolute top-0 z-1002 bg-brand w-full h-full overflow-hidden flex justify-center items-center"
      >
        <CasinoAnimateLogo
          class="max-h-(--breakpoint-logo-height) max-w-(--breakpoint-logo-height) md:max-w-(--breakpoint-logo-width) w-[150px] md:w-[200px] h-full"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.multiplier-node {
  &.pressed {
    animation: press 0.15s;
  }

  @keyframes press {
    0%,
    to {
      transform: translate(0);
    }

    50% {
      transform: translateY(30%);
    }
  }
}

.plinko-container {
  canvas {
    width: 100%;
    max-width: 100%;
  }
}
</style>
