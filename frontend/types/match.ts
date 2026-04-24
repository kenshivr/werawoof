import type { Dog } from './dog'

export interface Match {
  id: number
  dog1_id: number
  dog2_id: number
  dog1: Dog
  dog2: Dog
  created_at: string
}
