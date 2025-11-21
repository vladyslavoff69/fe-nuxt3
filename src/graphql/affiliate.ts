import { paginatorInfoFields, sponsorCodeFields, } from '~/graphql/fragments'

export const SPONSOR_COMMISSIONS_TOTALS_QUERY = gql`
  query SponsorCommissionsTotals {
    sponsorCommissionsTotals {
      id
      total_sponsor_commission_claimable
      total_sponsor_commission_claimed
      total_sponsor_commission
      total_affiliates
      total_commission
      total_wagered_by_affiliates
      sponsor_commission_tier_percentage
    }
  }
`

export const GET_SPONSOR_CODE_QUERY = gql`
  query getSponsorCode($code: String) {
    getSponsorCode(code: $code) {
      percent_back
      code
    }
  }
`

export const SPONSOR_AFFILIATES_ANALYTICS_QUERY = gql`
  query SponsorAffiliateAnalytics(
    $first: Int!
    $page: Int
    $input: SponsorAnalyticsFilter
    $orderBy: [QuerySponsorAffiliatesAnalyticsOrderByOrderByClause!]
  ) {
    sponsorAffiliatesAnalytics(
      first: $first
      page: $page
      input: $input
      orderBy: $orderBy
    ) {
      data {
        id
        created_at
        sponsorCode {
          ...sponsorCodeFields
        }
        affiliate {
          id
          username
          created_at
          vip_level_name
          total_wagered_as_affiliate
          total_affiliate_cashback_received_as_affiliate
          total_sponsor_commission_generated_as_affiliate
          total_commission_generated_as_affiliate
        }
      }
      paginatorInfo {
        ...paginatorInfoFields
      }
    }
  }
  ${sponsorCodeFields}
  ${paginatorInfoFields}
`

export const AFFILIATE_CURRENCY_BREAKDOWN_QUERY = gql`
  query AffiliateCurrencyBreakdown($username: String!) {
    affiliateCurrencyBreakdown(username: $username) {
      id
      affiliate_commission_claimed
      sponsor_commission_claimed
      affiliate_commission_claimable
      sponsor_commission_claimable
      wagered
      loss
      total_affiliate_commission
      total_sponsor_commission
      total_commission
      affiliate {
        username
        vip_level_name
      }
      currency {
        code
        id
      }
    }
  }
`

export const SPONSOR_COMMISSIONS_BY_CURRENCY_QUERY = gql`
  query SponsorCommissionsByCurrency {
    sponsorCommissionsByCurrency(first: 100) {
      data {
        sponsor_commission_claimable
        total_sponsor_commission
        total_affiliate_commission
        sponsor_commission_claimed
        total_commission
        currency {
          id
          code
        }
      }
    }
  }
`

export const GET_AFFILIATE_STATES = gql`
  query affiliateStats {
    affiliateStats {
      totalReferred
      referredLastDay
      affiliateUsers
    }
  }
`

export const CREATE_SPONSOR_CODE_MUTATION = gql`
  mutation CreateSponsorCode($percentBack: Int, $code: String) {
    createSponsorCode(input: { percentBack: $percentBack, code: $code }) {
      ...sponsorCodeFields
    }
  }
  ${sponsorCodeFields}
`

export const CLAIM_SPONSOR_COMMISSIONS_MUTATION = gql`
  mutation ClaimSponsorCommissions {
    claimSponsorCommissions {
      title
      description
    }
  }
`

export const CLAIM_PERCENT_BACK_COMMISSIONS_MUTATION = gql`
  mutation ClaimPercentBackCommissions {
    claimPercentBackCommissions {
      title
      description
    }
  }
`

export const APPLY_SPONSOR_CODE_MUTATION = gql`
  mutation ApplySponsorCode($code: String) {
    applySponsorCode(code: $code) {
      title
      description
    }
  }
`
