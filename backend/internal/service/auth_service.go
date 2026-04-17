package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/kenshivr/werawoof/internal/domain"
	"github.com/kenshivr/werawoof/internal/repository"
	redispkg "github.com/kenshivr/werawoof/pkg/redis"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct {
	userRepo            *repository.UserRepository
	redis               *redispkg.Client
	jwtSecret           string
	jwtTTL              time.Duration
	verificationService *VerificationService
}

func NewAuthService(userRepo *repository.UserRepository, redis *redispkg.Client, jwtSecret string, jwtExpirationHours int) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		redis:     redis,
		jwtSecret: jwtSecret,
		jwtTTL:    time.Duration(jwtExpirationHours) * time.Hour,
	}
}

func (s *AuthService) SetVerificationService(vs *VerificationService) {
	s.verificationService = vs
}

func (s *AuthService) Register(name, email, password string) (*domain.User, error) {
	_, err := s.userRepo.FindByEmail(email)
	if err == nil {
		return nil, errors.New("email already in use")
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		Name:         name,
		Email:        email,
		PasswordHash: string(hash),
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	if s.verificationService != nil {
		go s.verificationService.SendVerificationEmail(context.Background(), user.ID, user.Email, user.Name)
	}

	return user, nil
}

func (s *AuthService) Login(email, password string) (string, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return "", errors.New("invalid credentials")
	}

	return s.generateToken(user.ID)
}

func (s *AuthService) Logout(ctx context.Context, token string) error {
	return s.redis.BlacklistToken(ctx, token, s.jwtTTL)
}

func (s *AuthService) ValidateToken(ctx context.Context, tokenStr string) (*jwt.RegisteredClaims, error) {
	blacklisted, err := s.redis.IsTokenBlacklisted(ctx, tokenStr)
	if err != nil {
		return nil, err
	}
	if blacklisted {
		return nil, errors.New("token has been revoked")
	}

	token, err := jwt.ParseWithClaims(tokenStr, &jwt.RegisteredClaims{}, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(s.jwtSecret), nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(*jwt.RegisteredClaims)
	if !ok {
		return nil, errors.New("invalid token claims")
	}

	return claims, nil
}

func (s *AuthService) generateToken(userID uint) (string, error) {
	claims := jwt.RegisteredClaims{
		Subject:   fmt.Sprintf("%d", userID),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(s.jwtTTL)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}
