import { GEOCODE_ADDRESS_QUERY } from '~/graphql'
import type { Address } from '~/types'

export const useAddress = (
  {
    input = '',
  }: {
    input: string | number
  }
) => {
  const {
    load: addressLoad,
    result: addressResult,
    loading: addressLoading,
    refetch: addressReFetch,
    onResult: onAddressResult,
    onError: onAddressError,
  } = useLazyQuery<{
    geocodeAddress: Address[];
  }>(GEOCODE_ADDRESS_QUERY, {
    input,
  }, { fetchPolicy: 'cache-and-network' })
  const { t } = useI18n()

  onAddressError((error) => {
    const parsedError = parseGraphqlError(error)
    useGeneralNotify({
      type: 'error',
      title: t('notifications.failed-search-address'),
      description: parsedError.message
    })
  })

  return {
    addressLoad,
    addressReFetch,
    addressResult,
    addressLoading,
    onAddressResult
  }
}
