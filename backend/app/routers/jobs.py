from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..database import get_session
from ..models import Company, Job, JobSectorEnum, RedirectStat, WorkTypeEnum
from ..routers.deps import get_employer_user, get_current_user
from ..schemas.company import CompanyRead
from ..schemas.job import JobRead

router = APIRouter()


def _build_company(job: Job) -> CompanyRead:
    company = job.company
    return CompanyRead(
        id=company.id,
        name=company.name,
        logo=company.logo,
        description=company.description,
        website=company.website,
        isVerified=company.is_verified,
    )


def _build_job_payload(job: Job) -> JobRead:
    return JobRead(
        id=job.id,
        title=job.title,
        location=job.location,
        sector=job.sector,
        workType=job.work_type,
        salaryRange=[job.salary_min, job.salary_max],
        postedDate=job.posted_date,
        description=job.description,
        responsibilities=job.responsibilities or [],
        qualifications=job.qualifications or [],
        isThirdParty=job.is_third_party,
        redirectUrl=job.redirect_url,
        company=_build_company(job),
    )


@router.get("/jobs", response_model=List[JobRead])
async def list_jobs(
    title: str | None = Query(None),
    location: str | None = Query(None),
    sector: JobSectorEnum | None = Query(None),
    work_type: WorkTypeEnum | None = Query(None, alias="workType"),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Job).options(selectinload(Job.company)).order_by(Job.posted_date.desc())
    if title:
        stmt = stmt.filter(Job.title.ilike(f"%{title}%"))
    if location:
        stmt = stmt.filter(Job.location.ilike(f"%{location}%"))
    if sector:
        stmt = stmt.filter(Job.sector == sector)
    if work_type:
        stmt = stmt.filter(Job.work_type == work_type)
    result = await session.execute(stmt)
    jobs = result.scalars().all()
    return [_build_job_payload(job) for job in jobs]


@router.get("/jobs/featured", response_model=List[JobRead])
async def featured_jobs(session: AsyncSession = Depends(get_session)):
    stmt = (
        select(Job)
        .options(selectinload(Job.company))
        .order_by(Job.posted_date.desc())
        .limit(4)
    )
    result = await session.execute(stmt)
    jobs = result.scalars().all()
    return [_build_job_payload(job) for job in jobs]


@router.get("/jobs/{job_id}", response_model=JobRead)
async def get_job(job_id: str, session: AsyncSession = Depends(get_session)):
    stmt = select(Job).options(selectinload(Job.company)).where(Job.id == job_id)
    result = await session.execute(stmt)
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return _build_job_payload(job)


@router.get("/companies/{company_id}", response_model=CompanyRead)
async def get_company(company_id: str, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Company).where(Company.id == company_id))
    company = result.scalars().first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return CompanyRead(
        id=company.id,
        name=company.name,
        logo=company.logo,
        description=company.description,
        website=company.website,
        isVerified=company.is_verified,
    )


@router.post("/jobs/{job_id}/track-redirect", status_code=204)
async def track_redirect(job_id: str, session: AsyncSession = Depends(get_session)):
    stmt = select(Job).where(Job.id == job_id)
    result = await session.execute(stmt)
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    redirect_stmt = select(RedirectStat).where(RedirectStat.job_id == job_id)
    redirect_result = await session.execute(redirect_stmt)
    redirect = redirect_result.scalars().first()
    if not redirect:
        redirect = RedirectStat(job_id=job.id, job_title=job.title, clicks=1)
        session.add(redirect)
    else:
        redirect.clicks += 1
        session.add(redirect)
    await session.commit()


@router.get("/employer/jobs", response_model=List[JobRead])
async def employer_jobs(
    employer=Depends(get_employer_user),
    session: AsyncSession = Depends(get_session),
):
    if not employer.company_id:
        return []
    stmt = (
        select(Job)
        .options(selectinload(Job.company))
        .where(Job.company_id == employer.company_id)
        .order_by(Job.posted_date.desc())
    )
    result = await session.execute(stmt)
    jobs = result.scalars().all()
    return [_build_job_payload(job) for job in jobs]
