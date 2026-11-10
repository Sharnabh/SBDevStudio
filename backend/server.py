from fastapi import FastAPI, APIRouter, BackgroundTasks, Depends
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from typing import List
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from models import Testimonial, Contact, ContactCreate, AdminUser
from database import init_db, get_session, async_session_maker
from mailer import send_contact_notification
from auth import get_password_hash

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI(title="SB Dev Studio API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Mount uploads directory for serving static files
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", Path(__file__).parent / "uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Import and include routers
from routes.public import router as public_router
from routes.admin import router as admin_router

# Health & Info check (Used by UptimeRobot)
@api_router.get("/")
async def root():
    return {"message": "SB Dev Studio API", "version": "1.0.0", "status": "healthy"}

# Public routes
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials(session: AsyncSession = Depends(get_session)):
    """Get all testimonials."""
    statement = select(Testimonial).order_by(Testimonial.created_at.desc())
    result = await session.exec(statement)
    return result.all()

@api_router.post("/contact", response_model=Contact)
async def submit_contact(
    contact_data: ContactCreate,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session)
):
    """Submit a contact form."""
    contact = Contact(**contact_data.dict())
    session.add(contact)
    await session.commit()
    await session.refresh(contact)
    # Fire-and-forget email notification via Resend
    background_tasks.add_task(send_contact_notification, contact.dict())
    return contact

# Include public and admin routers
api_router.include_router(public_router, tags=["Public"])
api_router.include_router(admin_router, tags=["Admin"])

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event():
    """Initialize Supabase Postgres tables and default admin if not exists."""
    try:
        await init_db()
        async with async_session_maker() as session:
            statement = select(AdminUser).where(AdminUser.username == "admin")
            result = await session.exec(statement)
            admin_exists = result.first()
            admin_email = os.getenv("NOTIFY_TO") or "sbdevstudio1@gmail.com"
            if not admin_exists:
                default_admin = AdminUser(
                    username="admin",
                    email=admin_email,
                    password_hash=get_password_hash("Admin@123")
                )
                session.add(default_admin)
                await session.commit()
                logger.info("Default admin user created: email='%s', password='Admin@123'", admin_email)
            elif admin_exists.email == "admin@sbdevstudio.com":
                admin_exists.email = admin_email
                session.add(admin_exists)
                await session.commit()
                logger.info("Updated default admin email to '%s'", admin_email)
    except Exception as exc:
        logger.error("Database startup initialization error: %s", exc)
