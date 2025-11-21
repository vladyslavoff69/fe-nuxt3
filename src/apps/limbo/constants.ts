import type { GameHistoryItem } from '~/types'
import type { LimboGameMatch, PlayStatus } from '~/apps/game/types'
import type { FetchResult } from '@apollo/client/core'
import type { OnDoneContext } from '@vue/apollo-composable/dist/useMutation'

export const LIMBO_GAME = Symbol('LIMBO_GAME') as InjectionKey<{
  betCryptoAmount: Ref<number>;
  betMode: Ref<'manual' | 'auto'>;
  betLoading: Ref<boolean>;
  betResult: Ref<LimboGameMatch>;
  history: Ref<GameHistoryItem[]>;
  invalid: ComputedRef<boolean>;
  isIdle: ComputedRef<boolean>;
  resultNumber: ComputedRef<number>;
  targetValue: Ref<number>;
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
  roundResults: Ref<LimboGameMatch[]>;
  startPlay: () => void;
  startRound: () => void;
  stopAmountOnLoss: Ref<number>;
  stopAmountOnWin: Ref<number>;
  stopPlay: () => void;
  onBetGameDone: (fn: (
    param: FetchResult<{ limboBetGame: LimboGameMatch; }, Record<string, any>, Record<string, any>>,
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
  betGame: () => void;
}>
