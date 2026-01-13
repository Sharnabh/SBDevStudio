from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid


class ProjectBase(BaseModel):
    title: str
    description: str
    category: str
    technologies: List[str]
    image: str
    link: Optional[str] = "#"


class ProjectCreate(ProjectBase):
    pass


class Project(ProjectBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "title": "E-Commerce Platform",
                "description": "Full-stack e-commerce solution",
                "category": "Web Development",
                "technologies": ["React", "Node.js", "MongoDB"],
                "image": "/uploads/projects/image.jpg",
                "link": "https://example.com"
            }
        }


class TestimonialBase(BaseModel):
    name: str
    role: str
    content: str
    rating: int = Field(ge=1, le=5)
    avatar: str


class TestimonialCreate(TestimonialBase):
    pass


class Testimonial(TestimonialBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "role": "CEO, Tech Corp",
                "content": "Amazing work!",
                "rating": 5,
                "avatar": "/uploads/testimonials/avatar.jpg"
            }
        }


class ContactBase(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class ContactCreate(ContactBase):
    pass


class Contact(ContactBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "new"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Jane Smith",
                "email": "jane@example.com",
                "subject": "Project Inquiry",
                "message": "I'd like to discuss a project",
                "status": "new"
            }
        }


class ContactStatusUpdate(BaseModel):
    status: str = Field(pattern="^(new|read|replied)$")


class AdminUserBase(BaseModel):
    username: str
    email: EmailStr


class AdminUserCreate(AdminUserBase):
    password: str


class AdminUser(AdminUserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AdminLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class FileUploadResponse(BaseModel):
    filename: str
    url: str