from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import Response, RedirectResponse
from sqlalchemy.orm import Session
from app import schemas, models
from app.database import get_db
from app.utils import verify_password, get_password_hash, create_access_token
from app.microsoft_auth import (
    get_microsoft_authorization_url,
    exchange_code_for_token,
    get_user_info,
    validate_email_domain,
    generate_state,
    MicrosoftOAuthConfig
)
from datetime import timedelta
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Store states temporarily (in production, use Redis or database)
oauth_states = {}

@router.post("/login", response_model=schemas.LoginResponse)
async def login(
    credentials: schemas.LoginRequest,
    db: Session = Depends(get_db)
):
    """
    User login endpoint
    """
    # Find user by email
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token_expires = timedelta(hours=24)
    token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )
    
    user_response = schemas.UserResponse.from_orm(user)
    
    return {
        "token": token,
        "user": user_response,
        "profile_completed": user.profile_completed
    }

@router.post("/register", response_model=schemas.RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: schemas.RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    User registration endpoint
    """
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create new user
    new_user = models.User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password,
        auth_provider="local"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token_expires = timedelta(hours=24)
    token = create_access_token(
        data={"sub": str(new_user.id), "email": new_user.email},
        expires_delta=access_token_expires
    )
    
    user_response = schemas.UserResponse.from_orm(new_user)
    
    return {
        "token": token,
        "user": user_response
    }

@router.get("/microsoft/login", response_model=schemas.MicrosoftLoginResponse)
async def microsoft_login():
    """
    Initiate Microsoft OAuth login flow.
    Returns the authorization URL to redirect user to.
    """
    state = generate_state()
    auth_url = await get_microsoft_authorization_url(state)
    
    # Store state (in production, use session or Redis)
    oauth_states[state] = True
    
    return {"authorization_url": auth_url}

@router.post("/microsoft/callback")
async def microsoft_callback(
    auth_data: schemas.MicrosoftAuthCallback,
    db: Session = Depends(get_db)
):
    """
    Handle Microsoft OAuth callback.
    Validates the authorization code and creates/updates user.
    """
    # Validate state (in production, use session or Redis)
    if auth_data.state not in oauth_states:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid state parameter. Possible CSRF attack."
        )
    
    # Clean up state
    del oauth_states[auth_data.state]
    
    # Exchange code for token
    token_response = await exchange_code_for_token(auth_data.code)
    if not token_response:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to exchange authorization code for token"
        )
    
    access_token = token_response.get("access_token")
    
    # Get user info from Microsoft
    user_info = await get_user_info(access_token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to retrieve user information from Microsoft"
        )
    
    email = user_info.get("mail") or user_info.get("userPrincipalName")
    microsoft_id = user_info.get("id")
    
    if not email or not microsoft_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to retrieve email from Microsoft account"
        )
    
    # Validate email domain
    if not validate_email_domain(email):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Login restricted to {MicrosoftOAuthConfig.ALLOWED_DOMAIN} domain only"
        )
    
    # Check if user exists
    user = db.query(models.User).filter(models.User.email == email).first()
    
    if user:
        # Update existing user with Microsoft ID if not already set
        if not user.microsoft_id:
            user.microsoft_id = microsoft_id
            user.auth_provider = "microsoft"
            db.commit()
            db.refresh(user)
    else:
        # Create new user from Microsoft auth
        new_user = models.User(
            email=email,
            name=user_info.get("displayName", email.split("@")[0]),
            microsoft_id=microsoft_id,
            auth_provider="microsoft",
            profile_completed=False
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user = new_user
    
    # Create JWT token
    access_token_expires = timedelta(hours=24)
    token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )
    
    user_response = schemas.UserResponse.from_orm(user)
    
    return {
        "token": token,
        "user": user_response,
        "profile_completed": user.profile_completed
    }

@router.post("/profile", response_model=schemas.ProfileCompletionResponse)
async def complete_profile(
    profile_data: schemas.ProfileCompletionRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Complete user profile after first Microsoft login.
    Requires valid JWT token.
    """
    # Extract token from Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    
    # Verify token and get user
    from app.utils import decode_token
    token = auth_header.split(" ")[1]
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user_id = payload.get("sub")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update user profile
    user.full_name = profile_data.full_name
    user.role = profile_data.role
    user.department = profile_data.department
    user.profile_completed = True
    
    db.commit()
    db.refresh(user)
    
    # Create new token with updated profile
    access_token_expires = timedelta(hours=24)
    new_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )
    
    user_response = schemas.UserResponse.from_orm(user)
    
    return {
        "token": new_token,
        "user": user_response,
        "message": "Profile completed successfully"
    }

@router.get("/users", response_model=schemas.UsersListResponse)
async def get_all_users(
    db: Session = Depends(get_db)
):
    """
    Get all registered users
    """
    users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    
    return {
        "users": [schemas.UserResponse.from_orm(user) for user in users],
        "total": len(users)
    }
