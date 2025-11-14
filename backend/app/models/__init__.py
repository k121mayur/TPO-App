import uuid
from datetime import datetime
from enum import Enum

from sqlalchemy import (
    Column,
    String,
    Enum as SQLEnum,
    DateTime,
    ForeignKey,
    Boolean,
    Float,
    Text,
    Integer,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from ..database import Base


class UserRoleEnum(str, Enum):
    EMPLOYEE = 'employee'
    EMPLOYER = 'employer'
    ADMIN = 'admin'


class JobSectorEnum(str, Enum):
    RENEWABLE_ENERGY = 'Renewable Energy'
    SUSTAINABILITY_CONSULTING = 'Sustainability Consulting'
    CONSERVATION = 'Conservation'
    ESG = 'ESG'
    NON_PROFIT = 'Non-Profit'
    GREEN_TECH = 'Green Tech'


class WorkTypeEnum(str, Enum):
    REMOTE = 'Remote'
    HYBRID = 'Hybrid'
    ON_SITE = 'On-site'


class Company(Base):
    __tablename__ = 'companies'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    logo = Column(String, nullable=False, default='')
    description = Column(Text, default='')
    website = Column(String, default='')
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    jobs = relationship('Job', back_populates='company', cascade='all, delete-orphan')


class Job(Base):
    __tablename__ = 'jobs'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    sector = Column(SQLEnum(JobSectorEnum), nullable=False)
    work_type = Column(SQLEnum(WorkTypeEnum), nullable=False)
    salary_min = Column(Float, nullable=False)
    salary_max = Column(Float, nullable=False)
    posted_date = Column(DateTime, default=datetime.utcnow)
    description = Column(Text, default='')
    responsibilities = Column(JSONB, default=list)
    qualifications = Column(JSONB, default=list)
    is_third_party = Column(Boolean, default=False)
    redirect_url = Column(String, nullable=True)
    company_id = Column(String, ForeignKey('companies.id'), nullable=False)
    company = relationship('Company', back_populates='jobs')


class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRoleEnum), nullable=False)
    profile = Column(JSONB, default=dict)
    company_id = Column(String, ForeignKey('companies.id'), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class RedirectStat(Base):
    __tablename__ = 'redirect_stats'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, ForeignKey('jobs.id'), nullable=False)
    job_title = Column(String, nullable=False)
    clicks = Column(Integer, default=0)
