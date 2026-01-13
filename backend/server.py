from fastapi import FastAPI, APIRouter, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from models import Testimonial, Contact, ContactCreate
from mailer import send_contact_notification
from auth import get_password_hash
from typing import List


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="SB Dev Studio API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Mount uploads directory for serving static files
UPLOAD_DIR = Path("/app/backend/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Import and include routers
from routes.public import router as public_router
from routes.admin import router as admin_router

# Basic routes
@api_router.get("/")
async def root():
    return {"message": "SB Dev Studio API", "version": "1.0.0"}

# Public routes
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    """Get all testimonials."""
    testimonials = await db.testimonials.find().sort("created_at", -1).to_list(100)
    return [Testimonial(**testimonial) for testimonial in testimonials]

@api_router.post("/contact", response_model=Contact)
async def submit_contact(contact_data: ContactCreate, background_tasks: BackgroundTasks):
    """Submit a contact form."""
    contact = Contact(**contact_data.dict())
    await db.contacts.insert_one(contact.dict())
    # Fire-and-forget email notification if SMTP is configured
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
    """Initialize database with default admin if not exists."""
    admin_exists = await db.admins.find_one({"username": "admin"})
    if not admin_exists:
        from models import AdminUser
        default_admin = AdminUser(
            username="admin",
            email="admin@sbdevstudio.com",
            password_hash=get_password_hash("Admin@123")
        )
        await db.admins.insert_one(default_admin.dict())
        logger.info("Default admin user created: username='admin', password='Admin@123'")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()