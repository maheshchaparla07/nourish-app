# How to Start the Frontend

## Quick Start

### 1. Install Dependencies (First Time Only)
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
The frontend will be available at: **http://localhost:5173**

## Complete Steps

### Step 1: Navigate to Project Root
```bash
cd /Users/ayyappa.juttiga/Desktop/nourish-app
```

### Step 2: Install Dependencies (if not already installed)
```bash
npm install
```

This will install all required packages:
- React 18
- React Router DOM
- TypeScript
- Vite
- TailwindCSS
- And other dependencies

### Step 3: Start the Development Server
```bash
npm run dev
```

You should see output like:
```
  VITE v5.0.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Access the Application
Open your browser and go to: **http://localhost:5173**

## Available Scripts

- `npm run dev` - Start development server (with hot reload)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Frontend Routes

- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Dashboard (protected, requires authentication)
- `/` - Redirects to `/dashboard`

## Backend Connection

The frontend is configured to connect to the backend at:
- **Development**: `http://localhost:8000/api`

Make sure your backend is running before testing login/register:
```bash
cd backend
docker-compose up
```

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port (5174, 5175, etc.)

### Dependencies Not Installed
If you see errors about missing modules:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Backend Connection Issues
- Ensure backend is running: `docker ps` (should show `nourish_backend`)
- Check backend URL in `src/api/auth.ts`
- Verify CORS is enabled in backend (it should be)

## Development Tips

- The dev server has **hot module replacement** - changes will reflect immediately
- Check browser console for any errors
- Use React DevTools browser extension for debugging

