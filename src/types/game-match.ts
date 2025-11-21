import type { GameMatchStatus } from './bet'
import type { ID } from '.'

export type GameHistoryItem = {
  id: ID;
  transactionId: string;
  status: GameMatchStatus;
  text: string | number;
  isFree?: boolean;
}
