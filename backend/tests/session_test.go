package tests

import (
	"context"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/chetan/01_web_server_session/backend/internal/store"
)

func newTestStore(t *testing.T) *store.SessionStore {
	t.Helper()
	mr := miniredis.RunT(t)
	return store.NewSessionStore(mr.Addr(), time.Minute)
}

func TestSessionCreateGet(t *testing.T) {
	s := newTestStore(t)
	ctx := context.Background()

	err := s.Create(ctx, "abc", store.SessionData{UserID: "u1", Email: "a@b.c"})
	if err != nil {
		t.Fatal(err)
	}

	data, err := s.Get(ctx, "abc")
	if err != nil {
		t.Fatal(err)
	}
	if data.UserID != "u1" || data.Email != "a@b.c" {
		t.Fatalf("unexpected data: %+v", data)
	}
}

func TestSessionGetUnknownIsNotFound(t *testing.T) {
	s := newTestStore(t)
	_, err := s.Get(context.Background(), "does-not-exist")
	if err != store.ErrNotFound {
		t.Fatalf("want ErrNotFound, got %v", err)
	}
}

func TestSessionDelete(t *testing.T) {
	s := newTestStore(t)
	ctx := context.Background()

	_ = s.Create(ctx, "abc", store.SessionData{UserID: "u1"})
	if err := s.Delete(ctx, "abc"); err != nil {
		t.Fatal(err)
	}
	if _, err := s.Get(ctx, "abc"); err != store.ErrNotFound {
		t.Fatalf("session should be gone, got %v", err)
	}
}

