package config

import (
	"os"
)

type Config struct {
	DatabaseURL string
	RedisURL    string
	JWTSecret   string
	Environment string
}

func LoadConfig() *Config {
	return &Config{
		DatabaseURL: getEnv("DB_URL", "postgres://admin:strongpassword@postgres:5432/appointment_db?sslmode=disable"),
		RedisURL:    getEnv("REDIS_URL", "redis:6379"),
		JWTSecret:   getEnv("JWT_SECRET", "your-secret-key"),
		Environment: getEnv("ENV", "development"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
} 