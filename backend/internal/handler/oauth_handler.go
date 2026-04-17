package handler

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kenshivr/werawoof/internal/service"
)

type OAuthHandler struct {
	oauthService *service.OAuthService
}

func NewOAuthHandler(oauthService *service.OAuthService) *OAuthHandler {
	return &OAuthHandler{oauthService: oauthService}
}

func (h *OAuthHandler) Redirect(c *gin.Context) {
	state := generateState()
	url := h.oauthService.GetAuthURL(state)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (h *OAuthHandler) Callback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing code"})
		return
	}

	token, err := h.oauthService.HandleCallback(c.Request.Context(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "oauth failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func generateState() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}
