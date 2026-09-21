package tests

import (
	"testing"

	"github.com/chetan/01_web_server_session/backend/internal/user"
)

func TestPasswordHashRoundTrip(t *testing.T) {
	hash, err := user.HashPassword("hunter2")
	if err != nil {
		t.Fatal(err)
	}
	if !user.VerifyPassword("hunter2", hash) {
		t.Fatal("correct password must verify")
	}
	if user.VerifyPassword("hunter3", hash) {
		t.Fatal("wrong password must not verify")
	}
}

func TestVerifyPasswordRejectsMalformedHash(t *testing.T) {
	if user.VerifyPassword("hunter2", "not-a-hash") {
		t.Fatal("malformed stored hash must not verify")
	}
}
