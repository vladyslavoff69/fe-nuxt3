import type { ID } from './base'

export type Charity = {
  id: ID;
  name: string
  image?: string
  rank: number
  totalPlayers: string
  totalDonations: string
  playersImage?: string[] | any[]
}
