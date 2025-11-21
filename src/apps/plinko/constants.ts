import type { ID, GameHistoryItem } from '~/types'
import type { PlayStatus, PlinkoGameMatch, RiskShort } from '~/apps/game/types'
import type { FetchResult } from '@apollo/client/core'
import type { OnDoneContext } from '@vue/apollo-composable/dist/useMutation'
import type { coefficientsType } from '~/apps/plinko/types'

export const PLINKO_GAME = Symbol('PLINKO_GAME') as InjectionKey<{
  ballSize: ComputedRef<number>;
  betCryptoAmount: Ref<number>;
  betMode: Ref<'manual' | 'auto' | 'free'>;
  betResult: Ref<PlinkoGameMatch | null>;
  hasDroppingBall: ComputedRef<boolean>;
  history: Ref<GameHistoryItem[]>;
  invalid: ComputedRef<boolean>;
  isIdle: ComputedRef<boolean>;
  lastBetCryptoCode: Ref<string>;
  loadingBoard: Ref<boolean>;
  maxBooster: Ref<'default' | 'left' | 'right'>;
  multipliers: ComputedRef<number[]>;
  pinSize: ComputedRef<number>;
  playStatus: ComputedRef<PlayStatus>;
  plinkoEl: Ref<HTMLDivElement | null>;
  pressed: Ref<number>;
  risk: Ref<RiskShort>;
  selectedRow: Ref<number>;
}>

export const AUTO_BET = Symbol('AUTO_BET') as InjectionKey<{
  betCryptoAmount: Ref<number>;
  betGameLoading: Ref<boolean>;
  isIdle: ComputedRef<boolean>;
  numberOfBets: Ref<number>;
  playStatus: Ref<PlayStatus>;
  roundResults: Ref<PlinkoGameMatch[]>;
  startPlay: () => void;
  stopPlay: () => void;
  startRound: () => void;
  onBetDone: (fn: (
    param: FetchResult<{ plinkoBetGame: PlinkoGameMatch; }, Record<string, any>, Record<string, any>>,
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
  betGame: (withoutSound: boolean) => Promise<void>;
}>

export const FREE_BET = Symbol('FREE_BET') as InjectionKey<{
  freeSpinID: Ref<ID>;
  freeBetsRemaining: Ref<number>;
  freeBetsAmount: Ref<number>;
  betGameLoading: Ref<boolean>;
  isIdle: ComputedRef<boolean>;
  payoutMultiplier: ComputedRef<number>;
  playStatus: ComputedRef<PlayStatus>;
  betGame: (withoutSound: boolean) => Promise<void>;
}>

export const COEFFICIENTS: coefficientsType = {
  8: {
    low: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
    medium: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
    high: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
    chances: [0.3906, 3.125, 10.9375, 21.875, 27.3438, 21.875, 10.9375, 3.125, 0.3906]
  },
  9: {
    low: [5.6, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 5.6],
    medium: [18, 4, 1.7, 0.9, 0.5, 0.5, 0.9, 1.7, 4, 18],
    high: [43, 7, 2, 0.6, 0.2, 0.2, 0.6, 2, 7, 43],
    chances: [0.1953, 1.7578, 7.0313, 16.4063, 24.6094, 24.6094, 16.4063, 7.0313, 1.7578, 0.1953]
  },
  10: {
    low: [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
    medium: [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22],
    high: [76, 10, 3, 0.9, 0.3, 0.2, 0.3, 0.9, 3, 10, 76],
    chances: [0.0977, 0.9766, 4.3945, 11.7188, 20.5078, 24.6094, 20.5078, 11.7188, 4.3945, 0.9766, 0.0977]
  },
  11: {
    low: [8.4, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 8.4],
    medium: [24, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 24],
    high: [120, 14, 5.2, 1.4, 0.4, 0.2, 0.2, 0.4, 1.4, 5.2, 14, 120],
    chances: [0.0488, 0.5371, 2.6855, 8.0566, 16.1133, 22.5586, 22.5586, 16.1133, 8.0566, 2.6855, 0.5371, 0.0488]
  },
  12: {
    low: [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
    medium: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
    high: [170, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 2, 8.1, 24, 170],
    chances: [0.0244, 0.293, 1.6113, 5.3711, 12.085, 19.3359, 22.5586, 19.3359, 12.085, 5.3711, 1.6113, 0.293, 0.0244]
  },
  13: {
    low: [8.1, 4, 3, 1.9, 1.2, 0.9, 0.7, 0.7, 0.9, 1.2, 1.9, 3, 4, 8.1],
    medium: [43, 13, 6, 3, 1.3, 0.7, 0.4, 0.4, 0.7, 1.3, 3, 6, 13, 43],
    high: [260, 37, 11, 4, 1, 0.2, 0.2, 0.2, 0.2, 1, 4, 11, 37, 260],
    chances: [0.0122, 0.1587, 0.9521, 3.4912, 8.728, 15.7104, 20.9473, 20.9473, 15.7104, 8.728, 3.4912, 0.9521, 0.1587, 0.0122]
  },
  14: {
    low: [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1],
    medium: [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58],
    high: [420, 56, 18, 5, 1.9, 0.3, 0.2, 0.2, 0.2, 0.3, 1.9, 5, 18, 56, 420],
    chances: [0.0061, 0.0854, 0.5554, 2.2217, 6.1096, 12.2192, 18.3289, 20.9473, 18.3289, 12.2192, 6.1096, 2.2217, 0.5554, 0.0854, 0.0061]
  },
  15: {
    low: [15, 8, 3, 2, 1.5, 1.1, 1, 0.7, 0.7, 1, 1.1, 1.5, 2, 3, 8, 15],
    medium: [88, 18, 11, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 11, 18, 88],
    high: [620, 83, 27, 8, 3, 0.5, 0.2, 0.2, 0.2, 0.2, 0.5, 3, 8, 27, 83, 620],
    chances: [0.0031, 0.0458, 0.3204, 1.3885, 4.1656, 9.1644, 15.274, 19.6381, 19.6381, 15.274, 9.1644, 4.1656, 1.3885, 0.3204, 0.0458, 0.0031]
  },
  16: {
    low: [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16],
    medium: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
    high: [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000],
    chances: [0.0015, 0.0244, 0.1831, 0.8545, 2.7771, 6.665, 12.2192, 17.4561, 19.6381, 17.4561, 12.2192, 6.665, 2.7771, 0.8545, 0.1831, 0.0244, 0.0015]
  }
}

export const LEFT_COEFFICIENTS: coefficientsType = {
  8: {
    low: [8.4, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 2.8],
    medium: [19.5, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 6.5],
    high: [43.5, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 14.5]
  },
  9: {
    low: [8.4, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 2.8],
    medium: [27, 4, 1.7, 0.9, 0.5, 0.5, 0.9, 1.7, 4, 9],
    high: [64.5, 7, 2, 0.6, 0.2, 0.2, 0.6, 2, 7, 21.5]
  },
  10: {
    low: [13.35, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 4.45],
    medium: [33, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 11],
    high: [114, 10, 3, 0.9, 0.3, 0.2, 0.3, 0.9, 3, 10, 38]
  },
  11: {
    low: [12.6, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 4.2],
    medium: [36, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 12],
    high: [180, 14, 5.2, 1.4, 0.4, 0.2, 0.2, 0.4, 1.4, 5.2, 14, 60]
  },
  12: {
    low: [15, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 5],
    medium: [49.5, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 16.5],
    high: [255, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 2, 8.1, 24, 85]
  },
  13: {
    low: [12.15, 4, 3, 1.9, 1.2, 0.9, 0.7, 0.7, 0.9, 1.2, 1.9, 3, 4, 4.05],
    medium: [64.5, 13, 6, 3, 1.3, 0.7, 0.4, 0.4, 0.7, 1.3, 3, 6, 13, 21.5],
    high: [390, 37, 11, 4, 1, 0.2, 0.2, 0.2, 0.2, 1, 4, 11, 37, 130]
  },
  14: {
    low: [10.65, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 3.55],
    medium: [87, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 29],
    high: [630, 56, 18, 5, 1.9, 0.3, 0.2, 0.2, 0.2, 0.3, 1.9, 5, 18, 56, 210]
  },
  15: {
    low: [22.5, 8, 3, 2, 1.5, 1.1, 1, 0.7, 0.7, 1, 1.1, 1.5, 2, 3, 8, 7.5],
    medium: [132, 18, 11, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 11, 18, 44],
    high: [930, 83, 27, 8, 3, 0.5, 0.2, 0.2, 0.2, 0.2, 0.5, 3, 8, 27, 83, 310]
  },
  16: {
    low: [24, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 8],
    medium: [165, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 55],
    high: [1500, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 500]
  }
}

export const RIGHT_COEFFICIENTS: coefficientsType = {
  8: {
    low: [2.8, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 8.4],
    medium: [6.5, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 19.5],
    high: [14.5, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 43.5]
  },
  9: {
    low: [2.8, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 8.4],
    medium: [9, 4, 1.7, 0.9, 0.5, 0.5, 0.9, 1.7, 4, 27],
    high: [21.5, 7, 2, 0.6, 0.2, 0.2, 0.6, 2, 7, 64.5]
  },
  10: {
    low: [4.45, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 13.35],
    medium: [11, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 33],
    high: [38, 10, 3, 0.9, 0.3, 0.2, 0.3, 0.9, 3, 10, 114]
  },
  11: {
    low: [4.2, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 12.6],
    medium: [12, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 36],
    high: [60, 14, 5.2, 1.4, 0.4, 0.2, 0.2, 0.4, 1.4, 5.2, 14, 180]
  },
  12: {
    low: [5, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 15],
    medium: [16.5, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 49.5],
    high: [85, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 2, 8.1, 24, 255]
  },
  13: {
    low: [4.05, 4, 3, 1.9, 1.2, 0.9, 0.7, 0.7, 0.9, 1.2, 1.9, 3, 4, 12.15],
    medium: [21.5, 13, 6, 3, 1.3, 0.7, 0.4, 0.4, 0.7, 1.3, 3, 6, 13, 64.5],
    high: [130, 37, 11, 4, 1, 0.2, 0.2, 0.2, 0.2, 1, 4, 11, 37, 390]
  },
  14: {
    low: [3.55, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 10.65],
    medium: [29, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 87],
    high: [210, 56, 18, 5, 1.9, 0.3, 0.2, 0.2, 0.2, 0.3, 1.9, 5, 18, 56, 630]
  },
  15: {
    low: [7.5, 8, 3, 2, 1.5, 1.1, 1, 0.7, 0.7, 1, 1.1, 1.5, 2, 3, 8, 22.5],
    medium: [44, 18, 11, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 11, 18, 132],
    high: [310, 83, 27, 8, 3, 0.5, 0.2, 0.2, 0.2, 0.2, 0.5, 3, 8, 27, 83, 930]
  },
  16: {
    low: [8, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 24],
    medium: [55, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 165],
    high: [500, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1500]
  }
}

export const buttonBackgrounds: string[] = [
  'bg-plinko-0', 'bg-plinko-1', 'bg-plinko-2', 'bg-plinko-3', 'bg-plinko-4', 'bg-plinko-5', 'bg-plinko-6', 'bg-plinko-7', 'bg-plinko-8'
]

export const buttonShadows: string[] = [
  'shadow-plinko-0', 'shadow-plinko-1', 'shadow-plinko-2', 'shadow-plinko-3', 'shadow-plinko-4', 'shadow-plinko-5', 'shadow-plinko-6', 'shadow-plinko-7', 'shadow-plinko-8'
]

export const PLINKO_INIT = {
  backgroundColor: '#021902',
  innerWidth: 512,
  width: 610,
  height: 540,
  antialias: true,
  resolution: 2,
  side: 'both',
  startPins: 3,
  startRow: 16,
  ball: 8,
  pin: 4,
  totalRows: 16,
  maxPools: 30,
}

export const MULTIPLIER_OPTIONS = {
  8: { scale: 1.15, w: 3, m: 2.5, x: 48, mX: 0.5, mY: 0.7, bX: 0.8, scale1: 1.12, left: -55 },
  9: { scale: 1.05, w: 2, m: 2.2, x: 40, mX: 0.4, mY: 0.7, bX: 0.8, scale1: 1.12, left: -36 },
  10: { scale: 1, w: 1.5, m: 2.1, x: 38, mX: 0.34, mY: 0.85, bX: 0.8, scale1: 1.12, left: -26 },
  11: { scale: 1, w: 1.5, m: 2, x: 32, mX: 0.24, mY: 0.87, bX: -0.5, scale1: 1.12, left: -15 },
  12: { scale: 0.95, w: 0, m: 2, x: 29, mX: 0.16, mY: 0.95, bX: -0.55, scale1: 1.12, left: -5 },
  13: { scale: 0.95, w: 0, m: 2, x: 28, mX: 0.1, mY: 1.3, bX: -0.6, scale1: 1.12, left: 5 },
  14: { scale: 0.9, w: -0.6, m: 2, x: 27, mX: 0, mY: 1.3, bX: -0.7, scale1: 1.12, left: 13 },
  15: { scale: 0.9, w: -0.6, m: 2, x: 26, mX: -0.1, mY: 1.6, bX: -0.75, scale1: 1.12, left: 18 },
  16: { scale: 0.8, w: -0.6, m: 2, x: 25, mX: -0.2, mY: 1.9, bX: -0.8, scale1: 1.12, left: 22 }
}

export const PLINKO_ROWS = [
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
  { label: '12', value: 12 },
  { label: '13', value: 13 },
  { label: '14', value: 14 },
  { label: '15', value: 15 },
  { label: '16', value: 16 },
]

export const AUDIO_CONFIGS = {
  low: [
    '/assets/audio/plinko/1.mp3',
    '/assets/audio/plinko/2.mp3',
    '/assets/audio/plinko/3.mp3',
  ],
  medium: [
    '/assets/audio/plinko/4.mp3',
    '/assets/audio/plinko/5.mp3',
  ],
  high: [
    '/assets/audio/plinko/6.mp3',
    '/assets/audio/plinko/7.mp3',
  ]
}

export const PLINKO_BALL_TEXTURES = {
  low: 'https://imagedelivery.net/PqUPeaOeGAxHB9FZtXllkg/54d8aaf4-2979-4737-7416-9c6f31a47300/sm',
  medium: 'https://imagedelivery.net/PqUPeaOeGAxHB9FZtXllkg/397316f2-3674-4ac8-ce00-5932b768f400/sm',
  high: 'https://imagedelivery.net/PqUPeaOeGAxHB9FZtXllkg/1ea34d54-2a12-4275-6096-9f6beb592d00/sm',
  pin: 'https://imagedelivery.net/PqUPeaOeGAxHB9FZtXllkg/503b4d8f-1eaa-4bf1-e6ec-860e81155400/sm'
}

export const RIPPLE_CIRCLE_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAJ1BMVEUAAAD///////////////////////////////////////////////+uPUo5AAAADHRSTlMA369g78+QcFAQgH/PBaI0AAAAcklEQVQI12NgYOAskjmqzAAGLWeAQBjEYjsDBhuAzD0Q5jEGBuYzUNDAwAhjejLYwJjHGXRgzEMMMTDmQYYzcIDMlIGxjiJrq4ExDzNMgTEFGDhgTAMGhhwI6xTQZVwQZgLIwYYglgfEG0YxB9UnMDAAABPVeWNXUG/pAAAAAElFTkSuQmCC'
