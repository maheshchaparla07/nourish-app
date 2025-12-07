from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from app.routers import auth, clients, carers
from app.database import engine, Base
from app.auth_middleware import verify_jwt_middleware

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Nourish Care API",
    description="Backend API for Nourish Care digital care records platform",
    version="1.0.0"
)

# Handle OPTIONS requests at the app level (before routers)
@app.middleware("http")
async def options_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        origin = request.headers.get("origin", "*")
        
        # If no origin header, allow all
        if not origin or origin == "null":
            origin = "*"
        
        headers = {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "86400",
        }
        
        # Only add credentials header if origin is not wildcard
        if origin != "*":
            headers["Access-Control-Allow-Credentials"] = "true"
        
        return Response(status_code=200, headers=headers)
    
    response = await call_next(request)
    return response

# CORS middleware - allow all origins (but can't use * with credentials)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r".*",  # Allow all origins using regex
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Add JWT verification middleware
app.add_middleware(verify_jwt_middleware)

# Include routers
app.include_router(auth.router, prefix="/api", tags=["authentication"])
app.include_router(clients.router, prefix="/api", tags=["clients"])
app.include_router(carers.router, prefix="/api", tags=["carers"])

@app.get("/")
async def root():
    return {"message": "Nourish Care API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
