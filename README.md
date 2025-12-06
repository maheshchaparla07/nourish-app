# Nourish Care Application

A full-stack digital care records platform with React frontend and FastAPI backend.

## Project Structure

```
nourish-app/
├── frontend/          # React + TypeScript frontend
│   ├── src/          # Source code
│   ├── package.json  # Frontend dependencies
│   └── ...
│
└── backend/          # FastAPI + PostgreSQL backend
    ├── app/         # Application code
    ├── main.py      # FastAPI entry point
    ├── docker-compose.yml  # Docker setup
    └── ...
```

## Quick Start

### Backend Setup

```bash
cd backend
docker-compose up --build
```

Backend will run on: http://localhost:8000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: http://localhost:5173

## Documentation

- **Backend**: See `backend/README.md`
- **Frontend**: See `frontend/README.md`
- **Database Setup**: See `backend/DATABASE_SETUP.md`
- **Data Persistence**: See `backend/DATA_PERSISTENCE.md`

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- Docker
- JWT Authentication

## Development

1. Start backend: `cd backend && docker-compose up`
2. Start frontend: `cd frontend && npm run dev`
3. Access frontend: http://localhost:5173
4. Access API docs: http://localhost:8000/docs


