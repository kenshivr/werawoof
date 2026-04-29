package domain

import "time"

type Subscriber struct {
	ID        uint      `gorm:"primaryKey"`
	Email     string    `gorm:"uniqueIndex;not null"`
	CreatedAt time.Time
}
