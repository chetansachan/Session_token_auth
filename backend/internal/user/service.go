package user

import (
	"context"
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"

	"golang.org/x/crypto/argon2"
)

// Argon2id parameters per the docs: m=64MB, t=3, p=4.
const (
	argonTime    = 3
	argonMemory  = 64 * 1024
	argonThreads = 4
	argonKeyLen  = 32
	saltLen      = 16
)

var ErrInvalidCredentials = errors.New("invalid credentials")

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func HashPassword(password string) (string, error) {
	salt := make([]byte, saltLen)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}
	hash := argon2.IDKey([]byte(password), salt, argonTime, argonMemory, argonThreads, argonKeyLen)
	return fmt.Sprintf("%s.%s",
		base64.RawStdEncoding.EncodeToString(salt),
		base64.RawStdEncoding.EncodeToString(hash),
	), nil
}

func VerifyPassword(password, stored string) bool {
	parts := strings.Split(stored, ".")
	if len(parts) != 2 {
		return false
	}
	salt, err := base64.RawStdEncoding.DecodeString(parts[0])
	if err != nil {
		return false
	}
	expected, err := base64.RawStdEncoding.DecodeString(parts[1])
	if err != nil {
		return false
	}
	hash := argon2.IDKey([]byte(password), salt, argonTime, argonMemory, argonThreads, uint32(len(expected)))
	return subtle.ConstantTimeCompare(hash, expected) == 1
}

func (s *Service) Register(ctx context.Context, email, password string) (User, error) {
	hash, err := HashPassword(password)
	if err != nil {
		return User{}, err
	}
	return s.repo.Create(ctx, email, hash)
}

// Authenticate returns the user on success. It always runs a hash comparison
// so valid and invalid emails have near-identical latency (timing defense),
// and returns a generic error (no user enumeration).
func (s *Service) Authenticate(ctx context.Context, email, password string) (User, error) {
	u, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		VerifyPassword(password, "c2FsdA.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
		return User{}, ErrInvalidCredentials
	}
	if !VerifyPassword(password, u.PasswordHash) {
		return User{}, ErrInvalidCredentials
	}
	return u, nil
}

func (s *Service) GetByID(ctx context.Context, id string) (User, error) {
	return s.repo.GetByID(ctx, id)
}
