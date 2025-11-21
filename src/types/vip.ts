import type { DateTime, ID } from './base'
import type { Game } from '~/types/game'
import type { Currency } from '~/types/wallet'

export type Rank = {
  __typename: string;
  level_name: string;
  total_wagered: number;
  xp_threshold: number;
};

export type ClaimInterval = 'incremental' | 'traditional';
export type ReloadInterval = 'TEN_MIN' | 'ONE_HOUR' | 'ONE_DAY';
export type ReloadIntervalValue = {
  interval: ReloadInterval;
  value: number;
};

export type DualRank = {
  __typename: string;
  availableXpOnLevel: number;
  bonusPerClaim: number;
  canClaimCurated: boolean;
  canClaimPerLevel: boolean;
  canClaimRankUp: boolean;
  claimInterval: ClaimInterval;
  claimedCount: number;
  claims: number;
  claimsAvailable: number;
  curatedAmount: number;
  nextClaimInterval: ClaimInterval;
  percentage: number;
  vipLevel: string;
  wagered: number;
  xp: number;
  xpThreshold: number;
  upcomingRank: Rank;
};

export type RakebackValue = {
  [key: string]: number;
};

export type RakebackRank = {
  __typename: string;
  canClaimRakeback: boolean;
  percentage: number;
  values: RakebackValue;
  xp: number;
};

export type CashbackRank = {
  __typename: string;
  canClaimCashback: boolean;
  countdown: string;
  currentCashbackAmount: number;
  currentLossAmount: number;
  currentWageredAmount: number;
  limitClaimDate: string;
  previousCashbackAmount: number;
  previousLossAmount: number;
  previousWageredAmount: number;
  startDate: string;
  xp: number;
};

export type ReloadRank = {
  __typename: string;
  activationAt: string | null;
  amount: number;
  availableWeeklyBonus: number;
  canActivateReload: boolean;
  canChangeReload: boolean;
  canClaimReload: boolean;
  canClaimWeeklyBonus: boolean;
  wageredPastWeek: number;
  claimedTimeInterval: number | null;
  countdownIncrementSeconds: Number;
  currentTimeInterval: number | null;
  expiresAt: string | null;
  expiresAtCountdown: string;
  hasClaimedWeekly: boolean;
  hasFinishedClaims: boolean;
  interval: ReloadInterval;
  intervalValues: ReloadIntervalValue[];
  isExpired: boolean;
  isReloadActivated: boolean;
  nextInterval: string;
  nextLimitClaimDate: string;
  nextReloadCountdown: string;
  previousInterval: ReloadInterval;
  reloadClaimDate: string | null;
  totalClaimed: number;
  wagered: number;
  xp: number;
  maxAmount: number;
};

export type Vip = {
  id: ID;
  xp: number;
  wagered_all_time: number;
  nextXpThreshold: number;
  dualRank: DualRank;
  cashbackRank: CashbackRank;
  vipLevel: VipLevel;
};

export type VipLevel = {
  id: ID;
  name: string;
  image: string;
  description: string;
  order: number;
  xp_threshold: number;
  rakeback: number;
  reload_base: number;
  reload_loss: number;
  weekly_cashback: number;
  rank_up_bonus: number;
  curated_rank_up_bonus: number;
  created_at: DateTime;
  updated_at: DateTime;
}

export type DailyFreeSpinRank = {
  canClaimDailySpins: boolean;
  daily_spins: number;
  daily_spins_free_bets: number;
  daily_spin_value: number;
  daily_spin_claimed_at: DateTime;
  daily_spin_next_claim: DateTime;
  daily_spin_game: Game;
  daily_spin_currency: Currency;
  daily_spin_count: number;
  daily_spin_won: number;
  isExpired: boolean;
  min_vip_level_order: boolean;
}
