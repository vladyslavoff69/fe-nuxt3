<script lang="ts" setup>
import { useGameSettingStore } from '~/store/games/settings'
import GameProvider from '~/services/providers/pages/GameProvider.vue'
import GamePageLayout from '~/components/organisms/games/GamePageLayout.vue'
import PlinkoGameContext from '~/apps/plinko/PlinkoGameContext.vue'
import PlinkoContainer from '~/apps/plinko/components/PlinkoContainer.vue'

const { game } = useGame('plinko')
const store = useGameSettingStore()
const loaded = ref(false)
const render = ref(false)

onMounted(() => {
  const graphicsInfo = getGraphicsInfo()

  store.setGame('plinko')

  if (graphicsInfo && graphicsInfo.renderer && graphicsInfo.renderer.includes('UHD')) {
    render.value = true
  }

  loaded.value = true
})
</script>

<template>
  <UPage class="w-full pt-4 lg:pt-5 pl-1.5 pr-2.5 lg:pl-0 lg:pr-0 text-sm">
    <GameProvider
      v-if="game"
      :game="game"
    >
      <GamePageLayout>
        <PlinkoGameContext v-if="loaded">
          <PlinkoContainer />
        </PlinkoGameContext>
      </GamePageLayout>
    </GameProvider>
  </UPage>
</template>
