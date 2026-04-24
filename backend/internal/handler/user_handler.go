package handler

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kenshivr/werawoof/internal/service"
	cloudinarypkg "github.com/kenshivr/werawoof/pkg/cloudinary"
)

type UserHandler struct {
	userService *service.UserService
	cloudinary  *cloudinarypkg.Client
}

func NewUserHandler(userService *service.UserService, cloudinary *cloudinarypkg.Client) *UserHandler {
	return &UserHandler{userService: userService, cloudinary: cloudinary}
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
// @Success 200 {object} map[string]any
// @Router /api/me [put]
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID := mustGetUserID(c)

	var req struct {
		Name     string `json:"name" binding:"required"`
		Location string `json:"location"`
		Bio      string `json:"bio"`
		Avatar   string `json:"avatar"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	input := service.UpdateProfileInput{
		Name:     req.Name,
		Location: req.Location,
		Bio:      req.Bio,
		Avatar:   req.Avatar,
	}

	user, err := h.userService.UpdateProfile(userID, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}

func (h *UserHandler) UploadAvatar(c *gin.Context) {
	userID := mustGetUserID(c)

	fileHeader, err := c.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "avatar file is required"})
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not read file"})
		return
	}
	defer file.Close()

	avatarURL, err := h.cloudinary.UploadImage(context.Background(), file)
	if err != nil || avatarURL == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not upload avatar"})
		return
	}

	user, err := h.userService.UpdateAvatar(userID, avatarURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not save avatar"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}

func mustGetUserID(c *gin.Context) uint {
	id, _ := strconv.ParseUint(c.GetString("userID"), 10, 64)
	return uint(id)
}
