package database

import (
	"github.com/kenshivr/werawoof/internal/domain"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&domain.User{},
		&domain.Dog{},
		&domain.Swipe{},
		&domain.Match{},
		&domain.Message{},
		&domain.Review{},
		&domain.Subscriber{},
		&domain.PageVisit{},
	)
}
