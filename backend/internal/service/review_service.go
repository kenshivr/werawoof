package service

import (
	"errors"

	"github.com/kenshivr/werawoof/internal/domain"
	"github.com/kenshivr/werawoof/internal/repository"
)

type ReviewService struct {
	reviewRepo *repository.ReviewRepository
}

func NewReviewService(reviewRepo *repository.ReviewRepository) *ReviewService {
	return &ReviewService{reviewRepo: reviewRepo}
}

func (s *ReviewService) Upsert(userID uint, rating int, comment string) (*domain.Review, error) {
	if rating < 1 || rating > 5 {
		return nil, errors.New("rating must be between 1 and 5")
	}
	review := &domain.Review{
		UserID:  userID,
		Rating:  rating,
		Comment: comment,
	}
	if err := s.reviewRepo.Upsert(review); err != nil {
		return nil, err
	}
	return s.reviewRepo.FindByUserID(userID)
}

func (s *ReviewService) GetAll() ([]domain.Review, error) {
	return s.reviewRepo.FindAll()
}
