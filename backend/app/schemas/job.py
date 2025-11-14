from datetime import datetime

from pydantic import BaseModel, Field

from ..models import JobSectorEnum, WorkTypeEnum
from .company import CompanyRead


class JobRead(BaseModel):
    id: str
    title: str
    location: str
    sector: JobSectorEnum
    work_type: WorkTypeEnum = Field(alias="workType")
    salary_range: list[float] = Field(alias="salaryRange")
    posted_date: datetime = Field(alias="postedDate")
    description: str
    responsibilities: list[str]
    qualifications: list[str]
    is_third_party: bool = Field(alias="isThirdParty")
    redirect_url: str | None = Field(alias="redirectUrl")
    company: "CompanyRead"

    class Config:
        allow_population_by_field_name = True
