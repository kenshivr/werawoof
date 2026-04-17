package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/kenshivr/werawoof/internal/config"
	"github.com/kenshivr/werawoof/internal/handler"
	"github.com/kenshivr/werawoof/internal/middleware"
	"github.com/kenshivr/werawoof/internal/repository"
	"github.com/kenshivr/werawoof/internal/service"
	"github.com/kenshivr/werawoof/pkg/database"
	"github.com/kenshivr/werawoof/pkg/redis"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	db, err := database.Connect(cfg.Database.URL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	if err := database.Migrate(db); err != nil {
		log.Fatalf("failed to run migrations: %v", err)
	}

	redisClient, err := redis.Connect(cfg.Redis.URL)
	if err != nil {
		log.Fatalf("failed to connect to redis: %v", err)
	}

	userRepo := repository.NewUserRepository(db)
	dogRepo := repository.NewDogRepository(db)
	authService := service.NewAuthService(userRepo, redisClient, cfg.JWT.Secret, cfg.JWT.ExpirationHours)
	oauthService := service.NewOAuthService(userRepo, authService, cfg.Google.ClientID, cfg.Google.ClientSecret, cfg.Google.RedirectURL)
	emailService := service.NewEmailService(cfg.Resend.APIKey, cfg.Resend.FromEmail, cfg.App.FrontendURL)
	verificationService := service.NewVerificationService(userRepo, redisClient, emailService, cfg.App.FrontendURL)
	authService.SetVerificationService(verificationService)

	userService := service.NewUserService(userRepo)
	dogService := service.NewDogService(dogRepo)

	authHandler := handler.NewAuthHandler(authService)
	oauthHandler := handler.NewOAuthHandler(oauthService)
	verificationHandler := handler.NewVerificationHandler(verificationService)
	userHandler := handler.NewUserHandler(userService)
	dogHandler := handler.NewDogHandler(dogService)

	r := gin.Default()

	r.GET("/health", handler.HealthCheck)

	auth := r.Group("/auth")
	{
		auth.POST("/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
		auth.POST("/logout", middleware.Auth(authService), authHandler.Logout)
		auth.GET("/google", oauthHandler.Redirect)
		auth.GET("/google/callback", oauthHandler.Callback)
		auth.GET("/verify", verificationHandler.VerifyAccount)
		auth.POST("/forgot-password", verificationHandler.ForgotPassword)
		auth.POST("/reset-password", verificationHandler.ResetPassword)
	}

	authMiddleware := middleware.Auth(authService)

	api := r.Group("/api", authMiddleware)
	{
		api.GET("/me", userHandler.GetProfile)
		api.PUT("/me", userHandler.UpdateProfile)

		api.POST("/dogs", dogHandler.Create)
		api.GET("/dogs", dogHandler.GetMyDogs)
		api.GET("/dogs/:id", dogHandler.GetByID)
		api.PUT("/dogs/:id", dogHandler.Update)
		api.DELETE("/dogs/:id", dogHandler.Delete)
	}

	log.Printf("server running on port %s", cfg.App.Port)
	if err := r.Run(":" + cfg.App.Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
