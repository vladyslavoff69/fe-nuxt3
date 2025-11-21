import { TOGGLE_FAVORITE_CRYPTO_MUTATION } from '~/graphql'
import { AUTH, PREFERENCE } from '~/constants'

export const useCurrencyFavorite = (currencyId: number) => {
  const { t } = useI18n()
  const { isLoggedIn, openAuthModal } = inject(AUTH)!
  const { favCryptoReFetch, favoriteCryptoCodes } = inject(PREFERENCE)!

  const isInFavorites = ref<boolean>(false)

  onMounted(() => {
    if (currencyId > 0) {
      const favIdx = favoriteCryptoCodes.value.findIndex(item => Number(item.id) === currencyId)
      if (favIdx > -1) {
        isInFavorites.value = true
      }
    }
  })

  const {
    mutate: favoriteMutate,
    onDone: favoriteOnDone,
    onError: favoriteOnError
  } = useMutation(TOGGLE_FAVORITE_CRYPTO_MUTATION)

  favoriteOnDone(({ data }) => {
    useGeneralNotify({
      type: 'success',
      title: t('notifications.favorite-crypto-updated'),
      description: data?.toggleFavoriteCurrency ? t('notifications.added-currency-to-favorites') : t('notifications.removed-currency-from-favorites')
    })

    useTimeoutFn(() => {
      favCryptoReFetch()
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

  const toggleFavorite = (e) => {
    e.stopPropagation()
    if (!isLoggedIn.value) {
      openAuthModal()
    } else if (currencyId) {
      isInFavorites.value = !isInFavorites.value
      favoriteMutate({ currencyId: Number(currencyId) })
    }
  }
  return {
    toggleFavorite,
    isInFavorites
  }
}
