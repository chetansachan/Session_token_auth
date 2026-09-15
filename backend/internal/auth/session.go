package auth

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"net"
	"net/http"
	"time"

	"github.com/chetan/01_web_server_session/backend/internal/store"
)

// Manager owns the session lifecycle: Cookie → Session ID → Redis → User.
type Manager struct {
	sessions *store.SessionStore
	cookie   string
	secure   bool
	ttl      time.Duration
}

func NewManager(sessions *store.SessionStore, cookieName string, secure bool, ttl time.Duration) *Manager {
	return &Manager{sessions: sessions, cookie: cookieName, secure: secure, ttl: ttl}
}

// NewSessionID returns a 256-bit cryptographically random session ID.
func NewSessionID() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

func hashString(s string) string {
	sum := sha256.Sum256([]byte(s))
	return hex.EncodeToString(sum[:])
}

// clientIP extracts the remote IP without trusting X-Forwarded-For
// (no trusted proxies in this level-01 setup).
func clientIP(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

func ipHash(r *http.Request) string  { return hashString(clientIP(r)) }
func uaHash(r *http.Request) string  { return hashString(r.UserAgent()) }

// Create stores a new session in Redis and sets the cookie.
func (m *Manager) Create(w http.ResponseWriter, r *http.Request, userID, email string) error {
	id, err := NewSessionID()
	if err != nil {
		return err
	}
	data := store.SessionData{
		UserID: userID,
		Email:  email,
		IPHash: ipHash(r),
		UAHash: uaHash(r),
	}
	if err := m.sessions.Create(r.Context(), id, data); err != nil {
		return err
	}
	m.setCookie(w, id)
	return nil
}

func (m *Manager) setCookie(w http.ResponseWriter, id string) {
	http.SetCookie(w, &http.Cookie{
		Name:     m.cookie,
		Value:    id,
		Path:     "/",
		HttpOnly: true,
		Secure:   m.secure,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   int(m.ttl.Seconds()),
	})
}

func (m *Manager) clearCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     m.cookie,
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   m.secure,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   -1,
	})
}

// Resolve reads the cookie and loads the session from Redis.
// It flags (but does not hard-fail on) IP/UA binding drift.
func (m *Manager) Resolve(r *http.Request) (store.SessionData, bool, error) {
	c, err := r.Cookie(m.cookie)
	if err != nil || c.Value == "" {
		return store.SessionData{}, false, nil
	}
	data, err := m.sessions.Get(r.Context(), c.Value)
	if errors.Is(err, store.ErrNotFound) {
		return store.SessionData{}, false, nil
	}
	if err != nil {
		return store.SessionData{}, false, err
	}
	bindingDrift := data.IPHash != ipHash(r) || data.UAHash != uaHash(r)
	return data, bindingDrift, nil
}

type contextKey struct{}

// ContextWithSession attaches session data to a request context.
func ContextWithSession(ctx context.Context, data store.SessionData) context.Context {
	return context.WithValue(ctx, contextKey{}, data)
}

// SessionFromContext returns the session data, or nil if unauthenticated.
func SessionFromContext(ctx context.Context) *store.SessionData {
	data, ok := ctx.Value(contextKey{}).(store.SessionData)
	if !ok {
		return nil
	}
	return &data
}

// Destroy removes the session from Redis and clears the cookie.
func (m *Manager) Destroy(w http.ResponseWriter, r *http.Request) error {
	c, err := r.Cookie(m.cookie)
	if err == nil && c.Value != "" {
		if err := m.sessions.Delete(r.Context(), c.Value); err != nil {
			return err
		}
	}
	m.clearCookie(w)
	return nil
}
