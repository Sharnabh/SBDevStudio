import asyncio
import os
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from database import async_session_maker, init_db
from models import Project, Testimonial
from sqlmodel import select

SAMPLE_PROJECTS = [
    {
        "title": "E-Commerce Revolution",
        "description": "Full-stack e-commerce platform with real-time inventory, payment integration, and AI-powered recommendations.",
        "category": "Web Development",
        "technologies": ["React", "Node.js", "MongoDB", "Stripe"],
        "image": "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&q=80",
        "link": "#",
    },
    {
        "title": "HealthTrack Mobile App",
        "description": "iOS and Android fitness tracking app with social features, workout plans, and nutrition tracking.",
        "category": "Mobile Development",
        "technologies": ["React Native", "Firebase", "Redux"],
        "image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
        "link": "#",
    },
    {
        "title": "CryptoWallet Dashboard",
        "description": "Secure cryptocurrency portfolio management dashboard with real-time market data and trading features.",
        "category": "Web Development",
        "technologies": ["Vue.js", "Web3.js", "Chart.js"],
        "image": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
        "link": "#",
    },
    {
        "title": "TaskFlow Pro",
        "description": "Enterprise project management tool with team collaboration, time tracking, and advanced analytics.",
        "category": "Web Development",
        "technologies": ["React", "FastAPI", "PostgreSQL"],
        "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
        "link": "#",
    },
    {
        "title": "FoodDelivery iOS App",
        "description": "On-demand food delivery application with real-time tracking, payment gateway, and restaurant management.",
        "category": "Mobile Development",
        "technologies": ["Swift", "SwiftUI", "Firebase"],
        "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
        "link": "#",
    },
    {
        "title": "AI Content Generator",
        "description": "SaaS platform leveraging AI for automated content creation, editing, and optimization.",
        "category": "Web Development",
        "technologies": ["Next.js", "OpenAI API", "Tailwind"],
        "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
        "link": "#",
    },
]

SAMPLE_TESTIMONIALS = [
    {
        "name": "Sarah Johnson",
        "role": "CEO, TechStart Inc.",
        "content": "SB Dev Studio transformed our vision into reality. Their expertise in both web and mobile development is unmatched. The final product exceeded all our expectations!",
        "rating": 5,
        "avatar": "https://i.pravatar.cc/150?img=1",
    },
    {
        "name": "Michael Chen",
        "role": "Founder, CryptoVentures",
        "content": "Working with SB Dev Studio was a game-changer for our startup. They delivered a secure, scalable platform ahead of schedule. Highly recommended!",
        "rating": 5,
        "avatar": "https://i.pravatar.cc/150?img=13",
    },
    {
        "name": "Emily Rodriguez",
        "role": "Product Manager, FitLife",
        "content": "The team's attention to detail and commitment to quality is outstanding. Our mobile app has received incredible user feedback thanks to their work.",
        "rating": 5,
        "avatar": "https://i.pravatar.cc/150?img=5",
    },
    {
        "name": "David Thompson",
        "role": "CTO, Enterprise Solutions",
        "content": "Professional, innovative, and reliable. SB Dev Studio brought cutting-edge technology to our enterprise platform. A true partner in digital transformation.",
        "rating": 5,
        "avatar": "https://i.pravatar.cc/150?img=12",
    },
]


async def seed():
    await init_db()
    async with async_session_maker() as session:
        # Check projects
        existing_projects = (await session.exec(select(Project))).all()
        if not existing_projects:
            print("Seeding sample projects into Supabase...")
            for p in SAMPLE_PROJECTS:
                proj = Project(**p)
                session.add(proj)
            await session.commit()
            print(f"Added {len(SAMPLE_PROJECTS)} projects.")
        else:
            print(f"Projects already exist in database ({len(existing_projects)} found).")

        # Check testimonials
        existing_testimonials = (await session.exec(select(Testimonial))).all()
        if not existing_testimonials:
            print("Seeding sample testimonials into Supabase...")
            for t in SAMPLE_TESTIMONIALS:
                test = Testimonial(**t)
                session.add(test)
            await session.commit()
            print(f"Added {len(SAMPLE_TESTIMONIALS)} testimonials.")
        else:
            print(f"Testimonials already exist in database ({len(existing_testimonials)} found).")

    print("\nDatabase seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
