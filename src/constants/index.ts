export const [
  CREATE_USER,
  LOGIN,
  TWOFA,
  EMAIL_VERIFY,
  FORGOT_PASSWORD,
  RESET_PASSWORD
] = [
  'register',
  'login',
  'towfa',
  'email_verify',
  'forgot_password',
  'reset_password'
] as const

export * from './symbols'
export * from './game'
export * from './languages'
export * from './micro-constants'
export * from './seo-meta'

export const CouponTypes = {
  CRYPTO_BALANCE: 'CRYPTO_BALANCE',
  COMMUNITY_BALANCE: 'COMMUNITY_BALANCE',
  XP_BALANCE: 'XP_BALANCE',
  FREE_SPINS: 'FREE_SPINS',
  XP_BOOST: 'XP_BOOST',
  RAKEBACK_BOOST: 'RAKEBACK_BOOST',
}

export const [WAITING_PLAY, FUN_PLAY, REAL_PLAY] = ['PENDING_PLAY', 'FUN_PLAY', 'REAL_PLAY'] as const
export const [
  BALANCE_ADJUST_UPDATE,
  CASHBACK_CLAIM,
  CLAIM_AFFILIATE_COMISSIONS,
  CLAIM_SPONSOR_COMISSIONS,
  COUPON_CLAIM,
  DEPOSIT,
  DONATION,
  EARN_CHAT_RAIN,
  EXCHANGE_OPERATION,
  GAME_TRANSACTION,
  PROGRESSIVE_LOTTERY,
  RACE_WINNER_REWARD,
  RAKEBACK_CLAIM,
  RANK_UP_CLAIM,
  RELOAD_CLAIM,
  SEND_CHAT_RAIN,
  VAULT_DEPOSIT,
  VAULT_WITHDRAW,
  WITHDRAW,
  TIP_WITHDRAW,
  TIP_DEPOSIT,
] = [
  'BALANCE_ADJUST_UPDATE',
  'CASHBACK_CLAIM',
  'CLAIM_AFFILIATE_COMISSIONS',
  'CLAIM_SPONSOR_COMISSIONS',
  'COUPON_CLAIM',
  'DEPOSIT',
  'DONATION',
  'EARN_CHAT_RAIN',
  'EXCHANGE_OPERATION',
  'GAME_TRANSACTION',
  'PROGRESSIVE_LOTTERY',
  'RACE_WINNER_REWARD',
  'RAKEBACK_CLAIM',
  'RANK_UP_CLAIM',
  'RELOAD_CLAIM',
  'SEND_CHAT_RAIN',
  'VAULT_DEPOSIT',
  'VAULT_WITHDRAW',
  'WITHDRAW',
  'TIP_WITHDRAW',
  'TIP_DEPOSIT',
] as const

export const [
  OPENED_SIDEBAR_WIDTH,
  CLOSED_SIDEBAR_WIDTH
] = ['248px', '84px'] as const

// these should be matched to graphql
export const [CRYPTO, FIAT] = ['crypto', 'fiat']

export const GEO_ARRAY: string[] = [
  // 'AT', 'AU', 'KM', 'NL', 'KP', 'FR', 'ES', 'IR', 'MM', 'GB', 'US',
  'AF', 'AT', 'AU', 'BY', 'BE', 'CO', 'CI', 'CU', 'CW', 'CZ', 'CD', 'DK', 'FR', 'GR',
  'IR', 'IQ', 'IL', 'IT', 'LR', 'LY', 'LT', 'NL', 'KP', 'ON, CA', 'PK', 'PT', 'RS', 'SK',
  'SS', 'ES', 'SD', 'SY', 'CH', 'GB', 'US', 'ZW', 'UAE', 'AE'
]
