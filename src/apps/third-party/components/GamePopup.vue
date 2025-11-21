<script lang="ts" setup>
import { AUTH, CREATE_USER, FUN_PLAY, GAME_POPUP, LOGIN, PREFERENCE, REAL_PLAY, THEME, WAITING_PLAY } from '~/constants'
import { GAME_QUERY, START_DEMO_MUTATION, START_GAME_MUTATION } from '~/graphql'
import { DraggableResizable } from '~/services/libs/draggable-resizable'
import type { Game, LaunchGameOption } from '~/types'
import FiatPopover from '~/components/organisms/wallets/popovers/FiatPopover.vue'

const props = defineProps<{
  slug: string;
}>()

const { t } = useI18n()
const router = useRouter()
const { screen } = inject(THEME)!
const {
  closePopup,
  isResizingPopup,
  activeGameOptions,
  topPopupGameSlug,
  setActiveGameOption,
  setTopPopupGameSlug
} = inject(GAME_POPUP)!
const { isLoggedIn } = inject(AUTH)!
const { activeCryptoCode } = inject(PREFERENCE)!
const gameContainer = ref<HTMLDivElement>()
const maximize = ref<boolean>(false)
const width = ref<number>(400)
const height = ref<number>(280)
const left = ref<number>(screen.value.width - width.value - 20)
const top = ref<number>(screen.value.height - height.value - 50)
const maxWidth = ref<number>(849)
const maxHeight = ref<number>(594.5)
const currentPlay = computed(
  () => activeGameOptions.value[props.slug]?.currentPlay ?? WAITING_PLAY
)
const currency = computed(
  () => activeGameOptions.value[props.slug]?.currency ?? 'USD'
)
const { result: gameResult, onResult } = useQuery<{ game: Game }>(
  GAME_QUERY,
  {
    slug: props.slug,
  }
)
const game = computed(() => gameResult.value?.game)
const { mutate: mutateStartDemo, onDone: onStartDemoDone } = useMutation(START_DEMO_MUTATION)
const { mutate: mutateStartReal, onDone: onStartRealDone } = useMutation(START_GAME_MUTATION)

onResult(() => {
  if (currentPlay.value === WAITING_PLAY) {
    mutateStartDemo({
      game: game.value?.identifier,
      fiatCurrency: currency.value,
      cryptoCurrency: activeCryptoCode.value,
    })
  } else if (currentPlay.value === FUN_PLAY) {
    mutateStartDemo({
      game: game.value?.identifier,
      fiatCurrency: currency.value,
      cryptoCurrency: activeCryptoCode.value,
    })
  } else if (currentPlay.value === REAL_PLAY) {
    if (isLoggedIn) {
      mutateStartReal({
        game: game.value?.identifier,
        fiatCurrency: currency.value,
        cryptoCurrency: activeCryptoCode.value,
      })
    } else {
      setActiveGameOption(props.slug, {
        currentPlay: WAITING_PLAY,
      })
    }
  }
})
// Start fun play mutate
onStartDemoDone((result) => {
  const {
    data: {
      startDemoAleaPlay: { url },
    },
  } = result
  launchGame({ url })
})

// Start real play mutate
onStartRealDone((result) => {
  const {
    data: {
      startGameAleaPlay: { url },
    },
  } = result
  launchGame({ url })
})

// Unmount game on popup
const unmountGame = () => {
  gameContainer.value!.innerHTML = ''
}

// Launch a Game on popup
const launchGame = ({ url }: LaunchGameOption) => {
  unmountGame()

  if (gameContainer.value) {
    const iframe = document.createElement('iframe')
    iframe.src = url
    iframe.id = 'thirdPartyGamePopup'
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.border = '0px'
    iframe.setAttribute('allow', 'fullscreen; camera; microphone; autoplay')
    iframe.setAttribute('referrerpolicy', 'origin')
    gameContainer.value?.appendChild(iframe)
  }
}

const handleMaximize = () => {
  if (!maximize.value) {
    const topValue = top.value - maxHeight.value + height.value
    if (topValue < 0) {
      top.value = Math.abs(topValue) / 2
    } else if (topValue + maxHeight.value >= screen.value.height) {
      top.value = screen.value.height - maxHeight.value - 10
    } else {
      top.value = topValue
    }
    const leftValue = left.value - maxWidth.value + width.value
    if (leftValue <= 0) {
      left.value = Math.abs(leftValue) / 2
    } else if (leftValue + maxWidth.value >= screen.value.width) {
      left.value = screen.value.width - maxWidth.value - 10
    } else {
      left.value = leftValue
    }
    width.value = maxWidth.value
    height.value = maxHeight.value
  } else {
    width.value = 400
    height.value = 280
    top.value = top.value + maxHeight.value - height.value
    left.value = left.value + maxWidth.value - width.value
  }
  maximize.value = !maximize.value
}

const handleClose = () => {
  unmountGame()
  closePopup(props.slug)
}

const openLoginModal = () => {
  router.push({
    path: router.currentRoute.value.path,
    query: {
      tab: LOGIN,
      modal: 'auth',
    },
  })
}

const openRegisterModal = () => {
  router.push({
    path: router.currentRoute.value.path,
    query: {
      tab: CREATE_USER,
      modal: 'auth',
    },
  })
}

const handleRealPlay = () => {
  setActiveGameOption(props.slug, {
    currentPlay: REAL_PLAY,
  })
  mutateStartReal({
    game: game.value?.identifier,
    fiatCurrency: currency.value,
    cryptoCurrency: activeCryptoCode.value,
  })
}

const handleFunPlay = () => {
  setActiveGameOption(props.slug, {
    currentPlay: FUN_PLAY,
  })
  mutateStartDemo({
    game: game.value?.identifier,
  })
}

const handleUpdateCurrency = (v: string) => {
  setActiveGameOption(props.slug, {
    currency: v,
  })
}

// Set current game popup to top priority popup
const handleWindowClick = () => {
  setTopPopupGameSlug(props.slug)
}

// To check popup position when user resize window
watch(
  () => screen.value.width,
  (v) => {
    const currentRightPosition = width.value + left.value
    if (currentRightPosition >= v) {
      left.value = screen.value.width - width.value - 20
    }
  }
)

watch(
  () => screen.value.height,
  (v) => {
    const currentRightPosition = height.value + top.value
    if (currentRightPosition >= v) {
      top.value = screen.value.height - height.value - (screen.value.md ? 60 : 20)
    }
  }
)

// Popup event handlers
const onResizing = () => {
  isResizingPopup.value = true
}

const onResizeStop = () => {
  isResizingPopup.value = false
}
</script>

<template>
  <DraggableResizable
    v-model:h="height"
    v-model:w="width"
    v-model:x="left"
    v-model:y="top"
    :active="true"
    :lock-aspect-ratio="true"
    :max-height="maxHeight"
    :max-width="maxWidth"
    :min-height="height"
    :min-width="width"
    :style="topPopupGameSlug === props.slug ? 'z-index: 1006 !important;' : ''"
    class-name="GamePopupRoot"
    handles-type="borders"
    parent="#parent_container"
    @resizestop="onResizeStop"
    @resizing="onResizing"
  >
    <div
      class="GamePopup bg-green-950 rounded-md h-full"
      @mousedown="handleWindowClick"
    >
      <div
        id="game_popup_header"
        class="GamePopupHeader px-4 py-2.5 flex justify-between drag-el cursor-move"
      >
        <div class="GamePopupTitle text-sm md:text-base text-white flex items-center gap-2 font-bold">
          {{ game?.title }}
        </div>
        <div class="GamePopupAction flex gap-1 items-center cursor-pointer">
          <UTooltip
            :content="{ side: 'top' }"
            arrow
            :text="maximize ? t('base.min-size') : t('base.max-size')"
          >
            <UIcon
              :name="maximize ? `heroicons:arrows-pointing-in-16-solid` : `heroicons:arrows-pointing-out-16-solid`"
              class="h-4 w-4 min-w-4 min-h-4 text-paragraph hover:text-white"
              @click="handleMaximize"
              @click.stop
            />
          </UTooltip>
          <UTooltip
            :content="{ side: 'top' }"
            arrow
            text="Close"
          >
            <UIcon
              class="h-5 w-5 min-w-5 min-h-5 text-paragraph hover:text-white"
              name="i-heroicons-x-mark-20-solid"
              @click="handleClose"
              @click.stop
            />
          </UTooltip>
        </div>
      </div>
      <div class="w-full h-[calc(100%-45px)] relative">
        <div
          :id="'game_popup_content_container_' + game?.identifier"
          ref="gameContainer"
          class="GamePopupContent w-full h-full"
        />
        <div
          v-if="isResizingPopup"
          class="absolute inset-0 flex justify-center items-center font-semibold"
        />
        <div
          v-if="currentPlay === WAITING_PLAY"
          class="absolute inset-0 flex justify-center items-center font-semibold bg-green-950/85"
        >
          <div>
            <div class="flex items-center justify-center gap-x-2 mb-2">
              <span class="text-sm font-semibold text-white">
                {{ t('games.balance-in') }}
              </span>
              <FiatPopover
                :content-height="screen.md ? 300 : 150"
                button-class="w-full pl-3 pr-1.5 py-1 hover:shadow-none rounded-md bg-brand!"
                @update:fiat-value="handleUpdateCurrency"
              />
            </div>
            <div class="flex gap-x-2 items-center justify-center">
              <template v-if="isLoggedIn">
                <JButton
                  class="px-4"
                  variant="bet-gradient"
                  @click="handleRealPlay"
                >
                  {{ t('games.real-play') }}
                </JButton>
                <JButton
                  button-class="bg-border! font-bold"
                  class="px-4"
                  variant="alternative"
                  @click="handleFunPlay"
                >
                  {{ t('games.fun-play') }}
                </JButton>
              </template>
              <template v-else>
                <JButton
                  @click="openLoginModal"
                >
                  {{ t('auth.login') }}
                </JButton>
                <JButton
                  variant="outline"
                  @click="openRegisterModal"
                >
                  {{ t('auth.register') }}
                </JButton>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DraggableResizable>
</template>

<style lang="scss">
.GamePopupRoot {
  position: absolute !important;
  z-index: 1005 !important;
  pointer-events: fill;
  border: none !important;

  .GamePopup {
    overflow: hidden;
  }
}
</style>
