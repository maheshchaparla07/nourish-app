# Database Setup Guide

## Where Tables Are Created

### 1. Automatic Creation (Current Setup)
**Location:** `backend/main.py` (Line 7)

```python
# Create database tables
Base.metadata.create_all(bind=engine)
```

Tables are automatically created when the FastAPI app starts. This happens every time you run:
- `docker-compose up`
- `uvicorn main:app --reload`

### 2. Manual Script Creation
**Location:** `backend/init_db.py`

A separate script for manual table creation.

## How to Create Tables

### Method 1: Automatic (Current - Recommended)
Tables are created automatically when you start the backend:

```bash
# Using Docker
cd backend
docker-compose up --build

# Or manually
uvicorn main:app --reload
```

### Method 2: Using the Script
Run the initialization script manually:

```bash
cd backend

# Create tables
python init_db.py

# Drop all tables (use with caution!)
python init_db.py drop
```

### Method 3: Using Python Interpreter
```bash
cd backend
python
```

```python
from app.database import engine, Base
from app.models import User  # Import all your models

# Create all tables
Base.metadata.create_all(bind=engine)
print("Tables created!")
```

## Viewing Tables

### Option 1: Using psql (PostgreSQL CLI)
```bash
# Connect to database
docker exec -it nourish_postgres psql -U nourish_user -d nourish_db

# List all tables
\dt

# View users table structure
\d users

# View all data in users table
SELECT * FROM users;

# Exit
\q
```

### Option 2: Using Docker Exec
```bash
# Connect to PostgreSQL container
docker exec -it nourish_postgres psql -U nourish_user -d nourish_db

# Then run SQL commands
\dt  # List tables
\d users  # Describe users table
```

### Option 3: Using pgAdmin or DBeaver
Connect to:
- **Host:** localhost
- **Port:** 5432
- **Database:** nourish_db
- **Username:** nourish_user
- **Password:** nourish_password

## Current Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    hashed_password VARCHAR NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Troubleshooting

### Tables Not Created?
1. Check database connection in `app/database.py`
2. Ensure PostgreSQL is running: `docker ps`
3. Check logs: `docker-compose logs backend`

### Reset Database
```bash
# Stop containers
docker-compose down

# Remove volumes (deletes all data)
docker-compose down -v

# Start fresh
docker-compose up --build
```

### Check if Tables Exist
```bash
docker exec -it nourish_postgres psql -U nourish_user -d nourish_db -c "\dt"
```

