import type { DateTime, ID } from './base'
import type { Game, GameProvider } from '~/types/game'
import type { ClientSeed, ServerSeed, User } from '~/types/user'

export type GameMatchStatus =
  | 'playing'
  | 'won'
  | 'lost'
  | 'draw'
  | 'refund'
  | 'cashout'
  | 'discarded'
  | 'rollback'
  | 'open'
  | 'settled';

export type SeedPair = {
  clientSeed?: ClientSeed;
  serverSeed?: ServerSeed;
  serverSeedUnhashed?: string;
}

export type BetFeed = {
  id: ID;
  amount: number;
  bet_multiplier: number;
  created_at: DateTime;
  currency_code: string;
  detail_type: string;
  display_name: string;
  game: string;
  game_id?: ID;
  game_slug: string;
  high_roller: boolean;
  issued_at: DateTime;
  match_status?: string;
  multiplier: number;
  normalized_payout: number;
  normalized_amount: number;
  payout: number;
  transaction_id: ID;
  user_id?: ID;
  username?: string;
  vip_level_name?: string;
}

export type Bet = {
  id: ID;
  amount: number;
  bet_conditions: any;
  bet_multiplier: number;
  created_at: DateTime;
  currency_code: string;
  date?: DateTime;
  detail_type: string;
  display_name: string;
  final_results: any;
  game: string;
  game_id?: ID;
  game_slug: string;
  high_roller: boolean;
  issued_at: DateTime;
  match?: GameMatch;
  match_status?: string;
  multiplier: number;
  nonce: number;
  normalized_payout: number;
  normalized_amount: number;
  payout: number;
  processed_at: DateTime;
  seed_pair: SeedPair;
  time?: string;
  transaction_id: ID;
  user_id?: ID;
  username?: string;
  vip_level_name?: string;
}

export type GameTransaction = {
  amount: number;
  created_at: DateTime;
  currency_code: string;
  detail_type: string;
  game: string;
  game_id?: ID;
  game_slug: string;
  issued_at: DateTime;
  match_status?: string;
  normalized_payout: number;
  normalized_amount: number;
  payout: number;
  transaction_id: ID;
  user_id?: ID;
  status?: string;
  match_id?: ID;
}

export type GameMatch = {
  id: ID;
  balance: number;
  delta: number;
  matchId: ID;
  partialResult: string;
  status: GameMatchStatus;
  transactionId: string;
  amount: number;
  nonce: number;
  bets: any[];
  user: {
    username: string;
  }
  created_at: string;
  profit: number;
  loss: number;
}

export type BetTransactions = BetFeed & { __typename: string }

export type BetDetail = {
  type: string,
  user: User,
  game: Game,
  bet: Bet,
  provider: GameProvider,
  match: GameMatch
}
