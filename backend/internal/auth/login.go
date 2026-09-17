package auth

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/chetan/01_web_server_session/backend/internal/user"
)

type Handler struct {
	users   *user.Service
	manager *Manager
}

func NewHandler(users *user.Service, manager *Manager) *Handler {
	return &Handler{users: users, manager: manager}
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Login validates user credentials and issues a new session.
func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	u, err := h.users.Authenticate(r.Context(), req.Email, req.Password)
	if err != nil {
		// Generic message — never reveal whether the email exists.
		writeError(w, http.StatusUnauthorized, "invalid credentials")
		return
	}

	if err := h.manager.Create(w, r, u.ID, u.Email); err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

// Me returns the currently authenticated session's user.
func (h *Handler) Me(w http.ResponseWriter, r *http.Request) {
	data := SessionFromContext(r.Context())
	if data == nil {
		writeError(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	u, err := h.users.GetByID(r.Context(), data.UserID)
	if err != nil {
		writeError(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	writeJSON(w, http.StatusOK, u)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}
