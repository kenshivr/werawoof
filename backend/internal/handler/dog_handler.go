package handler

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kenshivr/werawoof/internal/service"
	cloudinarypkg "github.com/kenshivr/werawoof/pkg/cloudinary"
)

type DogHandler struct {
	dogService *service.DogService
	cloudinary *cloudinarypkg.Client
}

func NewDogHandler(dogService *service.DogService, cloudinary *cloudinarypkg.Client) *DogHandler {
	return &DogHandler{dogService: dogService, cloudinary: cloudinary}
}

// Create godoc
// @Summary Crear perro
// @Tags dogs
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param body body CreateDogRequest true "Datos del perro"
// @Success 201 {object} map[string]any
// @Router /api/dogs [post]
func (h *DogHandler) Create(c *gin.Context) {
	userID := mustGetUserID(c)

	var req struct {
		Name            string   `json:"name" binding:"required"`
		Breed           string   `json:"breed"`
		Bio             string   `json:"bio"`
		Sex             string   `json:"sex"`
		Size            string   `json:"size"`
		Age             int      `json:"age"`
		PersonalityTags []string `json:"personality_tags"`
		Latitude        float64  `json:"latitude"`
		Longitude       float64  `json:"longitude"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dog, err := h.dogService.Create(userID, service.DogInput{
		Name:            req.Name,
		Breed:           req.Breed,
		Bio:             req.Bio,
		Sex:             req.Sex,
		Size:            req.Size,
		Age:             req.Age,
		PersonalityTags: req.PersonalityTags,
		Latitude:        req.Latitude,
		Longitude:       req.Longitude,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create dog"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"dog": dog})
}

// GetMyDogs godoc
// @Summary Obtener mis perros
// @Tags dogs
// @Security BearerAuth
// @Produce json
// @Success 200 {object} map[string]any
// @Router /api/dogs [get]
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
		Name            string    `json:"name" binding:"required"`
		Breed           string    `json:"breed"`
		Bio             string    `json:"bio"`
		Sex             string    `json:"sex"`
		Size            string    `json:"size"`
		Age             int       `json:"age"`
		PersonalityTags []string  `json:"personality_tags"`
		Latitude        float64   `json:"latitude"`
		Longitude       float64   `json:"longitude"`
		Photos          *[]string `json:"photos"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Capture old photos before update to detect removals
	var oldPhotos []string
	if req.Photos != nil && h.cloudinary.IsConfigured() {
		if oldDog, err := h.dogService.GetByID(uint(dogID)); err == nil {
			oldPhotos = []string(oldDog.Photos)
		}
	}

	dog, err := h.dogService.Update(uint(dogID), userID, service.DogInput{
		Name:            req.Name,
		Breed:           req.Breed,
		Bio:             req.Bio,
		Sex:             req.Sex,
		Size:            req.Size,
		Age:             req.Age,
		PersonalityTags: req.PersonalityTags,
		Latitude:        req.Latitude,
		Longitude:       req.Longitude,
		Photos:          req.Photos,
	})
	if err != nil {
		if err.Error() == "forbidden" {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not update dog"})
		return
	}

	// Delete removed photos from Cloudinary
	if len(oldPhotos) > 0 && req.Photos != nil {
		kept := make(map[string]bool, len(*req.Photos))
		for _, u := range *req.Photos {
			kept[u] = true
		}
		for _, u := range oldPhotos {
			if !kept[u] {
				if pid := cloudinaryPublicID(u); pid != "" {
					h.cloudinary.DeleteImage(context.Background(), pid)
				}
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"dog": dog})
}

// cloudinaryPublicID extracts the public ID from a Cloudinary URL.
// e.g. https://res.cloudinary.com/cloud/image/upload/v123/folder/file.jpg → folder/file
func cloudinaryPublicID(url string) string {
	if !strings.Contains(url, "cloudinary.com") {
		return ""
	}
	const marker = "/upload/"
	idx := strings.Index(url, marker)
	if idx == -1 {
		return ""
	}
	path := url[idx+len(marker):]
	// Strip version prefix (v1234567890/)
	if len(path) > 1 && path[0] == 'v' {
		if i := strings.Index(path, "/"); i != -1 {
			path = path[i+1:]
		}
	}
	// Strip extension
	if i := strings.LastIndex(path, "."); i != -1 {
		path = path[:i]
	}
	return path
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

// UploadPhoto godoc
// @Summary Subir foto a un perro
// @Tags dogs
// @Security BearerAuth
// @Accept multipart/form-data
// @Produce json
// @Param id path int true "Dog ID"
// @Param photo formData file true "Foto"
// @Success 200 {object} map[string]any
// @Router /api/dogs/{id}/photos [post]
func (h *DogHandler) UploadPhoto(c *gin.Context) {
	userID := mustGetUserID(c)

	dogID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	fileHeader, err := c.FormFile("photo")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "photo file is required"})
		return
	}

	var photoURL string

	if h.cloudinary.IsConfigured() {
		file, err := fileHeader.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not read file"})
			return
		}
		defer file.Close()

		photoURL, err = h.cloudinary.UploadImage(context.Background(), file)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not upload photo"})
			return
		}
	} else {
		dir := fmt.Sprintf("./static/dogs/%d", dogID)
		if err := os.MkdirAll(dir, 0755); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create directory"})
			return
		}
		ext := filepath.Ext(fileHeader.Filename)
		if ext == "" {
			ext = ".jpg"
		}
		filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
		dst := filepath.Join(dir, filename)

		if err := c.SaveUploadedFile(fileHeader, dst); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not save photo"})
			return
		}

		scheme := "http"
		photoURL = fmt.Sprintf("%s://%s/static/dogs/%d/%s", scheme, c.Request.Host, dogID, filename)
	}

	dog, err := h.dogService.AddPhoto(uint(dogID), userID, photoURL)
	if err != nil {
		if err.Error() == "forbidden" {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not save photo"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"dog": dog})
}
