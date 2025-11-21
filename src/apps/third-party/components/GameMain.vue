<script lang="ts" setup>
import { THIRD_PARTY_GAME } from '~/apps/third-party/constants'
import { START_DEMO_MUTATION, START_GAME_MUTATION } from '~/graphql'
import { AUTH, CREATE_USER, FUN_PLAY, GAME_POPUP, LOGIN, PREFERENCE, REAL_PLAY, THEME, WAITING_PLAY } from '~/constants'
import type { LaunchGameOption } from '~/types'
import FiatPopover from '~/components/organisms/wallets/popovers/FiatPopover.vue'

const router = useRouter()
const { screen } = inject(THEME)!
const { t } = useI18n()
const { me, isLoggedIn, openVerifyModal, isNotVerifiedEmail } = inject(AUTH)!
const { activeCryptoCode, changedActiveCode } = inject(PREFERENCE)!
const { game, currentPlay, fullScreen, theatreMode, currency, pictureMode, hasOnlyRealPlay } = inject(THIRD_PARTY_GAME)!
const { setActiveGameOption } = inject(GAME_POPUP)!
const gameContainer = ref<HTMLDivElement>()
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

const loading = computed(() => demoMutateLoading.value || realMutateLoading.value)
const activeCurrency = computed(() => currency.value)
const styles = computed(() => {
  if (theatreMode.value) {
    return {
      height: screen.value.lg
        ? 'calc(100vh - 70px - 55px)'
        : 'calc(100vh - 69px - 55px)',
    }
  } else {
    return {
      aspectRatio: '1360/765',
    }
  }
})

const unmountGame = () => {
  if (gameContainer.value) {
    gameContainer.value!.innerHTML = ''
    savedRecent.value = false
  }
}

const launchGame = ({ url }: LaunchGameOption) => {
  unmountGame()
  if (gameContainer.value) {
    const iframe = document.createElement('iframe')
    iframe.src = url
    iframe.id = 'thirdPartyGameMain'
    iframe.style.border = '0px'
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.borderRadius = '8px'
    iframe.setAttribute('allow', 'fullscreen; camera; microphone; autoplay')
    iframe.setAttribute('referrerpolicy', 'origin')
    gameContainer.value?.appendChild(iframe)
  }
}

const savedRecent = ref(false)
const funPlay = () => {
  unmountGame()
  mutateStartDemo({
    game: game.identifier!,
    fiatCurrency: activeCurrency.value,
    cryptoCurrency: activeCryptoCode.value,
  })

  changedActiveCode.value = false
  if (!!game && me.value?.id && token.value && !savedRecent.value) {
    updateGameKv({ game })
    savedRecent.value = true
  }
}

const realPlay = () => {
  if (isNotVerifiedEmail.value) {
    openVerifyModal()
  } else {
    unmountGame()
    mutateStartReal({
      game: game.identifier!,
      fiatCurrency: activeCurrency.value,
      cryptoCurrency: activeCryptoCode.value,
    })

    changedActiveCode.value = false
    if (!!game && me.value?.id && token.value && !savedRecent.value) {
      updateGameKv({ game })
      savedRecent.value = true
    }
  }
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

const enterFullScreen = () => {
  gameContainer.value!.requestFullscreen()
}

const openAuthModal = () => {
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

watch(
  () => currentPlay.value,
  (playValue) => {
    if (playValue === FUN_PLAY) {
      funPlay()
    } else if (playValue === WAITING_PLAY) {
      if (isLoggedIn.value) {
        realPlay()
      } else {
        funPlay()
      }
    }
  }
)

watch(
  () => fullScreen.value,
  (fullScreenValue) => {
    if (fullScreenValue) {
      enterFullScreen()
    }
  }
)

watch(
  () => pictureMode.value,
  (_pictureModeValue) => {
    if (!_pictureModeValue) {
      if (!hasOnlyRealPlay.value && currentPlay.value === FUN_PLAY) {
        funPlay()
      } else if (isLoggedIn.value) {
        realPlay()
      } else {
        currentPlay.value = WAITING_PLAY
      }
    }
  }
)

watch(
  () => changedActiveCode.value,
  (n) => {
    if (n) {
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

onMounted(() => {
  // if game container is existed
  if (gameContainer.value) {
    gameContainer.value!.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        fullScreen.value = false
      }
    })

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
})

onUnmounted(() => {
  currentPlay.value = WAITING_PLAY
  setActiveGameOption(game.slug, {
    currentPlay: WAITING_PLAY,
  })

  unmountGame()
})
</script>

<template>
  <div class="GameMain relative w-full rounded-md">
    <template v-if="!pictureMode">
      <div
        ref="gameContainer"
        :style="styles"
        class="bg-green-950 flex items-center w-full justify-center rounded-md overflow-hidden border border-brand"
      />
      <div
        v-if="currentPlay === WAITING_PLAY"
        class="absolute inset-0 flex justify-center items-center font-semibold bg-green-950 w-full rounded-md border border-brand"
      >
        <div class="w-full">
          <div class="flex items-center justify-center gap-x-2 mb-2">
            <span class="text-sm font-semibold text-white">
              {{ t('games.balance-in') }}
            </span>
            <FiatPopover
              :content-height="screen.md ? 300 : 150"
              button-class="w-full max-w-26 pl-3 pr-1.5 py-1 hover:shadow-none rounded-md bg-brand!"
              @update:fiat-value="handleUpdateCurrency"
            />
          </div>
          <div class="flex gap-x-3 items-center justify-center">
            <template v-if="isLoggedIn">
              <JButton
                class="px-4"
                variant="bet-gradient"
                @click="handleRealPlay"
              >
                {{ t('games.real-play') }}
              </JButton>
              <JButton
                v-if="!hasOnlyRealPlay"
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
                @click="openAuthModal"
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
      <div
        v-else-if="loading"
        class="absolute inset-0 flex justify-center items-center w-full h-full"
      >
        <CasinoAnimateLogo
          class="max-h-(--breakpoint-logo-height) max-w-(--breakpoint-logo-height) md:max-w-(--breakpoint-logo-width) w-[150px] md:w-[200px] h-full"
        />
      </div>
    </template>
    <div
      v-else
      :style="styles"
      class="flex justify-center items-center text-white text-2xl bg-brand"
    >
      {{ t('games.pop-out') }}
    </div>
  </div>
</template>
