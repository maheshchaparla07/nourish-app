# Nourish Care Backend API

FastAPI backend service for the Nourish Care digital care records platform.

## Features

- ✅ User authentication (Login & Register)
- ✅ JWT token-based authentication
- ✅ PostgreSQL database
- ✅ Docker setup for local development
- ✅ Password hashing with bcrypt
- ✅ CORS enabled for frontend integration

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt (passlib)

## Prerequisites

- Docker and Docker Compose installed
- (Optional) Python 3.11+ if running without Docker

## Quick Start with Docker

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Start the services:**
   ```bash
   docker-compose up --build
   ```

   This will start:
   - PostgreSQL database on port 5432
   - FastAPI backend on port 8000

3. **Access the API:**
   - API: http://localhost:8000
   - API Docs (Swagger): http://localhost:8000/docs
   - API Docs (ReDoc): http://localhost:8000/redoc

## API Endpoints

### Authentication

#### POST `/api/login`
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/api/register`
Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Local Development (Without Docker)

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up PostgreSQL:**
   - Install PostgreSQL locally
   - Create a database named `nourish_db`
   - Update `.env` with your database credentials

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and secret key
   ```

4. **Run database migrations:**
   The tables are created automatically on startup. If you need to reset:
   ```bash
   python -c "from app.database import Base, engine; Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine)"
   ```

5. **Start the server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://nourish_user:nourish_password@db:5432/nourish_db
SECRET_KEY=your-secret-key-change-this-in-production
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique, Indexed)
- `name` (String)
- `hashed_password` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)

## Docker Commands

- **Start services:** `docker-compose up`
- **Start in background:** `docker-compose up -d`
- **Stop services:** `docker-compose down`
- **View logs:** `docker-compose logs -f`
- **Rebuild:** `docker-compose up --build`
- **Remove volumes (clean database):** `docker-compose down -v`

## Testing the API

You can test the API using:

1. **Swagger UI**: http://localhost:8000/docs
2. **ReDoc**: http://localhost:8000/redoc
3. **cURL**:
   ```bash
   # Register
   curl -X POST "http://localhost:8000/api/register" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
   
   # Login
   curl -X POST "http://localhost:8000/api/login" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

## Frontend Integration

Update your frontend API base URL in `src/api/auth.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

## Production Considerations

- Change `SECRET_KEY` to a strong random key
- Use environment variables for all sensitive data
- Set up proper CORS origins
- Use a production-grade ASGI server (e.g., Gunicorn with Uvicorn workers)
- Set up database backups
- Use SSL/TLS for API endpoints
- Implement rate limiting
- Add request logging and monitoring

