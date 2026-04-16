package domain

import "time"

type Message struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	MatchID   uint      `gorm:"not null;index" json:"match_id"`
	SenderID  uint      `gorm:"not null;index" json:"sender_id"`
	Match     Match     `gorm:"foreignKey:MatchID" json:"match,omitempty"`
	Sender    User      `gorm:"foreignKey:SenderID" json:"sender,omitempty"`
	Content   string    `gorm:"not null" json:"content"`
	CreatedAt time.Time `json:"created_at"`
}
