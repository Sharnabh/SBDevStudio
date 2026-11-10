from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from models import Project
from database import get_session

router = APIRouter()


@router.get("/projects", response_model=List[Project])
async def get_projects(
    category: Optional[str] = None,
    session: AsyncSession = Depends(get_session)
):
    """Get all projects, optionally filtered by category."""
    statement = select(Project).order_by(Project.created_at.desc())
    if category and category != "All":
        statement = statement.where(Project.category == category)
    
    result = await session.exec(statement)
    return result.all()


@router.get("/projects/{project_id}", response_model=Project)
async def get_project(
    project_id: str,
    session: AsyncSession = Depends(get_session)
):
    """Get a single project by ID."""
    statement = select(Project).where(Project.id == project_id)
    result = await session.exec(statement)
    project = result.first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
