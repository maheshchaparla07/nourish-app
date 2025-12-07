from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime

# Request schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

# Response schemas
class UserResponse(BaseModel):
    id: UUID
    email: str
    name: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UsersListResponse(BaseModel):
    users: List[UserResponse]
    total: int

class LoginResponse(BaseModel):
    token: str
    user: UserResponse

class RegisterResponse(BaseModel):
    token: str
    user: UserResponse

class ErrorResponse(BaseModel):
    message: str

