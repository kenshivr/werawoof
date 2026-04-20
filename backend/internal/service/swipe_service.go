package service

import (
	"errors"

	"github.com/kenshivr/werawoof/internal/domain"
	"github.com/kenshivr/werawoof/internal/repository"
)

type SwipeService struct {
	swipeRepo *repository.SwipeRepository
	dogRepo   *repository.DogRepository
}

func NewSwipeService(swipeRepo *repository.SwipeRepository, dogRepo *repository.DogRepository) *SwipeService {
	return &SwipeService{swipeRepo: swipeRepo, dogRepo: dogRepo}
}

type SwipeResult struct {
	Match *domain.Match
}

func (s *SwipeService) Swipe(swiperDogID, swipedDogID, userID uint, direction domain.SwipeDirection) (*SwipeResult, error) {
	swiper, err := s.dogRepo.FindByID(swiperDogID)
	if err != nil {
		return nil, errors.New("swiper dog not found")
	}
	if swiper.UserID != userID {
		return nil, errors.New("forbidden")
	}

	already, err := s.swipeRepo.Exists(swiperDogID, swipedDogID)
	if err != nil {
		return nil, err
	}
	if already {
		return nil, errors.New("already swiped")
	}

	swipe := &domain.Swipe{
		SwiperID:  swiperDogID,
		SwipedID:  swipedDogID,
		Direction: direction,
	}
	if err := s.swipeRepo.Create(swipe); err != nil {
		return nil, err
	}

	result := &SwipeResult{}

	if direction == domain.SwipeLike {
		mutual, err := s.swipeRepo.HasMutualLike(swiperDogID, swipedDogID)
		if err != nil {
			return nil, err
		}

		if mutual {
			matchExists, err := s.swipeRepo.MatchExists(swiperDogID, swipedDogID)
			if err != nil {
				return nil, err
			}
			if !matchExists {
				match := &domain.Match{Dog1ID: swiperDogID, Dog2ID: swipedDogID}
				if err := s.swipeRepo.CreateMatch(match); err != nil {
					return nil, err
				}
				result.Match = match
			}
		}
	}

	return result, nil
}

func (s *SwipeService) GetMatches(dogID, userID uint) ([]domain.Match, error) {
	dog, err := s.dogRepo.FindByID(dogID)
	if err != nil {
		return nil, errors.New("dog not found")
	}
	if dog.UserID != userID {
		return nil, errors.New("forbidden")
	}

	return s.swipeRepo.FindMatchesByDog(dogID)
}

func (s *SwipeService) GetCandidates(dogID, userID uint) ([]domain.Dog, error) {
	dog, err := s.dogRepo.FindByID(dogID)
	if err != nil {
		return nil, errors.New("dog not found")
	}
	if dog.UserID != userID {
		return nil, errors.New("forbidden")
	}

	return s.dogRepo.FindCandidates(userID, dogID)
}
