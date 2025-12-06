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

