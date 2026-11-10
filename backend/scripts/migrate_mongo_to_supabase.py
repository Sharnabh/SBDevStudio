"""
Data Migration Script: MongoDB to Supabase (PostgreSQL)

Usage:
    export MONGO_URL="mongodb://localhost:27017" # or your Atlas URL
    export DB_NAME="sbdevstudio"
    export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

    python scripts/migrate_mongo_to_supabase.py
"""

import asyncio
import os
import sys
from datetime import datetime
from pathlib import Path

# Add backend root to path
sys.path.append(str(Path(__file__).parent.parent))

from motor.motor_asyncio import AsyncIOMotorClient
from sqlmodel import select
from database import init_db, async_session_maker
from models import Project, Testimonial, Contact, AdminUser


async def migrate():
    mongo_url = os.getenv("MONGO_URL")
    db_name = os.getenv("DB_NAME", "sbdevstudio")

    if not mongo_url:
        print("Error: MONGO_URL environment variable is required to read source data.")
        sys.exit(1)

    print("1. Connecting to MongoDB...")
    mongo_client = AsyncIOMotorClient(mongo_url)
    mongo_db = mongo_client[db_name]

    print("2. Ensuring Supabase tables exist...")
    await init_db()

    async with async_session_maker() as session:
        # Migrate Admins
        print("Migrating Admins...")
        mongo_admins = await mongo_db.admins.find().to_list(1000)
        for doc in mongo_admins:
            username = doc.get("username")
            existing = (await session.exec(select(AdminUser).where(AdminUser.username == username))).first()
            if not existing:
                admin = AdminUser(
                    username=username,
                    email=doc.get("email", f"{username}@sbdevstudio.com"),
                    password_hash=doc.get("password_hash", ""),
                    created_at=doc.get("created_at") or datetime.utcnow(),
                )
                session.add(admin)
        await session.commit()
        print(f"  Processed {len(mongo_admins)} admins.")

        # Migrate Projects
        print("Migrating Projects...")
        mongo_projects = await mongo_db.projects.find().to_list(1000)
        for doc in mongo_projects:
            proj_id = str(doc.get("id") or doc.get("_id"))
            existing = (await session.exec(select(Project).where(Project.id == proj_id))).first()
            if not existing:
                proj = Project(
                    id=proj_id,
                    title=doc.get("title", ""),
                    description=doc.get("description", ""),
                    category=doc.get("category", "Web Development"),
                    technologies=doc.get("technologies") or [],
                    image=doc.get("image", ""),
                    link=doc.get("link", "#"),
                    created_at=doc.get("created_at") or datetime.utcnow(),
                )
                session.add(proj)
        await session.commit()
        print(f"  Processed {len(mongo_projects)} projects.")

        # Migrate Testimonials
        print("Migrating Testimonials...")
        mongo_testimonials = await mongo_db.testimonials.find().to_list(1000)
        for doc in mongo_testimonials:
            test_id = str(doc.get("id") or doc.get("_id"))
            existing = (await session.exec(select(Testimonial).where(Testimonial.id == test_id))).first()
            if not existing:
                test = Testimonial(
                    id=test_id,
                    name=doc.get("name", ""),
                    role=doc.get("role", ""),
                    content=doc.get("content", ""),
                    rating=int(doc.get("rating", 5)),
                    avatar=doc.get("avatar", ""),
                    created_at=doc.get("created_at") or datetime.utcnow(),
                )
                session.add(test)
        await session.commit()
        print(f"  Processed {len(mongo_testimonials)} testimonials.")

        # Migrate Contacts
        print("Migrating Contacts...")
        mongo_contacts = await mongo_db.contacts.find().to_list(10000)
        for doc in mongo_contacts:
            contact_id = str(doc.get("id") or doc.get("_id"))
            existing = (await session.exec(select(Contact).where(Contact.id == contact_id))).first()
            if not existing:
                contact = Contact(
                    id=contact_id,
                    name=doc.get("name", ""),
                    email=doc.get("email", ""),
                    subject=doc.get("subject", ""),
                    message=doc.get("message", ""),
                    status=doc.get("status", "new"),
                    created_at=doc.get("created_at") or datetime.utcnow(),
                )
                session.add(contact)
        await session.commit()
        print(f"  Processed {len(mongo_contacts)} contacts.")

    print("\nData migration completed successfully!")


if __name__ == "__main__":
    asyncio.run(migrate())

