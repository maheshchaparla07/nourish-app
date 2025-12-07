# Microsoft OAuth2 Implementation Summary

## Overview
Successfully implemented Microsoft OAuth2 (Entra ID) authentication with domain restriction to `@iamain.org.uk` for the nourish-app project.

## Files Created

### Backend Files

#### 1. **app/microsoft_auth.py** (NEW)
- OAuth configuration management
- Token exchange with Microsoft
- User info retrieval from Microsoft Graph API
- Email domain validation
- State token generation for CSRF protection

Key Functions:
- `get_microsoft_authorization_url()` - Generates Microsoft login URL
- `exchange_code_for_token()` - Exchanges auth code for access token
- `get_user_info()` - Retrieves user data from Microsoft Graph
- `validate_email_domain()` - Ensures only `@iamain.org.uk` emails allowed
- `generate_state()` - Creates CSRF state tokens

#### 2. **app/auth_middleware.py** (NEW)
- Authentication middleware for protected routes
- JWT token verification
- Automatic route protection
- User info injection into request state

Key Features:
- Public routes: Login, registration, OAuth endpoints, health check
- Protected routes: All API endpoints require valid JWT
- Automatic 401 responses for missing/invalid tokens

#### 3. **backend/tests/test_auth.py** (NEW)
Comprehensive unit tests covering:
- Email domain validation (valid, invalid, case-insensitive)
- Local login (success, wrong password, non-existent user)
- User registration (success, duplicate prevention)
- OAuth flow (URL generation, domain blocking)
- Profile completion (auth requirement)
- Protected routes (authentication enforcement)
- JWT token handling (validity, structure)

Run with: `pytest tests/test_auth.py -v`

### Files Modified

#### Backend

1. **requirements.txt**
   - Added: `authlib==1.3.0` (OAuth support)
   - Added: `requests==2.31.0` (HTTP client for token exchange)

2. **.env.example**
   - Added Microsoft OAuth config variables
   - Added allowed domain configuration
   - Added frontend URL configuration

3. **app/models.py**
   - Updated User model with new fields:
     - `microsoft_id`: Unique Microsoft identifier
     - `auth_provider`: 'local' or 'microsoft'
     - `full_name`, `role`, `department`: Profile fields
     - `profile_completed`: First-time setup flag

4. **app/schemas.py**
   - Added new request schemas:
     - `MicrosoftAuthCallback`: For OAuth callback handling
     - `ProfileCompletionRequest`: For profile setup
   - Added new response schemas:
     - `MicrosoftLoginResponse`: Authorization URL response
     - `ProfileCompletionResponse`: Profile completion response
   - Updated `UserResponse` with new fields
   - Updated `LoginResponse` with `profile_completed` flag

5. **app/routers/auth.py**
   - Added `@router.get("/microsoft/login")`: Initiates OAuth flow
   - Added `@router.post("/microsoft/callback")`: Handles OAuth callback
   - Added `@router.post("/profile")`: Profile completion endpoint
   - Updated existing endpoints to support new auth provider field
   - Added domain validation and error handling

6. **app/utils.py**
   - Added `decode_token()`: JWT verification function
   - Used by middleware and profile endpoint

7. **main.py**
   - Added `verify_jwt_middleware` middleware
   - Middleware enforces authentication on protected routes
   - Proper CORS and OPTIONS handling maintained

### Frontend Files

#### New Components

1. **src/components/ProfileCompletion.tsx** (NEW)
   - First-time profile completion form
   - Collects: Full Name, Role, Department
   - Input validation with error messages
   - Loading state during submission
   - Success redirects to dashboard
   - Error handling for failed submissions

#### Modified Files

1. **src/api/auth.ts**
   - Added new interfaces:
     - `MicrosoftAuthCallbackRequest`
     - `ProfileCompletionRequest`
     - `MicrosoftLoginResponse`
     - `ProfileCompletionResponse`
   - Updated `LoginResponse` interface with new fields
   - Added new API functions:
     - `getMicrosoftLoginUrl()`: Get authorization URL
     - `handleMicrosoftCallback()`: Process OAuth callback
     - `completeProfile()`: Submit profile information
   - Updated `User` interface with profile fields

2. **src/pages/Login.tsx**
   - Added Microsoft login button with logo
   - Integrated OAuth callback handling
   - Detects `code` and `state` URL parameters
   - Routes to profile completion for first-time users
   - Shows error messages for domain rejection
   - Loading states for Microsoft login

### Documentation

1. **backend/MICROSOFT_OAUTH_SETUP.md** (NEW)
   - Complete setup guide
   - Azure/Entra ID configuration steps
   - Environment variable documentation
   - API endpoint specifications
   - Security features explanation
   - Troubleshooting guide
   - Testing instructions
   - Environment-specific configurations

## Implementation Details

### Authentication Flow

#### Local Login (Existing)
```
User enters credentials → Backend validates → JWT issued → Dashboard
```

#### Microsoft OAuth (New)
```
User clicks "Sign in with Microsoft"
    ↓
Frontend requests authorization URL from /api/microsoft/login
    ↓
Backend generates state token and returns Microsoft login URL
    ↓
User redirected to Microsoft login page
    ↓
User authenticates with Microsoft
    ↓
Microsoft redirects to /api/microsoft/callback with code
    ↓
Backend exchanges code for token via Microsoft Graph API
    ↓
Backend retrieves user info and validates email domain
    ↓
IF domain is invalid → 403 Forbidden "Login restricted to iamain.org.uk"
IF user is new → JWT issued + profile_completed=false
IF user exists → JWT issued + existing profile_completed status
    ↓
Frontend checks profile_completed flag
    ↓
IF false → Show ProfileCompletion form
IF true → Redirect to Dashboard
    ↓
User submits profile → POST /api/profile
    ↓
Profile saved → New JWT issued → Redirect to Dashboard
```

### Security Measures

1. **Domain Restriction**
   - Only `@iamain.org.uk` emails allowed
   - Validated on every Microsoft login
   - Returns 403 Forbidden for other domains

2. **CSRF Protection**
   - State tokens generated for OAuth flow
   - State validated on callback
   - Prevents authorization code interception

3. **JWT Security**
   - 24-hour token expiration
   - Environment-based secret keys
   - Token verification on protected routes
   - Automatic 401 responses for invalid/missing tokens

4. **No Hardcoded Secrets**
   - All credentials in environment variables
   - .env.example provided for reference
   - Tokens not stored in version control

### Database Changes

User model additions (migration required):
```sql
ALTER TABLE users ADD COLUMN microsoft_id VARCHAR UNIQUE NULL;
ALTER TABLE users ADD COLUMN auth_provider VARCHAR DEFAULT 'local';
ALTER TABLE users ADD COLUMN full_name VARCHAR NULL;
ALTER TABLE users ADD COLUMN role VARCHAR NULL;
ALTER TABLE users ADD COLUMN department VARCHAR NULL;
ALTER TABLE users ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ALTER COLUMN hashed_password DROP NOT NULL;
```

## Configuration Checklist

- [ ] Create Azure app registration
- [ ] Note Client ID, Tenant ID, Client Secret
- [ ] Configure redirect URI in Azure portal
- [ ] Copy values to backend/.env
- [ ] Copy values to frontend/.env
- [ ] Run database migration
- [ ] Install Python dependencies: `pip install -r requirements.txt`
- [ ] Install Node dependencies: `npm install`
- [ ] Start backend: `python -m uvicorn main:app --reload`
- [ ] Start frontend: `npm run dev`
- [ ] Test local login still works
- [ ] Test Microsoft login flow
- [ ] Test domain validation
- [ ] Test profile completion form

## Testing Coverage

### Backend Tests (test_auth.py)
- **Email Domain Validation**: 5 tests
- **Local Login**: 3 tests
- **Registration**: 3 tests
- **OAuth Flow**: 2 tests
- **Profile Completion**: 1 test
- **Protected Routes**: 2 tests
- **JWT Tokens**: 1 test

**Total: 17 unit tests**

Run tests with:
```bash
cd backend
pytest tests/test_auth.py -v
```

## API Endpoints Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /api/login | No | Local email/password login |
| POST | /api/register | No | Create new local account |
| GET | /api/microsoft/login | No | Get Microsoft authorization URL |
| POST | /api/microsoft/callback | No | Handle OAuth callback |
| POST | /api/profile | Yes | Complete first-time profile |
| GET | /api/users | Yes | List all users |

## Error Handling

### Domain Validation Error
```json
{
  "detail": "Login restricted to iamain.org.uk domain only"
}
```

### CSRF Attack Prevention
```json
{
  "detail": "Invalid state parameter. Possible CSRF attack."
}
```

### Missing Token
```json
{
  "detail": "Missing authentication token"
}
```

### Invalid Token
```json
{
  "detail": "Invalid or expired token"
}
```

## Next Steps

1. **Production Deployment**
   - Update redirect URIs in Azure portal
   - Update FRONTEND_URL environment variable
   - Generate strong SECRET_KEY
   - Use production database

2. **Enhancement Ideas**
   - Add token refresh endpoints
   - Implement role-based access control (RBAC)
   - Add audit logging
   - Implement session management
   - Add MFA support

3. **Monitoring**
   - Add login attempt logging
   - Monitor domain restriction blocks
   - Track token validation failures
   - Alert on repeated failed logins

## Support

For detailed setup instructions, see: `backend/MICROSOFT_OAUTH_SETUP.md`

For troubleshooting Azure configuration, visit: [Microsoft Identity Platform Docs](https://learn.microsoft.com/en-us/azure/active-directory/develop/)
