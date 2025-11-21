import { dualRankFields, rakebackRankFields, vipReloadFields, vipLevelFields, paginatorInfoFields } from './fragments'

export const VIP_QUERY = gql`
  query vip {
    vip {
      __typename
      id
      didLevelUp
      nextXpThreshold
      wagered_all_time
      xp
      vipLevel {
        order
      }
      dualRank {
        ...dualRankFields
      }
    }
  }
  ${dualRankFields}
`

export const VIP_RAKEBACK_QUERY = gql`
  query vipRakeback {
    vipRakeback {
      ...rakebackRankFields
    }
  }
  ${rakebackRankFields}
`

export const VIP_LEVELS_QUERY = gql`
  query vipLevels(
    $first: Int!
    $orderBy: [QueryVipLevelsOrderByOrderByClause!]
  ) {
    vipLevels(
      first: $first,
      orderBy: $orderBy,
    ) {
      data {
        ...vipLevelFields
      }
      paginatorInfo {
        ...paginatorInfoFields
      }
    }
  }
  ${vipLevelFields}
  ${paginatorInfoFields}
`

export const VIP_RELOAD_QUERY = gql`
  query vipReload {
    vipReload {
      ...vipReloadFields
    }
  }
  ${vipReloadFields}
`

export const DAILY_SPINS_QUERY = gql`
  query dailySpins {
    dailySpins {
      canClaimDailySpins
      daily_spin_claimed_at
      daily_spin_count
      daily_spin_currency {
        id
        code
      }
      daily_spin_game {
        id
        slug
      }
      daily_spin_next_claim
      daily_spin_value
      daily_spin_won
      daily_spins
      daily_spins_free_bets
      isExpired
      min_vip_level_order
    }
  }
`

export const VIP_SUBSCRIPTION = gql`
  subscription vipUpdated {
    vipUpdated {
      __typename
      id
      xp
      wagered_all_time
      nextXpThreshold
      didLevelUp
      dualRank {
        ...dualRankFields
      }
    }
  }
  ${dualRankFields}
`

export const CLAIM_RAKEBACK_MUTATION = gql`
  mutation claimRakeback {
    claimRakeback {
      id
      canClaimRakeback
      percentage
      values
      xp
    }
  }
`

export const SETUP_RANKUP_MUTATION = gql`
  mutation setupRankup($interval: ClaimInterval!) {
    setupRankup(interval: $interval) {
      id
      availableXpOnLevel
      bonusPerClaim
      canClaimCurated
      canClaimPerLevel
      canClaimRankUp
      claimInterval
      claimedCount
      claims
      claimsAvailable
      curatedAmount
      nextClaimInterval
      percentage
      upcomingRank {
        level_name
        total_wagered
        xp_threshold
      }
      vipLevel
      wagered
      xp
      xpThreshold
    }
  }
`

export const CLAIM_RANKUP_MUTATION = gql`
  mutation claimRankUp($currencyCode: String!) {
    claimRankUp(input: { currencyCode: $currencyCode }) {
      id
      availableXpOnLevel
      bonusPerClaim
      canClaimCurated
      canClaimPerLevel
      canClaimRankUp
      claimInterval
      claims
      claimedCount
      claimsAvailable
      curatedAmount
      nextClaimInterval
      percentage
      upcomingRank {
        level_name
        total_wagered
        xp_threshold
      }
      vipLevel
      wagered
      xp
      xpThreshold
    }
  }
`

export const ACTIVATE_RELOAD_MUTATION = gql`
  mutation activateReload($interval: ReloadInterval!) {
    activateReload(interval: $interval) {
      ...vipReloadFields
    }
  }
  ${vipReloadFields}
`

export const CHANGE_RELOAD_MUTATION = gql`
  mutation changeReload($interval: ReloadInterval!) {
    changeReload(interval: $interval) {
      ...vipReloadFields
    }
  }
  ${vipReloadFields}
`

export const CLAIM_RELOAD_MUTATION = gql`
  mutation claimReload($currencyCode: String!) {
    claimReload(input: { currencyCode: $currencyCode }) {
      ...vipReloadFields
    }
  }
  ${vipReloadFields}
`

export const CLAIM_WEEKLY_MUTATION = gql`
  mutation claimWeekly($currencyCode: String!) {
    claimWeekly(input: { currencyCode: $currencyCode }) {
      ...vipReloadFields
    }
  }
  ${vipReloadFields}
`

export const CLAIM_DAILY_SPIN_MUTATION = gql`
  mutation claimDailySpins($input: ClaimInput) {
    claimDailySpins(input: $input) {
      canClaimDailySpins
      isExpired
      min_vip_level_order
      daily_spins
      daily_spins_free_bets
      daily_spin_value
      daily_spin_claimed_at
      daily_spin_next_claim
      daily_spin_game {
        id
        slug
      }
      daily_spin_currency {
        id
        code
      }
      daily_spin_count
      daily_spin_won
    }
  }
`
