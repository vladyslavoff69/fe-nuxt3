<script lang="ts" setup>
import { KENO_GAME } from '~/apps/keno/constants'
import { CONTAINER, GAME } from '~/constants'
import { useKenoSounds } from '~/apps/keno/composables'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import Tile from '~/apps/keno/components/Tile.vue'
import Hits from '~/apps/keno/components/Hits.vue'
import GameResult from '~/apps/keno/components/GameResult.vue'

const { instantMode } = inject(GAME)!
const { tileNumbers, selectedTiles, openedTiles, inAutoPick, betResult, isIdle, showResult } = inject(KENO_GAME)!
const { containerScreen } = inject(CONTAINER)!
const { t } = useI18n()
const { soundTile } = useKenoSounds()

const tiles = computed(() => tileNumbers.map((n) => {
  const selected = selectedTiles.value?.includes(n)
  const limited = selectedTiles.value?.length === 10
  const opened = openedTiles.value?.includes(n)

  return {
    tileNumber: n,
    selected,
    opened,
    instantMode: instantMode.value,
    disabled: limited && !selected,
    loading: !isIdle.value,
  }
}))

const toggleTileSelection = async (tileNumber: number) => {
  if (selectedTiles.value?.includes(tileNumber)) {
    selectedTiles.value = selectedTiles.value?.filter((n: number) => n !== tileNumber)
  } else {
    selectedTiles.value?.push(tileNumber)
  }

  betResult.value = null
  soundTile()
}

const [resultParent] = useAutoAnimate({
  duration: 100,
})
</script>

<template>
  <div class="GameMain h-full flex flex-col items-center w-full font-bold relative">
    <div
      :class="{
        'xl:max-w-(--breakpoint-pane-tile-lg)': containerScreen.height > 800
      }"
      class="
        flex-1 mx-auto w-full h-full max-w-(--breakpoint-pane-tile) lg:max-w-(--breakpoint-pane-main)
        px-0 lg:px-4 pt-3 pb-3 lg:pt-0 lg:pb-4
      "
    >
      <div class="grid grid-cols-8 gap-1 md:gap-2 xl:gap-2.5 text-sm md:text-base lg:text-xl font-bold">
        <div
          v-for="tile of tiles"
          :key="tile.tileNumber"
          :class="{
            'bg-tile': !tile.selected && !tile.opened,
            'bg-navbar shadow-dark-box-inset': !tile.selected && tile.opened,
            'bg-tile-green': tile.selected && !tile.opened,
            'bg-bet-gradient': tile.selected && tile.opened,
          }"
          class="relative w-full h-full rounded-md"
        >
          <Tile
            :in-auto-pick="inAutoPick"
            v-bind="tile"
            @click.capture="toggleTileSelection(tile.tileNumber)"
            @touchstart.prevent="toggleTileSelection(tile.tileNumber)"
          />
        </div>
      </div>
    </div>
    <div class="flex-none flex flex-col justify-end w-full">
      <div
        v-if="selectedTiles.length > 0"
      >
        <Hits />
      </div>
      <div
        v-else
        class="
          py-2 px-0.5 lg:px-5 rounded-md bg-green-950 flex items-center justify-center text-sm lg:text-base leading-none!
          min-h-10 lg:min-h-16
        "
      >
        {{ t('casino.select-numbers-to-play') }}
      </div>
    </div>
    <div
      v-if="!instantMode"
      ref="resultParent"
      class="absolute grid place-content-center pointer-events-none z-999 w-full h-full"
    >
      <div
        v-if="showResult"
        style="transition-timing-function: cubic-bezier(0.7,0,0.1,1)"
      >
        <GameResult />
      </div>
    </div>
    <div
      v-else-if="showResult"
      class="absolute grid place-content-center pointer-events-none z-999 w-full h-full"
    >
      <GameResult />
    </div>
  </div>
</template>
