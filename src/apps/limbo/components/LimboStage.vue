<script lang="ts" setup>
import { useGameSettingStore } from '~/store/games/settings'
import GameProvider from '~/services/providers/pages/GameProvider.vue'
import GamePageLayout from '~/components/organisms/games/GamePageLayout.vue'
import LimboGameContext from '~/apps/limbo/LimboGameContext.vue'
import HouseGameLayout from '~/components/organisms/games/HouseGameLayout.vue'
import BetFormContainer from '~/apps/limbo/components/BetFormContainer.vue'
import GamePane from '~/apps/limbo/components/GamePane.vue'

const { game } = useGame('limbo')
const store = useGameSettingStore()

onMounted(() => {
  store.setGame('limbo')
})
</script>

<template>
  <UPage class="w-full pt-4 lg:pt-5 pl-1.5 pr-2.5 lg:pl-0 lg:pr-0 text-sm">
    <GameProvider
      v-if="game"
      :game="game"
    >
      <GamePageLayout>
        <LimboGameContext>
          <HouseGameLayout>
            <template #sidebar>
              <BetFormContainer />
            </template>
            <template #default>
              <GamePane />
            </template>
          </HouseGameLayout>
        </LimboGameContext>
      </GamePageLayout>
    </GameProvider>
  </UPage>
</template>
