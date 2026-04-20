package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kenshivr/werawoof/internal/service"
)

type UserHandler struct {
	userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

// GetProfile godoc
// @Summary Obtener perfil del usuario autenticado
// @Tags users
// @Security BearerAuth
// @Produce json
// @Success 200 {object} map[string]any
// @Router /api/me [get]
func (h *UserHandler) GetProfile(c *gin.Context) {
	userID := mustGetUserID(c)

	user, err := h.userService.GetProfile(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}

// UpdateProfile godoc
// @Summary Actualizar perfil
// @Tags users
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param body body UpdateProfileRequest true "Datos a actualizar"
// @Success 200 {object} map[string]any
// @Router /api/me [put]
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID := mustGetUserID(c)

	var req struct {
		Name string `json:"name" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.userService.UpdateProfile(userID, req.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}

func mustGetUserID(c *gin.Context) uint {
	id, _ := strconv.ParseUint(c.GetString("userID"), 10, 64)
	return uint(id)
}
