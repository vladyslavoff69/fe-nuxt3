import { AUTH } from '~/constants'
import { DEPOSIT_ADDRESS_QUERY } from '~/graphql'

export const useWalletAddress = (variables: {
  currencyCode: string;
  networkId: number;
}) => {
  const { isLoggedIn } = inject(AUTH)!

  const { result, loading, refetch, onError, options } = useQuery(
    DEPOSIT_ADDRESS_QUERY,
    {
      ...variables
    },
    { enabled: isLoggedIn.value },
  )

  watch(() => isLoggedIn.value, (v) => {
    if (v) {
      // @ts-ignore
      options.enabled = true
    }
  }, { immediate: true })

  return {
    result,
    loading,
    onError,
    refetch
  }
}
