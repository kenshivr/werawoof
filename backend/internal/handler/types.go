package handler

// Request / Response types used only for Swagger docs

type RegisterRequest struct {
	Name     string `json:"name" example:"Juan"`
	Email    string `json:"email" example:"juan@example.com"`
	Password string `json:"password" example:"secret123"`
}

type LoginRequest struct {
	Email    string `json:"email" example:"juan@example.com"`
	Password string `json:"password" example:"secret123"`
}

type UpdateProfileRequest struct {
	Name string `json:"name" example:"Juan"`
}

type CreateDogRequest struct {
	Name      string  `json:"name" example:"Wera"`
	Breed     string  `json:"breed" example:"Labrador"`
	Bio       string  `json:"bio" example:"Le encanta jugar"`
	Age       int     `json:"age" example:"3"`
	Latitude  float64 `json:"latitude" example:"-34.6037"`
	Longitude float64 `json:"longitude" example:"-58.3816"`
}

type SwipeRequest struct {
	SwiperDogID uint   `json:"swiper_dog_id" example:"1"`
	SwipedDogID uint   `json:"swiped_dog_id" example:"2"`
	Direction   string `json:"direction" example:"like"`
}
