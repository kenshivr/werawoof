package service

import (
	"errors"

	"github.com/kenshivr/werawoof/internal/domain"
	"github.com/kenshivr/werawoof/internal/repository"
	"github.com/lib/pq"
)

type DogService struct {
	dogRepo *repository.DogRepository
}

func NewDogService(dogRepo *repository.DogRepository) *DogService {
	return &DogService{dogRepo: dogRepo}
}

type DogInput struct {
	Name            string
	Breed           string
	Bio             string
	Sex             string
	Size            string
	Age             int
	PersonalityTags []string
	Latitude        float64
	Longitude       float64
}

func (s *DogService) Create(userID uint, input DogInput) (*domain.Dog, error) {
	dog := &domain.Dog{
		UserID:          userID,
		Name:            input.Name,
		Breed:           input.Breed,
		Bio:             input.Bio,
		Sex:             input.Sex,
		Size:            input.Size,
		Age:             input.Age,
		PersonalityTags: pq.StringArray(input.PersonalityTags),
		Latitude:        input.Latitude,
		Longitude:       input.Longitude,
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

func (s *DogService) Update(dogID, userID uint, input DogInput) (*domain.Dog, error) {
	dog, err := s.dogRepo.FindByID(dogID)
	if err != nil {
		return nil, err
	}

	if dog.UserID != userID {
		return nil, errors.New("forbidden")
	}

	dog.Name = input.Name
	dog.Breed = input.Breed
	dog.Bio = input.Bio
	dog.Sex = input.Sex
	dog.Size = input.Size
	dog.Age = input.Age
	dog.PersonalityTags = pq.StringArray(input.PersonalityTags)
	dog.Latitude = input.Latitude
	dog.Longitude = input.Longitude

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
