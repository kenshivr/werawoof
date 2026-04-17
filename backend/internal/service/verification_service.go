package service

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"time"

	"github.com/kenshivr/werawoof/internal/repository"
	redispkg "github.com/kenshivr/werawoof/pkg/redis"
	"golang.org/x/crypto/bcrypt"
)

type VerificationService struct {
	userRepo     *repository.UserRepository
	redis        *redispkg.Client
	emailService *EmailService
	appURL       string
}

func NewVerificationService(userRepo *repository.UserRepository, redis *redispkg.Client, emailService *EmailService, appURL string) *VerificationService {
	return &VerificationService{
		userRepo:     userRepo,
		redis:        redis,
		emailService: emailService,
		appURL:       appURL,
	}
}

func (s *VerificationService) SendVerificationEmail(ctx context.Context, userID uint, email, name string) error {
	token := generateToken()
	key := "verify:" + token

	if err := s.redis.Raw().Set(ctx, key, userID, 24*time.Hour).Err(); err != nil {
		return err
	}

	return s.emailService.SendVerification(email, name, token)
}

func (s *VerificationService) VerifyAccount(ctx context.Context, token string) error {
	key := "verify:" + token

	userIDStr, err := s.redis.Raw().Get(ctx, key).Result()
	if err != nil {
		return errors.New("invalid or expired token")
	}

	var userID uint
	if _, err := fmt.Sscanf(userIDStr, "%d", &userID); err != nil {
		return errors.New("invalid token data")
	}

	if err := s.userRepo.MarkVerified(userID); err != nil {
		return err
	}

	s.redis.Raw().Del(ctx, key)
	return nil
}

func (s *VerificationService) SendPasswordResetEmail(ctx context.Context, email string) error {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return nil
	}

	token := generateToken()
	key := "reset:" + token

	if err := s.redis.Raw().Set(ctx, key, user.ID, time.Hour).Err(); err != nil {
		return err
	}

	return s.emailService.SendPasswordReset(email, user.Name, token)
}

func (s *VerificationService) ResetPassword(ctx context.Context, token, newPassword string) error {
	key := "reset:" + token

	userIDStr, err := s.redis.Raw().Get(ctx, key).Result()
	if err != nil {
		return errors.New("invalid or expired token")
	}

	var userID uint
	if _, err := fmt.Sscanf(userIDStr, "%d", &userID); err != nil {
		return errors.New("invalid token data")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	if err := s.userRepo.UpdatePassword(userID, string(hash)); err != nil {
		return err
	}

	s.redis.Raw().Del(ctx, key)
	return nil
}

func generateToken() string {
	b := make([]byte, 32)
	rand.Read(b)
	return hex.EncodeToString(b)
}
