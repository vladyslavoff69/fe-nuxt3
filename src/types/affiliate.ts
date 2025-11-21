import type { DateTime, ID, PaginatorInfo, SelectOptionType } from '~/types/base'
import type { User } from '~/types/user'
import type { Currency } from '~/types/wallet'

export type SponsorCode = {
  id: ID;
  usage_limit: number;
  usage_count: number;
  code: string;
  percent_back: number;
  valid_to: DateTime;
  total_affiliates: number;
  total_wagered: number;
  total_commission: number;
  total_sponsor_commission: number;
  total_sponsor_commission_claimed: number;
  total_sponsor_commission_claimable: number;
  total_affiliate_cashback_sent_as_sponsor: number;
  sponsor_id: number;
};

export type SponsorCommissionsTotals = {
  id: ID;
  total_sponsor_commission_claimable: number;
  total_sponsor_commission_claimed: number;
  total_sponsor_commission: number;
  total_affiliates: number;
  total_commission: number;
  total_wagered_by_affiliates: number;
  sponsor_commission_tier_percentage: number;
};

export type SponsorAffiliate = {
  id: ID;
  affiliate: User;
  sponsorCode: SponsorCode;
};

export type SponsorAffiliatePaginator = {
  paginatorInfo: PaginatorInfo;
  data: [SponsorAffiliate];
};

export type SponsorAnalyticsFilter = {
  code: string;
  username: string;
  sortBy: string | number;
};

export type AffiliateCommission = {
  id: ID;
  affiliate_commission_claimed: number;
  sponsor_commission_claimed: number;
  affiliate_commission_claimable: number;
  sponsor_commission_claimable: number;
  wagered: number;
  loss: number;
  total_affiliate_commission: number;
  total_sponsor_commission: number;
  total_commission: number;
  affiliate: User;
  sponsor: User;
  currency: Currency;
};

export type SponsorCommissionsByCurrency = {
  currency: Currency;
  sponsor_commission_claimable: number;
  total_affiliate_commission: number;
  total_sponsor_commission: number;
  total_commission: number;
  sponsor_commission_claimed: number;
};

export type SponsorCommissionsByCurrencyPaginator = {
  paginatorInfo: PaginatorInfo;
  data: [SponsorCommissionsByCurrency];
}
