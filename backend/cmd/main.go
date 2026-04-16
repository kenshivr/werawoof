package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/kenshivr/werawoof/internal/config"
	"github.com/kenshivr/werawoof/internal/handler"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	r := gin.Default()

	r.GET("/health", handler.HealthCheck)

	log.Printf("server running on port %s", cfg.App.Port)
	if err := r.Run(":" + cfg.App.Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
