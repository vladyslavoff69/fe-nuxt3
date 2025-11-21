import {
  AZ_ICON,
  BACCARAT_ICON,
  BLACKJACK_ICON,
  CALENDAR_ICON,
  CASINO_LOBBY_ICON,
  CASINO_MINE_ICON,
  DICE_ICON,
  FEATURED_SLOTS_ICON,
  LIMBO_ICON,
  LIVE_CASINO_ICON,
  NEWEST_ICON,
  POKER_ICON,
  POPULAR_ICON,
  ROULETTE_ICON,
  ZA_ICON
} from '~/components/symbols'
import { AZ, NEWEST, POPULAR, ZA } from '~/apps/casino/constants'

export const GAME_MATCH_STATUS = {
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
  DRAW: 'draw',
  REFUND: 'refund',
  CASHOUT: 'cashout',
  DISCARDED: 'discarded',
  ROLLBACK: 'rollback',
  OPEN: 'open',
  SETTLED: 'settled',
  FREE_GAMES: ['WheelSpin'],
}

export const GAME_DEFAULT_ICON = 'https://imagedelivery.net/PqUPeaOeGAxHB9FZtXllkg/6d55a68f-3a42-45b5-8b86-af2724553b00/thumb'

export const GAME_MATH_ICONS: { [key in string]: { icon: string, type: string } } = {
  blackjack: { icon: BLACKJACK_ICON, type: 'symbol' },
  coinflip: { icon: 'game-icons:coinflip', type: 'ui' },
  dice: { icon: DICE_ICON, type: 'symbol' },
  dragontower: { icon: 'simple-icons:dungeonsanddragons', type: 'ui' },
  keno: { icon: 'carbon:scatter-matrix', type: 'ui' },
  limbo: { icon: LIMBO_ICON, type: 'symbol' },
  liveCasino: { icon: LIVE_CASINO_ICON, type: 'symbol' },
  lobby: { icon: CASINO_LOBBY_ICON, type: 'symbol' },
  mines: { icon: CASINO_MINE_ICON, type: 'symbol' },
  plinko: { icon: 'mdi:dots-triangle', type: 'ui' },
  slots: { icon: FEATURED_SLOTS_ICON, type: 'symbol' },
  upcoming: { icon: CALENDAR_ICON, type: 'symbol' },
  WheelSpin: { icon: 'i-game-icons-cartwheel', type: 'ui' },
}

export const MAP_GAME_CATEGORIES: { [key in string]: { icon: string, iconType: string, label: string } } = {
  poker: {
    icon: POKER_ICON, label: 'games.poker', iconType: 'symbol'
  },
  'table-games': {
    icon: POKER_ICON, label: 'games.poker', iconType: 'symbol'
  },
  blackjack: {
    icon: BLACKJACK_ICON, label: 'games.blackjack', iconType: 'symbol'
  },
  roulette: {
    icon: ROULETTE_ICON, label: 'games.roulette', iconType: 'symbol'
  },
  baccarat: {
    icon: BACCARAT_ICON, label: 'games.baccarat', iconType: 'symbol'
  }
}

export const LOBBY_SORT_OPTIONS: {
  label: string
  value: string
  icon: string
  iconType: string
}[] = [
  {
    label: 'Popular',
    value: POPULAR,
    icon: POPULAR_ICON,
    iconType: 'symbol'
  },
  {
    label: 'Newest',
    value: NEWEST,
    icon: NEWEST_ICON,
    iconType: 'symbol'
  },
]

export const SORT_OPTIONS: {
  label: string
  value: string
  icon: string
  iconType: string
}[] = [
  {
    label: 'Popular',
    value: POPULAR,
    icon: POPULAR_ICON,
    iconType: 'symbol'
  },
  {
    label: 'A-Z',
    value: AZ,
    icon: AZ_ICON,
    iconType: 'symbol'
  },
  {
    label: 'Z-A',
    value: ZA,
    icon: ZA_ICON,
    iconType: 'symbol'
  },
  {
    label: 'Newest',
    value: NEWEST,
    icon: NEWEST_ICON,
    iconType: 'symbol'
  },
]

export const FS_COLOR_MAP = {
  5: '#1D391D',
  7: '#112811',
  10: '#112811',
  15: '#1D391D',
  20: '#021902',
  50: '#22974A',
  100: '#D30000',
}

export const FS_VALUES = [5, 7, 50, 15, 20, 10, 100]
