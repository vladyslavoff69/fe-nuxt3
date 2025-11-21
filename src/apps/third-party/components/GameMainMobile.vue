<script lang="ts" setup>
import { AUTH, CREATE_USER, FUN_PLAY, GAME_POPUP, LOGIN, PREFERENCE, REAL_PLAY, WAITING_PLAY } from '~/constants'
import { START_DEMO_MUTATION, START_GAME_MUTATION } from '~/graphql'
import type { LaunchGameOption } from '~/types'
import FiatPopover from '~/components/organisms/wallets/popovers/FiatPopover.vue'
import { THIRD_PARTY_GAME } from '~/apps/third-party/constants'
import CloseButton from '~/components/molecules/button/CloseButton.vue'

const nuxtApp = useNuxtApp()
const router = useRouter()
const { t } = useI18n()
const { game, currency, currentPlay, fullScreen, hasOnlyRealPlay } = inject(THIRD_PARTY_GAME)!
const { setActiveGameOption } = inject(GAME_POPUP)!
const { me, isLoggedIn } = inject(AUTH)!
const { activeCryptoCode, changedActiveCode } = inject(PREFERENCE)!
const token = getAuthCookie()
const { updateGameKv } = useRecentGame()
const {
  mutate: mutateStartDemo,
  onDone: onStartDemoDone,
  onError: onStartDemoError,
  loading: demoMutateLoading,
} = useMutation(START_DEMO_MUTATION)
const {
  mutate: mutateStartReal,
  onDone: onStartRealDone,
  onError: onStartRealError,
  loading: realMutateLoading,
} = useMutation(START_GAME_MUTATION)

const gameContainer = ref<HTMLDivElement>()
const gameMobileContainer = ref<HTMLDivElement>()
const loading = computed(() => demoMutateLoading.value || realMutateLoading.value)
const activeCurrency = computed(() => currency.value)
const loaded = ref(false)
const styles = ref({
  aspectRatio: `${gameMobileContainer.value?.clientWidth}/${gameMobileContainer.value?.clientHeight}`,
})

const openAuthModal = () => {
  router.push({
    path: router.currentRoute.value.path,
    query: {
      tab: LOGIN,
      modal: 'auth',
    }
  })
}

const handleRealPlay = () => {
  currentPlay.value = REAL_PLAY
  setActiveGameOption(game.slug, {
    currentPlay: REAL_PLAY,
    currency: activeCurrency.value,
  })
}

const handleFunPlay = () => {
  currentPlay.value = FUN_PLAY
  setActiveGameOption(game.slug, {
    currentPlay: FUN_PLAY,
    currency: activeCurrency.value,
  })
}

const handleUpdateCurrency = (v: string) => {
  setActiveGameOption(game.slug, {
    currency: v,
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

const launchGame = ({ url }: LaunchGameOption) => {
  unmountGame()
  if (gameContainer.value) {
    const iframe = document.createElement('iframe')
    iframe.src = url
    iframe.id = 'thirdPartyGame'
    iframe.style.border = '0px'
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.borderRadius = '8px'
    iframe.setAttribute('allow', 'fullscreen; camera; microphone; autoplay;')
    iframe.setAttribute('referrerpolicy', 'origin')
    gameContainer.value?.appendChild(iframe)
  }
}

const unmountGame = () => {
  if (gameContainer.value) {
    gameContainer.value!.innerHTML = ''
  }
}

const funPlay = () => {
  unmountGame()
  mutateStartDemo({
    game: game.identifier!,
    fiatCurrency: activeCurrency.value,
    cryptoCurrency: activeCryptoCode.value,
  })

  changedActiveCode.value = false
  if (!!game && me.value?.id && token.value) {
    updateGameKv({ game })
  }
}

const realPlay = () => {
  unmountGame()
  mutateStartReal({
    game: game.identifier!,
    fiatCurrency: activeCurrency.value,
    cryptoCurrency: activeCryptoCode.value,
  })

  changedActiveCode.value = false
  if (!!game && me.value?.id && token.value) {
    updateGameKv({ game })
  }
}

watch(
  () => currentPlay.value,
  (playValue) => {
    if (playValue === FUN_PLAY) {
      funPlay()
    } else if (playValue === WAITING_PLAY) {
      if (isLoggedIn.value) {
        realPlay()
      }
    }
  }
)

watch(
  () => changedActiveCode.value,
  (v) => {
    if (v) {
      if (currentPlay.value === REAL_PLAY) {
        currentPlay.value = WAITING_PLAY
      }

      if (isLoggedIn.value) {
        realPlay()
      }
    }
  }
)

onStartDemoDone((result) => {
  if (currentPlay.value !== FUN_PLAY && isLoggedIn.value) {
    return
  }

  const {
    data: {
      startDemoAleaPlay: { url },
    },
  } = result
  launchGame({ url })
})

onStartDemoError(({ graphQLErrors }) => {
  // @ts-ignore
  const errorCode = graphQLErrors[0]?.extensions.errors?.code
  if (errorCode === 153) {
    useGeneralNotify({
      type: 'error',
      title: t('notifications.error'),
      description: t('games.error-load'),
    })
  }
})

onStartRealDone((result) => {
  const {
    data: {
      startGameAleaPlay: { url },
    },
  } = result

  launchGame({ url })
})

onStartRealError(({ graphQLErrors }) => {
  // @ts-ignore
  const errorCode = graphQLErrors[0]?.extensions.errors?.code
  if (errorCode === 153) {
    useGeneralNotify({
      type: 'error',
      title: t('notifications.error'),
      description: t('games.error-load'),
    })
  }
})

const exitFullscreen = async () => {
  fullScreen.value = false
}

watch(
  () => gameMobileContainer.value,
  (value) => {
    if (value) {
      styles.value = {
        aspectRatio: `${gameMobileContainer.value?.clientWidth}/${gameMobileContainer.value?.clientHeight}`,
      }
      nextTick(() => {
        loaded.value = true
      })
    } else {
      loaded.value = false
    }
  },
  { immediate: true }
)

nuxtApp.hook('page:finish', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

onMounted(() => {
  if (gameMobileContainer.value) {
    useTimeoutFn(() => {
      styles.value = {
        aspectRatio: `${gameMobileContainer.value?.clientWidth}/${gameMobileContainer.value?.clientHeight}`,
      }

      if (gameContainer.value) {
        watch(
          () => isLoggedIn.value,
          (v) => {
            if (v) {
              realPlay()
            } else if (hasOnlyRealPlay.value) {
              openAuthModal()
            } else {
              funPlay()
            }
          },
          { immediate: true }
        )
      }

      nextTick(() => {
        loaded.value = true
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    }, 300)
  }

  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

onUnmounted(() => {
  currentPlay.value = WAITING_PLAY
  setActiveGameOption(game.slug, {
    currentPlay: WAITING_PLAY,
  })
})
</script>

<template>
  <div
    class="w-full h-full"
    :class="{
      'fixed z-1002 inset-0 p-0 m-0 bg-brand top-0 left-0 w-screen h-screen': fullScreen
    }"
  >
    <div
      ref="gameMobileContainer"
      class="GameMainMobile rounded-md relative w-full h-full min-h-[calc(100vh-235px)]"
    >
      <div
        v-if="fullScreen"
        class="flex justify-end items-center p-4 absolute top-0 right-0 z-10"
      >
        <CloseButton
          class="w-4 h-4 min-w-4 min-h-4"
          @click="exitFullscreen"
        />
      </div>

      <div
        id="gameStage"
        class="w-full h-full p-0 m-0"
      >
        <div
          ref="gameContainer"
          :class="{
            'hidden': currentPlay === WAITING_PLAY || !loaded,
          }"
          :style="styles"
          class="
            bg-green-950 flex items-center justify-center border border-brand
            rounded-md overflow-hidden w-full h-full min-h-[calc(100vh-235px)]
          "
        />

        <div
          v-if="currentPlay === WAITING_PLAY"
          class="
            absolute inset-0 flex flex-col justify-center items-center gap-2.5 rounded
            font-semibold bg-green-950 w-full h-full min-h-[calc(100vh-235px)] px-2 border border-brand
          "
        >
          <div class="flex gap-2.5 items-center justify-between w-full px-4">
            <NuxtImg
              :src="game.image"
              :alt="game.slug"
              class="block object-cover rounded-md"
              loading="lazy"
              style="width: 139px; height: 188px"
            />

            <div class="flex flex-col gap-2.5 text-paragraph text-left w-1/2">
              <div class="font-bold text-white text-base w-full">
                {{ game.title }}
              </div>
              <div class="font-semibold text-sm hover:text-white w-full">
                <NuxtLinkLocale :to="`/casino/provider/${game.gameProvider.slug}`">
                  {{ game?.gameProvider?.display_name }}
                </NuxtLinkLocale>
              </div>
              <div class="flex items-center">
                <UIcon
                  :name="fullScreen ? 'gridicons:fullscreen-exit' : 'gridicons:fullscreen'"
                  class="h-6 w-6 min-w-6 min-h-6 text-paragraph hover:text-white"
                  @click="fullScreen = !fullScreen"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2.5 text-paragraph w-full">
            <div class="flex flex-col gap-2.5 items-center justify-center w-full px-4">
              <template v-if="isLoggedIn">
                <JButton
                  block="block"
                  class="w-full h-12"
                  size="md"
                  variant="bet-gradient"
                  @click="handleRealPlay"
                >
                  {{ t('games.real-play') }}
                </JButton>
                <JButton
                  v-if="!hasOnlyRealPlay"
                  block="block"
                  button-class="bg-border! font-bold"
                  class="w-full h-12"
                  size="md"
                  variant="alternative"
                  @click="handleFunPlay"
                >
                  {{ t('games.fun-play') }}
                </JButton>
              </template>
              <template v-else>
                <JButton
                  block="block"
                  class="w-full h-12"
                  size="md"
                  @click="openAuthModal"
                >
                  {{ t('auth.login') }}
                </JButton>
                <JButton
                  block="block"
                  class="w-full h-12"
                  size="md"
                  variant="outline"
                  @click="openRegisterModal"
                >
                  {{ t('auth.register') }}
                </JButton>
              </template>
            </div>

            <div class="flex items-center justify-center gap-2.5 w-full">
              <span class="text-sm font-semibold text-white">
                {{ t('games.balance-in') }}
              </span>
              <FiatPopover
                :content-height="150"
                button-class="w-full max-w-26 pl-3 pr-1.5 py-1 hover:shadow-none rounded-md bg-brand!"
                @update:fiat-value="handleUpdateCurrency"
              />
            </div>
          </div>
        </div>
        <div
          v-else-if="loading"
          class="absolute inset-0 flex justify-center items-center w-full h-full"
        >
          <CasinoAnimateLogo
            class="max-h-(--breakpoint-logo-height) max-w-(--breakpoint-logo-height) md:max-w-(--breakpoint-logo-width) w-[150px] md:w-[200px] h-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>
