from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ECHO Backend",
    description="Backend for the ECHO CyberSecurity Investigation Platform",
    version="0.1.0",
)

# Configure CORS for frontend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
