import type { DateTime, ID } from './base'
import type { Currency, Vault, Wallet } from './wallet'

import type { Preferences } from './preferences'
import type { SponsorAffiliate, SponsorCode } from '~/types/affiliate'

export type Role = {
  __typename: string;
  id: ID;
  name: string;
  guard_name: string;
}

export type SocialiteProvider = {
  provider: string;
  provider_user_id: string;
  avatar: string;
}

export type UserFingerprint = {
  __typename: string;
  id: ID;
  fingerprint: string;
  os: string;
  device: string;
  browser: string;
  ip: string;
  user_id: string;
  created_at: DateTime;
}

export type Address = {
  __typename: string;
  formatted_address: string;
  latitude: number;
  longitude: number;
  number: string;
  street: string;
  postalcode: string;
  subLocality: string;
  country_id: ID;
  state_id: ID;
  city_id: ID;
}

export type ActiveTimeout = {
  status?: string,
  due_datetime?: string,
  reason?: string,
  remaining_minutes?: number,
  moderator_username?: string
}

export type FreeSpinPromotion = {
  id: ID
  code: string
  game_type: string
  quantity: number
  currency: Currency
  expires_at: DateTime
  is_active: boolean
}

export type FreeSpinResult = {
  rng: number
  payout: number
  nonce: number
}

export type FreeSpin = {
  id: ID
  promotion: FreeSpinPromotion
  promo_spin: number
  free_rounds: number
  promotion_seed: string
  spin_results: FreeSpinResult[]
  total_won: number
  isDaily: boolean
}

export type User = {
  __typename: string;
  id: ID;
  address?: Address;
  active_timeout?: ActiveTimeout;
  clientSeeds?: ClientSeed[];
  created_at?: DateTime;
  date_of_birth?: DateTime;
  display_name?: string;
  email?: string;
  email_verified_at?: DateTime;
  enable2fa?: boolean;
  free_spins?: number;
  fingerprints?: UserFingerprint[];
  gender_id?: ID;
  language_id?: ID;
  lastname?: string;
  name?: string;
  preferences?: Preferences;
  roles?: Role[];
  socialiteProviders?: SocialiteProvider[];
  sponsorAffiliates?: SponsorAffiliate;
  sponsorCodes?: SponsorCode[];
  total_affiliates?: number;
  total_affiliate_cashback_received_as_affiliate?: number;
  total_commission_generated_as_affiliate?: number;
  total_donated?: number;
  total_sponsor_commission_generated_as_affiliate?: number;
  total_wagered_as_affiliate?: number;
  updated_at?: DateTime;
  username: string;
  vault?: Vault[];
  vip_level_name?: string;
  wallets?: Wallet[];
  bans?: Ban[];
  ssoToken?: string;
  shadow_banned?: boolean;
  remaining_free_spins?: FreeSpin[];
  telegram_id?: string
}

export type ClientSeed = {
  id?: ID;
  client_seed?: string;
  game_id?: ID;
  is_current?: boolean;
  nonce?: number;
  updated_at?: DateTime;
};

export type ServerSeed = {
  id?: ID;
  server_seed_hashed?: string;
  created_at?: DateTime;
  updated_at?: DateTime;
};

export type Ban = {
  id: ID;
  bannable_id?: number;
  bannable_type?: string;
  created_at?: string;
  expired_at?: string;
  comment?: string;
  banned?: User;
  bannedBy?: User;
}

export type PasskeyItem = {
  id: ID;
  name: string;
  type?: string;
  transports?: string[];
  created_at: DateTime;
  updated_at?: DateTime;
}

export type NewsletterMail = {
  email: string
  ip: string
  location: string
}

export type UserModalNotification = {
  header?: string
  body?: string
  image?: string
  action?: string
  action_url?: string
}
