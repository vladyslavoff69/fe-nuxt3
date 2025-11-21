import type { GameMatchStatus, ID } from '~/types'

export type PlayStatus = 'INITIAL' | 'STARTING' | 'PLAYING' | 'FINISHING' | 'ENDED';
export type Risk = 'classic' | 'low' | 'medium' | 'high';
export type RiskShort = 'low' | 'medium' | 'high';
export type Row = 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16
export type Segment = 0 | 1 | 2 | 3 | 4

export type LimboGameMatch = {
  id: ID;
  balance: number;
  betAmount: number;
  delta: number;
  nonce: number;
  payoutMultiplier: number;
  result: number;
  status: GameMatchStatus;
  target: number;
  transactionId: string;
};

export type DiceGameMatch = {
  id: ID;
  balance: number;
  betAmount: number;
  condition: 'over' | 'under';
  delta: number;
  nonce: number;
  payoutMultiplier: number;
  result: number;
  status: GameMatchStatus;
  target: number;
  transactionId: string;
}

export type KenoGameMatch = {
  id: ID;
  balance: number;
  betAmount: number;
  delta: number;
  nonce: number;
  numbers: number[];
  payoutMultiplier: number;
  result: number[];
  risk: Risk;
  status: GameMatchStatus;
  transactionId: string;
}

export type PlinkoGameMatch = {
  id: ID;
  balance: number;
  betAmount: number;
  delta: number;
  nonce: number;
  payout: number;
  payoutMultiplier: number;
  result: string[];
  risk: RiskShort;
  rows: number;
  status: GameMatchStatus;
  transactionId: string;
}

export type PlinkoFreeGameMatch = {
  id: ID;
  balance: number;
  betAmount: number;
  delta: number;
  nonce: number;
  payout: number;
  payoutMultiplier: number;
  result: string[];
  risk: RiskShort;
  rows: number;
  transactionId: string;
}

export type WheelGameMatch = {
  id: ID;
  angle: number;
  balance: number;
  betAmount: number;
  delta: number;
  nonce: number;
  payout: number;
  payoutMultiplier: number;
  result: number;
  risk: Risk;
  segment: number;
  segments: number;
  status: GameMatchStatus;
  transactionId: string;
}

export type Distribution = {
  multiplicationFactor: number
  chances: number
  color: string
}
