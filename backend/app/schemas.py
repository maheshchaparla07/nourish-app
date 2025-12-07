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

# Microsoft OAuth schemas
class MicrosoftAuthCallback(BaseModel):
    code: str
    state: str

class ProfileCompletionRequest(BaseModel):
    full_name: str
    role: str
    department: str

# Response schemas
class UserResponse(BaseModel):
    id: UUID
    email: str
    name: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    auth_provider: Optional[str] = None
    profile_completed: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UsersListResponse(BaseModel):
    users: List[UserResponse]
    total: int

class LoginResponse(BaseModel):
    token: str
    user: UserResponse
    profile_completed: bool = True

class RegisterResponse(BaseModel):
    token: str
    user: UserResponse

class MicrosoftLoginResponse(BaseModel):
    authorization_url: str

class ProfileCompletionResponse(BaseModel):
    token: str
    user: UserResponse
    message: str

class ErrorResponse(BaseModel):
    message: str

# Client Schemas
class ClientCreate(BaseModel):
    status: str = "Client"
    client_type: str = "Person"
    title: Optional[str] = None
    gender: Optional[str] = None
    forename: str
    middle_name: Optional[str] = None
    surname: str
    date_of_birth: Optional[datetime] = None
    email: Optional[str] = None
    secondary_email: Optional[str] = None
    landline: Optional[str] = None

class ClientUpdate(BaseModel):
    status: Optional[str] = None
    client_type: Optional[str] = None
    title: Optional[str] = None
    gender: Optional[str] = None
    forename: Optional[str] = None
    middle_name: Optional[str] = None
    surname: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    email: Optional[str] = None
    secondary_email: Optional[str] = None
    landline: Optional[str] = None

class ClientResponse(BaseModel):
    id: UUID
    status: str
    client_type: str
    title: Optional[str] = None
    gender: Optional[str] = None
    forename: str
    middle_name: Optional[str] = None
    surname: str
    date_of_birth: Optional[datetime] = None
    email: Optional[str] = None
    secondary_email: Optional[str] = None
    landline: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ClientsListResponse(BaseModel):
    clients: List[ClientResponse]
    total: int

# Carer Schemas
class CarerCreate(BaseModel):
    status: str = "Active"
    title: Optional[str] = None
    gender: Optional[str] = None
    forename: str
    middle_name: Optional[str] = None
    surname: str
    date_of_birth: Optional[datetime] = None
    email: Optional[str] = None
    secondary_email: Optional[str] = None
    landline: Optional[str] = None
    mobile: Optional[str] = None
    has_mobile_access: bool = False

class CarerUpdate(BaseModel):
    status: Optional[str] = None
    title: Optional[str] = None
    gender: Optional[str] = None
    forename: Optional[str] = None
    middle_name: Optional[str] = None
    surname: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    email: Optional[str] = None
    secondary_email: Optional[str] = None
    landline: Optional[str] = None
    mobile: Optional[str] = None
    has_mobile_access: Optional[bool] = None

class CarerResponse(BaseModel):
    id: UUID
    status: str
    title: Optional[str] = None
    gender: Optional[str] = None
    forename: str
    middle_name: Optional[str] = None
    surname: str
    date_of_birth: Optional[datetime] = None
    email: Optional[str] = None
    secondary_email: Optional[str] = None
    landline: Optional[str] = None
    mobile: Optional[str] = None
    has_mobile_access: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CarersListResponse(BaseModel):
    carers: List[CarerResponse]
    total: int

