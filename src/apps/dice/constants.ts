import type { GameHistoryItem } from '~/types'
import type { DiceGameMatch, PlayStatus } from '~/apps/game/types'
import type { FetchResult } from '@apollo/client/core'
import type { OnDoneContext } from '@vue/apollo-composable/dist/useMutation'

export const DICE_GAME = Symbol('DICE_GAME') as InjectionKey<{
  betCryptoAmount: Ref<number>;
  betMode: Ref<'manual' | 'auto'>;
  betResult: Ref<DiceGameMatch>;
  history: Ref<GameHistoryItem[]>;
  invalid: ComputedRef<boolean>;
  isIdle: ComputedRef<boolean>;
  rollOver: Ref<boolean>;
  targetValue: Ref<number>;
}>

export const AUTO_BET = Symbol('AUTO_BET') as InjectionKey<{
  betCryptoAmount: Ref<number>;
  betGameLoading: Ref<boolean>;
  isIdle: ComputedRef<boolean>;
  numberOfBets: Ref<number>;
  playStatus: Ref<PlayStatus>;
  roundResults: Ref<DiceGameMatch[]>;
  stopAmountOnLoss: Ref<number>;
  stopAmountOnWin: Ref<number>;
  increasePercentOnLoss: Ref<number>;
  increasePercentOnWin: Ref<number>;
  resetAmountOnLost: Ref<boolean>;
  resetAmountOnWin: Ref<boolean>;
  startPlay: () => void;
  stopPlay: () => void;
  startRound: () => void;
  onBetGameDone: (fn: (
    param: FetchResult<{ diceBetGame: DiceGameMatch; }, Record<string, any>, Record<string, any>>,
    context: OnDoneContext
  ) => void) => {
    off: () => void;
  };
}>

export const MANUAL_BET = Symbol('MANUAL_BET') as InjectionKey<{
  betCryptoAmount: Ref<number>;
  isIdle: ComputedRef<boolean>;
  payoutMultiplier: ComputedRef<number>;
  playStatus: ComputedRef<PlayStatus>;
  betGame: () => void;
}>
