import os
import logging
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession

# Load .env file from backend directory
load_dotenv(Path(__file__).parent / ".env")

logger = logging.getLogger(__name__)


def get_database_url() -> str:
    """Normalize Supabase/Postgres connection string for asyncpg."""
    url = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/sbdevstudio")
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return url


DATABASE_URL = get_database_url()

from sqlalchemy.pool import NullPool

# Supabase PgBouncer / Supavisor transaction pooler (port 6543)
connect_args = {
    "statement_cache_size": 0,
    "prepared_statement_cache_size": 0,
}

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    connect_args=connect_args,
    poolclass=NullPool,
)

async_session_maker = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def init_db() -> None:
    """Create all tables in Supabase / Postgres if they do not exist."""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    logger.info("Database initialized successfully.")


async def get_session():
    """Dependency that yields an async database session."""
    async with async_session_maker() as session:
        yield session

