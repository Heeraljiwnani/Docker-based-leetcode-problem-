from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.execution import router as execution_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Docker-based Code Execution Engine for CodeArena platform"
)

# CORS configuration to allow local frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register execution router
app.include_router(execution_router)

@app.get("/")
def root_status():
    return {
        "service": "CodeArena Execution Engine",
        "version": "1.0.0",
        "docs_url": "/docs"
    }
