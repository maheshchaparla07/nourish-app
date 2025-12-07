# Microsoft OAuth Integration Guide

## Overview

This guide explains how to set up Microsoft OAuth2 authentication (Entra ID) for the nourish-app project. The implementation restricts login to users with email addresses ending in `@iamain.org.uk`.

## Architecture

### Backend Flow
1. User clicks "Sign in with Microsoft" button on login page
2. Frontend redirects to `/api/microsoft/login` which returns Microsoft's authorization URL
3. User authenticates with Microsoft and is redirected to callback URL
4. Backend validates the authorization code and email domain
5. User is created or updated in the database
6. JWT token is issued for session management

### Frontend Flow
1. User is redirected to Microsoft login page
2. After authentication, Microsoft redirects back with authorization code
3. Frontend sends code to backend for token exchange
4. If first-time user, profile completion form is shown
5. After profile completion, user is logged in and redirected to dashboard

## Setup Instructions

### 1. Azure/Entra ID Configuration

#### Register Application in Azure

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations** > **New registration**
3. Fill in the registration form:
   - **Name**: nourish-app (or your app name)
   - **Supported account types**: Choose based on your requirements
   - **Redirect URI**: 
     - Select "Web"
     - URI: `http://localhost:8000/api/auth/microsoft/callback` (for development)
     - For production: Use your production domain

4. Click **Register**

#### Configure Application

1. In the app's **Overview** page, note:
   - Application (client) ID → `MICROSOFT_CLIENT_ID`
   - Directory (tenant) ID → `MICROSOFT_TENANT_ID`

2. Go to **Certificates & Secrets** > **New client secret**
   - Create a secret with description "nourish-app secret"
   - Copy the **Value** → `MICROSOFT_CLIENT_SECRET`
   - **Important**: Save this immediately, you won't see it again!

3. Go to **API Permissions**
   - Click **Add a permission** > **Microsoft Graph** > **Delegated permissions**
   - Search for and add:
     - `openid`
     - `profile`
     - `email`
     - `User.Read`
   - Click **Grant admin consent** (if you have permissions)

#### Configure Redirect URI

1. Go to **Authentication** settings
2. Under **Redirect URIs**, ensure both are present:
   - Development: `http://localhost:8000/api/auth/microsoft/callback`
   - Production: `https://yourdomain.com/api/auth/microsoft/callback`

3. Under **Implicit grant and hybrid flows**, ensure **ID tokens** is checked

### 2. Environment Configuration

#### Backend (.env)

Create or update `.env` file in the `backend/` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://nourish_user:nourish_password@localhost:5432/nourish_db

# JWT Secret Key (Generate a strong random key in production)
SECRET_KEY=your-super-secret-key-change-this-in-production

# API Settings
API_HOST=0.0.0.0
API_PORT=8000

# Microsoft OAuth Configuration
MICROSOFT_TENANT_ID=your-tenant-id-from-azure
MICROSOFT_CLIENT_ID=your-client-id-from-azure
MICROSOFT_CLIENT_SECRET=your-client-secret-from-azure
MICROSOFT_REDIRECT_URI=http://localhost:8000/api/auth/microsoft/callback

# Allowed Domain for Microsoft Login
ALLOWED_EMAIL_DOMAIN=iamain.org.uk

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)

Create `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000/api
```

### 3. Database Migration

The updated User model includes new fields:
- `microsoft_id`: Stores Microsoft's unique user identifier
- `auth_provider`: Tracks whether login is 'local' or 'microsoft'
- `full_name`, `role`, `department`: Profile information
- `profile_completed`: Boolean flag for first-time setup

Run database migration (exact command depends on your migration tool):

```bash
cd backend
# If using Alembic:
alembic upgrade head

# Or if using SQLAlchemy directly:
python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine)"
```

### 4. Install Dependencies

#### Backend

```bash
cd backend
pip install -r requirements.txt
```

New packages added:
- `authlib==1.3.0` - OAuth handling
- `requests==2.31.0` - HTTP requests for token exchange

#### Frontend

```bash
cd frontend
npm install
```

Existing dependencies are sufficient; no new packages needed.

### 5. Run the Application

#### Start Backend

```bash
cd backend
python -m uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

#### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication Endpoints

#### Local Login
- **POST** `/api/login`
- Request body: `{ "email": "user@example.com", "password": "password" }`
- Response: `{ "token": "jwt-token", "user": {...}, "profile_completed": true }`

#### Local Registration
- **POST** `/api/register`
- Request body: `{ "email": "user@example.com", "name": "John Doe", "password": "password" }`
- Response: `{ "token": "jwt-token", "user": {...} }`

#### Microsoft OAuth Login Initiation
- **GET** `/api/microsoft/login`
- Response: `{ "authorization_url": "https://login.microsoftonline.com/..." }`
- Returns Microsoft's authorization URL; frontend should redirect user here

#### Microsoft OAuth Callback
- **POST** `/api/microsoft/callback`
- Request body: `{ "code": "auth-code", "state": "state-token" }`
- Response: `{ "token": "jwt-token", "user": {...}, "profile_completed": false|true }`
- Validates email domain; rejects if not `@iamain.org.uk`

#### Profile Completion (First-Time Users)
- **POST** `/api/profile`
- Headers: `Authorization: Bearer <jwt-token>`
- Request body: `{ "full_name": "John Doe", "role": "Manager", "department": "Operations" }`
- Response: `{ "token": "new-jwt-token", "user": {...}, "message": "Profile completed successfully" }`

#### Get All Users (Protected)
- **GET** `/api/users`
- Headers: `Authorization: Bearer <jwt-token>`
- Response: `{ "users": [...], "total": count }`

## Security Features

### 1. Domain Restriction
Only emails ending with `@iamain.org.uk` are allowed:
```python
def validate_email_domain(email: str) -> bool:
    return email.lower().endswith(f"@{ALLOWED_EMAIL_DOMAIN.lower()}")
```

If a user from a different domain attempts to login, they'll receive:
```json
{
  "detail": "Login restricted to iamain.org.uk domain only"
}
```

### 2. CSRF Protection
OAuth state tokens are generated and validated:
```python
def generate_state() -> str:
    return secrets.token_urlsafe(32)
```

### 3. JWT Token Security
- Tokens expire after 24 hours
- Secrets are environment variables (not hardcoded)
- Tokens are validated for protected routes

### 4. Middleware Authentication
Protected routes check JWT tokens via `auth_middleware.py`:
- Public routes: `/login`, `/register`, `/microsoft/login`, `/microsoft/callback`, `/health`
- Protected routes: All others require valid JWT

## Testing

### Run Unit Tests

```bash
cd backend
pip install pytest pytest-asyncio

# Run all tests
pytest tests/test_auth.py -v

# Run specific test class
pytest tests/test_auth.py::TestEmailDomainValidation -v

# Run with coverage
pytest tests/test_auth.py --cov=app --cov-report=html
```

### Test Coverage

The test suite includes:
1. **Email Domain Validation Tests**
   - Valid domain acceptance
   - Invalid domain rejection
   - Case-insensitive validation

2. **Local Login Tests**
   - Successful login with correct credentials
   - Failed login with wrong password
   - Failed login for non-existent user

3. **Registration Tests**
   - Successful registration
   - Duplicate email prevention
   - Provider tracking

4. **OAuth Flow Tests**
   - Authorization URL generation
   - Domain blocking (mocked)

5. **JWT Token Tests**
   - Valid token structure
   - Token validation
   - Token expiration

## Frontend Components

### ProfileCompletion.tsx
- Shown to first-time Microsoft OAuth users
- Collects: Full Name, Role, Department
- Submits to `/api/profile` endpoint
- Replaces login form until profile is complete

### Updated Login.tsx
- Added "Sign in with Microsoft" button
- Handles OAuth callback (detects `code` and `state` URL params)
- Routes to profile completion or dashboard based on completion status

## Environment-Specific Configuration

### Development
```env
MICROSOFT_REDIRECT_URI=http://localhost:8000/api/auth/microsoft/callback
FRONTEND_URL=http://localhost:5173
SECRET_KEY=dev-key-change-this
```

### Staging
```env
MICROSOFT_REDIRECT_URI=https://staging.yourdomain.com/api/auth/microsoft/callback
FRONTEND_URL=https://staging.yourdomain.com
SECRET_KEY=<generate-strong-key>
```

### Production
```env
MICROSOFT_REDIRECT_URI=https://yourdomain.com/api/auth/microsoft/callback
FRONTEND_URL=https://yourdomain.com
SECRET_KEY=<generate-strong-key>
DATABASE_URL=<production-db-url>
```

## Troubleshooting

### "Invalid state parameter. Possible CSRF attack."
- **Cause**: State token doesn't match or expired
- **Solution**: Clear browser cookies and retry login

### "Login restricted to iamain.org.uk domain only"
- **Cause**: User logged in with non-whitelisted email domain
- **Solution**: Only users with `@iamain.org.uk` emails can login

### "Failed to exchange authorization code for token"
- **Cause**: Invalid credentials or redirect URI mismatch
- **Solution**: 
  1. Verify `MICROSOFT_CLIENT_ID` and `MICROSOFT_CLIENT_SECRET` in .env
  2. Check redirect URI matches in Azure portal and .env
  3. Ensure application is registered correctly

### Token expires immediately
- **Cause**: Server time out of sync or token parsing issue
- **Solution**: Check server time synchronization; verify `SECRET_KEY` is consistent

### Profile completion form not showing
- **Cause**: `profile_completed` flag not properly set
- **Solution**: Check database migration was applied; verify user record has field

## Future Enhancements

1. **Token Refresh**
   - Implement refresh tokens for longer sessions
   - Add token refresh endpoint

2. **MFA Support**
   - Require multi-factor authentication for Microsoft login
   - Support Windows Hello, authenticator apps

3. **Role-Based Access Control**
   - Map Microsoft groups to application roles
   - Implement permission-based route protection

4. **Audit Logging**
   - Log all authentication attempts
   - Track profile changes

5. **Session Management**
   - Add session expiration handling
   - Implement logout with token blacklisting

## References

- [Microsoft Identity Platform Docs](https://learn.microsoft.com/en-us/azure/active-directory/develop/)
- [OAuth 2.0 Authorization Code Flow](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)
