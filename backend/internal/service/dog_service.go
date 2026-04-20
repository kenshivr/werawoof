package service

import (
	"errors"

	"github.com/kenshivr/werawoof/internal/domain"
	"github.com/kenshivr/werawoof/internal/repository"
)

type DogService struct {
	dogRepo *repository.DogRepository
}

func NewDogService(dogRepo *repository.DogRepository) *DogService {
	return &DogService{dogRepo: dogRepo}
}

func (s *DogService) Create(userID uint, name, breed, bio string, age int, lat, lng float64) (*domain.Dog, error) {
	dog := &domain.Dog{
		UserID:    userID,
		Name:      name,
		Breed:     breed,
		Bio:       bio,
		Age:       age,
		Latitude:  lat,
		Longitude: lng,
	}

	if err := s.dogRepo.Create(dog); err != nil {
		return nil, err
	}

	return dog, nil
}

func (s *DogService) GetByID(id uint) (*domain.Dog, error) {
	return s.dogRepo.FindByID(id)
}

func (s *DogService) GetByUser(userID uint) ([]domain.Dog, error) {
	return s.dogRepo.FindByUserID(userID)
}

func (s *DogService) Update(dogID, userID uint, name, breed, bio string, age int, lat, lng float64) (*domain.Dog, error) {
	dog, err := s.dogRepo.FindByID(dogID)
	if err != nil {
		return nil, err
	}

	if dog.UserID != userID {
		return nil, errors.New("forbidden")
	}

	dog.Name = name
	dog.Breed = breed
	dog.Bio = bio
	dog.Age = age
	dog.Latitude = lat
	dog.Longitude = lng

	if err := s.dogRepo.Update(dog); err != nil {
		return nil, err
	}

	return dog, nil
}

func (s *DogService) Delete(dogID, userID uint) error {
	return s.dogRepo.Delete(dogID, userID)
}

func (s *DogService) AddPhoto(dogID, userID uint, photoURL string) (*domain.Dog, error) {
	dog, err := s.dogRepo.FindByID(dogID)
	if err != nil {
		return nil, err
	}

	if dog.UserID != userID {
		return nil, errors.New("forbidden")
	}

	dog.Photos = append(dog.Photos, photoURL)

	if err := s.dogRepo.Update(dog); err != nil {
		return nil, err
	}

	return dog, nil
}
