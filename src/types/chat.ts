import type { ID } from './base'
import type { User } from './user'

export type ChatMessage = {
  __typename: string;
  id: ID;
  message: string;
  msg_user_identifier: string;
  created_at: string;
  suppressed: boolean;
  user?: User;
  reply_to?: ChatMessage | null
};

export type ChatRoom = {
  id: number
  slug: string
  name: string
}

export type ChatRoomUser = {
  id: ID
  user: User
}
