package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/chetan/01_web_server_session/backend/internal/auth"
	"github.com/chetan/01_web_server_session/backend/internal/config"
	"github.com/chetan/01_web_server_session/backend/internal/middleware"
	"github.com/chetan/01_web_server_session/backend/internal/store"
	"github.com/chetan/01_web_server_session/backend/internal/user"
)

func main() {
	cfg := config.Load()

	ctx := context.Background()

	db, err := pgxpool.New(ctx, cfg.DatabaseURL)
	if err != nil {
		slog.Error("connect postgres", "error", err)
		os.Exit(1)
	}
	defer db.Close()
	if err := db.Ping(ctx); err != nil {
		slog.Error("ping postgres", "error", err)
		os.Exit(1)
	}

	sessions := store.NewSessionStore(cfg.RedisAddr, cfg.SessionTTL)
	defer sessions.Close()

	manager := auth.NewManager(sessions, cfg.CookieName, cfg.CookieSecure, cfg.SessionTTL)
	userSvc := user.NewService(user.NewRepository(db))
	userHandler := user.NewHandler(userSvc)
	authHandler := auth.NewHandler(userSvc, manager)

	r := chi.NewRouter()
	r.Use(chimw.RequestID)
	r.Use(chimw.RealIP)
	r.Use(chimw.Logger)
	r.Use(chimw.Recoverer)
	r.Use(cors(cfg.AllowedOrigins))
	r.Use(middleware.Session(manager))

	r.Route("/api", func(r chi.Router) {
		r.Post("/register", userHandler.Register)
		r.Post("/login", authHandler.Login)
		r.Post("/logout", authHandler.Logout)
		r.Group(func(r chi.Router) {
			r.Use(middleware.RequireAuth)
			r.Get("/me", authHandler.Me)
		})
	})

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           r,
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		slog.Info("listening", "addr", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("server", "error", err)
			os.Exit(1)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	srv.Shutdown(shutdownCtx)
}

// cors allows the frontend origin with credentials (needed for cookies).
func cors(origin string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
