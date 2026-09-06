import { defineStore } from 'pinia'
import type { Review, UpsertReviewPayload } from '~/types/review'

/* Fila que devuelve la RPC get_reviews */
interface ReviewRow {
  id: number
  user_id: string
  rating: number
  comment: string
  created_at: string
  user_name: string
  user_avatar: string
}

const toReview = (row: ReviewRow): Review => ({
  id: row.id,
  user_id: row.user_id,
  rating: row.rating,
  comment: row.comment,
  created_at: row.created_at,
  user: { id: row.user_id, name: row.user_name, avatar: row.user_avatar },
})

export const useReviewsStore = defineStore('reviews', () => {
  const supabase = useSupabaseClient()

  const reviews = ref<Review[]>([])
  const loading = ref(false)
  const myReview = ref<Review | null>(null)

  const fetchReviews = async () => {
    loading.value = true
    try {
      /* RPC security definer: /comunidad es pública y profiles no lo es */
      const { data, error } = await supabase.rpc('get_reviews')
      if (error) throw error
      reviews.value = ((data ?? []) as ReviewRow[]).map(toReview)
    } catch {
      // Base inaccesible: la página muestra el empty state sin ensuciar la consola
    } finally {
      loading.value = false
    }
  }

  const upsertReview = async (payload: UpsertReviewPayload) => {
    const user = useAuthStore().user
    if (!user) throw new Error('Tenés que iniciar sesión para dejar una reseña.')

    const { data, error } = await supabase
      .from('reviews')
      .upsert({ user_id: user.id, ...payload }, { onConflict: 'user_id' })
      .select()
      .single()
    if (error) throw new Error('No pudimos guardar tu reseña. Intentá de nuevo.')

    const review = toReview({
      ...(data as Omit<ReviewRow, 'user_name' | 'user_avatar'>),
      user_name: user.name,
      user_avatar: user.avatar ?? '',
    })
    myReview.value = review
    const idx = reviews.value.findIndex((r) => r.user_id === review.user_id)
    if (idx !== -1) reviews.value[idx] = review
    else reviews.value.unshift(review)
    return review
  }

  return { reviews, loading, myReview, fetchReviews, upsertReview }
})
