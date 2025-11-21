<script lang="ts" setup>
import { CONTAINER, GAME_POPUP, PREFERENCE, THEME, WAITING_PLAY } from '~/constants'
import { ONLY_REAL_PLAY_PROVIDERS, THIRD_PARTY_GAME } from '~/apps/third-party/constants'
import type { Game, PlayType } from '~/types'
import EscapeContainer from '~/components/molecules/containers/EscapeContainer.vue'
import GameMain from '~/apps/third-party/components/GameMain.vue'
import GameMainMobile from '~/apps/third-party/components/GameMainMobile.vue'
import GameDetailsFooter from '~/apps/third-party/components/GameDetailsFooter.vue'
import GameTable from '~/apps/casino/components/GameTable.vue'

const props = defineProps<{
  game: Game;
}>()

const { activeFiatCode } = inject(PREFERENCE)!
const { activePopups, activeGameOptions } = inject(GAME_POPUP)!
const { screen } = inject(THEME)!
const { containerScreen } = inject(CONTAINER)!
const gameOption = computed(() => activeGameOptions.value[props.game.slug])
const currentPlay = ref<PlayType>(gameOption.value && gameOption.value.currentPlay ? gameOption.value.currentPlay : WAITING_PLAY)
const fullScreen = ref(false)
const theatreMode = ref(false)
const pictureMode = computed(() => (activePopups.value ?? []).includes(props.game.slug))
const currency = ref(gameOption.value && gameOption.value.currency ? gameOption.value.currency : (activeFiatCode.value || 'USD'))
const gameCategories = computed(() => props.game.gameCategories.map(g => g.slug) || [])
const hasOnlyRealPlay = computed<boolean>(() => {
  let isOnlyReal = false
  gameCategories.value.forEach((c) => {
    if (ONLY_REAL_PLAY_PROVIDERS.includes((c || '').toLowerCase())) {
      isOnlyReal = true
    }
  })

  return isOnlyReal
})

watch(
  () => activeFiatCode.value,
  (v) => {
    if (v) {
      currency.value = v
    }
  }
)

watch(
  () => gameOption.value,
  (v) => {
    if (v) {
      if (v?.currency) {
        currency.value = v.currency
      }

      if (v?.currentPlay) {
        currentPlay.value = v?.currentPlay
      }
    }
  }
)

provide(THIRD_PARTY_GAME, {
  game: props.game,
  currentPlay,
  fullScreen,
  theatreMode,
  pictureMode,
  currency,
  hasOnlyRealPlay,
})

onMounted(() => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})
</script>

<template>
  <div class="flex flex-col gap-4 lg:gap-5 game-page-layout pl-1.5 pr-2.5 lg:pl-0 lg:pr-0">
    <div class="flex flex-col gap-4 lg:gap-5">
      <div class="third-party-game w-full h-full">
        <EscapeContainer
          v-if="screen.md"
          :class="{
            '-mt-3': theatreMode,
            'overflow-hidden rounded-md': !theatreMode,
          }"
          :enable="theatreMode"
        >
          <div
            :style="{
              ...(theatreMode && containerScreen.lg
                ? { maxWidth: `calc((100vh - 70px) * 1360 / ${containerScreen.height})` }
                : {}),
            }"
            class="mx-auto"
          >
            <GameMain />
          </div>
        </EscapeContainer>
        <div
          v-else
          class="mx-auto -mt-2"
        >
          <GameMainMobile />
        </div>
      </div>

      <GameDetailsFooter />
    </div>

    <ClientOnly>
      <GameTable />
    </ClientOnly>
  </div>
</template>
