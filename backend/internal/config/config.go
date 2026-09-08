package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	Port           string
	RedisAddr      string
	DatabaseURL    string
	SessionTTL     time.Duration
	CookieName     string
	CookieSecure   bool
	AllowedOrigins string
}

func Load() Config {
	return Config{
		Port:           getEnv("PORT", "8080"),
		RedisAddr:      getEnv("REDIS_ADDR", "127.0.0.1:6379"),
		DatabaseURL:    getEnv("DATABASE_URL", "postgres://auth:auth@127.0.0.1:5433/authdb?sslmode=disable"),
		SessionTTL:     time.Duration(getEnvInt("SESSION_TTL_MINUTES", 60)) * time.Minute,
		CookieName:     getEnv("COOKIE_NAME", "__Host-session"),
		CookieSecure:   getEnvBool("COOKIE_SECURE", false),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:3000"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			return n
		}
	}
	return fallback
}

func getEnvBool(key string, fallback bool) bool {
	if v := os.Getenv(key); v != "" {
		if b, err := strconv.ParseBool(v); err == nil {
			return b
		}
	}
	return fallback
}
