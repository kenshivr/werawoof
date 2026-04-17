package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/kenshivr/werawoof/internal/domain"
	"github.com/kenshivr/werawoof/internal/repository"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"gorm.io/gorm"
)

type googleUserInfo struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

type OAuthService struct {
	userRepo    *repository.UserRepository
	authService *AuthService
	oauthConfig *oauth2.Config
}

func NewOAuthService(userRepo *repository.UserRepository, authService *AuthService, clientID, clientSecret, redirectURL string) *OAuthService {
	return &OAuthService{
		userRepo:    userRepo,
		authService: authService,
		oauthConfig: &oauth2.Config{
			ClientID:     clientID,
			ClientSecret: clientSecret,
			RedirectURL:  redirectURL,
			Scopes:       []string{"openid", "email", "profile"},
			Endpoint:     google.Endpoint,
		},
	}
}

func (s *OAuthService) GetAuthURL(state string) string {
	return s.oauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
}

func (s *OAuthService) HandleCallback(ctx context.Context, code string) (string, error) {
	googleToken, err := s.oauthConfig.Exchange(ctx, code)
	if err != nil {
		return "", fmt.Errorf("code exchange failed: %w", err)
	}

	userInfo, err := s.fetchGoogleUser(ctx, googleToken.AccessToken)
	if err != nil {
		return "", err
	}

	user, err := s.userRepo.FindByEmail(userInfo.Email)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		user = &domain.User{
			Name:         userInfo.Name,
			Email:        userInfo.Email,
			GoogleID:     userInfo.ID,
			PasswordHash: "",
			Verified:     true,
		}
		if err := s.userRepo.Create(user); err != nil {
			return "", err
		}
	} else if err != nil {
		return "", err
	}

	return s.authService.generateToken(user.ID)
}

func (s *OAuthService) fetchGoogleUser(ctx context.Context, accessToken string) (*googleUserInfo, error) {
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, "https://www.googleapis.com/oauth2/v2/userinfo", nil)
	req.Header.Set("Authorization", "Bearer "+accessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch google user: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var userInfo googleUserInfo
	if err := json.Unmarshal(body, &userInfo); err != nil {
		return nil, err
	}

	return &userInfo, nil
}
