package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/kenshivr/werawoof/internal/service"
)

// Auth valida el JWT desde el header Authorization: Bearer <token>.
// No acepta ?token= — ese vector queda reservado exclusivamente para WSAuth.
func Auth(authService *service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing token"})
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := authService.ValidateToken(c.Request.Context(), token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		c.Set("userID", claims.Subject)
		c.Next()
	}
}

// WSAuth valida el JWT desde ?token= en la query string.
// Solo debe usarse en endpoints WebSocket y SSE donde el browser
// no puede enviar headers de autorización personalizados.
func WSAuth(authService *service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Query("token")
		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing token"})
			return
		}

		claims, err := authService.ValidateToken(c.Request.Context(), token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		c.Set("userID", claims.Subject)
		c.Next()
	}
}
