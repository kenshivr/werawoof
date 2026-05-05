package middleware

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kenshivr/werawoof/internal/repository"
)

func Admin(userRepo *repository.UserRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		rawID, exists := c.Get("userID")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		id, err := strconv.ParseUint(fmt.Sprintf("%v", rawID), 10, 64)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		user, err := userRepo.FindByID(uint(id))
		if err != nil || user.Role != "admin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}

		c.Next()
	}
}
