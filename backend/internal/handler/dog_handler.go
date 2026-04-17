package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kenshivr/werawoof/internal/service"
)

type DogHandler struct {
	dogService *service.DogService
}

func NewDogHandler(dogService *service.DogService) *DogHandler {
	return &DogHandler{dogService: dogService}
}

func (h *DogHandler) Create(c *gin.Context) {
	userID := mustGetUserID(c)

	var req struct {
		Name      string  `json:"name" binding:"required"`
		Breed     string  `json:"breed"`
		Bio       string  `json:"bio"`
		Age       int     `json:"age"`
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dog, err := h.dogService.Create(userID, req.Name, req.Breed, req.Bio, req.Age, req.Latitude, req.Longitude)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create dog"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"dog": dog})
}

func (h *DogHandler) GetMyDogs(c *gin.Context) {
	userID := mustGetUserID(c)

	dogs, err := h.dogService.GetByUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch dogs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"dogs": dogs})
}

func (h *DogHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	dog, err := h.dogService.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "dog not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"dog": dog})
}

func (h *DogHandler) Update(c *gin.Context) {
	userID := mustGetUserID(c)

	dogID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req struct {
		Name      string  `json:"name" binding:"required"`
		Breed     string  `json:"breed"`
		Bio       string  `json:"bio"`
		Age       int     `json:"age"`
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dog, err := h.dogService.Update(uint(dogID), userID, req.Name, req.Breed, req.Bio, req.Age, req.Latitude, req.Longitude)
	if err != nil {
		if err.Error() == "forbidden" {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not update dog"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"dog": dog})
}

func (h *DogHandler) Delete(c *gin.Context) {
	userID := mustGetUserID(c)

	dogID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := h.dogService.Delete(uint(dogID), userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not delete dog"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "dog deleted"})
}
