package domain

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Dog struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `gorm:"not null;index" json:"user_id"`
	User      User           `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Name      string         `gorm:"not null" json:"name"`
	Breed     string         `json:"breed"`
	Age       int            `json:"age"`
	Bio       string         `json:"bio"`
	Photos    pq.StringArray `gorm:"type:text[]" json:"photos"`
	Latitude  float64        `json:"latitude"`
	Longitude float64        `json:"longitude"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
