import type { DateTime, ID } from '~/types/base'

export type Deposit = {
  transaction_id: ID
  amount: number
  blockchairUrl: string
  currency_code: string
  created_at: DateTime
  normalized_amount: number
  status: string
  transaction_name: string
  transaction_type: string
  sender_username: string
  txHash: string
  txid: ID
  user_id: ID
  action_id: string
}

export type Tip = {
  transaction_id: ID
  amount: number
  blockchairUrl: string
  created_at: DateTime
  currency_code: string
  normalized_amount: number
  receiver_username: string
  sender_username: string
  status: string
  transaction_name: string
  txHash: string
  txid: ID
  user_id: ID
  action_id: string
}

export type Claim = {
  transaction_id: ID
  action_id: ID
  action: string
  amount: number
  normalized_amount: number
  currency_code: string
  transaction_type: string
  transaction_name: string
  rank_up_claims: string
  status: string
  created_at: DateTime
  processed_at: DateTime
  issued_at: DateTime
  updated_at: DateTime
}

export type OtherTransaction = {
  transaction_id: ID
  amount: number
  blockchairUrl: string
  currency_code: string
  created_at: DateTime
  normalized_amount: number
  status: string
  transaction_name: string
  transaction_type: string
  txHash: string
  txid: ID
  user_id: ID
  action_id: string
}

export type TransactionPaginate = {
  exclusive_start_key: any
  page_count: number
}

export enum CouponType {
  CRYPTO_BALANCE = 'CRYPTO_BALANCE',
  COMMUNITY_BALANCE = 'COMMUNITY_BALANCE',
  XP_BALANCE = 'XP_BALANCE',
  FREE_SPINS = 'FREE_SPINS',
  XP_BOOST = 'XP_BOOST',
  RAKEBACK_BOOST = 'RAKEBACK_BOOST',
}

export type Coupon = {
  id: ID
  code: string
  type: CouponType
  value: string
  is_enabled: boolean
  data: any
}

export type Couponable = {
  id: ID
  couponable_type: string
  couponable_id: number
  redeemed_at: DateTime
  coupon: Coupon
  currency_code: string
}

export type TransactionFilter = {
  limit: number,
  exclusive_start_key?: string | null,
  currency_code: string,
  starts_at?: string,
  ends_at?: string,
}
