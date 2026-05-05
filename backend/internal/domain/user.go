package domain

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	Email        string         `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string         `gorm:"not null" json:"-"`
	Name         string         `gorm:"not null" json:"name"`
	Location     string         `json:"location"`
	Bio          string         `json:"bio"`
	Avatar       string         `json:"avatar"`
	GoogleID     string         `gorm:"uniqueIndex" json:"-"`
	Verified     bool           `gorm:"default:false" json:"verified"`
	Role         string         `gorm:"default:'user'" json:"role"`
	Dogs         []Dog          `gorm:"foreignKey:UserID" json:"dogs,omitempty"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}
