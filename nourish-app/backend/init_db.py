"""
Database initialization script
Run this script to create all database tables
"""
from app.database import engine, Base
from app.models import User  # Import all models here

def init_database():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

def drop_database():
    """Drop all database tables (use with caution!)"""
    print("⚠️  Dropping all database tables...")
    Base.metadata.drop_all(bind=engine)
    print("✅ All tables dropped!")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "drop":
        confirm = input("Are you sure you want to drop all tables? (yes/no): ")
        if confirm.lower() == "yes":
            drop_database()
        else:
            print("Cancelled.")
    else:
        init_database()

