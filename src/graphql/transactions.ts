const transactionFields = gql`
  fragment transactionFields on UserTransaction {
    amount
    blockchairUrl
    currency_code
    created_at
    normalized_amount
    transaction_name
    transaction_type
    status
    txid
    txHash
    issued_at
    transaction_id
    user_id
    action_id
  }
`

export const WALLET_TRANSACTIONS_QUERY = gql`
  query playerTransactions($input: PlayerTransactionsFilter) {
    playerTransactions(input: $input) {
      items {
        ...transactionFields
      }
      perPage
      currentPage
      total
    }
  }
  ${transactionFields}
`

export const BLOCKCHAIR_URL_QUERY = gql`
  query getBlockchairUrl($actionId: String!) {
    getBlockchairUrl(actionId: $actionId) {
      url
    }
  }
`

export const RECENT_DEPOSITS_QUERY = gql`
  query depositsByUser($filter: DepositFilter) {
    depositsByUser(filter: $filter) {
      results {
        id
        amount
        blockchairUrl
        created_at
        currency_code
        status
        user_id
        txHash
      }
    }
  }
`

export const RECENT_WITHDRAWS_QUERY = gql`
  query withdrawsByUser($filter: TransactionFilter) {
    withdrawsByUser(filter: $filter) {
      results {
        id
        amount
        blockchairUrl
        created_at
        currency_code
        status
        user_id
        txHash
      }
    }
  }
`

const tipsFields = gql`
  fragment tipsFields on UserTransaction {
    amount
    blockchairUrl
    created_at
    currency_code
    sender_username
    receiver_username
    normalized_amount
    status
    transaction_name
    txHash
    txid
    transaction_id
    user_id
    action_id
  }
`

const gameHistoryFields = gql`
  fragment gameHistoryFields on UserTransaction {
    transaction_id
    issued_at
    created_at
    amount
    normalized_amount
    payout
    normalized_payout
    currency_code
    detail_type
    status
    user_id
    match_id
    game_id
    game_slug
    game
    match_status
    action_id
  }
`

export const MY_GAME_HISTORY_QUERY = gql`
  query playerTransactions($input: PlayerTransactionsFilter) {
    playerTransactions(input: $input) {
      items {
        ...gameHistoryFields
      }
      perPage
      currentPage
      total
    }
  }
  ${gameHistoryFields}
`

export const MY_TIPS_QUERY = gql`
  query playerTransactions($input: PlayerTransactionsFilter) {
    playerTransactions(input: $input) {
      items {
        ...tipsFields
      }
      perPage
      currentPage
      total
    }
  }
  ${tipsFields}
`

export const RECENT_TIPS_QUERY = gql`
  query myTips($filter: TransactionFilter!) {
    myTips(filter: $filter) {
      results {
        id
        amount
        created_at
        currency_code
        sender_username
        receiver_username
        status
        transaction_id
        transaction_type
        type
        user_id
      }
    }
  }
`

export const PROMO_CODE_BY_USER = gql`
  query PromocodeByUser(
    $filters: PromocodeFilter!
    $first: Int!
    $page: Int
    $orderBy: [QueryPromocodeByUserOrderByOrderByClause!]
  ) {
    promocodeByUser(
      filter: $filters
      first: $first
      page: $page
      orderBy: $orderBy
    ) {
      data {
        id
        couponable_type
        couponable_id
        redeemed_at
        coupon {
          id
          code
          value
          is_enabled
          type
          currency_code
        }
      }
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        lastPage
        perPage
        total
      }
    }
  }
`
