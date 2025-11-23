# Project Structure

## 📁 Complete Folder Structure

```
nourish-app/
│
├── frontend/                    # React Frontend Application
│   ├── src/
│   │   ├── api/
│   │   │   └── auth.ts         # API client functions
│   │   ├── components/
│   │   │   ├── Sidebar.tsx
│   │   │   └── StatCard.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── App.tsx             # Main app component
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.ts          # Vite configuration
│   ├── tsconfig.json           # TypeScript config
│   ├── tailwind.config.js      # TailwindCSS config
│   └── README.md               # Frontend documentation
│
└── backend/                     # FastAPI Backend Application
    ├── app/
    │   ├── __init__.py
    │   ├── database.py         # Database connection
    │   ├── models.py           # SQLAlchemy models
    │   ├── schemas.py           # Pydantic schemas
    │   ├── utils.py             # Utility functions (JWT, password hashing)
    │   └── routers/
    │       ├── __init__.py
    │       └── auth.py          # Authentication routes
    ├── main.py                  # FastAPI application entry
    ├── requirements.txt        # Python dependencies
    ├── Dockerfile              # Docker image definition
    ├── docker-compose.yml      # Docker Compose setup
    ├── init_db.py              # Database initialization script
    ├── README.md               # Backend documentation
    ├── DATABASE_SETUP.md       # Database setup guide
    └── DATA_PERSISTENCE.md     # Data persistence guide
```

## 🚀 How to Run

### Backend
```bash
cd backend
docker-compose up --build
```
**Runs on:** http://localhost:8000

### Frontend
```bash
cd frontend
npm install    # First time only
npm run dev
```
**Runs on:** http://localhost:5173

## 📝 Notes

- **Backend** is completely self-contained with Docker
- **Frontend** is a standard React + Vite application
- Both folders have their own `README.md` files
- All dependencies are managed separately

