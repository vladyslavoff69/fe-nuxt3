import { GAME_PROVIDERS_QUERY } from '~/graphql'

export const useGameProvider = (filterOptions: any) => {
  const {
    result: gameProvidersResult,
    loading: gameProvidersLoading,
    refetch: gameProvidersRefetch,
    load: gameProvidersLoad,
  } = useLazyQuery(
    GAME_PROVIDERS_QUERY,
    filterOptions,
    { fetchPolicy: 'no-cache' }
  )

  const gameProviders = computed(() => (gameProvidersResult.value ? gameProvidersResult.value.gameProviders : []))

  return {
    gameProvidersResult,
    gameProvidersLoading,
    gameProviders,
    gameProvidersRefetch,
    gameProvidersLoad
  }
}
