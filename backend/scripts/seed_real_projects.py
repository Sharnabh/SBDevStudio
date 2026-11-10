import asyncio
import os
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv
load_dotenv(backend_dir / ".env")

from sqlmodel import select
from database import async_session_maker, init_db
from models import Project


REAL_PROJECTS = [
    {
        "title": "Nimbus: Zero-Disk Cloud Storage",
        "category": "macOS / Cloud",
        "description": "Native macOS virtual cloud filesystem mounting remote cloud storage directly in Finder without consuming local SSD space, paired with a 3D web platform & automated licensing.",
        "technologies": ["Swift", "Apple FSKit", "FileProvider", "Next.js", "NestJS", "Three.js"],
        "image": "/assets/projects/nimbus.png",
        "link": "https://nimbus.sbdevstudio.in/",
    },
    {
        "title": "Orbit: Productivity Hub",
        "category": "macOS Productivity",
        "description": "Fluid, Metal-accelerated radial launcher and clipboard wheel for macOS with liquid physics, OpenSearch website sub-rings, and seamless iCloud sync.",
        "technologies": ["SwiftUI", "AppKit", "Metal Shaders", "iCloud Sync"],
        "image": "/assets/projects/orbit.jpg",
        "link": "https://apps.apple.com/in/app/orbit-productivity-hub/id6802066283",
    },
    {
        "title": "BulkMart: Wholesale & B2B",
        "category": "Mobile Development",
        "description": "B2B wholesale and consumer iOS shopping platform featuring tiered volume discounts, wallet & coupon payment engines, scheduled delivery slots, and gamified loyalty rewards.",
        "technologies": ["Swift", "SwiftUI", "CoreData", "Firebase"],
        "image": "/assets/projects/bulkmart.png",
        "link": "https://apps.apple.com/in/app/bulkmart/id6762193786",
    },
    {
        "title": "TaskFlow Enterprise",
        "category": "Web Development",
        "description": "Enterprise collaborative project management suite with real-time kanban boards, role-based access, automated sprint reporting, and timeline analytics.",
        "technologies": ["React", "Next.js", "FastAPI", "PostgreSQL", "Docker"],
        "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
        "link": "#",
    },
    {
        "title": "FoodDelivery Full-Stack Ecosystem",
        "category": "Mobile Development",
        "description": "End-to-end multi-vendor restaurant ordering & courier dispatch app with live GPS tracking, push notifications, and payment gateway integration.",
        "technologies": ["React Native", "Node.js", "PostgreSQL", "Stripe"],
        "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
        "link": "#",
    },
]


async def seed():
    await init_db()
    async with async_session_maker() as session:
        # Check existing projects
        existing = (await session.exec(select(Project))).all()
        existing_titles = {p.title for p in existing}

        for data in REAL_PROJECTS:
            # Check if title or similar already exists
            found = False
            for p in existing:
                if (data["title"].split(":")[0].strip().lower() in p.title.lower() or 
                    p.title.split(":")[0].strip().lower() in data["title"].lower()):
                    # Update existing project with link, image, and details
                    p.title = data["title"]
                    p.category = data["category"]
                    p.description = data["description"]
                    p.technologies = data["technologies"]
                    p.image = data["image"]
                    p.link = data["link"]
                    session.add(p)
                    found = True
                    print(f"Updated project: {p.title}")
                    break

            if not found:
                new_p = Project(**data)
                session.add(new_p)
                print(f"Added project: {new_p.title}")

        await session.commit()
        print("Real projects successfully seeded into Supabase!")


if __name__ == "__main__":
    asyncio.run(seed())
