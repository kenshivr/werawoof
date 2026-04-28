package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/kenshivr/werawoof/internal/service"
)

type ContactHandler struct {
	emailService *service.EmailService
}

func NewContactHandler(emailService *service.EmailService) *ContactHandler {
	return &ContactHandler{emailService: emailService}
}

type contactRequest struct {
	Name    string `json:"name"    binding:"required"`
	Phone   string `json:"phone"`
	Email   string `json:"email"   binding:"required,email"`
	Message string `json:"message" binding:"required"`
}

func (h *ContactHandler) Send(c *gin.Context) {
	var req contactRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos. Verifica nombre, correo y mensaje."})
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Message = strings.TrimSpace(req.Message)

	if err := h.emailService.SendContact(req.Name, req.Phone, req.Email, req.Message); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo enviar el mensaje. Intenta más tarde."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Mensaje enviado correctamente."})
}
