# LeetCode Clone — Backend (Person 2: Backend Core + Database)

FastAPI + PostgreSQL + SQLAlchemy backend for the LeetCode clone.

Owns everything except the discussion tab and the Docker code-execution
engine itself (that's the Docker teammate's service — this backend only
calls it over HTTP, see "Runner contract" below).

## Feature list

- JWT auth: register, login, refresh tokens, logout (refresh revocation)
- Email verification flow (dev-mode: prints the link/token to console)
- Forgot / reset password flow (dev-mode: same as above)
- Problems: list with **search, filter (difficulty/tag), pagination**,
  detail view with **hints, editorial, company tags**, related problems
- Per-user **"solved" status** on problem list/detail when logged in
- Boilerplate per language + all languages (for a language dropdown)
- Sample & hidden testcases
- Draft save/fetch (auto-save while coding)
- Submission run/submit, history, per-problem history
- Progress tracking (easy/medium/hard solved counts)
- Streak logic (current + longest)
- **Bookmarks** (save problems for later)
- **Admin APIs**: create/update/delete problems, boilerplates, testcases,
  create contests, list users — protected by an `is_admin` flag
- **Contests**: create (admin), list, detail, per-contest leaderboard
- **Global leaderboard**: ranked by total problems solved
- **Rate limiting** on login/register/run/submit (in-memory, per-IP)
- CORS configured for a separate frontend origin
- Docker Compose wiring for Postgres + this backend, with retry/healthcheck
  so it doesn't crash if Postgres takes a moment to start

Not included (by design/scope): discussion tab, and the actual sandboxed
code-execution engine (owned by the Docker teammate — this backend just
calls it over HTTP).

## Project layout

```
app/
  core/        # config, db session, jwt/password/token helpers
  models/      # SQLAlchemy tables
  schemas/     # Pydantic request/response models
  services/    # DB access logic (used by routes)
  routes/      # FastAPI routers
  utils/       # verdict mapping, runner HTTP client, email, rate limiter
  dependencies.py   # get_db, get_current_user, get_current_admin, optional-auth
  main.py           # app factory, CORS, router registration
seed.py         # 27 sample problems + a default admin user + a demo contest
requirements.txt
Dockerfile
docker-compose.yml   # backend + postgres
```

## Running locally (without Docker)

```bash
python -m venv venv
source venv/bin/activate        # venv\Scripts\activate on Windows
pip install -r requirements.txt

cp .env.example .env            # then edit values if needed
# make sure a local Postgres is running and DATABASE_URL in .env matches it

uvicorn app.main:app --reload
```

Seed sample data (safe to re-run):

```bash
python seed.py
```

This creates:
- 27 sample problems (Two Sum, Valid Parentheses, etc.)
- A default admin account: `admin@example.com` / `admin123`
- A demo contest ("Weekly Demo Contest") running for the next 7 days

API docs: http://localhost:8000/docs

## Running with Docker Compose

```bash
docker compose up --build
```

Starts Postgres + the backend on the same Docker network
(`leetcode_network`). Inside that network the backend reaches Postgres
at host `postgres`, not `localhost` — `docker-compose.yml` overrides
`DATABASE_URL` for you. The backend also retries the DB connection a
few times on boot (`app/core/database.py: wait_for_db`) in case
Postgres is still starting.

Seed data inside the running container:
```bash
docker exec -it leetcode_backend python seed.py
```

If/when the Docker teammate's code-runner service joins this compose
setup, give it the service name `runner` on `leetcode_network` (or set
`RUNNER_URL` to wherever it actually runs).

## Environment variables (`.env`)

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string (host-run only; Docker Compose overrides this) |
| `JWT_SECRET_KEY` | Secret used to sign JWTs — change in production |
| `JWT_ALGORITHM` | e.g. `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifetime |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token lifetime |
| `RESET_TOKEN_EXPIRE_MINUTES` | Password-reset token lifetime |
| `VERIFY_TOKEN_EXPIRE_HOURS` | Email-verification token lifetime |
| `RUNNER_URL` | Base URL of the Docker code-execution microservice |
| `ALLOWED_ORIGINS` | Comma-separated frontend origins for CORS, or `*` for local dev |
| `RATE_LIMIT_LOGIN` / `_REGISTER` / `_SUBMIT` / `_RUN` | Rate limits, format `"calls/seconds"` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `EMAIL_FROM` | Optional real SMTP; leave `SMTP_HOST` empty to just print emails to console (default, fine for dev/demo) |

## Auth flow

1. `POST /auth/register` → creates user, prints a verification email to
   the console (or sends real email if SMTP is configured).
2. `POST /auth/login` (OAuth2 form fields: `username`=email,
   `password`) → returns `{access_token, refresh_token}`.
3. Send `Authorization: Bearer <access_token>` on every authenticated
   request.
4. When the access token expires, `POST /auth/refresh` with the
   refresh token to get a new access token — no need to log in again.
5. `POST /auth/logout` with the refresh token to revoke it.
6. `POST /auth/forgot-password` → prints/sends a reset token.
   `POST /auth/reset-password` with that token + new password.
7. `POST /auth/verify-email` with the token from the registration email.

Admin access: set a user's `is_admin` flag (the seeded `admin@example.com`
account already has it) to use `/admin/*` and create contests.

## API summary

| Method & path | Auth | Purpose |
|---|---|---|
| `POST /auth/register` | – | Create account (rate-limited) |
| `POST /auth/login` | – | Get access + refresh token (rate-limited) |
| `POST /auth/refresh` | – | Exchange refresh token for a new access token |
| `POST /auth/logout` | – | Revoke a refresh token |
| `GET /auth/me` | ✓ | Current user |
| `POST /auth/forgot-password` | – | Request a password-reset token |
| `POST /auth/reset-password` | – | Reset password with that token |
| `POST /auth/resend-verification` | – | Resend the email-verification token |
| `POST /auth/verify-email` | – | Verify email with the token |
| `GET /problems/?page=&limit=&difficulty=&tag=&search=` | optional | Paginated, filterable, searchable problem list (shows `is_solved` if logged in) |
| `GET /problems/{id}` | optional | Problem detail incl. hints/editorial/company tags/`is_solved` |
| `GET /problems/{id}/related` | – | Problems sharing tags |
| `GET /problems/{id}/boilerplate?language=` | – | Starter code for one language |
| `GET /problems/{id}/boilerplates` | – | Starter code for every language |
| `GET /problems/{id}/sample-testcases` | – | Visible sample testcases |
| `POST /drafts/save` | ✓ | Save/upsert a user's in-progress code |
| `GET /drafts/{problem_id}?language=` | ✓ | Fetch a saved draft |
| `POST /submissions/run` | ✓ | Run against sample testcases, rate-limited |
| `POST /submissions/submit` | ✓ | Run against hidden testcases, persist, update progress/streak, rate-limited |
| `GET /submissions/history` | ✓ | All of the user's submissions |
| `GET /submissions/problem/{problem_id}` | ✓ | Submissions for one problem |
| `GET /progress/` | ✓ | Solved counts by difficulty |
| `GET /streak/` | ✓ | Current/longest streak |
| `POST /bookmarks/{problem_id}` | ✓ | Bookmark a problem |
| `DELETE /bookmarks/{problem_id}` | ✓ | Remove a bookmark |
| `GET /bookmarks/` | ✓ | List bookmarked problems |
| `GET /leaderboard/?page=&limit=` | – | Global leaderboard by total solved |
| `GET /contests/` | – | List contests (upcoming/ongoing/ended) |
| `GET /contests/{id}` | – | Contest detail + its problems |
| `GET /contests/{id}/leaderboard` | – | Per-contest leaderboard |
| `POST /contests/` | admin | Create a contest |
| `POST /admin/problems` | admin | Create a problem |
| `PUT /admin/problems/{id}` | admin | Update a problem |
| `DELETE /admin/problems/{id}` | admin | Delete a problem |
| `POST /admin/problems/{id}/boilerplates` | admin | Add/update boilerplate |
| `DELETE /admin/boilerplates/{id}` | admin | Delete boilerplate |
| `POST /admin/problems/{id}/testcases` | admin | Add a testcase |
| `DELETE /admin/testcases/{id}` | admin | Delete a testcase |
| `GET /admin/users` | admin | List all users |

Full interactive docs (with request/response schemas) at `/docs`.

## Runner contract (for the Docker teammate)

The backend never touches Docker directly — it POSTs to whatever
`RUNNER_URL` points at and expects JSON back.

**`POST {RUNNER_URL}/run`** and **`POST {RUNNER_URL}/submit`** — same
request/response shape for both; `/run` gets sample testcases, `/submit`
gets hidden ones.

Request body:
```json
{
  "language": "python",
  "code": "class Solution:\n    def twoSum(self, nums, target):\n        ...",
  "testcases": [
    {"input": "[2,7,11,15],9", "expected_output": "[0,1]"}
  ]
}
```

Expected response body:
```json
{
  "compile_error": false,
  "runtime_error": false,
  "time_limit": false,
  "runtime": "45 ms",
  "memory": "16 MB",
  "passed": 3,
  "total": 3
}
```

`app/utils/verdict.py` turns that into one of: `Accepted`,
`Wrong Answer`, `Compilation Error`, `Runtime Error`,
`Time Limit Exceeded`, or `Runner Unavailable` (if the runner can't be
reached at all — the backend won't crash, it just reports that
verdict and persists 0 passed testcases).

## If you ran an earlier version of this backend before

This version adds several new columns/tables (hints, editorial,
company_tags on problems; refresh tokens; bookmarks; contests; etc.).
`create_all` only creates tables that don't exist yet — it won't add
new columns to a table that's already there. If you already had this
database running, start fresh:

```bash
# Docker: wipes the Postgres volume too
docker compose down -v
docker compose up --build

# Or locally: drop and recreate the database
DROP DATABASE leetcode_db;
CREATE DATABASE leetcode_db;
```

Then re-run `python seed.py` (or `docker exec -it leetcode_backend python seed.py`).

## Notes / intentional simplifications

- No discussion tab (per project scope).
- Tables are created with `Base.metadata.create_all` rather than
  Alembic migrations — fine for this project's timeline.
- Emails (verification/reset) print to console unless `SMTP_HOST` is
  set — no mail server needed for local dev/demo.
- Rate limiting is a simple in-memory sliding window (per process) —
  fine for a single-instance deployment; swap for Redis-backed limiting
  if this ever runs multi-worker/multi-instance in production.
- `ALLOWED_ORIGINS=*` is for local dev only; set it to the real
  frontend origin(s) before deploying.
