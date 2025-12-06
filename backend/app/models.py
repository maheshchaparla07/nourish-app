from sqlalchemy import Column, String, DateTime, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Client(Base):
    __tablename__ = "clients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    status = Column(String, nullable=False, default="Client")
    client_type = Column(String, nullable=False, default="Person")  # Person or Organisation
    title = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    forename = Column(String, nullable=False)
    middle_name = Column(String, nullable=True)
    surname = Column(String, nullable=False)
    date_of_birth = Column(DateTime, nullable=True)
    email = Column(String, nullable=True)
    secondary_email = Column(String, nullable=True)
    landline = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Carer(Base):
    __tablename__ = "carers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    status = Column(String, nullable=False, default="Active")  # Active, Inactive, On Leave
    title = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    forename = Column(String, nullable=False)
    middle_name = Column(String, nullable=True)
    surname = Column(String, nullable=False)
    date_of_birth = Column(DateTime, nullable=True)
    email = Column(String, nullable=True)
    secondary_email = Column(String, nullable=True)
    landline = Column(String, nullable=True)
    mobile = Column(String, nullable=True)
    has_mobile_access = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


