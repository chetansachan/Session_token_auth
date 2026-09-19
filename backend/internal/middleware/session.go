package middleware

import (
	"log/slog"
	"net/http"

	"github.com/chetan/01_web_server_session/backend/internal/auth"
)

// Session loads the session from Redis via the cookie on every request.
// A binding mismatch (IP or User-Agent drift) is logged as a security
// signal; level 01 flags it rather than rejecting outright.
func Session(m *auth.Manager) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			data, drift, err := m.Resolve(r)
			if err != nil {
				writeError(w, http.StatusInternalServerError, "internal error")
				return
			}
			if data.UserID != "" {
				if drift {
					slog.Warn("session binding drift",
						"user_id", data.UserID,
						"path", r.URL.Path,
					)
				}
				r = r.WithContext(auth.ContextWithSession(r.Context(), data))
			}
			next.ServeHTTP(w, r)
		})
	}
}

func writeError(w http.ResponseWriter, status int, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write([]byte(`{"error":"` + msg + `"}`))
}
