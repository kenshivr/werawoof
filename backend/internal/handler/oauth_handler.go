package handler

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kenshivr/werawoof/internal/service"
)

const oauthStateCookie = "oauth_state"

type OAuthHandler struct {
	oauthService *service.OAuthService
	frontendURL  string
	isProd       bool
}

func NewOAuthHandler(oauthService *service.OAuthService, frontendURL string, isProd bool) *OAuthHandler {
	return &OAuthHandler{oauthService: oauthService, frontendURL: frontendURL, isProd: isProd}
}

func (h *OAuthHandler) Redirect(c *gin.Context) {
	state, err := generateState()
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, h.frontendURL+"/auth/login?error=oauth_failed")
		return
	}

	// Guardar state en cookie HttpOnly — se valida en el callback para prevenir CSRF.
	// SameSite=Lax permite que la cookie viaje en el redirect top-level de Google.
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(oauthStateCookie, state, 600, "/", "", h.isProd, true)

	url := h.oauthService.GetAuthURL(state)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (h *OAuthHandler) Callback(c *gin.Context) {
	// Validar state contra la cookie para prevenir CSRF
	cookieState, err := c.Cookie(oauthStateCookie)
	if err != nil || cookieState == "" {
		c.Redirect(http.StatusTemporaryRedirect, h.frontendURL+"/auth/login?error=oauth_failed")
		return
	}

	queryState := c.Query("state")
	if cookieState != queryState {
		c.Redirect(http.StatusTemporaryRedirect, h.frontendURL+"/auth/login?error=oauth_failed")
		return
	}

	// Consumir la cookie — el state es de un solo uso
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(oauthStateCookie, "", -1, "/", "", h.isProd, true)

	code := c.Query("code")
	if code == "" {
		c.Redirect(http.StatusTemporaryRedirect, h.frontendURL+"/auth/login?error=oauth_failed")
		return
	}

	token, err := h.oauthService.HandleCallback(c.Request.Context(), code)
	if err != nil {
		errCode := "oauth_failed"
		if err.Error() == "email_registered_with_password" {
			errCode = "use_password"
		}
		c.Redirect(http.StatusTemporaryRedirect, h.frontendURL+"/auth/login?error="+errCode)
		return
	}

	c.Redirect(http.StatusTemporaryRedirect, h.frontendURL+"/auth/callback?token="+token)
}

func generateState() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
