import type { GameHistoryItem } from '~/types'
import type { KenoGameMatch, PlayStatus, Risk } from '~/apps/game/types'
import type { FetchResult } from '@apollo/client/core'
import type { OnDoneContext } from '@vue/apollo-composable/dist/useMutation'

export const KENO_GAME = Symbol('KENO_GAME') as InjectionKey<{
  betCryptoAmount: Ref<number>;
  betMode: Ref<'manual' | 'auto'>;
  betResult: Ref<KenoGameMatch | null>;
  history: Ref<GameHistoryItem[]>;
  inAutoPick: Ref<boolean>;
  invalid: ComputedRef<boolean>;
  isIdle: ComputedRef<boolean>;
  lastBetCryptoCode: Ref<string>;
  openedTiles: Ref<number[]>;
  opening: Ref<boolean>;
  payoutMultiplier: ComputedRef<number>;
  playStatus: ComputedRef<PlayStatus>;
  resultNumbers: ComputedRef<number[]>;
  risk: Ref<Risk>;
  selectedTiles: Ref<number[]>;
  showResult: ComputedRef<boolean>;
  tileNumbers: number[];
  autoPick: () => void;
  onOpeningDone: (fn: Function) => Function;
  soundWin: () => void;
}>

export const AUTO_BET = Symbol('AUTO_BET') as InjectionKey<{
  betCryptoAmount: Ref<number>;
  betGameLoading: Ref<boolean>;
  increasePercentOnLoss: Ref<number>;
  increasePercentOnWin: Ref<number>;
  isIdle: ComputedRef<boolean>;
  numberOfBets: Ref<number>;
  playStatus: Ref<PlayStatus>;
  resetAmountOnLost: Ref<boolean>;
  resetAmountOnWin: Ref<boolean>;
  roundResults: Ref<KenoGameMatch[]>;
  showResult: ComputedRef<boolean>;
  stopAmountOnLoss: Ref<number>;
  stopAmountOnWin: Ref<number>;
  startPlay: () => void;
  stopPlay: () => void;
  startRound: () => void;
  onBetGameDone: (fn: (
    param: FetchResult<{ kenoBetGame: KenoGameMatch; }, Record<string, any>, Record<string, any>>,
    context: OnDoneContext
  ) => void) => {
    off: () => void;
  };
}>

export const MANUAL_BET = Symbol('MANUAL_BET') as InjectionKey<{
  betCryptoAmount: Ref<number>;
  betGameLoading: Ref<boolean>;
  isIdle: ComputedRef<boolean>;
  payoutMultiplier: ComputedRef<number>;
  playStatus: ComputedRef<PlayStatus>;
  showResult: ComputedRef<boolean>;
  betGame: () => void;
}>
