package service

import (
	"errors"

	"github.com/kenshivr/werawoof/internal/domain"
	"github.com/kenshivr/werawoof/internal/repository"
	"github.com/kenshivr/werawoof/pkg/sse"
)

type SwipeService struct {
	swipeRepo    *repository.SwipeRepository
	dogRepo      *repository.DogRepository
	userRepo     *repository.UserRepository
	emailService *EmailService
	broker       *sse.Broker
}

func NewSwipeService(swipeRepo *repository.SwipeRepository, dogRepo *repository.DogRepository, userRepo *repository.UserRepository, emailService *EmailService, broker *sse.Broker) *SwipeService {
	return &SwipeService{swipeRepo: swipeRepo, dogRepo: dogRepo, userRepo: userRepo, emailService: emailService, broker: broker}
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

				swipedDog, err := s.dogRepo.FindByID(swipedDogID)
				if err == nil {
					// SSE: notificar en tiempo real al dueño del otro perro
					s.broker.Send(swipedDog.UserID, sse.Event{Type: "new_match", Data: match})

					// Email: notificar a ambos dueños de forma asíncrona
					swiperCopy := swiper
					swipedCopy := swipedDog
					go func() {
						owner1, err1 := s.userRepo.FindByID(swiperCopy.UserID)
						owner2, err2 := s.userRepo.FindByID(swipedCopy.UserID)
						if err1 != nil || err2 != nil {
							return
						}

						photo1 := ""
						if len(swiperCopy.Photos) > 0 {
							photo1 = swiperCopy.Photos[0]
						}
						photo2 := ""
						if len(swipedCopy.Photos) > 0 {
							photo2 = swipedCopy.Photos[0]
						}

						_ = s.emailService.SendMatch(MatchEmailData{
							RecipientEmail: owner1.Email,
							MyDogName:      swiperCopy.Name,
							MyOwnerName:    owner1.Name,
							OtherDogName:   swipedCopy.Name,
							OtherDogBreed:  swipedCopy.Breed,
							OtherDogAge:    swipedCopy.Age,
							OtherDogPhoto:  photo2,
							OtherDogTags:   []string(swipedCopy.PersonalityTags),
							OtherOwnerName: owner2.Name,
						})
						_ = s.emailService.SendMatch(MatchEmailData{
							RecipientEmail: owner2.Email,
							MyDogName:      swipedCopy.Name,
							MyOwnerName:    owner2.Name,
							OtherDogName:   swiperCopy.Name,
							OtherDogBreed:  swiperCopy.Breed,
							OtherDogAge:    swiperCopy.Age,
							OtherDogPhoto:  photo1,
							OtherDogTags:   []string(swiperCopy.PersonalityTags),
							OtherOwnerName: owner1.Name,
						})
					}()
				}
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
