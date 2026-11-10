from sqlmodel import SQLModel, Field
from sqlalchemy import Column, JSON
from typing import List, Optional, Literal
from datetime import datetime, timezone
import uuid


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


# --- Project Models ---
class ProjectBase(SQLModel):
    title: str
    description: str
    category: str
    technologies: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    image: str
    link: Optional[str] = "#"


class ProjectCreate(ProjectBase):
    pass


class Project(ProjectBase, table=True):
    __tablename__ = "projects"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=utc_now)


# --- Testimonial Models ---
class TestimonialBase(SQLModel):
    name: str
    role: str
    content: str
    rating: int = Field(ge=1, le=5)
    avatar: str


class TestimonialCreate(TestimonialBase):
    pass


class Testimonial(TestimonialBase, table=True):
    __tablename__ = "testimonials"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=utc_now)


# --- Contact Models ---
class ContactBase(SQLModel):
    name: str
    email: str
    subject: str
    message: str


class ContactCreate(ContactBase):
    pass


class Contact(ContactBase, table=True):
    __tablename__ = "contacts"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    status: str = Field(default="new")
    created_at: datetime = Field(default_factory=utc_now)


class ContactStatusUpdate(SQLModel):
    status: Literal["new", "read", "replied"]


# --- Admin User Models ---
class AdminUserBase(SQLModel):
    username: str = Field(unique=True, index=True)
    email: str = Field(index=True)


class AdminUserCreate(AdminUserBase):
    password: str


class AdminUser(AdminUserBase, table=True):
    __tablename__ = "admins"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    password_hash: str
    created_at: datetime = Field(default_factory=utc_now)


class AdminOTP(SQLModel, table=True):
    __tablename__ = "admin_otps"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(index=True)
    otp_code: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=utc_now)


class AdminLogin(SQLModel):
    email: str
    password: str


class AdminOTPVerifyRequest(SQLModel):
    email: str
    otp_code: str


class AdminResendOTPRequest(SQLModel):
    email: str


class AdminCreateRequest(SQLModel):
    username: str
    email: str
    password: str


class AdminChangePasswordRequest(SQLModel):
    current_password: str
    new_password: str


class AdminUserResponse(SQLModel):
    id: str
    username: str
    email: str
    created_at: datetime


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class FileUploadResponse(SQLModel):
    filename: str
    url: str
