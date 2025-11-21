import {
  CRYPTO_ADA_ICON,
  CRYPTO_BCH_ICON,
  CRYPTO_BNB_ICON,
  CRYPTO_BTC_ICON,
  CRYPTO_DOGE_ICON,
  CRYPTO_ETH_ICON,
  CRYPTO_LINK_ICON,
  CRYPTO_LTC_ICON,
  CRYPTO_MATIC_ICON,
  CRYPTO_TRX_ICON,
  CRYPTO_USDC_ICON,
  CRYPTO_USDT_ICON,
  CRYPTO_XLM_ICON,
  CRYPTO_XRP_ICON
} from '~/icons'

export type currencyType = {
  [key: string]: {
    icon: string,
    iconType: string,
    symbol: string
  };
};

const icons = '/assets/symbols/crypto-coins.svg'

export const fiatCurrencyMap: currencyType = {
  USD: {
    icon: 'i-cryptocurrency-color-usd',
    iconType: 'ui',
    symbol: '$'
  },
  EUR: {
    icon: 'i-cryptocurrency-color-eur',
    iconType: 'ui',
    symbol: '€'
  },
  PHP: {
    icon: `${icons}#currency_php`,
    iconType: 'symbol',
    symbol: '₱'
  },
  INR: {
    icon: `${icons}#currency_inr`,
    symbol: '₹',
    iconType: 'symbol',
  },
  BRL: {
    icon: `${icons}#currency_brl`,
    symbol: 'R$',
    iconType: 'symbol',
  },
  CAD: {
    icon: 'i-cryptocurrency-color-cdn',
    symbol: 'CA$',
    iconType: 'ui',
  },
  JPY: {
    icon: 'i-cryptocurrency-color-jpy',
    symbol: '¥',
    iconType: 'ui'
  },
  RUB: {
    icon: 'i-cryptocurrency-color-rub',
    symbol: '₽',
    iconType: 'ui',
  },
  KRW: {
    icon: `${icons}#currency_krw`,
    symbol: '₩',
    iconType: 'symbol',
  },
  TRY: {
    icon: `${icons}#currency_try`,
    symbol: '₺',
    iconType: 'symbol',
  },
  CNY: {
    icon: 'i-cryptocurrency-color-cny',
    symbol: 'CN¥',
    iconType: 'ui',
  },
  PLN: {
    icon: `${icons}#currency_pln`,
    symbol: 'zł',
    iconType: 'symbol',
  },
  MXN: {
    icon: `${icons}#currency_mxn`,
    symbol: 'MX$',
    iconType: 'symbol',
  },
  VND: {
    icon: 'i-circle-flags-vn',
    symbol: 'VN$',
    iconType: 'ui',
  },
  AUD: {
    icon: 'i-circle-flags-au',
    symbol: 'AU$',
    iconType: 'ui',
  },
  NGN: {
    icon: 'i-circle-flags-ng',
    symbol: '₦',
    iconType: 'ui',
  },
  DKK: {
    icon: 'i-circle-flags-dk',
    symbol: 'DKK',
    iconType: 'ui',
  }
}

type cryptoCurrencyItem = {
  icon?: string;
  iconType?: string;
}

export const cryptoCurrencyMap: {
  [key in string]: cryptoCurrencyItem;
} = {
  BTC: {
    icon: CRYPTO_BTC_ICON,
    iconType: 'symbol'
  },
  ETH: {
    icon: CRYPTO_ETH_ICON,
    iconType: 'symbol'
  },
  LTC: {
    icon: CRYPTO_LTC_ICON,
    iconType: 'symbol'
  },
  BCH: {
    icon: CRYPTO_BCH_ICON,
    iconType: 'symbol'
  },
  DOGE: {
    icon: CRYPTO_DOGE_ICON,
    iconType: 'symbol'
  },
  XLM: {
    icon: CRYPTO_XLM_ICON,
    iconType: 'symbol'
  },
  XRP: {
    icon: CRYPTO_XRP_ICON,
    iconType: 'symbol'
  },
  SOL: {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
    iconType: 'logo'
  },
  USDT: {
    icon: CRYPTO_USDT_ICON,
    iconType: 'symbol'
  },
  USDC: {
    icon: CRYPTO_USDC_ICON,
    iconType: 'symbol'
  },
  BNB: {
    icon: CRYPTO_BNB_ICON,
    iconType: 'symbol'
  },
  TRX: {
    icon: CRYPTO_TRX_ICON,
    iconType: 'symbol'
  },
  MATIC: {
    icon: CRYPTO_MATIC_ICON,
    iconType: 'symbol'
  },
  POL: {
    icon: CRYPTO_MATIC_ICON,
    iconType: 'symbol'
  },
  LINK: {
    icon: CRYPTO_LINK_ICON,
    iconType: 'symbol'
  },
  ADA: {
    icon: CRYPTO_ADA_ICON,
    iconType: 'symbol'
  },
  WBTC: {
    icon: 'i-cryptocurrency-color-wbtc',
    iconType: 'ui'
  },
  WETH: {
    icon: 'i-cryptocurrency-color-wbtc',
    iconType: 'ui'
  },
}

export const GHOST_MODE_USERNAME = 'Hidden'
export const UNRANKED_VIP = 'UNRANKED'

export const VIP_LEVEL_MAP: {
  [key in string]: {
    index: number;
    icon: string;
  };
} = {
  UNRANKED: {index: 0, icon: '110cc9a0-47c0-4a42-48bd-083164399700'},
  'WOOD 1': {index: 1, icon: '110cc9a0-47c0-4a42-48bd-083164399700'},
  'WOOD 2': {index: 2, icon: '42f02efb-ca09-487a-283d-313c2dcc0900'},
  'WOOD 3': {index: 3, icon: '27d459c8-1b29-4d7b-79b0-3017568e1900'},
  'SILVER 1': {index: 4, icon: 'c2d9e081-524a-45fd-6e83-0cdf7d91fc00'},
  'SILVER 2': {index: 5, icon: 'e6716d69-aeaf-46d8-0e51-6ad8ec396d00'},
  'SILVER 3': {index: 6, icon: 'd01d4b48-47ef-443f-0958-68ac41178200'},
  'GOLD 1': {index: 7, icon: 'a3759431-8869-4079-726f-46546fa8c900'},
  'GOLD 2': {index: 8, icon: '399ad107-097a-4251-303e-7d718a5ebe00'},
  'GOLD 3': {index: 9, icon: 'a5869011-80cf-4e5d-951b-604b8b1ce400'},
  'PLATINUM 1': {index: 10, icon: '93511e56-a565-49a2-1425-f1fa2b21c400'},
  'PLATINUM 2': {index: 11, icon: '57543d2f-a366-4bc1-1d5a-a416a78c8100'},
  'PLATINUM 3': {index: 12, icon: 'bb02aa77-1a5b-4520-46d4-bf2bde79af00'},
  'DIAMOND 1': {index: 13, icon: 'ae812ee8-4364-40f6-49ff-4c06d6d7f500'},
  'DIAMOND 2': {index: 14, icon: '6d0c5cf6-fc77-46ec-8d1c-67e2140cbf00'},
  'DIAMOND 3': {index: 15, icon: '015f50cd-61c7-4879-75cd-25f8b1296200'},
  'OBSIDIAN 1': {index: 16, icon: '881d9ea9-95ac-4ebb-a6a1-35e1dc1ad000'},
  'OBSIDIAN 2': {index: 17, icon: '1cb6f0ed-ca93-4ea2-42da-657edfd99b00'},
  'OBSIDIAN 3': {index: 18, icon: '9574ec31-1594-4f73-52f3-0ebbf616cd00'}
}

export const CUSTOM_CRYPTO_ORDER = ['BTC', 'ETH', 'LTC', 'XRP', 'SOL', 'DOGE', 'TRX', 'MATIC', 'USDT', 'USDC']
