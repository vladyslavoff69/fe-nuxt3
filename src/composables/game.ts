import { Howl } from 'howler'
import useVuelidate from '@vuelidate/core'
import { helpers, maxValue, minValue, required, } from '@vuelidate/validators'
import { useTickCallback } from '.'
import { AUTH, CURRENCY, MODALS, PAGE_LOADING } from '~/constants'
import { GAME_QUERY } from '~/graphql'
import type { Game, GameTransaction } from '~/types'
import { useGameSettingStore } from '~/store/games/settings'

export const useGame = (gameSlug: string) => {
  const {
    result,
    loading,
  } = useQuery<{ game: Game }>(GAME_QUERY, {
    slug: gameSlug,
  }, {
    enabled: import.meta.client,
    fetchPolicy: 'cache-and-network'
  })

  const { useAddLoading } = inject(PAGE_LOADING)!
  const { add: addLoading, remove: removeLoading } = useAddLoading()
  const game = computed(() => result.value?.game)

  const checkIfNotFoundOrDisabled = () => {
    if (!game.value || !game.value?.enabled) {
      useGeneralNotify({
        type: 'error',
        title: 'Game Not Found',
        description: 'Game Not Found',
      })

      return
    }
  }

  watch(
    () => loading.value,
    (isLoading) => {
      if (isLoading) {
        addLoading()
      } else {
        removeLoading(100)
      }
    },
    { immediate: loading.value }
  )

  watchEffect(() => {
    if (import.meta.client && !loading.value) {
      checkIfNotFoundOrDisabled()
    }
  })

  return {
    loading,
    game
  }
}

export const useQueueFn = <T extends Function>(fn: T, interval = 50) => {
  const queue: Function[] = []
  let onDoneCallbacks: Function[] = []
  const loading = ref(false)
  const idle = ref(true)
  let runningFunctions: any[] = []

  const func = (...args: any[]) => {
    queue.push(async () => await fn(...args))
    idle.value && resume()
  }

  const onDone = (onDoneFn: Function) => {
    onDoneCallbacks.push(onDoneFn)
    return () => {
      onDoneCallbacks = onDoneCallbacks.filter(
        (iFn: Function) => iFn !== onDoneFn
      )
    }
  }

  let timeout = setTimeout(() => {
  }, 60000)

  const resume = () => {
    idle.value = false
    loading.value = true
    const currentFn = queue.shift()!
    runningFunctions.push(currentFn())

    timeout = setTimeout(async () => {
      if (queue.length === 0) {
        idle.value = true
        const currentRunnings = [...runningFunctions]
        Promise.all(currentRunnings)
          .then(() => {
            if (
              idle.value &&
            runningFunctions.length === currentRunnings.length
            ) {
              onDoneCallbacks.forEach((iFn) => {
                iFn()
              })
              runningFunctions = []
              loading.value = false
            }
          })
          .catch(() => {
          })
      } else {
        resume()
      }
    }, interval)
  }

  onBeforeMount(() => {
    clearTimeout(timeout)
  })

  return {
    func,
    onDone,
    loading,
  }
}

export const useAudio = (url: string, timeout = 40) => {
  const store = useGameSettingStore()
  let endCallbacks: Function[] = []
  const onEnd = (fn: Function) => {
    endCallbacks.push(fn)
    return () => {
      endCallbacks = endCallbacks.filter(iFn => iFn !== fn)
    }
  }

  const audio = new Howl({
    src: [url],
    preload: true,
    mute: false,
    volume: store.audioVolume.value / 100,
    onend: () => {
      endCallbacks.forEach((fn: Function) => {
        fn()
      })
    },
  })

  const { tickCallback: play } = useTickCallback(() => {
    if (audio.playing()) {
      audio.stop()
    }

    audio.play()
  }, timeout)

  const { tickCallback: stop } = useTickCallback(() => {
    if (audio.playing()) {
      audio.stop()
    }
  }, 0)

  const off = () => {
    audio.volume(store.audioVolume.value / 100)
  }

  watch(() => store.audioVolume.value, (v, oV) => {
    if (v !== oV) {
      audio.volume(v / 100)
    }
  }, { immediate: true })

  const destroyAudio = () => {
    if (audio && audio.playing()) {
      audio.stop()
      off()
      audio.unload()
    }
  }

  onUnmounted(() => {
    destroyAudio()
  })

  return {
    audio,
    play,
    stop,
    onEnd,
    destroyAudio,
  }
}

export const useGameHotkeys = (
  betCryptoAmount: Ref<number> = ref(0),
  { applyDefaults = false, isIdle = ref(true) } = {}
) => {
  const { currentCryptoBalance } = inject(CURRENCY)!

  const store = useGameSettingStore()
  const onGameKeyStroke = (
    keys: string[],
    callback: (event: KeyboardEvent) => void
  ) => {
    onKeyStroke(
      keys,
      (e) => {
        if (!store.hotKey.value || isInputEvent(e) || !isIdle.value) {
          return
        }
        e.preventDefault()
        callback(e)
      },
      { dedupe: true }
    )
  }

  const onGameKeyStrokeAnytime = (
    keys: string[],
    callback: (event: KeyboardEvent) => void
  ) => {
    onKeyStroke(
      keys,
      (e) => {
        if (!store.hotKey.value || isInputEvent(e)) {
          return
        }
        e.preventDefault()
        callback(e)
      },
      { dedupe: true }
    )
  }

  const onGameKeyDownAnytimeRepeat = (
    keys: string[],
    callback: (event: KeyboardEvent) => void,
    ms = 200
  ) => {
    const throttledCallback = useThrottleFn(callback, ms)
    onKeyStroke(
      keys,
      (e) => {
        if (!store.hotKey.value || isInputEvent(e)) {
          return
        }
        e.preventDefault()
        throttledCallback(e)
      },
      { dedupe: false }
    )
  }

  const onBetKeyStroke = (callback: (event: KeyboardEvent) => void, ms = 200) => {
    onGameKeyDownAnytimeRepeat([' '], callback, ms)
  }

  const applyDefaultKeys = () => {
    onGameKeyStroke(['s', 'S'], () => {
      betCryptoAmount.value = Math.min(
        betCryptoAmount.value * 2,
        currentCryptoBalance.value
      )
    })
    onGameKeyStroke(['a', 'A'], () => {
      betCryptoAmount.value = Math.min(
        betCryptoAmount.value / 2,
        currentCryptoBalance.value
      )
    })
    onGameKeyStroke(['d', 'D'], () => {
      betCryptoAmount.value = 0
    })
  }

  onMounted(() => {
    if (applyDefaults) {
      applyDefaultKeys()
    }
  })

  return {
    onGameKeyStroke,
    onBetKeyStroke,
    applyDefaultKeys,
    onGameKeyStrokeAnytime,
  }
}

export const useGameValidation = (betCryptoAmount: Ref<number>) => {
  const { currentCryptoBalance } = inject(CURRENCY)!
  const { t } = useI18n()
  const rules = computed(() => ({
    betCryptoAmount: {
      required,
      minValue: helpers.withMessage(
        t('errors.BET_MIN_LENGTH'),
        minValue(0)
      ),
      maxValue: helpers.withMessage(
        t('errors.BET_MAX_LENGTH'),
        maxValue(currentCryptoBalance.value)
      ),
    },
  }))

  const v$ = useVuelidate(
    rules,
    {
      betCryptoAmount,
    },
    { $autoDirty: true }
  )

  return {
    v$,
    invalid: computed(() => v$.value.$invalid),
  }
}

export const useOpenBetDetailsModal = () => {
  const router = useRouter()
  const openBetDetails = (bet: GameTransaction) => {
    router.push({
      path: router.currentRoute.value.path,
      query: {
        ...router.currentRoute.value.query,
        modal: 'bet',
        type: bet?.detail_type?.toLowerCase(),
        ref: bet?.transaction_id
      },
    })
  }

  return {
    openBetDetails,
  }
}

export const useRecentGame = () => {
  const { myRecentGames, gameList, recentGamesLoading } = inject(MODALS)!
  const token = getAuthCookie()
  const { me } = inject(AUTH)!
  const loadingCache = ref(false)

  const updateGameKv = async ({ game }) => {
    if (loadingCache.value || recentGamesLoading.value || !game) {
      return
    }

    const existingInd = myRecentGames.value.findIndex(i => i.id === game?.id)
    if (existingInd !== -1) {
      gameList.value.splice(existingInd, 1)
    }

    loadingCache.value = true

    gameList.value = [
      ...gameList.value,
      game
    ]

    await useFetch(
      `/api/kv/game/${me.value?.id}`,
      {
        method: 'POST',
        body: {
          value: JSON.stringify(gameList.value)
        },
        headers: {
          Authorization: `Bearer ${token.value}`,
        }
      }
    )

    loadingCache.value = false
  }

  return {
    updateGameKv
  }
}
