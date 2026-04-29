export interface ReviewUser {
  id: number
  name: string
  avatar: string
}

export interface Review {
  id: number
  user_id: number
  user: ReviewUser
  rating: number
  comment: string
  created_at: string
}

export interface UpsertReviewPayload {
  rating: number
  comment: string
}
