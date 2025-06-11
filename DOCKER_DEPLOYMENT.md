# Docker Deployment Guide

This guide provides complete instructions for deploying ReArt Events using Docker Compose.

## Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd reart-events

# Start the application
docker compose up --build
```

The application will be available at `http://localhost:5000`

## Environment Variables

### Required Variables
- `DATABASE_URL` - Automatically configured in Docker
- `NODE_ENV` - Set to "production" in Docker

### Optional Variables
- `OPENAI_API_KEY` - For AI-powered chat features

### Setting OpenAI API Key

Option 1: Environment variable
```bash
export OPENAI_API_KEY=sk-your-key-here
docker compose up --build
```

Option 2: .env file
```bash
echo "OPENAI_API_KEY=sk-your-key-here" > .env
docker compose up --build
```

## Services

### Application (Port 5000)
- Full-stack Node.js application
- Automatic database migrations
- Production-optimized build

### Database (Port 5499)
- PostgreSQL 15 with Alpine Linux
- Persistent data storage
- Automatic initialization

## Troubleshooting

### Common Issues

**Port Conflicts**
```bash
# Stop conflicting services
sudo lsof -ti:5000 | xargs kill -9
sudo lsof -ti:5499 | xargs kill -9
```

**Database Connection Issues**
```bash
# Restart containers
docker compose down
docker compose up --build
```

**Build Failures**
```bash
# Clean rebuild
docker compose down --volumes
docker compose up --build
```

### Logs

View application logs:
```bash
docker compose logs app -f
```

View database logs:
```bash
docker compose logs db -f
```

## Production Considerations

1. **Security**
   - Change default database credentials
   - Use environment-specific secrets
   - Enable HTTPS

2. **Performance**
   - Configure database connection pooling
   - Set up proper logging
   - Monitor resource usage

3. **Backup**
   - Regular database backups
   - Volume persistence
   - Disaster recovery plan

## Development vs Production

### Development
```bash
npm run dev
```

### Production (Docker)
```bash
docker compose up --build
```

The application gracefully handles missing OpenAI API keys, ensuring deployment success even without AI features.