package service

import (
	"github.com/kenshivr/werawoof/internal/domain"
	"github.com/kenshivr/werawoof/internal/repository"
)

type UserService struct {
	userRepo *repository.UserRepository
}

func NewUserService(userRepo *repository.UserRepository) *UserService {
	return &UserService{userRepo: userRepo}
}

type UpdateProfileInput struct {
	Name     string
	Location string
	Bio      string
	Avatar   string
}

func (s *UserService) GetProfile(userID uint) (*domain.User, error) {
	return s.userRepo.FindByID(userID)
}

func (s *UserService) UpdateProfile(userID uint, input UpdateProfileInput) (*domain.User, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}

	user.Name = input.Name
	user.Location = input.Location
	user.Bio = input.Bio

	if err := s.userRepo.Update(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) UpdateAvatar(userID uint, avatarURL string) (*domain.User, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}

	user.Avatar = avatarURL

	if err := s.userRepo.Update(user); err != nil {
		return nil, err
	}

	return user, nil
}
