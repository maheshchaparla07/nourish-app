#!/bin/bash

# Start script for Nourish Care Backend

echo "🚀 Starting Nourish Care Backend Services..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start services
echo "📦 Starting PostgreSQL and FastAPI backend..."
docker-compose up --build


