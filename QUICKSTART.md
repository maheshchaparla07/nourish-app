# Quick Start Guide - Microsoft OAuth Implementation

## 5-Minute Setup

### Step 1: Get Azure Credentials (5 minutes)
1. Go to [Azure Portal](https://portal.azure.com)
2. Create app registration → Copy **Client ID** and **Tenant ID**
3. Create client secret → Copy **Secret Value**
4. Add redirect URI: `http://localhost:8000/api/auth/microsoft/callback`

### Step 2: Configure Environment (2 minutes)

**backend/.env**
```env
MICROSOFT_TENANT_ID=<your-tenant-id>
MICROSOFT_CLIENT_ID=<your-client-id>
MICROSOFT_CLIENT_SECRET=<your-client-secret>
MICROSOFT_REDIRECT_URI=http://localhost:8000/api/auth/microsoft/callback
ALLOWED_EMAIL_DOMAIN=iamain.org.uk
FRONTEND_URL=http://localhost:5173
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost/nourish_db
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:8000/api
```

### Step 3: Install & Run (3 minutes)

```bash
# Backend
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### Step 4: Test It

1. Open `http://localhost:5173`
2. Click "Sign in with Microsoft"
3. Login with `yourname@iamain.org.uk`
4. Complete profile (Full Name, Role, Department)
5. You're in the dashboard! ✓

## What Was Implemented

✓ Microsoft OAuth2 authentication  
✓ Domain restriction to `@iamain.org.uk`  
✓ First-time profile completion form  
✓ JWT token-based sessions  
✓ Protected routes middleware  
✓ Comprehensive unit tests  
✓ Error handling for blocked domains  

## Key Features

### Login Options
- Traditional email/password login (unchanged)
- New "Sign in with Microsoft" button
- Seamless profile completion for new users

### Security
- Email domain validation (403 error for non-iamain.org.uk)
- CSRF protection with state tokens
- JWT token expiration (24 hours)
- Environment-based secrets
- Protected routes require authentication

### Database Updates
User table now includes:
- `microsoft_id` - Microsoft's unique identifier
- `auth_provider` - 'local' or 'microsoft'
- `full_name`, `role`, `department` - Profile fields
- `profile_completed` - First-time setup flag

## API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/microsoft/login` | GET | No | Get Microsoft login URL |
| `/api/microsoft/callback` | POST | No | Handle OAuth callback |
| `/api/profile` | POST | Yes | Complete first-time profile |
| `/api/login` | POST | No | Traditional login |
| `/api/register` | POST | No | Create account |
| `/api/users` | GET | Yes | List users |

## Troubleshooting

### "Login restricted to iamain.org.uk domain only"
Only `@iamain.org.uk` emails work. Use a different account.

### "Invalid state parameter"
Clear browser cookies and try again. Might be session timeout.

### "Failed to exchange authorization code"
Check that:
- MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET are correct
- Redirect URI in Azure matches your .env
- Server time is synchronized

### Token expires immediately
Verify `SECRET_KEY` is set and the same across restarts.

## Testing

```bash
cd backend
pytest tests/test_auth.py -v
```

Tests cover:
- Email domain validation
- Local login/registration
- OAuth flow
- Profile completion
- JWT handling

## File Changes Summary

### New Files
- `backend/app/microsoft_auth.py` - OAuth utilities
- `backend/app/auth_middleware.py` - Route protection
- `backend/tests/test_auth.py` - Unit tests (17 tests)
- `frontend/src/components/ProfileCompletion.tsx` - Profile form
- `backend/MICROSOFT_OAUTH_SETUP.md` - Detailed guide

### Modified Files
- `backend/requirements.txt` - Added authlib, requests
- `backend/.env.example` - OAuth configuration
- `backend/app/models.py` - User model updates
- `backend/app/schemas.py` - New request/response types
- `backend/app/routers/auth.py` - OAuth endpoints
- `backend/app/utils.py` - Token decoding
- `backend/main.py` - Middleware setup
- `frontend/src/api/auth.ts` - OAuth API calls
- `frontend/src/pages/Login.tsx` - Microsoft button & callback

## Next: Production Deployment

When ready for production:

1. Register production app in Azure
2. Update `MICROSOFT_REDIRECT_URI` to your domain
3. Update `FRONTEND_URL` to your domain
4. Generate strong `SECRET_KEY`
5. Update database URL
6. Test domain validation works
7. Deploy to production

See `backend/MICROSOFT_OAUTH_SETUP.md` for detailed steps.

---

**Questions?** Check `IMPLEMENTATION_SUMMARY.md` for technical details or `backend/MICROSOFT_OAUTH_SETUP.md` for comprehensive setup.
