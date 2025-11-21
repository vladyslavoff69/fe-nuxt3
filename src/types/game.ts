import type { ID } from './base'
import type { DateTime } from '.'
import type { FUN_PLAY, REAL_PLAY, WAITING_PLAY } from '~/constants'

export type PlayType = typeof WAITING_PLAY | typeof FUN_PLAY | typeof REAL_PLAY;

export type GameProvider = {
  id: ID;
  name: string;
  display_name: string;
  enabled: boolean;
  slug: string;
  order?: number;
  image: string;
  games?: Game[];
  game_count?: number;
};

type HighestWin = {
  amount: string | number;
  username: string | null
  display_name: string | null
}

type HighestMultiplier = {
  multiplier: string | number;
  username: string | null
  display_name: string | null
}

export type xpBoost = {
  id: ID
  name: string
  enabled: boolean
  active: boolean
  description: string
  xp_multiplier: number
  ends_at: DateTime
  image: string
}

export type Game = {
  id: ID;
  identifier: string;
  title: string;
  image: string;
  description: string;
  cover: string;
  slug: string;
  video?: string | null;
  provider_id: ID;
  gameCategories: GameCategory[];
  gameProvider: GameProvider;
  house_edge: number;
  enabled: boolean;
  highest_win?: HighestWin | null
  highest_multiplier?: HighestMultiplier | null
  volatility?: string | null
  xpBoosts?: xpBoost[]
};

export type GameCategory = {
  id: ID;
  name: string;
  slug: string;
  enabled: boolean
  display_in_frontend: boolean
  icon?: string
  iconType?: string
  games: Game[];
};

export interface InternalGameEventBytes {
  bytes: number[];
  hmacsUsed: string[];
}

export interface InternalGameEventFloat {
  float: number;
  hmacsUsed: string[];
}

export interface InternalGameEventFloats {
  floats: number[];
  hmacsUsed: string[];
}

export interface GameSeed {
  clientSeed: string;
  serverSeed: string;
  nonce: number;
}

export interface MultiplayerGameSeed {
  hash: string;
  seed: string;
}

export enum TopFiveResultType {
  biggestwinners = 'biggestwinners',
  highestpayouts = 'highestpayouts',
}

export interface TopFiveResultData {
  type: TopFiveResultType;
  username: string;
  vip_level_name: string;
  currency_code: string;
  normalized_bet_amount: number;
  normalized_payout: number;
  amount: number;
  currency_amount: number;
  wagered: number;
  wagered_currency: number;
  bet_multiplier: number;
  game: Game;
  created_at: DateTime;
}

export type GameActiveOption = {
  currency?: string;
  currentPlay?: string;
};

export type ActiveGameOptions = {
  [key: string]: GameActiveOption
};

export type LaunchGameOption = {
  url: string;
};
