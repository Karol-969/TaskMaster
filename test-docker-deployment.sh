#!/bin/bash

# Test Docker Deployment Script for ReArt Events Platform
echo "🚀 Testing Docker Deployment for ReArt Events Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating example .env file..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@db:5432/reart_events
PGHOST=db
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=reart_events
PGPORT=5432

# OpenAI Configuration (REQUIRED for AI Chat)
OPENAI_API_KEY=your_openai_api_key_here

# Application Configuration  
NODE_ENV=production
SESSION_SECRET=your_secure_session_secret_here
EOF
    echo "📝 Example .env file created. Please update with your actual OpenAI API key."
fi

# Start the deployment
echo "🏁 Starting Docker Compose deployment..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to initialize..."
sleep 30

# Test health endpoint
echo "🔍 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:5000/api/health)
echo "Health check response: $HEALTH_RESPONSE"

# Test main application
echo "🌐 Testing main application..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000)
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Main application is responding (HTTP $HTTP_STATUS)"
else
    echo "❌ Main application is not responding (HTTP $HTTP_STATUS)"
fi

# Test database connectivity
echo "🗄️  Testing database connectivity..."
DB_STATUS=$(docker-compose exec -T db pg_isready -U postgres)
if [[ $DB_STATUS == *"accepting connections"* ]]; then
    echo "✅ Database is ready and accepting connections"
else
    echo "❌ Database is not ready"
fi

# Check logs for any errors
echo "📋 Checking application logs..."
echo "Last 20 lines of app logs:"
docker-compose logs --tail=20 app

echo ""
echo "🎯 Deployment Summary:"
echo "- Main Application: http://localhost:5000"
echo "- Database: localhost:5499"
echo "- Chat Feature: Depends on OpenAI API key configuration"
echo ""
echo "📞 To test chat feature:"
echo "1. Open http://localhost:5000 in your browser"
echo "2. Click the chat button"
echo "3. Ask: 'What services do you offer?'"
echo ""
echo "🔧 To view logs: docker-compose logs -f app"
echo "🛑 To stop: docker-compose down"