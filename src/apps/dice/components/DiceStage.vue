<script lang="ts" setup>
import { useGameSettingStore } from '~/store/games/settings'
import GameProvider from '~/services/providers/pages/GameProvider.vue'
import GamePageLayout from '~/components/organisms/games/GamePageLayout.vue'
import DiceGameContext from '~/apps/dice/DiceGameContext.vue'
import HouseGameLayout from '~/components/organisms/games/HouseGameLayout.vue'
import BetFormContainer from '~/apps/dice/components/BetFormContainer.vue'
import GamePane from '~/apps/dice/components/GamePane.vue'

const { game } = useGame('dice')
const store = useGameSettingStore()

onMounted(() => {
  store.setGame('dice')
})
</script>

<template>
  <UPage class="w-full pt-4 lg:pt-5 pl-1.5 pr-2.5 lg:pl-0 lg:pr-0 text-sm">
    <GameProvider
      v-if="game"
      :game="game"
    >
      <GamePageLayout>
        <DiceGameContext>
          <HouseGameLayout>
            <template #sidebar>
              <BetFormContainer />
            </template>
            <template #default>
              <GamePane />
            </template>
          </HouseGameLayout>
        </DiceGameContext>
      </GamePageLayout>
    </GameProvider>
  </UPage>
</template>
