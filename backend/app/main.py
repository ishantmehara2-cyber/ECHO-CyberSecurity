from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.investigation import router as api_investigation_router

app = FastAPI(
    title="ECHO Backend API",
    description="Backend for the ECHO CyberSecurity Investigation Platform & Vulnerable Lab Analysis Engine",
    version="0.2.0",
)

# Robust CORS configuration for local Vite development servers across all ports
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):.*",
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_investigation_router)

# Direct legacy alias routes
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "echo-backend",
        "message": "ECHO backend operational & lab ready"
    }

@app.post("/investigation/demo")
def legacy_demo():
    from app.services.pipeline import run_investigation_pipeline
    return run_investigation_pipeline()

@app.post("/investigation/analyze")
def legacy_analyze():
    from app.services.pipeline import run_investigation_pipeline
    return run_investigation_pipeline()

@app.get("/")
def read_root():
    return {"message": "ECHO API is running. Access /docs for API documentation."}
