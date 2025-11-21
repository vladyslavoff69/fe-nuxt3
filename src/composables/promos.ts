import { PROMO_CAMPAIGNS_QUERY } from '~/graphql'

export const usePromotions = ({ promoId, category, enabled }) => {
  const variables = computed(() => {
    const _inputs: any = {}

    if (category && category !== 'all') {
      _inputs.active = category !== 'expired'
    }

    if (promoId) {
      _inputs.slug = promoId
    }

    if (enabled) {
      _inputs.enabled = true
    }

    return _inputs
  })

  const { loading, result, refetch, onResult } = useQuery(
    PROMO_CAMPAIGNS_QUERY, variables, {
      fetchPolicy: 'cache-and-network',
      enabled: import.meta.client
    }
  )

  const promotions = computed(() => (result.value?.promoCampaigns || []))

  return {
    loading,
    result,
    onResult,
    refetchPromotions: refetch,
    promotions
  }
}

export const useRemainingTime = (expirationDateTime) => {
  const remainingTime = ref<any>({})

  const calculateRemainingTime = () => {
    if (!expirationDateTime) {
      remainingTime.value = {}
      return
    }
    const now = new Date()
    const expiration = new Date(expirationDateTime)
    const difference = expiration.getTime() - now.getTime()

    if (difference <= 0) {
      remainingTime.value.is_expired = true
      return
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    remainingTime.value = {
      total: difference,
      formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
      days,
      hours,
      minutes,
      seconds
    }
  }

  let intervalId: NodeJS.Timeout

  onMounted(() => {
    calculateRemainingTime()
    intervalId = setInterval(calculateRemainingTime, 1000)
  })

  onUnmounted(() => {
    clearInterval(intervalId)
  })

  return {
    remainingTime
  }
}
