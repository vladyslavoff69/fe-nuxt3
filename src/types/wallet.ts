import type { DateTime, ID } from './base'
import type { User } from './user'

export type ActiveAddress = {
  id: ID;
  address: string;
  status: boolean;
  wallet_id: ID;
  currency_code: string;
};

export type KLine = {
  interval: string,
  closePrice: number,
  closeDateTime: DateTime
}

export type CryptoNetwork = {
  id: ID;
  name: string;
  slug: string;
  enabled: boolean;
}

export type Currency = {
  active: boolean;
  code: string;
  created_at?: DateTime;
  current_price: number;
  description?: string;
  min_withdraw: number;
  min_tip_withdraw: number;
  fee: number;
  id: ID;
  symbol?: string;
  type?: string;
  updated_at?: DateTime;
  quotes: {
    values: {
      [key: string]: number;
    }
  };
  klines?: KLine[];
  last_price?: number;
  logo: string;
  name: string;
  price_updated_at?: DateTime;
  icon: string;
  networks?: CryptoNetwork[];
  min_confirmtime?: number;
  max_confirmtime?: number;
  confirmtime_unit?: string;
  isSellSupported?: boolean;
  isBuySupported: boolean;
  minBuyAmount?: number;
  maxBuyAmount?: number;
  minSellAmount?: number;
  maxSellAmount?: number;
};

export type CurrencyItem = Currency & {
  iconType?: string;
}

export type Vault = {
  amount: number;
  currency: string;
}

export type Wallet = {
  id: ID;
  balance: number;
  created_at: DateTime;
  currency_code: string;
  locked_balance: number;
  updated_at: DateTime;
  user_id: ID;
  vaulted_balance: number;
  activeAddress: ActiveAddress
  user: User;
  status: string;
  txHash?: string;
}

export type UserBalance = {
  currencyCode: string
  balance: number
  availableBalance: number
  vaultedBalance: number
  lockedBalance: number
}

export type WatchList = {
  higher_price?: number
  lower_price?: number
  filled_at?: number
  filled?: number
  id: ID
  currency?: CurrencyItem
  user: User
}
