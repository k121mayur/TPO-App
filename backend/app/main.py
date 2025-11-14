from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .routers import admin, auth, jobs
from .services.seed_data import init_db, seed_default_data

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"{settings.API_PREFIX}/auth", tags=["auth"])
app.include_router(jobs.router, prefix=settings.API_PREFIX, tags=["jobs"])
app.include_router(admin.router, prefix=settings.API_PREFIX, tags=["admin"])


@app.on_event("startup")
async def on_startup():
    await init_db()
    await seed_default_data()


@app.get("/health")
async def health_check():
    return {"status": "ok"}
