package config

import (
	"github.com/spf13/viper"
)

type Config struct {
	App        AppConfig
	Database   DatabaseConfig
	Redis      RedisConfig
	JWT        JWTConfig
	Google     GoogleConfig
	Brevo      BrevoConfig
	Cloudinary CloudinaryConfig
}

type CloudinaryConfig struct {
	CloudName string `mapstructure:"CLOUDINARY_CLOUD_NAME"`
	APIKey    string `mapstructure:"CLOUDINARY_API_KEY"`
	APISecret string `mapstructure:"CLOUDINARY_API_SECRET"`
	Folder    string `mapstructure:"CLOUDINARY_FOLDER"`
}

type BrevoConfig struct {
	APIKey string `mapstructure:"BREVO_API_KEY"`
	From   string `mapstructure:"BREVO_FROM"`
}

type GoogleConfig struct {
	ClientID     string `mapstructure:"GOOGLE_CLIENT_ID"`
	ClientSecret string `mapstructure:"GOOGLE_CLIENT_SECRET"`
	RedirectURL  string `mapstructure:"GOOGLE_REDIRECT_URL"`
}

type AppConfig struct {
	Env         string `mapstructure:"APP_ENV"`
	Port        string `mapstructure:"APP_PORT"`
	FrontendURL string `mapstructure:"FRONTEND_URL"`
	AdminEmail  string `mapstructure:"ADMIN_EMAIL"`
}

type DatabaseConfig struct {
	URL string `mapstructure:"DATABASE_URL"`
}

type RedisConfig struct {
	URL string `mapstructure:"REDIS_URL"`
}

type JWTConfig struct {
	Secret          string `mapstructure:"JWT_SECRET"`
	ExpirationHours int    `mapstructure:"JWT_EXPIRATION_HOURS"`
}

func Load() (*Config, error) {
	viper.SetConfigFile(".env")
	viper.SetConfigType("env")
	if err := viper.ReadInConfig(); err != nil {
		viper.SetConfigFile("../.env")
		_ = viper.ReadInConfig()
	}
	viper.AutomaticEnv()

	viper.SetDefault("APP_ENV", "development")
	viper.SetDefault("APP_PORT", "8080")
	viper.SetDefault("JWT_EXPIRATION_HOURS", 24)

	cfg := &Config{
		App: AppConfig{
			Env:         viper.GetString("APP_ENV"),
			Port:        viper.GetString("APP_PORT"),
			FrontendURL: viper.GetString("FRONTEND_URL"),
			AdminEmail:  viper.GetString("ADMIN_EMAIL"),
		},
		Database: DatabaseConfig{
			URL: viper.GetString("DATABASE_URL"),
		},
		Redis: RedisConfig{
			URL: viper.GetString("REDIS_URL"),
		},
		JWT: JWTConfig{
			Secret:          viper.GetString("JWT_SECRET"),
			ExpirationHours: viper.GetInt("JWT_EXPIRATION_HOURS"),
		},
		Google: GoogleConfig{
			ClientID:     viper.GetString("GOOGLE_CLIENT_ID"),
			ClientSecret: viper.GetString("GOOGLE_CLIENT_SECRET"),
			RedirectURL:  viper.GetString("GOOGLE_REDIRECT_URL"),
		},
		Brevo: BrevoConfig{
			APIKey: viper.GetString("BREVO_API_KEY"),
			From:   viper.GetString("BREVO_FROM"),
		},
		Cloudinary: CloudinaryConfig{
			CloudName: viper.GetString("CLOUDINARY_CLOUD_NAME"),
			APIKey:    viper.GetString("CLOUDINARY_API_KEY"),
			APISecret: viper.GetString("CLOUDINARY_API_SECRET"),
			Folder:    viper.GetString("CLOUDINARY_FOLDER"),
		},
	}

	return cfg, nil
}
