import secrets
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends, BackgroundTasks
from typing import List, Dict, Any
from datetime import datetime, timezone, timedelta
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession

from models import (
    Project, ProjectCreate,
    Testimonial, TestimonialCreate,
    Contact, ContactStatusUpdate,
    AdminLogin, Token, AdminUserCreate, AdminUser,
    AdminOTP, AdminOTPVerifyRequest, AdminResendOTPRequest,
    AdminCreateRequest, AdminChangePasswordRequest, AdminUserResponse,
    FileUploadResponse
)
from auth import (
    get_password_hash, verify_password, create_access_token, get_current_admin
)
from file_handler import save_upload_file, delete_file
from database import get_session
from mailer import send_otp_email

router = APIRouter()


# --- Authentication & 2FA Routes ---
@router.post("/admin/login")
async def admin_login(
    credentials: AdminLogin,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session)
):
    """Step 1 of Admin Login: Verify email/password and dispatch 2FA OTP."""
    email_clean = credentials.email.strip().lower()
    statement = select(AdminUser).where(
        (func.lower(AdminUser.email) == email_clean) |
        (func.lower(AdminUser.username) == email_clean)
    )
    result = await session.exec(statement)
    admin = result.first()
    
    if not admin or not verify_password(credentials.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    # Generate secure 6-digit OTP
    otp_code = f"{secrets.randbelow(900000) + 100000}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    # Clean previous OTPs for this admin's email
    existing_otps = (await session.exec(
        select(AdminOTP).where(func.lower(AdminOTP.email) == admin.email.lower())
    )).all()
    for item in existing_otps:
        await session.delete(item)

    # Store new OTP record
    new_otp = AdminOTP(
        email=admin.email.lower(),
        otp_code=otp_code,
        expires_at=expires_at
    )
    session.add(new_otp)
    await session.commit()

    # Dispatch OTP email in background
    background_tasks.add_task(send_otp_email, admin.email, otp_code)

    return {
        "require_otp": True,
        "email": admin.email,
        "message": f"A 6-digit verification code has been sent to {admin.email}"
    }


@router.post("/admin/verify-otp")
async def verify_admin_otp(
    payload: AdminOTPVerifyRequest,
    session: AsyncSession = Depends(get_session)
):
    """Step 2 of Admin Login: Verify OTP and issue JWT access token."""
    email_clean = payload.email.strip().lower()
    otp_clean = payload.otp_code.strip()
    now = datetime.now(timezone.utc)

    statement = select(AdminOTP).where(
        (func.lower(AdminOTP.email) == email_clean) &
        (AdminOTP.otp_code == otp_clean) &
        (AdminOTP.expires_at > now)
    )
    result = await session.exec(statement)
    otp_record = result.first()

    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code")

    # Consume and delete the OTP
    await session.delete(otp_record)

    # Retrieve admin record
    admin_stmt = select(AdminUser).where(func.lower(AdminUser.email) == email_clean)
    admin = (await session.exec(admin_stmt)).first()

    if not admin:
        raise HTTPException(status_code=404, detail="Admin account not found")

    await session.commit()

    access_token = create_access_token(
        data={"sub": admin.username, "email": admin.email},
        expires_delta=timedelta(hours=24)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin": {
            "id": admin.id,
            "username": admin.username,
            "email": admin.email
        }
    }


@router.post("/admin/resend-otp")
async def resend_admin_otp(
    payload: AdminResendOTPRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session)
):
    """Resend 2FA OTP to admin email."""
    email_clean = payload.email.strip().lower()
    admin_stmt = select(AdminUser).where(func.lower(AdminUser.email) == email_clean)
    admin = (await session.exec(admin_stmt)).first()

    if not admin:
        raise HTTPException(status_code=404, detail="Admin account not found")

    otp_code = f"{secrets.randbelow(900000) + 100000}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    # Clean old OTPs
    existing_otps = (await session.exec(
        select(AdminOTP).where(func.lower(AdminOTP.email) == email_clean)
    )).all()
    for item in existing_otps:
        await session.delete(item)

    new_otp = AdminOTP(
        email=email_clean,
        otp_code=otp_code,
        expires_at=expires_at
    )
    session.add(new_otp)
    await session.commit()

    background_tasks.add_task(send_otp_email, admin.email, otp_code)

    return {"message": f"New verification code sent to {admin.email}"}


@router.get("/admin/admins", response_model=List[AdminUserResponse])
async def list_admins(
    session: AsyncSession = Depends(get_session),
    current_admin: str = Depends(get_current_admin)
):
    """List all registered admin users."""
    statement = select(AdminUser).order_by(AdminUser.created_at.desc())
    admins = (await session.exec(statement)).all()
    return admins


@router.post("/admin/create-admin", response_model=AdminUserResponse)
async def create_new_admin(
    payload: AdminCreateRequest,
    session: AsyncSession = Depends(get_session),
    current_admin: str = Depends(get_current_admin)
):
    """Create a new admin user (requires current admin authentication)."""
    username_clean = payload.username.strip()
    email_clean = payload.email.strip().lower()

    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    # Check username
    user_chk = await session.exec(select(AdminUser).where(AdminUser.username == username_clean))
    if user_chk.first():
        raise HTTPException(status_code=400, detail="Username already exists")

    # Check email
    email_chk = await session.exec(select(AdminUser).where(func.lower(AdminUser.email) == email_clean))
    if email_chk.first():
        raise HTTPException(status_code=400, detail="Email already registered to an admin")

    new_admin = AdminUser(
        username=username_clean,
        email=email_clean,
        password_hash=get_password_hash(payload.password)
    )
    session.add(new_admin)
    await session.commit()
    await session.refresh(new_admin)
    return new_admin


@router.post("/admin/change-password")
async def change_admin_password(
    payload: AdminChangePasswordRequest,
    session: AsyncSession = Depends(get_session),
    current_admin: str = Depends(get_current_admin)
):
    """Change current admin's password."""
    statement = select(AdminUser).where(AdminUser.username == current_admin)
    result = await session.exec(statement)
    admin = result.first()

    if not admin:
        raise HTTPException(status_code=404, detail="Admin account not found")

    if not verify_password(payload.current_password, admin.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")

    admin.password_hash = get_password_hash(payload.new_password)
    session.add(admin)
    await session.commit()

    return {"message": "Password changed successfully"}


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
