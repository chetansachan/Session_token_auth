package middleware

import (
	"net/http"

	"github.com/chetan/01_web_server_session/backend/internal/auth"
)

// RequireAuth rejects requests without a valid session.
func RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if auth.SessionFromContext(r.Context()) == nil {
			writeError(w, http.StatusUnauthorized, "not authenticated")
			return
		}
		next.ServeHTTP(w, r)
	})
}
