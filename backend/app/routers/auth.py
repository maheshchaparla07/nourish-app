from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app import schemas, models
from app.database import get_db
from app.utils import verify_password, get_password_hash, create_access_token
from datetime import timedelta
from typing import List

router = APIRouter()

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
    
    return {
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
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
        hashed_password=hashed_password
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
    
    return {
        "token": token,
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name
        }
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
        "users": [
            {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "created_at": user.created_at
            }
            for user in users
        ],
        "total": len(users)
    }

