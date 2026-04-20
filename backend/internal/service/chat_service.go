package service

import (
	"errors"

	"github.com/kenshivr/werawoof/internal/domain"
	"github.com/kenshivr/werawoof/internal/repository"
	"github.com/kenshivr/werawoof/pkg/hub"
	"github.com/kenshivr/werawoof/pkg/sse"
)

type ChatService struct {
	msgRepo   *repository.MessageRepository
	swipeRepo *repository.SwipeRepository
	dogRepo   *repository.DogRepository
	hub       *hub.Hub
	broker    *sse.Broker
}

func NewChatService(
	msgRepo *repository.MessageRepository,
	swipeRepo *repository.SwipeRepository,
	dogRepo *repository.DogRepository,
	h *hub.Hub,
	broker *sse.Broker,
) *ChatService {
	return &ChatService{msgRepo: msgRepo, swipeRepo: swipeRepo, dogRepo: dogRepo, hub: h, broker: broker}
}

// senderDogInMatch returns the sender's dog that belongs to this match, or 0 if not authorized
func (s *ChatService) senderDogInMatch(match *domain.Match, userID uint) (uint, error) {
	dogs, err := s.dogRepo.FindByUserID(userID)
	if err != nil {
		return 0, err
	}
	for _, dog := range dogs {
		if match.Dog1ID == dog.ID || match.Dog2ID == dog.ID {
			return dog.ID, nil
		}
	}
	return 0, nil
}

func (s *ChatService) SendMessage(matchID, senderUserID uint, content string) (*domain.Message, error) {
	match, err := s.swipeRepo.FindMatchByID(matchID)
	if err != nil {
		return nil, errors.New("match not found")
	}

	senderDogID, err := s.senderDogInMatch(match, senderUserID)
	if err != nil {
		return nil, err
	}
	if senderDogID == 0 {
		return nil, errors.New("forbidden")
	}

	recipientDogID := match.Dog2ID
	if match.Dog2ID == senderDogID {
		recipientDogID = match.Dog1ID
	}

	recipientDog, err := s.dogRepo.FindByID(recipientDogID)
	if err != nil {
		return nil, errors.New("recipient dog not found")
	}

	msg := &domain.Message{
		MatchID:  matchID,
		SenderID: senderUserID,
		Content:  content,
	}
	if err := s.msgRepo.Create(msg); err != nil {
		return nil, err
	}

	s.hub.Broadcast <- hub.OutboundMessage{
		RecipientID: recipientDog.UserID,
		Payload:     msg,
	}

	s.broker.Send(recipientDog.UserID, sse.Event{Type: "new_message", Data: msg})

	return msg, nil
}

func (s *ChatService) GetHistory(matchID, userID uint) ([]domain.Message, error) {
	match, err := s.swipeRepo.FindMatchByID(matchID)
	if err != nil {
		return nil, errors.New("match not found")
	}

	senderDogID, err := s.senderDogInMatch(match, userID)
	if err != nil {
		return nil, err
	}
	if senderDogID == 0 {
		return nil, errors.New("forbidden")
	}

	return s.msgRepo.FindByMatch(matchID)
}
