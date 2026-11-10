from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from typing import List
from datetime import timedelta
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession

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
from database import get_session

router = APIRouter()


# --- Authentication Routes ---
@router.post("/admin/login", response_model=Token)
async def admin_login(
    credentials: AdminLogin,
    session: AsyncSession = Depends(get_session)
):
    """Admin login endpoint."""
    statement = select(AdminUser).where(AdminUser.username == credentials.username)
    result = await session.exec(statement)
    admin = result.first()
    
    if not admin or not verify_password(credentials.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token = create_access_token(
        data={"sub": admin.username},
        expires_delta=timedelta(hours=24)
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/admin/register", response_model=dict)
async def register_admin(
    admin_data: AdminUserCreate,
    session: AsyncSession = Depends(get_session),
    current_admin: str = Depends(get_current_admin)
):
    """Register a new admin (requires existing admin authentication)."""
    statement = select(AdminUser).where(AdminUser.username == admin_data.username)
    result = await session.exec(statement)
    if result.first():
        raise HTTPException(status_code=400, detail="Username already exists")
    
    admin = AdminUser(
        username=admin_data.username,
        email=admin_data.email,
        password_hash=get_password_hash(admin_data.password)
    )
    session.add(admin)
    await session.commit()
    return {"message": "Admin created successfully"}


# --- File Upload Route ---
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
        "filename": file.filename or "upload",
        "url": file_url
    }


# --- Project Management Routes ---
@router.post("/admin/projects", response_model=Project)
async def create_project(
    project_data: ProjectCreate,
    session: AsyncSession = Depends(get_session),
    current_admin: str = Depends(get_current_admin)
):
    """Create a new project."""
    project = Project(**project_data.dict())
    session.add(project)
    await session.commit()
    await session.refresh(project)
    return project


@router.put("/admin/projects/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    project_data: ProjectCreate,
    session: AsyncSession = Depends(get_session),
    current_admin: str = Depends(get_current_admin)
):
    """Update an existing project."""
    statement = select(Project).where(Project.id == project_id)
    result = await session.exec(statement)
    project = result.first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Delete old image if changed
    if project.image != project_data.image:
        delete_file(project.image)
    
    for key, value in project_data.dict().items():
        setattr(project, key, value)
    
    session.add(project)
    await session.commit()
    await session.refresh(project)
    return project


@router.delete("/admin/projects/{project_id}")
async def delete_project(
    project_id: str,
    session: AsyncSession = Depends(get_session),
    current_admin: str = Depends(get_current_admin)
):
    """Delete a project."""
    statement = select(Project).where(Project.id == project_id)
    result = await session.exec(statement)
    project = result.first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Delete associated image
    delete_file(project.image)
    
    await session.delete(project)
    await session.commit()
    return {"message": "Project deleted successfully"}


# --- Testimonial Management Routes ---
@router.post("/admin/testimonials", response_model=Testimonial)
async def create_testimonial(
    testimonial_data: TestimonialCreate,
    session: AsyncSession = Depends(get_session),
    current_admin: str = Depends(get_current_admin)
):
    """Create a new testimonial."""
    testimonial = Testimonial(**testimonial_data.dict())
    session.add(testimonial)
    await session.commit()
    await session.refresh(testimonial)
    return testimonial


@router.put("/admin/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(
    testimonial_id: str,
    testimonial_data: TestimonialCreate,
    session: AsyncSession = Depends(get_session),
    current_admin: str = Depends(get_current_admin)
):
    """Update an existing testimonial."""
    statement = select(Testimonial).where(Testimonial.id == testimonial_id)
    result = await session.exec(statement)
    testimonial = result.first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    # Delete old avatar if changed
    if testimonial.avatar != testimonial_data.avatar:
        delete_file(testimonial.avatar)
    
    for key, value in testimonial_data.dict().items():
        setattr(testimonial, key, value)
    
    session.add(testimonial)
    await session.commit()
    await session.refresh(testimonial)
    return testimonial


@router.delete("/admin/testimonials/{testimonial_id}")
async def delete_testimonial(
    testimonial_id: str,
    session: AsyncSession = Depends(get_session),
    current_admin: str = Depends(get_current_admin)
):
    """Delete a testimonial."""
    statement = select(Testimonial).where(Testimonial.id == testimonial_id)
    result = await session.exec(statement)
    testimonial = result.first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    # Delete associated avatar
    delete_file(testimonial.avatar)
    
    await session.delete(testimonial)
    await session.commit()
    return {"message": "Testimonial deleted successfully"}


# --- Contact Management Routes ---
@router.get("/admin/contacts", response_model=List[Contact])
async def get_contacts(
    session: AsyncSession = Depends(get_session),
    current_admin: str = Depends(get_current_admin)
):
    """Get all contact submissions."""
    statement = select(Contact).order_by(Contact.created_at.desc())
    result = await session.exec(statement)
    return result.all()


@router.get("/admin/contacts/{contact_id}", response_model=Contact)
async def get_contact(
    contact_id: str,
    session: AsyncSession = Depends(get_session),
    current_admin: str = Depends(get_current_admin)
):
    """Get a single contact submission."""
    statement = select(Contact).where(Contact.id == contact_id)
    result = await session.exec(statement)
    contact = result.first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


@router.put("/admin/contacts/{contact_id}", response_model=Contact)
async def update_contact_status(
    contact_id: str,
    status_update: ContactStatusUpdate,
    session: AsyncSession = Depends(get_session),
    current_admin: str = Depends(get_current_admin)
):
    """Update contact submission status."""
    statement = select(Contact).where(Contact.id == contact_id)
    result = await session.exec(statement)
    contact = result.first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    contact.status = status_update.status
    session.add(contact)
    await session.commit()
    await session.refresh(contact)
    return contact


@router.delete("/admin/contacts/{contact_id}")
async def delete_contact(
    contact_id: str,
    session: AsyncSession = Depends(get_session),
    current_admin: str = Depends(get_current_admin)
):
    """Delete a contact submission."""
    statement = select(Contact).where(Contact.id == contact_id)
    result = await session.exec(statement)
    contact = result.first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    await session.delete(contact)
    await session.commit()
    return {"message": "Contact deleted successfully"}


# --- Dashboard Stats ---
@router.get("/admin/stats")
async def get_stats(
    session: AsyncSession = Depends(get_session),
    current_admin: str = Depends(get_current_admin)
):
    """Get dashboard statistics."""
    total_projects = (await session.exec(select(func.count()).select_from(Project))).one()
    total_testimonials = (await session.exec(select(func.count()).select_from(Testimonial))).one()
    total_contacts = (await session.exec(select(func.count()).select_from(Contact))).one()
    new_contacts = (await session.exec(
        select(func.count()).select_from(Contact).where(Contact.status == "new")
    )).one()
    
    return {
        "total_projects": total_projects,
        "total_testimonials": total_testimonials,
        "total_contacts": total_contacts,
        "new_contacts": new_contacts
    }
