# Docker Deployment Guide for ReArt Events Platform

## Overview
This guide ensures the chat feature (AI Assistant) works properly when deploying the ReArt Events platform using Docker Compose.

## Prerequisites
- Docker and Docker Compose installed
- OpenAI API key (for AI chat functionality)

## Quick Deployment Steps

### 1. Download and Extract
```bash
# Download the project as ZIP and extract
# Navigate to the project directory
cd reart-events-platform
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@db:5432/reart_events
PGHOST=db
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=reart_events
PGPORT=5432

# OpenAI Configuration (REQUIRED for AI Chat)
OPENAI_API_KEY=your_actual_openai_api_key_here

# Application Configuration  
NODE_ENV=production
SESSION_SECRET=your_secure_session_secret_here
```

### 3. Deploy with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs to ensure everything is working
docker-compose logs -f app
```

### 4. Access Your Application
- Main application: http://localhost:5000
- Database: localhost:5499 (external access)

## Chat Feature Configuration

### OpenAI API Key Setup
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Replace `your_actual_openai_api_key_here` in your `.env` file

### Chat Feature Components
The chat system includes:
- **Real-time AI Assistant**: Powered by OpenAI GPT-4o
- **Live Database Integration**: AI fetches current pricing and availability
- **WebSocket Support**: Real-time messaging
- **Human Support Fallback**: Option to connect with admin

### Verification Steps
1. Open the application in your browser
2. Click the chat button (usually in bottom-right corner)
3. Start a conversation with "Hello, what services do you offer?"
4. AI should respond with current pricing and service information

## Troubleshooting

### Chat Not Working
Check logs: `docker-compose logs app`

Common issues:
- **OpenAI API Key**: Ensure valid API key is set
- **Database Connection**: Verify database is running
- **Port Conflicts**: Ensure ports 5000 and 5499 are available

### Environment Variables
All required environment variables are handled by Docker Compose:
- Database connection strings
- OpenAI API key
- Session management

### Database Initialization
The system automatically:
- Creates database tables
- Populates sample data (artists, influencers, sound equipment)
- Sets up admin user (username: admin, password: admin123)

## Production Considerations

### Security
- Change default passwords
- Use strong session secrets
- Secure OpenAI API key storage
- Enable HTTPS in production

### Performance
- The application uses connection pooling
- Database queries are optimized
- AI responses are cached when possible

### Monitoring
- Application logs via `docker-compose logs`
- Database health checks included
- Automatic service restart on failure

## Development vs Production

### Development
```bash
# Run in development mode
docker-compose -f docker-compose.dev.yml up -d
```

### Production
```bash
# Use production configuration
docker-compose up -d
```

## Support
For issues with deployment:
1. Check logs: `docker-compose logs app`
2. Verify environment variables
3. Ensure OpenAI API key is valid
4. Check database connectivity

The chat feature is fully integrated and will work out-of-the-box with proper configuration.