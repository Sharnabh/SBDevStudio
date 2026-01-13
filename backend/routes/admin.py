from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from typing import List, Optional
from models import (
    Project, ProjectCreate,
    Testimonial, TestimonialCreate,
    Contact, ContactStatusUpdate,
    AdminLogin, Token, AdminUserCreate, AdminUser,
    FileUploadResponse
)
from auth import (
    get_password_hash, verify_password, create_access_token, get_current_admin
)
from file_handler import save_upload_file, delete_file
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import timedelta
import json

router = APIRouter()


async def get_db():
    from server import db
    return db


# Authentication Routes
@router.post("/admin/login", response_model=Token)
async def admin_login(credentials: AdminLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Admin login endpoint."""
    admin = await db.admins.find_one({"username": credentials.username})
    
    if not admin or not verify_password(credentials.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token = create_access_token(
        data={"sub": admin["username"]},
        expires_delta=timedelta(hours=24)
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/admin/register", response_model=dict)
async def register_admin(
    admin_data: AdminUserCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    """Register a new admin (requires existing admin authentication)."""
    # Check if username already exists
    existing = await db.admins.find_one({"username": admin_data.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Create new admin
    admin = AdminUser(
        username=admin_data.username,
        email=admin_data.email,
        password_hash=get_password_hash(admin_data.password)
    )
    
    await db.admins.insert_one(admin.dict())
    return {"message": "Admin created successfully"}


# File Upload Route
@router.post("/admin/upload", response_model=FileUploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    subfolder: str = Form(...),
    current_admin: str = Depends(get_current_admin)
):
    """Upload an image file."""
    if subfolder not in ["projects", "testimonials"]:
        raise HTTPException(status_code=400, detail="Invalid subfolder")
    
    file_url = await save_upload_file(file, subfolder)
    
    return {
        "filename": file.filename,
        "url": file_url
    }


# Project Management Routes
@router.post("/admin/projects", response_model=Project)
async def create_project(
    project_data: ProjectCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    """Create a new project."""
    project = Project(**project_data.dict())
    await db.projects.insert_one(project.dict())
    return project


@router.put("/admin/projects/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    project_data: ProjectCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    """Update an existing project."""
    existing = await db.projects.find_one({"id": project_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Delete old image if changed
    if existing.get("image") != project_data.image:
        delete_file(existing.get("image", ""))
    
    updated_data = project_data.dict()
    await db.projects.update_one({"id": project_id}, {"$set": updated_data})
    
    updated_project = await db.projects.find_one({"id": project_id})
    return Project(**updated_project)


@router.delete("/admin/projects/{project_id}")
async def delete_project(
    project_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    """Delete a project."""
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Delete associated image
    delete_file(project.get("image", ""))
    
    await db.projects.delete_one({"id": project_id})
    return {"message": "Project deleted successfully"}


# Testimonial Management Routes
@router.post("/admin/testimonials", response_model=Testimonial)
async def create_testimonial(
    testimonial_data: TestimonialCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    """Create a new testimonial."""
    testimonial = Testimonial(**testimonial_data.dict())
    await db.testimonials.insert_one(testimonial.dict())
    return testimonial


@router.put("/admin/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(
    testimonial_id: str,
    testimonial_data: TestimonialCreate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    """Update an existing testimonial."""
    existing = await db.testimonials.find_one({"id": testimonial_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    # Delete old avatar if changed
    if existing.get("avatar") != testimonial_data.avatar:
        delete_file(existing.get("avatar", ""))
    
    updated_data = testimonial_data.dict()
    await db.testimonials.update_one({"id": testimonial_id}, {"$set": updated_data})
    
    updated_testimonial = await db.testimonials.find_one({"id": testimonial_id})
    return Testimonial(**updated_testimonial)


@router.delete("/admin/testimonials/{testimonial_id}")
async def delete_testimonial(
    testimonial_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    """Delete a testimonial."""
    testimonial = await db.testimonials.find_one({"id": testimonial_id})
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    # Delete associated avatar
    delete_file(testimonial.get("avatar", ""))
    
    await db.testimonials.delete_one({"id": testimonial_id})
    return {"message": "Testimonial deleted successfully"}


# Contact Management Routes
@router.get("/admin/contacts", response_model=List[Contact])
async def get_contacts(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    """Get all contact submissions."""
    contacts = await db.contacts.find().sort("created_at", -1).to_list(1000)
    return [Contact(**contact) for contact in contacts]


@router.get("/admin/contacts/{contact_id}", response_model=Contact)
async def get_contact(
    contact_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    """Get a single contact submission."""
    contact = await db.contacts.find_one({"id": contact_id})
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return Contact(**contact)


@router.put("/admin/contacts/{contact_id}", response_model=Contact)
async def update_contact_status(
    contact_id: str,
    status_update: ContactStatusUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    """Update contact submission status."""
    contact = await db.contacts.find_one({"id": contact_id})
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    await db.contacts.update_one(
        {"id": contact_id},
        {"$set": {"status": status_update.status}}
    )
    
    updated_contact = await db.contacts.find_one({"id": contact_id})
    return Contact(**updated_contact)


@router.delete("/admin/contacts/{contact_id}")
async def delete_contact(
    contact_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    """Delete a contact submission."""
    result = await db.contacts.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted successfully"}


# Dashboard Stats
@router.get("/admin/stats")
async def get_stats(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    """Get dashboard statistics."""
    total_projects = await db.projects.count_documents({})
    total_testimonials = await db.testimonials.count_documents({})
    total_contacts = await db.contacts.count_documents({})
    new_contacts = await db.contacts.count_documents({"status": "new"})
    
    return {
        "total_projects": total_projects,
        "total_testimonials": total_testimonials,
        "total_contacts": total_contacts,
        "new_contacts": new_contacts
    }