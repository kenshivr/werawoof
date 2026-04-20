package repository

import (
	"github.com/kenshivr/werawoof/internal/domain"
	"gorm.io/gorm"
)

type MessageRepository struct {
	db *gorm.DB
}

func NewMessageRepository(db *gorm.DB) *MessageRepository {
	return &MessageRepository{db: db}
}

func (r *MessageRepository) Create(msg *domain.Message) error {
	return r.db.Create(msg).Error
}

func (r *MessageRepository) FindByMatch(matchID uint) ([]domain.Message, error) {
	var messages []domain.Message
	err := r.db.
		Preload("Sender").
		Where("match_id = ?", matchID).
		Order("created_at ASC").
		Find(&messages).Error
	return messages, err
}
