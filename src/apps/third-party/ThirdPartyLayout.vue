<script lang="ts" setup>
import GameContext from '~/services/providers/pages/GameProvider.vue'
import ThirdPartyGameContext from '~/apps/third-party/ThirdPartyGameContext.vue'

const props = defineProps<{
  slug: string;
}>()

const { game, loading } = useGame(props.slug ? props.slug : 'yeti-quest')

onMounted(async () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})
</script>

<template>
  <UPage class="w-full h-full pt-4 lg:pt-5 px-1 lg:px-0 text-sm">
    <GameContext
      v-if="game && !loading"
      :game="game"
    >
      <ThirdPartyGameContext
        :game="game"
      />
    </GameContext>
  </UPage>
</template>
