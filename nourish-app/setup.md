# Setup Instructions for Your Friend

## What Your Friend Needs to Install

### ✅ Required: Docker Desktop
**Only ONE software needed!**

Your friend needs to install **Docker Desktop** which includes:
- Docker Engine
- Docker Compose
- All container management tools

**Download:**
- **Mac**: https://www.docker.com/products/docker-desktop/
- **Windows**: https://www.docker.com/products/docker-desktop/
- **Linux**: Follow Docker installation guide for your distribution

### ❌ NOT Needed (Docker handles everything):
- ❌ Python (not needed - runs in Docker container)
- ❌ PostgreSQL (not needed - runs in Docker container)
- ❌ pip or virtual environments (not needed - Docker handles it)
- ❌ Node.js/npm (only needed for frontend, not backend)

## Backend Setup (Using Docker)

### Step 1: Install Docker Desktop
1. Download Docker Desktop from https://www.docker.com/products/docker-desktop/
2. Install and start Docker Desktop
3. Wait for Docker to be running (green icon in system tray/menu bar)

### Step 2: Navigate to Backend Folder
```bash
cd backend
```

### Step 3: Start Everything
```bash
docker-compose up --build
```

That's it! Docker will:
- ✅ Download PostgreSQL image automatically
- ✅ Download Python image automatically
- ✅ Install all Python packages automatically
- ✅ Create database automatically
- ✅ Start both services automatically

## Frontend Setup

### What's Needed:
- **Node.js and npm** (one-time install)

### Steps:
```bash
# Install dependencies (first time only)
npm install

# Start frontend
npm run dev
```

## Complete Setup Summary

### For Backend:
1. ✅ Install Docker Desktop
2. ✅ Run `docker-compose up --build`
3. ✅ Done! Backend runs on http://localhost:8000

### For Frontend:
1. ✅ Install Node.js (if not already installed)
2. ✅ Run `npm install` (first time only)
3. ✅ Run `npm run dev`
4. ✅ Done! Frontend runs on http://localhost:5173

## Why Docker is Great

**Without Docker**, your friend would need:
- Python 3.11+
- PostgreSQL server
- pip and virtual environment
- All Python packages
- Database setup and configuration
- Environment variables setup

**With Docker**, your friend only needs:
- Docker Desktop (one software)
- Everything else is automated!

## Troubleshooting

### Docker Not Running?
- Make sure Docker Desktop is started
- Check: `docker ps` should work without errors

### Port Already in Use?
- Backend uses port 8000
- PostgreSQL uses port 5433 (changed from 5432)
- Frontend uses port 5173
- If conflicts occur, Docker will show an error

### First Time Setup Takes Longer
- Docker downloads images on first run (~500MB)
- Subsequent runs are much faster

## Quick Start Commands

### Backend:
```bash
cd backend
docker-compose up --build
```

### Frontend (in another terminal):
```bash
npm install  # First time only
npm run dev
```

## What Gets Installed Automatically

When your friend runs `docker-compose up --build`, Docker automatically:

1. **Downloads PostgreSQL 15** (if not already downloaded)
2. **Downloads Python 3.11** (if not already downloaded)
3. **Installs all Python packages** from `requirements.txt`:
   - FastAPI
   - SQLAlchemy
   - bcrypt
   - python-jose
   - And all other dependencies
4. **Creates database** (`nourish_db`)
5. **Creates tables** (users table)
6. **Starts both services**

All of this happens automatically - no manual installation needed!

