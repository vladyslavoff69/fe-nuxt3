import { BETS_BY_USER_QUERY, LIVE_FEED_USER_SUBSCRIPTION } from '~/graphql'
import { AUTH } from '~/constants'
import type { BetTransactions, ID } from '~/types'

export const useBetsByUser = (
  {
    game_id = null,
    limit = 10,
    type = 'CASINO',
    accept_null_cursor = false,
    only_finished_matches = true
  }: {
    game_id?: ID | null,
    limit?: number,
    type?: string,
    accept_null_cursor?: boolean,
    only_finished_matches?: boolean
  }
) => {
  const { isLoggedIn, me } = inject(AUTH)!

  const variables = {
    limit,
    type,
    accept_null_cursor,
    only_finished_matches
  }

  const requests = game_id && game_id !== 'ALL'
    ? {
      ...variables,
      game_id
    }
    : variables

  const {
    result: betsResult,
    loading: betsLoading,
    refetch: betsRefetch,
    options,
  } = useQuery(
    BETS_BY_USER_QUERY,
    requests,
    {
      enabled: isLoggedIn.value
    }
  )

  const { onResult: onNewLiveBet } = useSubscription(
    LIVE_FEED_USER_SUBSCRIPTION,
    {
      user_id: Number((me.value?.id ?? 0))
    },
    {
      fetchPolicy: 'no-cache'
    },
  )

  onNewLiveBet((subscriptionData) => {
    if (
      !subscriptionData.data.liveFeedUser ||
      subscriptionData.data.liveFeedUser.user_id !== Number((me.value?.id ?? 0))
    ) {
      return
    }

    const newBetData: BetTransactions = {
      ...subscriptionData.data.liveFeedUser,
      __typename: 'BetFeed',
      amount: Number(subscriptionData.data.liveFeedUser.amount),
      match_status: subscriptionData.data.liveFeedUser.match_status || 'playing',
      username: subscriptionData.data.liveFeedUser.username || subscriptionData.data.liveFeedUser.display_name,
    }

    if (!!betsResult.value && !!betsResult.value.betsTableByUser && !!betsResult.value.betsTableByUser.results && newBetData) {
      betsResult.value = {
        ...betsResult.value,
        betsTableByUser: {
          ...betsResult.value.betsTableByUser,
          results: [
            newBetData,
            ...betsResult.value.betsTableByUser.results
          ].slice(0, 50)
        },
      }
    }
  })

  watch(
    () => isLoggedIn.value,
    (v: boolean) => {
      if (v) {
        // @ts-ignore
        options.enabled = true
      }
    },
    { immediate: true }
  )

  const bets = computed(() => (betsResult.value?.betsTableByUser?.results || []))

  return {
    betsLoading,
    bets,
    betsRefetch
  }
}
