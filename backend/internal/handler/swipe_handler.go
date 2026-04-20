package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kenshivr/werawoof/internal/domain"
	"github.com/kenshivr/werawoof/internal/service"
)

type SwipeHandler struct {
	swipeService *service.SwipeService
}

func NewSwipeHandler(swipeService *service.SwipeService) *SwipeHandler {
	return &SwipeHandler{swipeService: swipeService}
}

// Swipe godoc
// @Summary Dar like o dislike a un perro
// @Tags swipes
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param body body SwipeRequest true "Swipe"
// @Success 200 {object} map[string]any
// @Router /api/swipe [post]
func (h *SwipeHandler) Swipe(c *gin.Context) {
	userID := mustGetUserID(c)

	var req struct {
		SwiperDogID uint   `json:"swiper_dog_id" binding:"required"`
		SwipedDogID uint   `json:"swiped_dog_id" binding:"required"`
		Direction   string `json:"direction" binding:"required,oneof=like dislike"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.swipeService.Swipe(req.SwiperDogID, req.SwipedDogID, userID, domain.SwipeDirection(req.Direction))
	if err != nil {
		switch err.Error() {
		case "forbidden":
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		case "already swiped":
			c.JSON(http.StatusConflict, gin.H{"error": "already swiped"})
		case "swiper dog not found":
			c.JSON(http.StatusNotFound, gin.H{"error": "dog not found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not process swipe"})
		}
		return
	}

	resp := gin.H{"swiped": true}
	if result.Match != nil {
		resp["match"] = result.Match
	}

	c.JSON(http.StatusOK, resp)
}

// GetMatches godoc
// @Summary Obtener matches de un perro
// @Tags swipes
// @Security BearerAuth
// @Produce json
// @Param dog_id path int true "Dog ID"
// @Success 200 {object} map[string]any
// @Router /api/dogs/{dog_id}/matches [get]
func (h *SwipeHandler) GetMatches(c *gin.Context) {
	userID := mustGetUserID(c)

	dogID, err := strconv.ParseUint(c.Param("dog_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid dog_id"})
		return
	}

	matches, err := h.swipeService.GetMatches(uint(dogID), userID)
	if err != nil {
		if err.Error() == "forbidden" {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch matches"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"matches": matches})
}

// GetCandidates godoc
// @Summary Obtener perros candidatos para swipe
// @Tags swipes
// @Security BearerAuth
// @Produce json
// @Param dog_id path int true "Dog ID"
// @Success 200 {object} map[string]any
// @Router /api/dogs/{dog_id}/candidates [get]
func (h *SwipeHandler) GetCandidates(c *gin.Context) {
	userID := mustGetUserID(c)

	dogID, err := strconv.ParseUint(c.Param("dog_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid dog_id"})
		return
	}

	candidates, err := h.swipeService.GetCandidates(uint(dogID), userID)
	if err != nil {
		if err.Error() == "forbidden" {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch candidates"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"candidates": candidates})
}
