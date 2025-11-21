import type { MenuItem } from '~/types'
import { COLOR_CASINO_ICON, } from '~/icons'
import {
  AFFILIATE_ICON,
  BACCARAT_ICON,
  BLACKJACK_ICON,
  FAVORITES_ICON,
  FEATURED_SLOTS_ICON,
  JUNGLEBET_ORIGINALS_ICON,
  LIVE_CASINO_ICON,
  MY_BETS_ICON,
  NEWEST_ICON,
  PLAYERS_CHARITY_ICON,
  POKER_ICON,
  PROMOTIONS_ICON,
  ROULETTE_ICON,
  TOP_CROWN_ICON,
  WALLET_TRANSACTION_ICON,
} from '~/components/symbols'
import { HOME_PROVIDERS_ICON } from '~/components/symbols/casino-home'

export const ROUTES: MenuItem[] = [
  {
    type: 'group',
    key: 'games.casino',
    url: '/casino/home',
    path: '/casino',
    icon: COLOR_CASINO_ICON,
    iconType: 'icon',
    items: [
      {
        type: 'link',
        key: 'menu.my-favorites',
        url: '/favorites',
        icon: FAVORITES_ICON,
      },
      {
        type: 'link',
        key: 'menu.my-recents',
        url: '/recents',
        icon: 'pajamas:history',
        iconType: 'ui',
      },
      {
        type: 'link',
        key: 'games.my-bets',
        url: '/my-bets',
        icon: MY_BETS_ICON,
        iconType: 'icon',
        iconClass: '',
      },
      {
        type: 'divider',
        key: 'divider',
        url: '#',
      },
      {
        type: 'link',
        key: 'casino.originals',
        url: '/home/junglebet',
        icon: JUNGLEBET_ORIGINALS_ICON,
      },
      {
        type: 'link',
        key: 'casino.new-releases',
        url: '/home/new-releases',
        icon: NEWEST_ICON,
        iconClass: 'w-[17px] h-[17px] -mx-px',
      },
      {
        type: 'link',
        key: 'casino.slots',
        url: '/home/slots',
        icon: FEATURED_SLOTS_ICON,
        iconClass: 'w-[17px] h-[17px] -mx-px',
      },
      {
        type: 'link',
        key: 'casino.live-casino',
        url: '/home/live-casino',
        icon: LIVE_CASINO_ICON,
      },
      {
        type: 'link',
        key: 'casino.providers',
        url: '/providers',
        icon: HOME_PROVIDERS_ICON,
        iconType: 'icon',
      },
      {
        type: 'link',
        key: 'games.categories',
        url: '/categories',
        icon: 'material-symbols:category',
        iconType: 'ui',
      },
      {
        type: 'link',
        key: 'games.poker',
        url: '/category/poker',
        icon: POKER_ICON,
        iconClass: 'w-[22px] h-[22px] -mx-0.5',
      },
      {
        type: 'link',
        key: 'games.blackjack',
        url: '/category/blackjack',
        icon: BLACKJACK_ICON,
        iconClass: 'w-[22px] h-[22px] -mx-0.5',
      },
      {
        type: 'link',
        key: 'games.roulette',
        url: '/category/roulette',
        icon: ROULETTE_ICON,
        iconClass: 'w-[19px] h-[19px] -mr-0.5',
      },
      {
        type: 'link',
        key: 'games.baccarat',
        url: '/category/baccarat',
        icon: BACCARAT_ICON,
        iconClass: 'w-[19px] h-[19px] -mr-0.5',
      }
    ],
  },
  {
    type: 'group',
    key: 'home.players-charity',
    url: '/players-charity',
    path: '/players-charity',
    icon: 'mdi:charity',
    iconType: 'ui',
    iconClass: 'w-[18px] h-[18px] -mx-px text-primary',
    items: [],
  },
  {
    type: 'divider',
    key: 'divider',
  },
  {
    type: 'link',
    key: 'menu.promotions',
    url: '/promotions',
    path: '/promotions',
    icon: PROMOTIONS_ICON,
    iconType: 'icon',
    iconClass: 'w-5 h-5 -ml-0.5 -mr-0.5'
  },
  {
    type: 'link',
    key: 'menu.vip',
    url: '/vip-program',
    path: '/vip-program',
    icon: TOP_CROWN_ICON,
    iconType: 'icon',
    items: [],
  },
  {
    type: 'link',
    key: 'menu.affiliate',
    url: '/affiliate',
    icon: AFFILIATE_ICON,
    iconType: 'icon',
    iconClass: 'w-5 h-5 -mx-0.5',
    items: [],
  },
  {
    type: 'divider',
    key: 'divider'
  },
  {
    type: 'button',
    key: 'footer.live-support',
    icon: 'i-heroicons-question-mark-circle',
    iconType: 'ui',
    iconClass: 'w-5 h-5 -mx-0.5'
  },
  {
    type: 'dropdown',
    key: 'menu.language',
    url: '#',
    items: [],
  },
  {
    type: 'divider',
    key: 'divider'
  }
]

export const NAV_ITEMS: MenuItem[] = [
  {
    type: 'sidebar',
    key: 'menu.menu',
    icon: 'fluent:line-horizontal-4-search-20-filled',
    iconType: 'ui',
    iconClass: '',
  },
  {
    type: 'link',
    key: 'games.casino',
    url: '/casino/home',
    icon: COLOR_CASINO_ICON,
    iconType: 'icon',
    iconClass: '',
  },
  {
    type: 'link',
    key: 'charity.charity',
    url: '/players-charity',
    icon: 'mdi:charity',
    iconType: 'ui',
    iconClass: 'text-primary',
  },
  {
    type: 'link',
    key: 'games.my-bets',
    icon: MY_BETS_ICON,
    url: '/casino/my-bets',
    iconType: 'icon',
    iconClass: '',
  },
  {
    type: 'sidebar',
    key: 'menu.chat',
    icon: 'i-heroicons-chat-bubble-left-right-20-solid',
    iconType: 'ui',
    iconClass: '',
  }
]

export const ACCOUNT_DROPDOWN: MenuItem[] = [
  {
    type: 'modal',
    key: 'menu.my-vip',
    url: '?modal=vip&tab=rank',
    icon: TOP_CROWN_ICON,
    iconType: 'icon',
  },
  {
    type: 'modal',
    key: 'profile.my-profile',
    icon: 'i-heroicons-user-circle-20-solid',
    iconType: 'ui',
  },
  {
    type: 'link',
    key: 'base.settings',
    url: '/account',
    icon: 'ion:settings',
    iconType: 'ui'
  },
  {
    type: 'link',
    key: 'menu.affiliate',
    url: '/affiliate',
    icon: AFFILIATE_ICON,
    iconType: 'icon',
  },
  // {
  //   type: 'modal',
  //   key: 'menu.my-stats',
  //   icon: 'bx:stats',
  //   iconType: 'ui',
  // },
  {
    type: 'link',
    key: 'account.transactions',
    url: '/transactions?tabs=transactions',
    icon: WALLET_TRANSACTION_ICON,
    iconType: 'icon',
  },
  {
    type: 'link',
    key: 'charity.donations',
    url: '/transactions?tabs=donations',
    icon: PLAYERS_CHARITY_ICON,
    iconType: 'icon',
  },
  {
    type: 'modal',
    key: 'menu.help-support',
    icon: 'i-heroicons-question-mark-circle',
    iconType: 'ui',
  },
]

export const ACCOUNT_SETTING_DROPDOWN: MenuItem[] = [
  {
    type: 'link',
    key: 'account.account',
    url: '/account',
    icon: 'heroicons:user-circle-20-solid',
    iconType: 'ui',
  },
  {
    type: 'link',
    key: 'account.kyc-verification',
    url: '/account?tabs=kyc',
    icon: 'majesticons:settings-cog-check',
    iconType: 'ui',
  },
  {
    type: 'link',
    key: 'account.security',
    url: '/account?tabs=security',
    icon: 'heroicons:lock-closed-20-solid',
    iconType: 'ui',
  },
  {
    type: 'link',
    key: 'account.preferences',
    url: '/account?tabs=preferences',
    icon: 'heroicons:adjustments-horizontal-20-solid',
    iconType: 'ui',
  },
  {
    type: 'link',
    key: 'account.email-settings',
    url: '/account?tabs=email-settings',
    icon: 'heroicons:envelope-20-solid',
    iconType: 'ui',
  },
]
