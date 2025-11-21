import type { GameHistoryItem } from '~/types/index'
import type { WheelGameMatch, PlayStatus, Risk, Distribution, Segment } from '~/apps/game/types'
import type { FetchResult } from '@apollo/client/core'
import type { OnDoneContext } from '@vue/apollo-composable/dist/useMutation';

export const WHEEL_GAME = Symbol('WHEEL_GAME') as InjectionKey<{
  betCryptoAmount: Ref<number>;
  betMode: Ref<'manual' | 'auto'>;
  betResult: Ref<WheelGameMatch | null>;
  history: Ref<GameHistoryItem[]>;
  initialRotationDegree: Ref<number>
  invalid: ComputedRef<boolean>;
  isIdle: ComputedRef<boolean>;
  isLoading: Ref<boolean>;
  isSpinning: Ref<boolean>;
  lastBetCryptoCode: Ref<string>;
  risk: Ref<Risk>;
  segmentResultAngle: Ref<number>
  segment: Ref<Segment>;
  selectedMultiplicationFactor: Ref<number>
  selectedDistribution: Ref<Distribution | null>
}>

export const AUTO_BET = Symbol('AUTO_BET') as InjectionKey<{
  betCryptoAmount: Ref<number>;
  increasePercentOnLoss: Ref<number>;
  increasePercentOnWin: Ref<number>;
  isIdle: ComputedRef<boolean>;
  numberOfBets: Ref<number>;
  playStatus: Ref<PlayStatus>;
  resetAmountOnLost: Ref<boolean>;
  resetAmountOnWin: Ref<boolean>;
  roundResults: Ref<WheelGameMatch[]>;
  stopAmountOnLoss: Ref<number>;
  stopAmountOnWin: Ref<number>;
  startPlay: () => void;
  stopPlay: () => void;
  startRound: () => void;
  onBetGameDone: (fn: (
    param: FetchResult<{ wheelBetGame: WheelGameMatch; }, Record<string, any>, Record<string, any>>,
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

export const SEGMENTS = [
  {
    id: 0,
    number: 10,
    risks: {
      low: {
        order: [2, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        distribution: [
          {
            multiplicationFactor: 0,
            chances: 2,
            color: '#021902',
          },
          {
            multiplicationFactor: 1.2,
            chances: 7,
            color: '#ACCCAC',
          },
          {
            multiplicationFactor: 1.5,
            chances: 1,
            color: '#259F4F',
          },
        ],
      },
      medium: {
        order: [0, 2, 0, 1, 0, 3, 0, 1, 0, 4],
        distribution: [
          {
            multiplicationFactor: 0,
            chances: 5,
            color: '#021902',
          },
          {
            multiplicationFactor: 1.5,
            chances: 2,
            color: '#ACCCAC',
          },
          {
            multiplicationFactor: 1.9,
            chances: 1,
            color: '#259F4F',
          },
          {
            multiplicationFactor: 2,
            chances: 1,
            color: '#FF7A00',
          },
          {
            multiplicationFactor: 3,
            chances: 1,
            color: '#FFFF00',
          },
        ],
      },
      high: {
        order: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        distribution: [
          {
            multiplicationFactor: 0,
            chances: 9,
            color: '#021902',
          },
          {
            multiplicationFactor: 9.9,
            chances: 1,
            color: '#FFFF00',
          },
        ],
      },
    },
  },
  {
    id: 1,
    number: 20,
    risks: {
      low: {
        order: [2, 1, 1, 1, 0, 1, 1, 1, 1, 0, 2, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        distribution: [
          {
            multiplicationFactor: 0,
            chances: 4,
            color: '#021902',
          },
          {
            multiplicationFactor: 1.2,
            chances: 14,
            color: '#ACCCAC',
          },
          {
            multiplicationFactor: 1.5,
            chances: 2,
            color: '#259F4F',
          },
        ],
      },
      medium: {
        order: [1, 0, 3, 0, 3, 0, 3, 0, 1, 0, 4, 0, 2, 0, 3, 0, 3, 0, 3, 0],
        distribution: [
          {
            multiplicationFactor: 0,
            chances: 10,
            color: '#021902',
          },
          {
            multiplicationFactor: 1.5,
            chances: 2,
            color: '#ACCCAC',
          },
          {
            multiplicationFactor: 1.8,
            chances: 1,
            color: '#259F4F',
          },
          {
            multiplicationFactor: 2,
            chances: 6,
            color: '#FF7A00',
          },
          {
            multiplicationFactor: 3,
            chances: 1,
            color: '#FFFF00',
          },
        ],
      },
      high: {
        order: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        distribution: [
          {
            multiplicationFactor: 0,
            chances: 19,
            color: '#021902',
          },
          {
            multiplicationFactor: 19.8,
            chances: 1,
            color: '#FFFF00',
          },
        ],
      },
    },
  },
  {
    id: 2,
    number: 30,
    risks: {
      low: {
        order: [2, 1, 1, 1, 0, 1, 1, 1, 1, 0, 2, 1, 1, 1, 0, 1, 1, 1, 1, 0, 2, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        distribution: [
          {
            multiplicationFactor: 0,
            chances: 6,
            color: '#021902',
          },
          {
            multiplicationFactor: 1.2,
            chances: 21,
            color: '#ACCCAC',
          },
          {
            multiplicationFactor: 1.5,
            chances: 3,
            color: '#259F4F',
          },
        ],
      },
      medium: {
        order: [1, 0, 1, 0, 3, 0, 1, 0, 3, 0, 3, 0, 1, 0, 4, 0, 1, 0, 3, 0, 3, 0, 2, 0, 5, 0, 1, 0, 3, 0],
        distribution: [
          {
            multiplicationFactor: 0,
            chances: 15,
            color: '#021902',
          },
          {
            multiplicationFactor: 1.5,
            chances: 6,
            color: '#ACCCAC',
          },
          {
            multiplicationFactor: 1.7,
            chances: 1,
            color: '#FFFF33',
          },
          {
            multiplicationFactor: 2,
            chances: 6,
            color: '#259F4F',
          },
          {
            multiplicationFactor: 3,
            chances: 1,
            color: '#FF7A00',
          },
          {
            multiplicationFactor: 4,
            chances: 1,
            color: '#FF512F',
          },
        ],
      },
      high: {
        order: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        distribution: [
          {
            multiplicationFactor: 0,
            chances: 29,
            color: '#021902',
          },
          {
            multiplicationFactor: 29.7,
            chances: 1,
            color: '#FFFF00',
          },
        ],
      },
    },
  },
  {
    id: 3,
    number: 40,
    risks: {
      low: {
        order: [
          2, 1, 1, 1, 0, 1, 1, 1, 1, 0, 2, 1, 1, 1, 0, 1, 1, 1, 1, 0, 2, 1,
          1, 1, 0, 1, 1, 1, 1, 0, 2, 1, 1, 1, 0, 1, 1, 1, 1, 0
        ],
        distribution: [
          {
            multiplicationFactor: 0,
            chances: 8,
            color: '#021902',
          },
          {
            multiplicationFactor: 1.2,
            chances: 28,
            color: '#ACCCAC',
          },
          {
            multiplicationFactor: 1.5,
            chances: 4,
            color: '#259F4F',
          },
        ],
      },
      medium: {
        order: [
          3, 0, 4, 0, 3, 0, 1, 0, 4, 0, 1, 0, 1, 0, 3, 0, 1, 0, 4, 0, 1, 0,
          3, 0, 3, 0, 2, 0, 3, 0, 1, 0, 4, 0, 1, 0, 3, 0, 1, 0
        ],
        distribution: [
          {
            multiplicationFactor: 0,
            chances: 20,
            color: '#021902',
          },
          {
            multiplicationFactor: 1.5,
            chances: 8,
            color: '#ACCCAC',
          },
          {
            multiplicationFactor: 1.6,
            chances: 1,
            color: '#259F4F',
          },
          {
            multiplicationFactor: 2,
            chances: 7,
            color: '#FF7A00',
          },
          {
            multiplicationFactor: 3,
            chances: 4,
            color: '#FFFF00',
          },
        ],
      },
      high: {
        order: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1
        ],
        distribution: [
          {
            multiplicationFactor: 0,
            chances: 39,
            color: '#021902',
          },
          {
            multiplicationFactor: 39.6,
            chances: 1,
            color: '#FFFF00',
          },
        ],
      },
    },
  },
  {
    id: 4,
    number: 50,
    risks: {
      low: {
        order: [
          2, 1, 1, 1, 0, 1, 1, 1, 1, 0, 2, 1, 1, 1, 0, 1, 1, 1, 1, 0, 2, 1, 1, 1, 0, 1, 1, 1, 1, 0,
          2, 1, 1, 1, 0, 1, 1, 1, 1, 0, 2, 1, 1, 1, 0, 1, 1, 1, 1, 0,
        ],
        distribution: [
          {
            multiplicationFactor: 0,
            chances: 10,
            color: '#021902',
          },
          {
            multiplicationFactor: 1.2,
            chances: 35,
            color: '#ACCCAC',
          },
          {
            multiplicationFactor: 1.5,
            chances: 5,
            color: '#259F4F',
          },
        ],
      },
      medium: {
        order: [
          2, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 2, 0, 2, 0,
          1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0
        ],
        distribution: [
          {
            multiplicationFactor: 0,
            chances: 25,
            color: '#021902',
          },
          {
            multiplicationFactor: 1.5,
            chances: 13,
            color: '#ACCCAC',
          },
          {
            multiplicationFactor: 2,
            chances: 8,
            color: '#259F4F',
          },
          {
            multiplicationFactor: 3,
            chances: 3,
            color: '#FF7A00',
          },
          {
            multiplicationFactor: 5,
            chances: 1,
            color: '#FFFF00',
          },
        ],
      },
      high: {
        order: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1
        ],
        distribution: [
          {
            multiplicationFactor: 0,
            chances: 49,
            color: '#021902',
          },
          {
            multiplicationFactor: 49.5,
            chances: 1,
            color: '#FFFF00',
          },
        ],
      },
    },
  },
]
