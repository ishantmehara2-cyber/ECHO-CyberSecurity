from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.investigation import router as investigation_router

app = FastAPI(
    title="ECHO Backend",
    description="Backend for the ECHO CyberSecurity Investigation Platform",
    version="0.1.0",
)

# Robust CORS configuration for local development servers across all ports
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):.*",
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(investigation_router)

@app.get("/")
def read_root():
    return {"message": "ECHO API is running. Access /docs for documentation."}

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "echo-backend",
        "message": "ECHO backend operational"
    }
