# Nourish - React + TypeScript Login Application

A modern, beautiful login page built with React, TypeScript, and TailwindCSS, matching the Nourish design.

## Features

- ✅ Email/Username and password authentication
- ✅ Form validation (required fields)
- ✅ Loading state on submit
- ✅ Server error message display
- ✅ Token storage in localStorage as "auth_token"
- ✅ Automatic redirect to dashboard on success
- ✅ Protected routes with authentication check
- ✅ Beautiful UI matching the Nourish design
- ✅ Password visibility toggle
- ✅ "Keep me logged in" checkbox

## Project Structure

```
src/
├── api/
│   └── auth.ts              # Login API function
├── context/
│   └── AuthContext.tsx      # Authentication context provider
├── pages/
│   ├── Login.tsx            # Login page component
│   └── Dashboard.tsx        # Protected dashboard page
├── App.tsx                   # Main app with routing
├── main.tsx                  # Entry point
└── index.css                 # TailwindCSS styles
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

## API Configuration

The login API endpoint is configured in `src/api/auth.ts`. By default, it points to:
- **URL**: `https://example.com/api/login`
- **Method**: POST
- **Body**: `{ email: string, password: string }`

Update the `API_BASE_URL` constant in `src/api/auth.ts` to match your actual API endpoint.

## Authentication Flow

1. User enters email/username and password
2. Form validates required fields
3. On submit, API call is made to login endpoint
4. On success:
   - Token is saved to localStorage as "auth_token"
   - User data is saved to localStorage as "auth_user"
   - User is redirected to `/dashboard`
5. On error:
   - Error message is displayed to the user

## Protected Routes

The dashboard route (`/dashboard`) is protected and requires authentication. Unauthenticated users are automatically redirected to `/login`.

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router DOM** - Routing
- **TailwindCSS** - Styling
- **Vite** - Build tool

## Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

