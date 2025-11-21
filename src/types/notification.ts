import type { ID } from './base'

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
  WALLET = 'WALLET'
}

export type NotificationAction = {
  action: string
  label: string
  url: string
  coupon_code: string
}

export type Notification = {
  __typename: string;
  id: ID;
  actions?: any;
  notification_type: NotificationType;
  title: string;
  message: string;
  from_name: string;
  notification_at: string;
  read_at?: string;
  created_at?: string;
  updated_at?: string;
};
