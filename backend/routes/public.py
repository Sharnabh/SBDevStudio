from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from models import Project, ProjectCreate
from motor.motor_asyncio import AsyncIOMotorDatabase
import os
from datetime import datetime

router = APIRouter()


async def get_db():
    from server import db
    return db


@router.get("/projects", response_model=List[Project])
async def get_projects(category: Optional[str] = None, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all projects, optionally filtered by category."""
    query = {}
    if category and category != "All":
        query["category"] = category
    
    projects = await db.projects.find(query).sort("created_at", -1).to_list(100)
    return [Project(**project) for project in projects]


@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get a single project by ID."""
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return Project(**project)