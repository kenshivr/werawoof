package repository

import (
	"github.com/kenshivr/werawoof/internal/domain"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ReviewRepository struct {
	db *gorm.DB
}

func NewReviewRepository(db *gorm.DB) *ReviewRepository {
	return &ReviewRepository{db: db}
}

func (r *ReviewRepository) Upsert(review *domain.Review) error {
	return r.db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "user_id"}},
		DoUpdates: clause.AssignmentColumns([]string{"rating", "comment", "updated_at"}),
	}).Create(review).Error
}

func (r *ReviewRepository) FindAll() ([]domain.Review, error) {
	var reviews []domain.Review
	err := r.db.Preload("User").Order("created_at DESC").Find(&reviews).Error
	return reviews, err
}

func (r *ReviewRepository) FindByUserID(userID uint) (*domain.Review, error) {
	var review domain.Review
	err := r.db.Where("user_id = ?", userID).First(&review).Error
	if err != nil {
		return nil, err
	}
	return &review, nil
}
