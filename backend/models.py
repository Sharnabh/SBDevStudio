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
    email: str


class AdminUserCreate(AdminUserBase):
    password: str


class AdminUser(AdminUserBase, table=True):
    __tablename__ = "admins"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    password_hash: str
    created_at: datetime = Field(default_factory=utc_now)


class AdminLogin(SQLModel):
    username: str
    password: str


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class FileUploadResponse(SQLModel):
    filename: str
    url: str
