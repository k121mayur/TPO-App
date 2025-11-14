from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field

from ..models import UserRoleEnum
from .company import CompanyCreate


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRoleEnum
    company_id: Optional[str] = Field(default=None, alias="company_id")
    company: Optional[CompanyCreate] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ProfilePayload(BaseModel):
    summary: Optional[str]
    skills: Optional[list[str]]
    experience: Optional[list[dict[str, Any]]]
    education: Optional[list[dict[str, Any]]]
    resumeUrl: Optional[str]


class UserRead(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: UserRoleEnum
    profile: Optional[dict[str, Any]] = None
    company_id: Optional[str] = Field(default=None, alias='companyId')

    class Config:
        orm_mode = True
        allow_population_by_field_name = True


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


class SocialLoginRequest(BaseModel):
    role: UserRoleEnum = Field(default=UserRoleEnum.EMPLOYEE)
