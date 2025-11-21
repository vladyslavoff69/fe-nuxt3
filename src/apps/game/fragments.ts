export const limboGameMatchFields = gql`
  fragment limboGameMatchFields on LimboGameMatch {
    id
    target
    betAmount
    transactionId
    payoutMultiplier
    result
    balance
    status
    delta
    nonce
  }
`

export const diceGameMatchFields = gql`
  fragment diceGameMatchFields on DiceGameMatch {
    id
    betAmount
    transactionId
    payoutMultiplier
    result
    balance
    status
    delta
    nonce
    target
    condition
  }
`

export const kenoGameMatchFields = gql`
  fragment kenoGameMatchFields on KenoGameMatch {
    id
    balance
    betAmount
    delta
    nonce
    numbers
    payoutMultiplier
    result
    risk
    status
    transactionId
  }
`

export const plinkoGameMatchFields = gql`
  fragment plinkoGameMatchFields on PlinkoGameMatch {
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
    status
    transactionId
  }
`

export const wheelGameMatchFields = gql`
  fragment wheelGameMatchFields on WheelGameMatch {
    id
    angle
    balance
    betAmount
    delta
    nonce
    payout
    payoutMultiplier
    result
    risk
    segment
    segments
    status
    transactionId
  }
`
