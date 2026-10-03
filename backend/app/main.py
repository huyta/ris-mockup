from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.core.logging import StructuredLoggingMiddleware
from app.core.exceptions import (
    AppException,
    app_exception_handler,
    validation_exception_handler,
    sqlalchemy_exception_handler,
    generic_exception_handler
)
from app.api.v1.auth import router as auth_router
from app.api.v1.patient import router as patient_router
from app.api.v1.doctor import router as doctor_router
from app.db.database import SessionLocal
from app.db.seed import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-seed initial demo dataset if database is empty
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="FastAPI REST Backend for SMG Radiology Portal (React Mockup Integration)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    openapi_tags=[
        {
            "name": "Health",
            "description": "System health and readiness checks"
        },
        {
            "name": "Authentication",
            "description": "JWT Login, token issuance, and current session resolution"
        },
        {
            "name": "Patient Portal",
            "description": "Patient self-service dashboard, studies, viewer metadata, and reports"
        },
        {
            "name": "Doctor Portal",
            "description": "Referring physician portal, assigned patients, studies, viewer, and reports"
        }
    ],
    lifespan=lifespan
)

# Exception handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Structured Logging Middleware
app.add_middleware(StructuredLoggingMiddleware)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(patient_router, prefix="/api/v1")
app.include_router(doctor_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
def health_check():
    """
    Standard health check endpoint. Returns healthy status.
    """
    return {"status": "healthy"}
