<script
  generic="T extends {id: ID, transactionId: string, status: GameMatchStatus, text: string | number}"
  lang="ts"
  setup
>
import type { GameMatchStatus, ID } from '~/types'
import { GAME } from '~/constants'
import GameHistory from '~/components/organisms/games/GameHistory.vue'

const props = defineProps<{ history: T[]; }>()
const { paneCss } = inject(GAME)!
const historyData = computed(() => props.history)
</script>
<template>
  <div
    :class="[paneCss]"
    class="h-full relative text-sm game-pane"
  >
    <div class="flex flex-col h-full">
      <div class="flex-1 flex flex-col">
        <div
          v-if="historyData"
          class="flex-none min-h-8"
        >
          <GameHistory :history="historyData" />
        </div>

        <div class="flex-1">
          <div class="mx-auto w-full h-full lg:pt-4">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
