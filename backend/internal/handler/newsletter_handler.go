package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/kenshivr/werawoof/internal/repository"
	"github.com/kenshivr/werawoof/internal/service"
)

type NewsletterHandler struct {
	repo         *repository.SubscriberRepository
	emailService *service.EmailService
}

func NewNewsletterHandler(repo *repository.SubscriberRepository, emailService *service.EmailService) *NewsletterHandler {
	return &NewsletterHandler{repo: repo, emailService: emailService}
}

// Subscribe godoc
// @Summary      Subscribe to newsletter
// @Tags         newsletter
// @Accept       json
// @Produce      json
// @Param        body  body  object{email=string}  true  "Subscriber email"
// @Success      200   {object}  map[string]string
// @Failure      400   {object}  map[string]string
// @Router       /newsletter [post]
func (h *NewsletterHandler) Subscribe(c *gin.Context) {
	var body struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Correo inválido"})
		return
	}

	body.Email = strings.ToLower(strings.TrimSpace(body.Email))

	if err := h.repo.Save(body.Email); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo guardar"})
		return
	}

	go h.emailService.SendNewsletterNotification(body.Email)

	c.JSON(http.StatusOK, gin.H{"message": "¡Suscripción exitosa!"})
}
