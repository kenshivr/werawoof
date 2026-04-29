import { defineStore } from 'pinia'
import type { Review, UpsertReviewPayload } from '~/types/review'

export const useReviewsStore = defineStore('reviews', () => {
  const reviews = ref<Review[]>([])
  const loading = ref(false)
  const myReview = ref<Review | null>(null)

  const fetchReviews = async () => {
    const config = useRuntimeConfig()
    loading.value = true
    try {
      const res = await $fetch<{ reviews: Review[] }>('/reviews', {
        baseURL: config.public.apiBase as string,
      })
      reviews.value = res.reviews ?? []
    } finally {
      loading.value = false
    }
  }

  const upsertReview = async (payload: UpsertReviewPayload) => {
    const api = useApi()
    const res = await api.post<{ review: Review }>('/api/reviews', payload)
    myReview.value = res.review
    const idx = reviews.value.findIndex((r) => r.user_id === res.review.user_id)
    if (idx !== -1) reviews.value[idx] = res.review
    else reviews.value.unshift(res.review)
    return res.review
  }

  return { reviews, loading, myReview, fetchReviews, upsertReview }
})
