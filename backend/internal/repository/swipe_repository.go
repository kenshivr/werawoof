package repository

import (
	"github.com/kenshivr/werawoof/internal/domain"
	"gorm.io/gorm"
)

type SwipeRepository struct {
	db *gorm.DB
}

func NewSwipeRepository(db *gorm.DB) *SwipeRepository {
	return &SwipeRepository{db: db}
}

func (r *SwipeRepository) Create(swipe *domain.Swipe) error {
	return r.db.Create(swipe).Error
}

func (r *SwipeRepository) Exists(swiperID, swipedID uint) (bool, error) {
	var count int64
	err := r.db.Model(&domain.Swipe{}).
		Where("swiper_id = ? AND swiped_id = ?", swiperID, swipedID).
		Count(&count).Error
	return count > 0, err
}

// HasMutualLike checks if swipedID already liked swiperID (reverse like exists)
func (r *SwipeRepository) HasMutualLike(swiperID, swipedID uint) (bool, error) {
	var count int64
	err := r.db.Model(&domain.Swipe{}).
		Where("swiper_id = ? AND swiped_id = ? AND direction = ?", swipedID, swiperID, domain.SwipeLike).
		Count(&count).Error
	return count > 0, err
}

func (r *SwipeRepository) CreateMatch(match *domain.Match) error {
	return r.db.Create(match).Error
}

func (r *SwipeRepository) MatchExists(dog1ID, dog2ID uint) (bool, error) {
	var count int64
	err := r.db.Model(&domain.Match{}).
		Where("(dog1_id = ? AND dog2_id = ?) OR (dog1_id = ? AND dog2_id = ?)", dog1ID, dog2ID, dog2ID, dog1ID).
		Count(&count).Error
	return count > 0, err
}

func (r *SwipeRepository) FindMatchesByDog(dogID uint) ([]domain.Match, error) {
	var matches []domain.Match
	err := r.db.
		Preload("Dog1").
		Preload("Dog2").
		Where("dog1_id = ? OR dog2_id = ?", dogID, dogID).
		Find(&matches).Error
	return matches, err
}

func (r *SwipeRepository) FindMatchByID(id uint) (*domain.Match, error) {
	var match domain.Match
	err := r.db.First(&match, id).Error
	if err != nil {
		return nil, err
	}
	return &match, nil
}
