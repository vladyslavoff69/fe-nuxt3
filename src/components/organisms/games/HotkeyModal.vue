<script lang="ts" setup>
import { useGameSettingStore } from '~/store/games/settings'

type HotKeyType = {
  description: string;
  key: string;
}

const { t } = useI18n()
const store = useGameSettingStore()
const game = computed(() => store.game.value)
const gameHotKeysMap: {
  [key in string]: HotKeyType[]
} = {
  dice: [
    { description: t('bets.flip-the-rollover-under'), key: 'q' },
    { description: t('bets.lower-target-number-by-1'), key: 'w' },
    { description: t('bets.higher-target-number'), key: 'e' },
  ],
  hilo: [],
  blackjack: [],
  wheel: [],
  limbo: [],
  plinko: [],
  mines: [
    { description: t('bets.pick-random-tile'), key: 'q' },
    { description: t('bets.cashout'), key: 'w' },
  ],
  'dragon-tower': [
    { description: t('bets.pick-random-tile'), key: 'q' },
    { description: t('bets.cashout'), key: 'w' },
  ],
  keno: [
    { description: t('bets.auto-pick-button'), key: 'q' },
    { description: t('games.clear-table'), key: 'w' },
  ],
  coinflip: [],
}

const hotKeys = computed<HotKeyType[]>(() => ([
  { description: t('bets.make-a-bet'), key: 'Space' },
  { description: t('bets.double-bet-amount'), key: 's' },
  { description: t('bets.halve-bet-amount'), key: 'a' },
  { description: t('bets.zero-bet-amount'), key: 'd' },
  // @ts-ignore
  ...((game.value && gameHotKeysMap[game.value]) ? gameHotKeysMap[game.value] : {})
]))
</script>

<template>
  <div class="w-full flex flex-col text-sm font-semibold gap-1 lg:gap-1.5">
    <div
      v-for="(item, index) in hotKeys"
      :key="`key-${index}-hey-13`"
      class="flex items-center justify-between lg:gap-2.5 gap-2"
    >
      <span class="leading-none">
        {{ item.description }}
      </span>
      <span
        class="bg-green-950 rounded-md leading-none"
        :class="[
          index === 0 ? 'px-2.5 py-2' : 'flex justify-center items-center w-9 h-9'
        ]"
      >
        {{ item.key }}
      </span>
    </div>

    <div class="flex gap-x-1 mt-2.5 leading-tight rounded-md border border-dashed border-paragraph p-2">
      <UIcon
        class="w-4 h-4 min-w-4 min-h-4"
        name="i-heroicons-information-circle-20-solid"
      />

      <span>
        {{ t('bets.hot-keys-desc') }}
      </span>
    </div>
  </div>
</template>
