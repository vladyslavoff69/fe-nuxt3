import type { TransactionFilter } from '~/types'

export const useTransactionDataTableFilters = () => {
  const requestParams: TransactionFilter = reactive({
    limit: 10,
    exclusive_start_key: null,
    currency_code: 'ALL',
    starts_at: '',
    ends_at: '',
  })

  const filters = computed(() => {
    const {
      currency_code,
      limit,
      exclusive_start_key,
      starts_at,
      ends_at
    } = requestParams

    const commonFilters = {
      limit,
      exclusive_start_key,
      starts_at: starts_at || null,
      ends_at: ends_at || null,
    }

    return currency_code === 'ALL'
      ? commonFilters
      : { ...commonFilters, currency_code }
  })

  const setQueryVariables = (value: TransactionFilter) => {
    const {
      limit,
      exclusive_start_key,
      currency_code,
      starts_at,
      ends_at
    } = value

    requestParams.limit = limit
    requestParams.exclusive_start_key = exclusive_start_key
    requestParams.currency_code = currency_code
    requestParams.starts_at = starts_at
    requestParams.ends_at = ends_at
  }

  return {
    requestParams,
    filters,
    setQueryVariables,
  }
}
