package store

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/redis/go-redis/v9"
)

var ErrNotFound = errors.New("session not found")

type SessionData struct {
	UserID    string    `json:"user_id"`
	Email     string    `json:"email"`
	IPHash    string    `json:"ip_hash"`
	UAHash    string    `json:"ua_hash"`
	CreatedAt time.Time `json:"created_at"`
}

type SessionStore struct {
	rdb *redis.Client
	ttl time.Duration
}

func NewSessionStore(addr string, ttl time.Duration) *SessionStore {
	rdb := redis.NewClient(&redis.Options{Addr: addr})
	return &SessionStore{rdb: rdb, ttl: ttl}
}

func (s *SessionStore) Close() error {
	return s.rdb.Close()
}

func key(id string) string {
	return "session:" + id
}

func (s *SessionStore) Create(ctx context.Context, id string, data SessionData) error {
	data.CreatedAt = time.Now().UTC()
	b, err := json.Marshal(data)
	if err != nil {
		return err
	}
	return s.rdb.Set(ctx, key(id), b, s.ttl).Err()
}

func (s *SessionStore) Get(ctx context.Context, id string) (SessionData, error) {
	var data SessionData
	b, err := s.rdb.Get(ctx, key(id)).Bytes()
	if errors.Is(err, redis.Nil) {
		return data, ErrNotFound
	}
	if err != nil {
		return data, err
	}
	if err := json.Unmarshal(b, &data); err != nil {
		return data, err
	}
	// Sliding renewal: every read extends the session TTL.
	s.rdb.Expire(ctx, key(id), s.ttl)
	return data, nil
}

func (s *SessionStore) Delete(ctx context.Context, id string) error {
	return s.rdb.Del(ctx, key(id)).Err()
}

// Rotate atomically moves the session to a new ID (prevents session fixation).
func (s *SessionStore) Rotate(ctx context.Context, oldID, newID string) (SessionData, error) {
	data, err := s.Get(ctx, oldID)
	if err != nil {
		return data, err
	}
	if err := s.Create(ctx, newID, data); err != nil {
		return data, err
	}
	if err := s.Delete(ctx, oldID); err != nil {
		return data, err
	}
	return data, nil
}
