package domain

import "time"

type SwipeDirection string

const (
	SwipeLike    SwipeDirection = "like"
	SwipeDislike SwipeDirection = "dislike"
)

type Swipe struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	SwiperID   uint           `gorm:"not null;index" json:"swiper_id"`
	SwipedID   uint           `gorm:"not null;index" json:"swiped_id"`
	Swiper     Dog            `gorm:"foreignKey:SwiperID" json:"swiper,omitempty"`
	Swiped     Dog            `gorm:"foreignKey:SwipedID" json:"swiped,omitempty"`
	Direction  SwipeDirection `gorm:"not null" json:"direction"`
	CreatedAt  time.Time      `json:"created_at"`
}

type Match struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Dog1ID    uint      `gorm:"not null;index" json:"dog1_id"`
	Dog2ID    uint      `gorm:"not null;index" json:"dog2_id"`
	Dog1      Dog       `gorm:"foreignKey:Dog1ID" json:"dog1,omitempty"`
	Dog2      Dog       `gorm:"foreignKey:Dog2ID" json:"dog2,omitempty"`
	Messages  []Message `gorm:"foreignKey:MatchID" json:"messages,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}
