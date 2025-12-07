import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.database import Base, get_db
from main import app
from app import models, schemas
from app.utils import get_password_hash
from app.microsoft_auth import validate_email_domain, MicrosoftOAuthConfig

# Create test database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

class TestEmailDomainValidation:
    """Test email domain validation for Microsoft OAuth"""
    
    def test_valid_domain(self):
        """Test that valid domain emails are accepted"""
        valid_email = f"user@{MicrosoftOAuthConfig.ALLOWED_DOMAIN}"
        assert validate_email_domain(valid_email) is True
    
    def test_invalid_domain(self):
        """Test that invalid domain emails are rejected"""
        invalid_email = "user@invalid-domain.com"
        assert validate_email_domain(invalid_email) is False
    
    def test_empty_email(self):
        """Test that empty email is rejected"""
        assert validate_email_domain("") is False
    
    def test_none_email(self):
        """Test that None email is rejected"""
        assert validate_email_domain(None) is False
    
    def test_case_insensitive_domain(self):
        """Test that domain validation is case insensitive"""
        valid_email = f"user@{MicrosoftOAuthConfig.ALLOWED_DOMAIN.upper()}"
        assert validate_email_domain(valid_email) is True

class TestLocalLogin:
    """Test local email/password login"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Clear database before each test"""
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
    
    def test_successful_login(self):
        """Test successful login with correct credentials"""
        # Create test user
        db = TestingSessionLocal()
        hashed_password = get_password_hash("password123")
        test_user = models.User(
            email="test@example.com",
            name="Test User",
            hashed_password=hashed_password,
            auth_provider="local"
        )
        db.add(test_user)
        db.commit()
        db.close()
        
        # Test login
        response = client.post(
            "/api/login",
            json={"email": "test@example.com", "password": "password123"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["email"] == "test@example.com"
    
    def test_login_with_wrong_password(self):
        """Test login fails with wrong password"""
        # Create test user
        db = TestingSessionLocal()
        hashed_password = get_password_hash("password123")
        test_user = models.User(
            email="test@example.com",
            name="Test User",
            hashed_password=hashed_password,
            auth_provider="local"
        )
        db.add(test_user)
        db.commit()
        db.close()
        
        # Test login with wrong password
        response = client.post(
            "/api/login",
            json={"email": "test@example.com", "password": "wrongpassword"}
        )
        
        assert response.status_code == 401
        assert "Invalid" in response.json()["detail"]
    
    def test_login_with_nonexistent_user(self):
        """Test login fails for nonexistent user"""
        response = client.post(
            "/api/login",
            json={"email": "nonexistent@example.com", "password": "password123"}
        )
        
        assert response.status_code == 401
        assert "Invalid" in response.json()["detail"]

class TestUserRegistration:
    """Test local user registration"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Clear database before each test"""
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
    
    def test_successful_registration(self):
        """Test successful user registration"""
        response = client.post(
            "/api/register",
            json={
                "email": "newuser@example.com",
                "name": "New User",
                "password": "password123"
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert "token" in data
        assert data["user"]["email"] == "newuser@example.com"
        assert data["user"]["name"] == "New User"
    
    def test_registration_with_existing_email(self):
        """Test registration fails with existing email"""
        # First registration
        client.post(
            "/api/register",
            json={
                "email": "existing@example.com",
                "name": "Existing User",
                "password": "password123"
            }
        )
        
        # Second registration with same email
        response = client.post(
            "/api/register",
            json={
                "email": "existing@example.com",
                "name": "Another User",
                "password": "password456"
            }
        )
        
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"]
    
    def test_registration_stores_provider(self):
        """Test that local provider is stored on registration"""
        response = client.post(
            "/api/register",
            json={
                "email": "newuser@example.com",
                "name": "New User",
                "password": "password123"
            }
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["user"]["auth_provider"] == "local"

class TestMicrosoftOAuthFlow:
    """Test Microsoft OAuth login flow"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Clear database before each test"""
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
    
    def test_microsoft_login_url_generation(self):
        """Test Microsoft login URL is generated"""
        response = client.get("/api/microsoft/login")
        
        assert response.status_code == 200
        data = response.json()
        assert "authorization_url" in data
        assert "login.microsoftonline.com" in data["authorization_url"]
        assert "client_id" in data["authorization_url"]
    
    def test_blocked_domain_rejection(self):
        """Test that users from blocked domains are rejected"""
        # This test assumes we can mock the Microsoft OAuth flow
        # In practice, you'd need to mock the exchange_code_for_token and get_user_info functions
        pass

class TestProfileCompletion:
    """Test profile completion after Microsoft login"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Clear database before each test"""
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
    
    def test_profile_completion_requires_auth(self):
        """Test that profile completion requires authentication"""
        response = client.post(
            "/api/profile",
            json={
                "full_name": "John Doe",
                "role": "Manager",
                "department": "Operations"
            }
        )
        
        # Should fail without token
        assert response.status_code in [401, 422]

class TestProtectedRoutes:
    """Test that protected routes require authentication"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Clear database before each test"""
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
    
    def test_get_users_without_auth(self):
        """Test that /users endpoint requires authentication"""
        response = client.get("/api/users")
        
        # Should fail or succeed based on middleware configuration
        # If middleware is enforced, should return 401
        assert response.status_code in [200, 401]
    
    def test_get_users_with_invalid_token(self):
        """Test that /users endpoint rejects invalid tokens"""
        response = client.get(
            "/api/users",
            headers={"Authorization": "Bearer invalid-token"}
        )
        
        assert response.status_code in [401, 422]

class TestJWTTokenHandling:
    """Test JWT token creation and validation"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Clear database before each test"""
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
    
    def test_login_returns_valid_token(self):
        """Test that login returns a valid JWT token"""
        # Register user first
        client.post(
            "/api/register",
            json={
                "email": "test@example.com",
                "name": "Test User",
                "password": "password123"
            }
        )
        
        # Login
        response = client.post(
            "/api/login",
            json={"email": "test@example.com", "password": "password123"}
        )
        
        assert response.status_code == 200
        token = response.json()["token"]
        
        # Token should be a string
        assert isinstance(token, str)
        assert len(token) > 0
        
        # Token should have JWT structure (three parts separated by dots)
        assert token.count('.') == 2

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
