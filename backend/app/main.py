import os
import mimetypes
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.db import engine, Base
from app.routes import auth, categories, products, services, exchanges, settings as settings_route

# Ensure modern web image formats are recognized on all operating systems
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("image/avif", ".avif")

# Create static directories if they don't exist
os.makedirs(settings.IMAGES_DIR, exist_ok=True)

# Ensure database tables are created on initialization
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database tables are created
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files
app.mount("/static", StaticFiles(directory=settings.STATIC_DIR), name="static")

# Include Routers under API v1
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(categories.router, prefix=settings.API_V1_STR)
app.include_router(products.router, prefix=settings.API_V1_STR)
app.include_router(services.router, prefix=settings.API_V1_STR)
app.include_router(exchanges.router, prefix=settings.API_V1_STR)
app.include_router(settings_route.router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "online", "project": settings.PROJECT_NAME, "version": settings.VERSION}
