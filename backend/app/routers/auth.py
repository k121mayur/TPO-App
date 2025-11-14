from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.config import settings
from ..core.security import create_access_token, get_password_hash, verify_password
from ..database import get_session
from ..models import Company, User, UserRoleEnum
from ..routers.deps import get_current_user
from ..schemas.auth import (
    AuthResponse,
    LoginRequest,
    ProfilePayload,
    SocialLoginRequest,
    UserCreate,
    UserRead,
)

router = APIRouter()


def _build_user_payload(user: User) -> UserRead:
    return UserRead(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        profile=user.profile or {},
        company_id=user.company_id,
    )


@router.post("/register", response_model=AuthResponse)
async def register(user_in: UserCreate, session: AsyncSession = Depends(get_session)):
    if user_in.role == UserRoleEnum.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin accounts must be provisioned via environment variables",
        )

    existing_stmt = await session.execute(select(User).where(User.email == user_in.email))
    if existing_stmt.scalars().first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    company_id = user_in.company_id
    if user_in.role == UserRoleEnum.EMPLOYER:
        if user_in.company:
            company_payload = user_in.company
            company = Company(
                name=company_payload.name,
                description=company_payload.description,
                website=company_payload.website or "",
                logo="https://picsum.photos/seed/company/100",
                is_verified=False,
            )
            session.add(company)
            await session.flush()
            company_id = company.id
        if not company_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employer accounts must include a company profile or a company identifier",
            )

    hashed = get_password_hash(user_in.password)
    user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed,
        role=user_in.role,
        company_id=company_id,
        profile={},
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    token = create_access_token(subject=user.id)
    return AuthResponse(access_token=token, user=_build_user_payload(user))


@router.post("/login", response_model=AuthResponse)
async def login(credentials: LoginRequest, session: AsyncSession = Depends(get_session)):
    if credentials.email == settings.ADMIN_EMAIL and credentials.password == settings.ADMIN_PASSWORD:
        admin_stmt = await session.execute(select(User).where(User.email == settings.ADMIN_EMAIL))
        admin_user = admin_stmt.scalars().first()
        if admin_user:
            token = create_access_token(subject=admin_user.id)
            return AuthResponse(access_token=token, user=_build_user_payload(admin_user))

    query = await session.execute(select(User).where(User.email == credentials.email))
    user = query.scalars().first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(subject=user.id)
    return AuthResponse(access_token=token, user=_build_user_payload(user))


@router.post("/google", response_model=AuthResponse)
async def login_with_google(payload: SocialLoginRequest, session: AsyncSession = Depends(get_session)):
    if payload.role == UserRoleEnum.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin login must happen via configured credentials",
        )
    stmt = await session.execute(select(User).where(User.role == payload.role))
    user = stmt.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No user found for the requested role"
        )
    token = create_access_token(subject=user.id)
    return AuthResponse(access_token=token, user=_build_user_payload(user))


@router.get("/me", response_model=UserRead)
async def read_profile(current_user: User = Depends(get_current_user)):
    return _build_user_payload(current_user)


@router.put("/profile", response_model=UserRead)
async def update_profile(
    payload: ProfilePayload,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if current_user.role != UserRoleEnum.EMPLOYEE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employees can update profiles")
    update_data = payload.dict(exclude_unset=True, by_alias=True)
    current_profile = current_user.profile or {}
    current_profile.update(update_data)
    current_user.profile = current_profile
    session.add(current_user)
    await session.commit()
    await session.refresh(current_user)
    return _build_user_payload(current_user)
