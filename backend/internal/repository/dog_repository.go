package repository

import (
	"github.com/kenshivr/werawoof/internal/domain"
	"gorm.io/gorm"
)

type DogRepository struct {
	db *gorm.DB
}

func NewDogRepository(db *gorm.DB) *DogRepository {
	return &DogRepository{db: db}
}

func (r *DogRepository) Create(dog *domain.Dog) error {
	return r.db.Create(dog).Error
}

func (r *DogRepository) FindByID(id uint) (*domain.Dog, error) {
	var dog domain.Dog
	err := r.db.First(&dog, id).Error
	if err != nil {
		return nil, err
	}
	return &dog, nil
}

func (r *DogRepository) FindByUserID(userID uint) ([]domain.Dog, error) {
	var dogs []domain.Dog
	err := r.db.Where("user_id = ?", userID).Find(&dogs).Error
	return dogs, err
}

func (r *DogRepository) Update(dog *domain.Dog) error {
	return r.db.Save(dog).Error
}

func (r *DogRepository) Delete(id, userID uint) error {
	return r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&domain.Dog{}).Error
}
