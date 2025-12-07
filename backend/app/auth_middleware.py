from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from app.utils import decode_token
from typing import Optional

class AuthMiddleware:
    """Middleware to verify JWT tokens on protected routes"""
    
    # Routes that don't require authentication
    PUBLIC_ROUTES = {
        "/api/login",
        "/api/register",
        "/api/microsoft/login",
        "/api/microsoft/callback",
        "/health",
        "/docs",
        "/openapi.json",
        "/redoc"
    }
    
    @staticmethod
    def is_public_route(path: str) -> bool:
        """Check if route is public"""
        return any(path.startswith(route) for route in AuthMiddleware.PUBLIC_ROUTES)
    
    @staticmethod
    def extract_token(request: Request) -> Optional[str]:
        """Extract JWT token from Authorization header"""
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None
        return auth_header.split(" ")[1]
    
    @staticmethod
    def verify_token(token: str) -> Optional[dict]:
        """Verify JWT token and return payload"""
        return decode_token(token)

async def verify_jwt_middleware(request: Request, call_next):
    """
    Middleware to verify JWT tokens for protected routes.
    Add this to main.py app.add_middleware()
    """
    
    # Skip auth for public routes
    if AuthMiddleware.is_public_route(request.url.path):
        return await call_next(request)
    
    # Extract token
    token = AuthMiddleware.extract_token(request)
    if not token:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Missing authentication token"}
        )
    
    # Verify token
    payload = AuthMiddleware.verify_token(token)
    if not payload:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Invalid or expired token"}
        )
    
    # Store user info in request state for use in route handlers
    request.state.user_id = payload.get("sub")
    request.state.user_email = payload.get("email")
    
    return await call_next(request)
