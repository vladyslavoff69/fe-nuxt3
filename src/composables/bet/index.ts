import type { BetTransactions, ID } from '~/types'
import {
  BETS_HIGHROLLERS_QUERY,
  BETS_QUERY,
  LIVE_FEED_HIGH_ROLLER_SUBSCRIPTION,
  LIVE_FEED_SUBSCRIPTION
} from '~/graphql'

export const useLiveBetsFormat = (subscriptionData: any) => {
  return {
    ...subscriptionData.data.liveFeed,
    __typename: 'BetFeed',
    id: subscriptionData.data.liveFeed.id,
    amount: Number(subscriptionData.data.liveFeed.amount),
    match_status: subscriptionData.data.liveFeed?.match_status || 'playing',
    username: subscriptionData.data.liveFeed?.username || subscriptionData.data.liveFeed.display_name,
  }
}

export const useBets = (
  {
    game_id = '',
    limit = 10,
    type = '',
    accept_null_cursor = false,
    only_finished_matches = true,
  }: {
    game_id?: ID,
    limit?: number,
    type?: string,
    accept_null_cursor?: boolean
    only_finished_matches?: boolean
  }
) => {
  const variables = {
    game_id,
    limit,
    type,
    accept_null_cursor,
    only_finished_matches,
    amount_start: 0.00000001
  }

  const {
    result: betsResult,
    loading: betsLoading,
    refetch: betsRefetch
  } = useQuery(
    BETS_QUERY,
    variables,
    { fetchPolicy: 'no-cache' }
  )

  const { onResult: onNewLiveBet } = useSubscription(
    LIVE_FEED_SUBSCRIPTION,
    {},
    { fetchPolicy: 'no-cache' }
  )

  const throttleFn = useThrottleFn((subscriptionData) => {
    if (!subscriptionData.data || !subscriptionData.data.liveFeed || subscriptionData.data.liveFeed.amount === 0) {
      return
    }

    const newBetData: BetTransactions = useLiveBetsFormat(subscriptionData)
    if (!!betsResult.value && !!betsResult.value.betsTable && !!betsResult.value.betsTable.results && newBetData) {
      betsResult.value = {
        ...betsResult.value,
        betsTable: {
          ...betsResult.value.betsTable,
          results: [
            newBetData,
            ...betsResult.value.betsTable.results
          ].slice(0, 50)
        },
      }
    }
  }, 800)

  onNewLiveBet((subscriptionData) => {
    throttleFn(subscriptionData)
  })

  const bets = computed(() => (betsResult.value?.betsTable?.results || []))

  return {
    betsLoading,
    bets,
    betsRefetch
  }
}

export const useHighRollersBets = (
  {
    limit = 10,
    type = 'CASINO',
    accept_null_cursor = false,
    only_finished_matches = true,
  }: {
    limit?: number,
    type?: string,
    accept_null_cursor?: boolean
    only_finished_matches?: boolean
  }) => {
  const {
    result,
    loading,
    refetch
  } = useQuery(
    BETS_HIGHROLLERS_QUERY, {
      limit,
      type,
      accept_null_cursor,
      only_finished_matches,
      amount_start: 0.00000001
    },
    { fetchPolicy: 'no-cache' }
  )

  const { onResult: onNewLiveBet } = useSubscription(
    LIVE_FEED_HIGH_ROLLER_SUBSCRIPTION,
    {},
    { fetchPolicy: 'no-cache' }
  )

  onNewLiveBet((subscriptionData) => {
    if (
      !subscriptionData.data ||
      !subscriptionData.data.liveFeedHighRoller ||
      !subscriptionData.data.liveFeedHighRoller.high_roller ||
      !subscriptionData.data.liveFeedHighRoller?.username ||
      subscriptionData.data.liveFeedHighRoller?.username === '' ||
      !subscriptionData.data.liveFeedHighRoller?.amount
    ) {
      return
    }

    const newBetData: BetTransactions = {
      ...subscriptionData.data.liveFeedHighRoller,
      __typename: 'BetFeed',
      id: subscriptionData.data.liveFeedHighRoller.id,
      amount: Number(subscriptionData.data.liveFeedHighRoller.amount),
      match_status: subscriptionData.data.liveFeedHighRoller?.match_status || 'playing',
      username: subscriptionData.data.liveFeedHighRoller?.username || subscriptionData.data.liveFeedHighRoller.display_name,
    }

    if (!!result.value && !!result.value.betsHighRollersTable && !!result.value.betsHighRollersTable.results && newBetData) {
      result.value = {
        ...result.value,
        betsHighRollersTable: {
          ...result.value.betsHighRollersTable,
          results: [
            newBetData,
            ...result.value.betsHighRollersTable.results
          ].slice(0, 50)
        }
      }
    }
  })

  const bets = computed(() => (result.value?.betsHighRollersTable?.results || []))

  return {
    loading,
    bets,
    refetch
  }
}
