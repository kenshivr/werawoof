package repository

import (
	"github.com/kenshivr/werawoof/internal/domain"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type SubscriberRepository struct {
	db *gorm.DB
}

func NewSubscriberRepository(db *gorm.DB) *SubscriberRepository {
	return &SubscriberRepository{db: db}
}

func (r *SubscriberRepository) Save(email string) error {
	sub := domain.Subscriber{Email: email}
	return r.db.Clauses(clause.OnConflict{DoNothing: true}).Create(&sub).Error
}
