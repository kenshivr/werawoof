package service

import (
	"context"
	"errors"
	"log"

	"github.com/kenshivr/werawoof/internal/domain"
	"github.com/kenshivr/werawoof/internal/repository"
	"github.com/kenshivr/werawoof/pkg/hub"
	redispkg "github.com/kenshivr/werawoof/pkg/redis"
	"github.com/kenshivr/werawoof/pkg/sse"
)

type ChatService struct {
	msgRepo      *repository.MessageRepository
	swipeRepo    *repository.SwipeRepository
	dogRepo      *repository.DogRepository
	userRepo     *repository.UserRepository
	hub          *hub.Hub
	broker       *sse.Broker
	redis        *redispkg.Client
	emailService *EmailService
}

func NewChatService(
	msgRepo *repository.MessageRepository,
	swipeRepo *repository.SwipeRepository,
	dogRepo *repository.DogRepository,
	userRepo *repository.UserRepository,
	h *hub.Hub,
	broker *sse.Broker,
	redis *redispkg.Client,
	emailService *EmailService,
) *ChatService {
	return &ChatService{
		msgRepo:      msgRepo,
		swipeRepo:    swipeRepo,
		dogRepo:      dogRepo,
		userRepo:     userRepo,
		hub:          h,
		broker:       broker,
		redis:        redis,
		emailService: emailService,
	}
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

	go s.maybeSendEmailNotification(matchID, senderUserID, senderDogID, recipientDog.UserID)

	return msg, nil
}

func (s *ChatService) maybeSendEmailNotification(matchID, senderUserID, senderDogID, recipientUserID uint) {
	ctx := context.Background()

	sent, err := s.redis.IsChatEmailSent(ctx, matchID, recipientUserID)
	if err != nil || sent {
		return
	}

	recipientUser, err := s.userRepo.FindByID(recipientUserID)
	if err != nil {
		return
	}
	senderUser, err := s.userRepo.FindByID(senderUserID)
	if err != nil {
		return
	}
	senderDog, err := s.dogRepo.FindByID(senderDogID)
	if err != nil {
		return
	}

	if err := s.emailService.SendNewMessage(recipientUser.Email, recipientUser.Name, senderUser.Name, senderDog.Name); err != nil {
		log.Printf("[chat] email notification error: %v", err)
		return
	}

	_ = s.redis.SetChatEmailSent(ctx, matchID, recipientUserID)
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
