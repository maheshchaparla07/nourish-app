import os
import secrets
from typing import Optional, Dict
from authlib.integrations.httpx_client import AsyncOAuth2Client
import httpx
from dotenv import load_dotenv

load_dotenv()

class MicrosoftOAuthConfig:
    """Microsoft OAuth configuration"""
    TENANT_ID = os.getenv("MICROSOFT_TENANT_ID")
    CLIENT_ID = os.getenv("MICROSOFT_CLIENT_ID")
    CLIENT_SECRET = os.getenv("MICROSOFT_CLIENT_SECRET")
    REDIRECT_URI = os.getenv("MICROSOFT_REDIRECT_URI", "http://localhost:8000/api/auth/microsoft/callback")
    ALLOWED_DOMAIN = os.getenv("ALLOWED_EMAIL_DOMAIN", "iamain.org.uk")
    
    # Microsoft OAuth endpoints
    AUTHORIZATION_BASE_URL = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/authorize"
    TOKEN_URL = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token"
    USERINFO_URL = "https://graph.microsoft.com/v1.0/me"
    
    SCOPES = ["openid", "profile", "email", "User.Read"]

async def get_microsoft_authorization_url(state: str) -> str:
    """Generate Microsoft authorization URL"""
    params = {
        "client_id": MicrosoftOAuthConfig.CLIENT_ID,
        "redirect_uri": MicrosoftOAuthConfig.REDIRECT_URI,
        "response_type": "code",
        "scope": " ".join(MicrosoftOAuthConfig.SCOPES),
        "state": state,
        "prompt": "select_account"
    }
    
    param_str = "&".join(f"{k}={v}" for k, v in params.items())
    return f"{MicrosoftOAuthConfig.AUTHORIZATION_BASE_URL}?{param_str}"

async def exchange_code_for_token(code: str) -> Optional[Dict]:
    """Exchange authorization code for access token"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                MicrosoftOAuthConfig.TOKEN_URL,
                data={
                    "client_id": MicrosoftOAuthConfig.CLIENT_ID,
                    "client_secret": MicrosoftOAuthConfig.CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": MicrosoftOAuthConfig.REDIRECT_URI,
                    "grant_type": "authorization_code",
                    "scope": " ".join(MicrosoftOAuthConfig.SCOPES)
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Token exchange failed: {response.text}")
                return None
    except Exception as e:
        print(f"Error exchanging code for token: {e}")
        return None

async def get_user_info(access_token: str) -> Optional[Dict]:
    """Get user info from Microsoft Graph API"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                MicrosoftOAuthConfig.USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"},
                timeout=10.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Failed to get user info: {response.text}")
                return None
    except Exception as e:
        print(f"Error getting user info: {e}")
        return None

def validate_email_domain(email: str) -> bool:
    """Validate that email ends with allowed domain"""
    if not email:
        return False
    allowed_domain = f"@{MicrosoftOAuthConfig.ALLOWED_DOMAIN}"
    return email.lower().endswith(allowed_domain.lower())

def generate_state() -> str:
    """Generate random state for OAuth"""
    return secrets.token_urlsafe(32)
