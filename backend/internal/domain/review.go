package domain

import "time"

type Review struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"uniqueIndex;not null" json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"user"`
	Rating    int       `gorm:"not null" json:"rating"`
	Comment   string    `gorm:"not null" json:"comment"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
