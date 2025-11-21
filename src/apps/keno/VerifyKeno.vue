<script lang="ts" setup>
import { LOADING_ICON } from '~/components/symbols'
import TileSimple from '~/apps/keno/components/TileSimple.vue'

const {
  clientSeed = '',
  serverSeed = '',
  nonce = 0,
} = defineProps<{
  clientSeed?: string;
  serverSeed?: string;
  nonce?: number;
}>()

const { t } = useI18n()
const tileNumbers = Array.from(Array(40)).map((_v, index) => index + 1)

const { loading, verified, result: resultNumbers } = useVerifyFairness({
  serverSeed: computed(() => serverSeed),
  clientSeed: computed(() => clientSeed),
  nonce: computed(() => nonce),
  count: computed(() => 10),
  range: [1, 40],
  intOnly: true,
  isGenerateIntegers: true,
  additionalIndex: true,
})

const tiles = computed(() => tileNumbers.map((tileNumber) => {
  const selected = resultNumbers.value?.includes(tileNumber)
  const opened = selected

  return {
    tileNumber,
    selected,
    opened,
    disabled: false
  }
}))
</script>

<template>
  <div class="VerifyKeno flex items-center justify-center text-center w-full min-h-20 bg-green-950 rounded-md">
    <div
      v-if="verified"
      class="mx-auto"
    >
      <div
        class="w-full grid grid-cols-8 gap-1 text-sm"
      >
        <div
          v-for="tile of tiles"
          :key="tile.tileNumber"
          :class="{
            'bg-tile': !tile.selected && !tile.opened,
            'bg-form-input shadow-dark-box-inset': !tile.selected && tile.opened,
            'bg-tile-green': tile.selected && !tile.opened,
            'bg-bet-gradient': tile.selected && tile.opened,
          }"
          class="relative w-full h-full rounded-md"
        >
          <TileSimple v-bind="tile" />
        </div>
      </div>
    </div>
    <div
      v-else-if="loading"
      class="flex items-center justify-center h-12"
    >
      <svg
        class="animate-spin w-4 h-4 text-border"
      >
        <use :href="LOADING_ICON" />
      </svg>
    </div>
    <div
      v-else
      class="flex items-center justify-center text-center h-12"
    >
      {{ t('notifications.complete-all-input-desc') }}
    </div>
  </div>
</template>
