from typing import List

from pydantic import BaseModel, Field

from .company import CompanyRead


class RedirectStat(BaseModel):
    job_id: str = Field(alias="jobId")
    job_title: str = Field(alias="jobTitle")
    clicks: int

    class Config:
        allow_population_by_field_name = True


class AdminStats(BaseModel):
    total_jobs: int = Field(alias="totalJobs")
    total_companies: int = Field(alias="totalCompanies")
    total_users: int = Field(alias="totalUsers")
    redirects: List[RedirectStat]
    pending_companies: List[CompanyRead] = Field(alias="pendingCompanies")

    class Config:
        allow_population_by_field_name = True
