from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.config import settings
from ..core.security import get_password_hash
from ..database import AsyncSessionLocal, Base, engine
from ..models import (
    Company,
    Job,
    RedirectStat,
    User,
    JobSectorEnum,
    WorkTypeEnum,
    UserRoleEnum,
)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def seed_default_data():
    async with AsyncSessionLocal() as session:  # type: AsyncSession
        existing_jobs = await session.execute(select(Job).limit(1))
        if existing_jobs.scalars().first():
            return

        companies = [
            Company(
                name='EcoSolutions Inc.',
                logo='https://picsum.photos/seed/comp1/100',
                description='Pioneering sustainable solutions for a greener planet. We focus on renewable energy and waste reduction technologies.',
                website='https://ecosolutions.example.com',
                is_verified=True,
            ),
            Company(
                name='GreenScape Foundation',
                logo='https://picsum.photos/seed/comp2/100',
                description='A non-profit dedicated to reforestation and biodiversity conservation projects worldwide.',
                website='https://greenscape.example.org',
                is_verified=True,
            ),
            Company(
                name='SustainaConsult',
                logo='https://picsum.photos/seed/comp3/100',
                description='Expert ESG and sustainability consulting for forward-thinking corporations.',
                website='https://sustainaconsult.example.com',
                is_verified=False,
            ),
            Company(
                name='Global Energy Watch',
                logo='https://picsum.photos/seed/comp4/100',
                description='Global renewable energy data analysis and insights.',
                website='https://globalenergywatch.example.com',
                is_verified=True,
            ),
        ]
        session.add_all(companies)
        await session.flush()

        jobs = [
            Job(
                title='Solar Panel Technician',
                location='Austin, TX',
                sector=JobSectorEnum.RENEWABLE_ENERGY,
                work_type=WorkTypeEnum.ON_SITE,
                salary_min=60000,
                salary_max=80000,
                description='Install and maintain solar panels for residential and commercial clients. Join a team dedicated to expanding clean energy access.',
                responsibilities=[
                    'Assemble and install solar modules on rooftops and other structures.',
                    'Perform maintenance and troubleshooting of solar energy systems.',
                    'Ensure compliance with safety standards and building codes.',
                ],
                qualifications=[
                    'Previous experience in solar installation or a related trade.',
                    'NABCEP certification is a plus.',
                    'Comfortable working at heights.',
                ],
                company_id=companies[0].id,
            ),
            Job(
                title='Conservation Project Manager',
                location='Portland, OR',
                sector=JobSectorEnum.CONSERVATION,
                work_type=WorkTypeEnum.HYBRID,
                salary_min=75000,
                salary_max=95000,
                description='Lead and manage large-scale conservation projects, coordinating with local communities and stakeholders to protect vital ecosystems.',
                responsibilities=[
                    'Develop project plans and budgets.',
                    'Manage a team of field researchers and volunteers.',
                    'Write grant proposals and report to funders.',
                ],
                qualifications=[
                    'Master\'s degree in Environmental Science or related field.',
                    '5+ years of project management experience.',
                    'Strong communication and leadership skills.',
                ],
                company_id=companies[1].id,
            ),
            Job(
                title='ESG Analyst',
                location='New York, NY',
                sector=JobSectorEnum.ESG,
                work_type=WorkTypeEnum.REMOTE,
                salary_min=80000,
                salary_max=110000,
                description='Analyze company data to assess their environmental, social, and governance (ESG) performance.',
                responsibilities=[
                    'Conduct research on corporate ESG practices.',
                    'Develop and maintain ESG rating models.',
                    'Prepare detailed reports and presentations.',
                ],
                qualifications=[
                    'Bachelor\'s degree in Finance, Economics, or Sustainability.',
                    'Strong analytical and quantitative skills.',
                    'Familiarity with ESG frameworks (GRI, SASB).',
                ],
                company_id=companies[2].id,
            ),
            Job(
                title='Lead Frontend Engineer (Green Tech)',
                location='Remote',
                sector=JobSectorEnum.GREEN_TECH,
                work_type=WorkTypeEnum.REMOTE,
                salary_min=120000,
                salary_max=150000,
                description='Build beautiful and impactful user interfaces for our clean energy monitoring platform.',
                responsibilities=[
                    'Architect and develop scalable frontend systems using modern web technologies.',
                    'Mentor junior engineers and lead code reviews.',
                    'Collaborate with product and design teams.',
                ],
                qualifications=[
                    '7+ years of frontend development experience.',
                    'Expertise in React, TypeScript, and modern web technologies.',
                    'Passion for sustainability and clean technology.',
                ],
                company_id=companies[0].id,
            ),
            Job(
                title='Third-Party Renewable Energy Analyst',
                location='Global',
                sector=JobSectorEnum.RENEWABLE_ENERGY,
                work_type=WorkTypeEnum.REMOTE,
                salary_min=90000,
                salary_max=120000,
                description='This is an external job posting. You will be redirected to apply on the company\'s website.',
                responsibilities=[],
                qualifications=[],
                is_third_party=True,
                redirect_url='https://google.com/search?q=jobs',
                company_id=companies[3].id,
            ),
        ]
        session.add_all(jobs)
        await session.flush()

        users = [
            User(
                name='Alex Doe',
                email='alex.doe@example.com',
                hashed_password=get_password_hash('password123'),
                role=UserRoleEnum.EMPLOYEE,
                profile={
                    'summary': 'Passionate environmental scientist with 5 years of experience in conservation research and project management.',
                    'skills': ['Data Analysis', 'Project Management', 'GIS', 'Grant Writing', 'Public Speaking'],
                    'experience': [
                        {
                            'id': 'exp1',
                            'title': 'Research Scientist',
                            'company': 'Nature Conservancy',
                            'startDate': '2019',
                            'endDate': 'Present',
                            'description': 'Led research on biodiversity impacts.',
                        },
                        {
                            'id': 'exp2',
                            'title': 'Field Technician',
                            'company': 'National Park Service',
                            'startDate': '2017',
                            'endDate': '2019',
                            'description': 'Conducted ecological surveys.',
                        },
                    ],
                    'education': [
                        {
                            'id': 'edu1',
                            'institution': 'University of Colorado Boulder',
                            'degree': 'M.S. in Environmental Science',
                            'fieldOfStudy': 'Ecology',
                            'gradYear': '2017',
                        }
                    ],
                    'resumeUrl': 'https://example.com/resume.pdf',
                },
            ),
            User(
                name='Jane Smith',
                email='jane.smith@ecosolutions.example.com',
                hashed_password=get_password_hash('password123'),
                role=UserRoleEnum.EMPLOYER,
                company_id=companies[0].id,
            ),
            User(
                name='Admin User',
                email='admin@greenjobs.example.com',
                hashed_password=get_password_hash('password123'),
                role=UserRoleEnum.ADMIN,
            ),
        ]
        session.add_all(users)

        redirect_stat = RedirectStat(
            job_id=jobs[-1].id,
            job_title=jobs[-1].title,
            clicks=42,
        )
        session.add(redirect_stat)

        # Ensure admin user from environment variables
        admin_user_query = await session.execute(select(User).where(User.email == settings.ADMIN_EMAIL))
        if not admin_user_query.scalars().first():
            admin = User(
                name=settings.ADMIN_NAME,
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                role=UserRoleEnum.ADMIN,
            )
            session.add(admin)

        await session.commit()
