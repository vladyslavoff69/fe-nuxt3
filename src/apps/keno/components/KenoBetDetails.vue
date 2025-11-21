<script lang="ts" setup>
import { KENO_RESULT_QUERY } from '~/apps/game/graphql'
import type { ID } from '~/types'
import type { KenoGameMatch } from '~/apps/game/types'
import AnimateSkeleton from '~/apps/game/components/in-house/AnimateSkeleton.vue'
import TileSimple from '~/apps/keno/components/TileSimple.vue'

const props = defineProps<{
  id: ID
  name: string
}>()

const { t } = useI18n()
const { data } = useAsyncQuery<{ kenoResult: KenoGameMatch }>(KENO_RESULT_QUERY, { id: props.id })
const tileNumbers = Array.from(Array(40)).map((_v, index) => index + 1)
const localePath = useLocalePath()
const v = {
  get gameMatch () {
    return data.value?.kenoResult
  }
}

const tiles = computed(() => tileNumbers.map((tileNumber) => {
  const selected = v.gameMatch?.numbers.includes(tileNumber) || false
  const opened = v.gameMatch?.result.includes(tileNumber) || false
  const disabled = !selected

  return {
    tileNumber,
    opened,
    selected,
    disabled
  }
}))

const openKenoGame = () => {
  navigateTo(localePath('/casino/games/junglebet/keno'))
}
</script>

<template>
  <div class="w-full flex flex-col gap-y-3 lg:gap-y-4 text-sm bg-green-950 rounded-md p-2 lg:p-3 relative">
    <AnimateSkeleton v-if="!v.gameMatch" />

    <div
      v-else
      class="w-full flex flex-col gap-y-3 lg:gap-y-4"
    >
      <div class="pointer-events-none w-full">
        <div class="grid grid-cols-8 gap-1 text-sm">
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

      <div class="flex flex-col gap-y-1 font-bold text-sm">
        <label class="block leading-none">
          {{ t('bets.risk') }}
        </label>
        <UInput
          v-model="v.gameMatch.risk"
          class="ring-brand bg-brand font-bold capitalize"
          disabled
          size="sm"
        />
      </div>
    </div>

    <JButton
      class="min-w-24 h-10 w-full block"
      @click="openKenoGame"
    >
      {{ t('games.play') }} {{ props.name }}
    </JButton>
  </div>
</template>
