import {
  diceGameMatchFields,
  kenoGameMatchFields,
  limboGameMatchFields,
  plinkoGameMatchFields,
  wheelGameMatchFields
} from '~/apps/game/fragments'

/**
 * ==== LIMBO ====
 */
export const LIMBO_BET_GAME_MUTATION = gql`
  mutation limboBetGame($input: LimboBetGameInput!) {
    limboBetGame(input: $input) {
      ...limboGameMatchFields
    }
  }
  ${limboGameMatchFields}
`

export const LIMBO_RESULT_QUERY = gql`
  query limboResult($id: ID!) {
    limboResult(id: $id) {
      ...limboGameMatchFields
    }
  }
  ${limboGameMatchFields}
`

/**
 * ==== DICE ====
 */
export const DICE_BET_GAME_MUTATION = gql`
  mutation diceBetGame($input: DiceBetGameInput!) {
    diceBetGame(input: $input) {
      ...diceGameMatchFields
    }
  }
  ${diceGameMatchFields}
`

export const DICE_RESULT_QUERY = gql`
  query diceResult($id: ID!) {
    diceResult(id: $id) {
      ...diceGameMatchFields
    }
  }
  ${diceGameMatchFields}
`

/**
 * ==== KENO ====
 */
export const KENO_BET_GAME_MUTATION = gql`
  mutation kenoBetGame($input: KenoBetGameInput!) {
    kenoBetGame(input: $input) {
      ...kenoGameMatchFields
    }
  }
  ${kenoGameMatchFields}
`

export const KENO_RESULT_QUERY = gql`
  query kenoResult($id: ID!) {
    kenoResult(id: $id) {
      ...kenoGameMatchFields
    }
  }
  ${kenoGameMatchFields}
`

export const FREE_SPIN_QUERY = gql`
  query freeSpin($id: ID!) {
    freeSpin(id: $id) {
      id
      promo_spin
      free_rounds
      spin_results {
        rng
        payout
        nonce
      }
      total_won
    }
  }
`

export const PLINKO_BET_GAME_MUTATION = gql`
  mutation PlinkoBetGame($input: PlinkoBetGameInput!) {
    plinkoBetGame(input: $input) {
      ...plinkoGameMatchFields
    }
  }
  ${plinkoGameMatchFields}
`

export const PLINKO_FREE_BET_GAME_MUTATION = gql`
  mutation PlinkoFreeBetGame($input: PlinkoFreeSpinGameInput!) {
    plinkoFreeSpinMutation(input: $input) {
      id
      balance
      betAmount
      delta
      nonce
      payout
      payoutMultiplier
      result
      risk
      rows
      transactionId
    }
  }
`

export const WHEEL_BET_GAME_MUTATION = gql`
  mutation wheelBetGame($input: WheelBetGameInput!) {
    wheelBetGame(input: $input) {
      ...wheelGameMatchFields
    }
  }
  ${wheelGameMatchFields}
`
