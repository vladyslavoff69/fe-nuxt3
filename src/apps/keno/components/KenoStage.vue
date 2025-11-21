<script lang="ts" setup>
import { useGameSettingStore } from '~/store/games/settings'
import GameProvider from '~/services/providers/pages/GameProvider.vue'
import GamePageLayout from '~/components/organisms/games/GamePageLayout.vue'
import KenoGameContext from '~/apps/keno/KenoGameContext.vue'
import HouseGameLayout from '~/components/organisms/games/HouseGameLayout.vue'
import BetFormContainer from '~/apps/keno/components/BetFormContainer.vue'
import GamePane from '~/apps/keno/components/GamePane.vue'

const { game } = useGame('keno')
const store = useGameSettingStore()

onMounted(() => {
  store.setGame('keno')
})
</script>

<template>
  <UPage class="w-full pt-4 lg:pt-5 pl-1.5 pr-2.5 lg:pl-0 lg:pr-0 text-sm">
    <GameProvider
      v-if="game"
      :game="game"
    >
      <GamePageLayout>
        <KenoGameContext>
          <HouseGameLayout>
            <template #sidebar>
              <BetFormContainer />
            </template>
            <template #default>
              <GamePane />
            </template>
          </HouseGameLayout>
        </KenoGameContext>
      </GamePageLayout>
    </GameProvider>
  </UPage>
</template>
