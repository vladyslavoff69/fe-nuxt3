import { TOGGLE_FAVORITE_MUTATION } from '~/graphql'
import { AUTH, PREFERENCE } from '~/constants'

export const useGameFavorite = (gameId: number) => {
  const { t } = useI18n()
  const { isLoggedIn, openAuthModal } = inject(AUTH)!
  const { favGameReFetch, favoriteGames } = inject(PREFERENCE)!

  const isInFavorites = ref<boolean>(false)

  const {
    mutate: favoriteMutate,
    onDone: favoriteOnDone,
    onError: favoriteOnError
  } = useMutation(TOGGLE_FAVORITE_MUTATION)

  favoriteOnDone(({ data }) => {
    useGeneralNotify({
      type: 'success',
      title: t('notifications.favorite-game-updated'),
      description: data.toggleFavorite ? t('notifications.added-game-to-favorites') : t('notifications.removed-game-from-favorites')
    })

    isInFavorites.value = !isInFavorites.value

    useTimeoutFn(() => {
      favGameReFetch()
    }, 200)
  })

  favoriteOnError((error) => {
    const parsedError = parseGraphqlError(error)
    isInFavorites.value = !isInFavorites.value
    useGeneralNotify({
      type: 'error',
      title: 'Server Error!',
      description: parsedError.message
    })
  })

  const toggleFavorite = async (e) => {
    e.stopPropagation()
    if (!isLoggedIn.value) {
      openAuthModal()
    } else if (gameId) {
      await favoriteMutate({ gameId })
    }
  }

  watch(() => gameId, (v) => {
    if (v) {
      const favIdx = favoriteGames.value?.find(item => Number(item.id) === gameId)
      if (favIdx) {
        isInFavorites.value = true
      }
    }
  }, { immediate: true })

  return {
    toggleFavorite,
    isInFavorites
  }
}
