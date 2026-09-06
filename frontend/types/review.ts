export interface ReviewUser {
  id: string
  name: string
  avatar: string
}

/* Review + autor, armada desde la RPC get_reviews (ver supabase/002_get_reviews.sql) */
export interface Review {
  id: number
  user_id: string
  user: ReviewUser
  rating: number
  comment: string
  created_at: string
}

export interface UpsertReviewPayload {
  rating: number
  comment: string
}
