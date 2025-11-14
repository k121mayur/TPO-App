from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.security import create_access_token, get_password_hash, verify_password
from ..database import get_session
from ..models import User, UserRoleEnum
from ..routers.deps import get_current_user
from ..schemas.auth import AuthResponse, LoginRequest, ProfilePayload, UserCreate, UserRead

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
    query = await session.execute(select(User).where(User.email == user_in.email))
    existing = query.scalars().first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    hashed = get_password_hash(user_in.password)
    user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed,
        role=user_in.role,
        company_id=user_in.company_id,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    token = create_access_token(subject=user.id)
    return AuthResponse(access_token=token, user=_build_user_payload(user))


@router.post("/login", response_model=AuthResponse)
async def login(credentials: LoginRequest, session: AsyncSession = Depends(get_session)):
    query = await session.execute(select(User).where(User.email == credentials.email))
    user = query.scalars().first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
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
