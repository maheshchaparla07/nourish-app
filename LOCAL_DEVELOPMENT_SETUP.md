# Local Development Setup Guide

## Current Status

You have successfully:
✅ Frontend: npm dependencies installed & dev server running on http://localhost:5174/  
✅ Backend: Core FastAPI & authentication packages installed  
✅ Git: All code committed to GitHub (Branch1)  

## Challenge: Backend Database Setup

The backend requires PostgreSQL connection. You have three options:

---

## Option 1: Docker Desktop (Recommended)

**Prerequisites**: Docker Desktop installed and running

**Steps**:
```powershell
cd backend
docker-compose up --build
```

This will:
- Start PostgreSQL database automatically
- Start FastAPI backend on http://localhost:8000
- No manual configuration needed

**Status**: Docker Desktop not currently running on your system

---

## Option 2: SQLite for Development (Quick Setup)

Use SQLite instead of PostgreSQL for development.

### Step 1: Update database.py

Replace `backend/app/database.py` with SQLite configuration:

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

# Use SQLite for development
SQLALCHEMY_DATABASE_URL = "sqlite:///./nourish_dev.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Step 2: Update requirements.txt

Remove database-specific packages:
- Remove: `psycopg2-binary==2.9.9`
- Remove: `sqlalchemy==2.0.23`
- Add: `sqlalchemy` (latest version)

### Step 3: Run Backend

```powershell
cd backend
pip install sqlalchemy
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## Option 3: Use Windows Subsystem for Linux (WSL2)

Install WSL2 and Docker in Linux, then run:

```bash
docker-compose up --build
```

---

## Recommended for Your Setup

Given you're on Windows without Docker Desktop currently active:

### Quick Path (SQLite):
1. Update `backend/app/database.py` to use SQLite
2. Run: `python -m uvicorn main:app --reload --port 8000`
3. Backend available at http://localhost:8000

### Production Path (Docker):
1. Install Docker Desktop
2. Run: `docker-compose up --build`
3. Full PostgreSQL setup with one command

---

## Next Steps

1. **Choose your setup** (SQLite for dev or Docker)
2. **Update database.py** if using SQLite
3. **Start backend server**
4. **Test API** at http://localhost:8000/docs

---

## API Testing

Once backend is running:

**Swagger UI**: http://localhost:8000/docs  
**ReDoc**: http://localhost:8000/redoc  

Test with sample requests:

```bash
# Register
curl -X POST "http://localhost:8000/api/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@iamain.org.uk","password":"test123"}'

# Login
curl -X POST "http://localhost:8000/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@iamain.org.uk","password":"test123"}'
```

---

## Full Stack Running

Once backend is set up:

**Terminal 1 (Backend)**:
```powershell
cd c:\Users\mahes\OneDrive\Desktop\nourish-app\backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 (Frontend)**:
```powershell
cd c:\Users\mahes\OneDrive\Desktop\nourish-app\frontend
npm run dev
```

**Access**:
- Frontend: http://localhost:5174/
- Backend: http://localhost:8000/
- API Docs: http://localhost:8000/docs

---

## Need Help?

- **Docker Issues**: See `backend/README.md`
- **Microsoft OAuth Setup**: See `backend/MICROSOFT_OAUTH_SETUP.md`
- **Quick Start**: See `QUICKSTART.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
