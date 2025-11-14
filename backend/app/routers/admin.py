from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_session
from ..models import Company, Job, RedirectStat, User
from ..routers.deps import get_admin_user
from ..schemas.stats import AdminStats, RedirectStat as RedirectStatSchema

router = APIRouter()


@router.get("/admin/stats", response_model=AdminStats)
async def read_admin_stats(
    _: None = Depends(get_admin_user),
    session: AsyncSession = Depends(get_session),
):
    total_jobs = await session.scalar(select(func.count()).select_from(Job))
    total_companies = await session.scalar(select(func.count()).select_from(Company))
    total_users = await session.scalar(select(func.count()).select_from(User))
    stats_result = await session.execute(select(RedirectStat))
    redirects = stats_result.scalars().all()
    redirect_payloads: List[RedirectStatSchema] = [
        RedirectStatSchema(jobId=stat.job_id, jobTitle=stat.job_title, clicks=stat.clicks)
        for stat in redirects
    ]
    return AdminStats(
        totalJobs=total_jobs or 0,
        totalCompanies=total_companies or 0,
        totalUsers=total_users or 0,
        redirects=redirect_payloads,
    )
