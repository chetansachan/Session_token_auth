package auth

import "net/http"

// Logout deletes the server-side session and expires the cookie.
func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	if err := h.manager.Destroy(w, r); err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}
