# 01 — Web Server-Side Sessions

The classic authentication model, learned before touching JWTs.

```text
Cookie → Session ID → Redis → User
```

## What this teaches

- **Opaque session IDs**: 256-bit random value from `crypto/rand` — the
  browser holds a meaningless key; all state lives server-side.
- **Redis as the session store** with TTL = session lifetime and sliding
  renewal (every authenticated read extends the TTL).
- **Session rotation** as the fixation defense: a fresh session ID is issued
  on every login; pre-login cookie values are never trusted.
- **Session binding**: the session stores SHA-256 hashes of the client IP and
  User-Agent; drift is flagged (logged) as a theft signal.
- **Argon2id** password hashing (m=64MB, t=3, p=4) with constant-time
  comparison and uniform "invalid credentials" errors (no user enumeration,
  no timing oracle).
- **Cookie hardening**: `HttpOnly` + `SameSite=Strict` (+ `Secure` and the
  `__Host-` prefix when served over HTTPS).

## Layout

```text
backend/    Go API — chi router, pgx (Postgres), go-redis
frontend/   Next.js (App Router) — login, register, dashboard, profile
infra/      docker-compose: Redis + Postgres (migrations auto-applied)
```

## Run it

```bash
# 1. Start Redis + Postgres (applies backend/migrations automatically)
docker compose -f infra/docker-compose.yml up -d

# 2. Start the API (http://localhost:8080)
cd backend && go run ./cmd/api

# 3. Start the frontend (http://localhost:3000)
cd frontend && npm install && npm run dev
```

Register at `/register`, then watch Redis:

```bash
docker exec -it $(docker ps -qf name=redis) redis-cli
> KEYS session:*
> GET session:<id>     # {"user_id":..., "ip_hash":..., "ua_hash":...}
> TTL session:<id>     # resets on every authenticated request (sliding renewal)
```

Log out, and the key disappears — the cookie becomes instantly worthless.

## API

| Method | Path            | Auth | Purpose                        |
|--------|-----------------|------|--------------------------------|
| POST   | `/api/register` | —    | Create account (Argon2id hash) |
| POST   | `/api/login`    | —    | Verify credentials, set cookie |
| POST   | `/api/logout`   | —    | Delete session, expire cookie  |
| GET    | `/api/me`       | ✓    | Current user from session      |

## Config (env vars)

| Var                   | Default                                        |
|-----------------------|------------------------------------------------|
| `PORT`                | `8080`                                         |
| `REDIS_ADDR`          | `127.0.0.1:6379`                               |
| `DATABASE_URL`        | `postgres://auth:auth@127.0.0.1:5433/authdb?sslmode=disable` |
| `SESSION_TTL_MINUTES` | `60`                                           |
| `COOKIE_SECURE`       | `false` (set `true` behind HTTPS)              |
| `ALLOWED_ORIGINS`     | `http://localhost:3000`                        |

## Tests

```bash
cd backend && go test ./...
```

Covers password hashing round-trip, session CRUD, rotation (old ID dies),
and unknown-session handling — using miniredis, no live infra needed.

## Deliberate limitations (addressed in later levels)

- Sessions never expire while active beyond sliding TTL — no absolute/idle
  timeout (→ level 22)
- No login rate limiting yet (→ level 20)
- Binding drift is only logged, not enforced (→ levels 21/25)
- No CSRF token — mitigated for now by `SameSite=Strict` (→ level 27)
