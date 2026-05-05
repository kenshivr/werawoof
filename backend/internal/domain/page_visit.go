package domain

import "time"

type PageVisit struct {
	ID        uint      `gorm:"primaryKey"`
	Path      string    `gorm:"index;not null"`
	IP        string    `gorm:"not null"`
	UserAgent string
	VisitedAt time.Time `gorm:"index;not null"`
}
