# Backend (FastAPI)

FastAPI + MongoDB service that powers the SB Dev Studio site and admin dashboard. Provides public content, admin CRUD, contact intake, and email notifications.

## Prerequisites
- Python 3.11+
- MongoDB running and reachable via `MONGO_URL`

## Setup
1) From `backend/`, create and activate a virtualenv.
2) Install deps: `pip install -r requirements.txt`.
3) Copy `.env.example` to `.env` (create it if missing) and fill the values below.
4) Start the API: `uvicorn server:app --reload` (binds to `http://localhost:8000`).

## Environment
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=sbdevstudio
SECRET_KEY=change-me
# Optional SMTP for contact notifications
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=mailer@example.com
SMTP_PASS=supersecret
SMTP_FROM=mailer@example.com
NOTIFY_TO=alerts@example.com
```

Uploads are stored under `backend/uploads/` and served at `/uploads/...`.

## Default admin
On first startup, a default admin is created: `admin` / `Admin@123`. Change it after login via the register endpoint.

## API surface (high level)
- Public
  - `GET /api/` health/info
  - `GET /api/projects` and `GET /api/projects/{id}` (optional `category` filter)
  - `GET /api/testimonials`
  - `POST /api/contact` (creates a contact and triggers optional email)
- Admin (JWT Bearer)
  - Auth: `POST /api/admin/login`, `POST /api/admin/register`
  - Projects: `POST|PUT|DELETE /api/admin/projects/{id}`
  - Testimonials: `POST|PUT|DELETE /api/admin/testimonials/{id}`
  - Contacts: `GET /api/admin/contacts`, `GET|PUT|DELETE /api/admin/contacts/{id}`
  - Uploads: `POST /api/admin/upload` (accepts images for `projects` or `testimonials`)
  - Stats: `GET /api/admin/stats`

## Notes
- JWT settings are defined in `auth.py`; default expiry is 24h.
- File uploads are validated for type/size in `file_handler.py` (max 5 MB, image formats only).
- SMTP send is best-effort; if SMTP vars are missing, the service logs and skips email.
