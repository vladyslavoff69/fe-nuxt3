<script lang="ts" setup>
import { AUTH, GAME_POPUP, THEME } from '~/constants'
import type { ActiveGameOptions, Bet, GameActiveOption } from '~/types'

const { screen } = inject(THEME)!
const { me, isLoggedIn } = inject(AUTH)!

const GamePopup = defineAsyncComponent({
  loader: () => import('~/apps/third-party/components/GamePopup.vue'),
})
const GameLiveStatsPopup = defineAsyncComponent({
  loader: () => import('~/components/organisms/games/GameLiveStatsPopup.vue'),
})
const GameSharePopup = defineAsyncComponent({
  loader: () => import('~/apps/screen-share/components/Whip.vue'),
})

const topPopupGameSlug = ref<string>('') // Current top positioned game slug, current active game popup slug
const isResizingPopup = ref<boolean>(false) // Is resizing on popup?
const openedGameStatsPopup = ref<boolean>(false) // Is opened game stats popup?
const isOpenGameSharePopup = ref<boolean>(false) // Is opened game share popup?
const isSpinSharing = ref<boolean>(false)
const isStreaming = ref<boolean>(false)
const stopLoading = ref<boolean>(false)
const popupGameSlugs = ref<string[]>([]) // Current popup games slugs array
const activeGameOptions = ref<ActiveGameOptions>({}) // Current actived popup games options
const betResults = ref<Bet[]>([])
const roomId = ref()
const screenStream = ref()
const whipClient = ref()
const audioOn = ref(false)
const audioContainer = ref<HTMLDivElement>()
const previewContainer = ref<HTMLVideoElement>()
const audioLoading = ref(false)

// Set a game to picture mode
const setPictureMode = (slug: string) => {
  const isExist = popupGameSlugs.value.includes(slug)
  if (!isExist) {
    popupGameSlugs.value = [...popupGameSlugs.value, slug]
  } else {
    closePopup(slug)
  }
  setTopPopupGameSlug(slug)
}

// stop sharing
const onStopLive = async () => {
  stopLoading.value = true
  if (whipClient.value && screenStream.value) {
    await whipClient.value?.disconnectStream()?.catch(() => {})
    screenStream.value?.getTracks().forEach(t => t.stop())
  }

  if (previewContainer.value) {
    previewContainer.value.srcObject = null
  }

  if (audioOn.value && audioContainer.value) {
    audioContainer.value.innerHTML = ''
    audioOn.value = false
  }

  isStreaming.value = false
  stopLoading.value = false
}

// Open or Hide game stats popup
const toggleGameStatsPopup = () => {
  openedGameStatsPopup.value = !openedGameStatsPopup.value
}

// Open or Hide game share popup
const toggleGameSharePopup = async () => {
  await onStopLive()
  isOpenGameSharePopup.value = !isOpenGameSharePopup.value
  isSpinSharing.value = isOpenGameSharePopup.value
  isStreaming.value = false
}

// Set a game options(currency or current play mode) on picture mode popup
const setActiveGameOption = (slug: string, option: GameActiveOption) => {
  if (!activeGameOptions.value[slug]) {
    activeGameOptions.value[slug] = {}
  }

  activeGameOptions.value[slug] = { ...activeGameOptions.value[slug], ...option }
}

// Close the game popup and reinitialize game on normal view
const closePopup = (slug: string) => {
  const index = popupGameSlugs.value.findIndex(v => v === slug)
  const tempAry = popupGameSlugs.value
  if (index > -1) {
    tempAry.splice(index, 1)
    popupGameSlugs.value = tempAry
  }
  delete activeGameOptions.value[slug]
}

// When user click game popup title, set that game to top position(z-index)
const setTopPopupGameSlug = (slug: string) => {
  topPopupGameSlug.value = slug
}

const resetBetsResult = () => {
  betResults.value = []
}

provide(GAME_POPUP, {
  activePopups: popupGameSlugs,
  activeGameOptions,
  topPopupGameSlug,
  isOpenGameSharePopup,
  isResizingPopup,
  isSpinSharing,
  isStreaming,
  stopLoading,
  openedGameStatsPopup,
  betResults,
  roomId,
  screenStream,
  whipClient,
  audioOn,
  audioLoading,
  audioContainer,
  previewContainer,
  setPictureMode,
  setActiveGameOption,
  closePopup,
  setTopPopupGameSlug,
  toggleGameSharePopup,
  toggleGameStatsPopup,
  resetBetsResult,
  onStopLive,
})

watch(
  () => screen.value.width,
  (v) => {
    if (v <= 992) {
      topPopupGameSlug.value = ''
      popupGameSlugs.value = []
      activeGameOptions.value = {}
    }
  }
)
</script>

<template>
  <slot />
  <template v-if="isLoggedIn && !!me">
    <ClientOnly>
      <div
        v-if="screen.width > 992 && popupGameSlugs.length"
        id="parent_container"
        class="w-[calc(100vw-15px)] h-[calc(100vh-15px)] absolute left-1 top-1 z-1001 pointer-events-none"
      >
        <GamePopup
          v-for="(slug, i) in popupGameSlugs"
          :key="`${slug}_${i}`"
          :slug="slug"
        />
      </div>
    </ClientOnly>
    <ClientOnly>
      <div
        v-if="openedGameStatsPopup"
        id="parent_stats_container"
        class="w-[calc(100vw-15px)] h-[calc(100vh-15px)] absolute left-0 top-0 z-1001 pointer-events-none"
      >
        <GameLiveStatsPopup />
      </div>
    </ClientOnly>
    <ClientOnly>
      <div
        v-if="isOpenGameSharePopup"
        id="parent_share_container"
        class="w-[calc(100vw-15px)] h-[calc(100vh-15px)] absolute left-0 top-0 z-1001 pointer-events-none"
      >
        <GameSharePopup />
      </div>
    </ClientOnly>
  </template>
</template>
