# Backend (FastAPI + Supabase + Resend)

FastAPI service powered by **Supabase PostgreSQL** via **SQLModel**, with JWT authentication, file uploads, and email notifications via **Resend**.

## Tech Stack
- **Framework:** FastAPI
- **Database / ORM:** Supabase (PostgreSQL) + SQLModel / SQLAlchemy (Asyncpg)
- **Mailing:** Resend
- **Hosting:** Render (Web Service) + UptimeRobot

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
# Supabase PostgreSQL connection string
# Direct: postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
# Pooler (Render): postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sbdevstudio

# JWT Secret
SECRET_KEY=change-this-in-production

# Resend Email Service
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM=onboarding@resend.dev
NOTIFY_TO=your-email@example.com
```

---

## Local Setup

1. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set your `DATABASE_URL` in `.env`.
4. Start the server:
   ```bash
   uvicorn server:app --reload
   ```
   Tables are automatically created in Supabase on startup.

---

## Deploying to Render & UptimeRobot

### 1. Render Deployment
- Create a new **Web Service** on Render connected to this repository.
- **Root Directory:** leave blank (or project root).
- **Build Command:** `pip install -r backend/requirements.txt`
- **Start Command:** `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`
- **Health Check Path:** `/api/`
- Add environment variables: `DATABASE_URL`, `SECRET_KEY`, `RESEND_API_KEY`, `RESEND_FROM`, `NOTIFY_TO`.

### 2. UptimeRobot Setup
- In UptimeRobot, add a new **HTTP(s) Monitor**.
- **URL:** `https://<your-service-name>.onrender.com/api/`
- **Monitoring Interval:** 5 minutes.
- *This prevents Render free-tier instances from idling.*
