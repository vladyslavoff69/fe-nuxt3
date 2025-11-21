import { CHARITIES } from '~/graphql'

export const usePlayerCharities = ({
  category,
  limit = 10,
  name,
}: {
  category?: string
  limit?: number
  name?: string
}) => {
  const {
    result: charitiesResult,
    loading: charitiesLoading,
    refetch: refetchCharities,
    load: loadCharities,
  } = useLazyQuery(
    CHARITIES,
    {
      category,
      limit,
      name
    }
  )

  const charities = computed(() => (charitiesResult.value ? charitiesResult.value.charities : []))

  return {
    charitiesResult,
    charitiesLoading,
    refetchCharities,
    loadCharities,
    charities
  }
}
