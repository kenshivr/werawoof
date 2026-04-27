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
	frontendURL  string
}

func NewOAuthHandler(oauthService *service.OAuthService, frontendURL string) *OAuthHandler {
	return &OAuthHandler{oauthService: oauthService, frontendURL: frontendURL}
}

func (h *OAuthHandler) Redirect(c *gin.Context) {
	state := generateState()
	url := h.oauthService.GetAuthURL(state)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (h *OAuthHandler) Callback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.Redirect(http.StatusTemporaryRedirect, h.frontendURL+"/auth/login?error=oauth_failed")
		return
	}

	token, err := h.oauthService.HandleCallback(c.Request.Context(), code)
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, h.frontendURL+"/auth/login?error=oauth_failed")
		return
	}

	c.Redirect(http.StatusTemporaryRedirect, h.frontendURL+"/auth/callback?token="+token)
}

func generateState() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}
