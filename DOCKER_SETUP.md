# Docker Deployment Guide - ReArt Events Platform

This guide provides complete instructions for deploying the ReArt Events platform using Docker in any local environment or VM.

## Prerequisites

- Docker 20.10+ and Docker Compose 2.0+
- OpenAI API key (for AI chat functionality)
- At least 2GB RAM and 5GB disk space

## Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd reart-events
```

### 2. Configure OpenAI API Key
**Required for AI chat functionality to work properly**

Create `.env` file in project root:
```bash
# Create .env file with your OpenAI API key
cat > .env << 'EOF'
# OpenAI Configuration for AI Chat
OPENAI_API_KEY=sk-your_actual_openai_api_key_here

# Database Configuration (auto-configured for Docker)
DATABASE_URL=postgresql://postgres:postgres@db:5432/reart_events
PGHOST=db
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=reart_events
PGPORT=5432

# Application Configuration
NODE_ENV=production
SESSION_SECRET=reart-events-session-secret-2024
EOF
```

**To get an OpenAI API key:**
1. Visit https://platform.openai.com/api-keys
2. Sign up/login to OpenAI
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Replace `sk-your_actual_openai_api_key_here` in the .env file

### 3. Deploy with Docker
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

### 4. Access Application
- **Main Website**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin/login
  - Username: `admin`
  - Password: `admin123`

## Chat Widget Testing

After deployment, test the chat functionality:

1. **Open any page** on the website
2. **Click the purple chat icon** in bottom-right corner
3. **Choose "AI Assistant"** to test OpenAI integration
4. **Send a test message** like "What services do you offer?"
5. **Verify AI response** - should be contextual and informative

### Expected AI Response Example:
```
Hello! ReArt Events offers comprehensive event management services including:

1. Artist Management & Booking - Professional artists across Folk, Pop, Rock, Classical, Electronic, Hip-Hop, and Jazz genres
2. Sound Equipment Rental - PA systems from 500W to 5000W for 50-2000+ people
3. Event Management - Complete planning and coordination for corporate events, weddings, concerts
4. Venue Management - Premium venue partnerships and booking assistance
5. Influencer Services - Social media partnerships and marketing

How can I help you plan your event today?
```

### If Chat Shows Fallback Message:
If you see: "Thank you for your message! I'm currently experiencing technical difficulties with the AI assistant. To enable AI responses, please configure your OpenAI API key..."

**This means:**
- OpenAI API key is not configured or invalid
- Check your .env file
- Verify the API key starts with `sk-`
- Restart Docker containers: `docker-compose restart`

## Environment Configuration Details

### Docker Environment Variables
The `docker-compose.yml` automatically configures:

```yaml
environment:
  - NODE_ENV=production
  - DATABASE_URL=postgresql://postgres:postgres@db:5432/reart_events
  - PGHOST=db
  - PGUSER=postgres
  - PGPASSWORD=postgres
  - PGDATABASE=reart_events
  - PGPORT=5432
  - OPENAI_API_KEY=${OPENAI_API_KEY:-sk-your_openai_api_key_here}
  - SESSION_SECRET=reart-events-session-secret-2024
```

### Custom Environment Override
To use different environment variables:

```bash
# Create docker-compose.override.yml
cat > docker-compose.override.yml << 'EOF'
version: '3.8'
services:
  app:
    environment:
      - OPENAI_API_KEY=sk-your_custom_api_key
      - SESSION_SECRET=your-custom-session-secret
EOF
```

## Deployment Verification

### 1. Check Container Status
```bash
docker-compose ps
```
Should show both `app` and `db` containers as "Up"

### 2. Check Application Logs
```bash
docker-compose logs app
```
Look for:
- `✅ Admin user already exists: { id: 2, username: 'admin', role: 'admin' }`
- `serving on port 5000`
- No OpenAI API errors

### 3. Verify Database Connection
```bash
docker-compose logs db
```
Should show PostgreSQL startup messages without errors

### 4. Test API Endpoints
```bash
# Test public API
curl http://localhost:5000/api/artists

# Test admin login
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 5. Test Chat API
```bash
# Test AI chat endpoint
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What services do you offer?",
    "serviceName": "Event Management",
    "serviceDescription": "Complete event planning services",
    "conversationHistory": []
  }'
```

## Troubleshooting

### Chat Not Responding / Showing Fallback Messages

**Symptoms:**
- Chat widget shows: "Thank you for your message! I'm currently experiencing technical difficulties..."
- No AI-powered responses

**Solutions:**
1. **Check API Key Configuration:**
   ```bash
   # Verify .env file exists and contains correct API key
   cat .env | grep OPENAI_API_KEY
   
   # Should show: OPENAI_API_KEY=sk-...
   ```

2. **Verify API Key Validity:**
   ```bash
   # Test API key directly (replace with your key)
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer sk-your_api_key_here"
   ```

3. **Check Container Environment:**
   ```bash
   # Check if environment variable is loaded in container
   docker-compose exec app printenv | grep OPENAI
   ```

4. **Restart Containers:**
   ```bash
   docker-compose restart
   # Or full rebuild
   docker-compose down && docker-compose up --build
   ```

### Database Connection Issues

**Symptoms:**
- Application won't start
- Database connection errors in logs

**Solutions:**
1. **Wait for Database Initialization:**
   ```bash
   # Database may take 30-60 seconds to fully initialize
   docker-compose logs -f db
   ```

2. **Clean Database Restart:**
   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

3. **Check Port Conflicts:**
   ```bash
   # Ensure ports 5000 and 5499 are not in use
   lsof -i :5000
   lsof -i :5499
   ```

### Admin Login Issues

**Symptoms:**
- Cannot login with admin/admin123
- "Invalid credentials" error

**Solutions:**
1. **Wait for Database Seeding:**
   ```bash
   # Check logs for admin user creation
   docker-compose logs app | grep "Admin user"
   ```

2. **Verify Admin User in Database:**
   ```bash
   # Connect to database
   docker-compose exec db psql -U postgres -d reart_events -c "SELECT username, role FROM users WHERE role = 'admin';"
   ```

3. **Reset Admin User:**
   ```bash
   # Remove containers and volumes, rebuild
   docker-compose down -v
   docker-compose up --build
   ```

### Port Conflicts

**Symptoms:**
- "Port already in use" errors
- Cannot access application

**Solutions:**
1. **Check Current Port Usage:**
   ```bash
   netstat -tlnp | grep :5000
   netstat -tlnp | grep :5499
   ```

2. **Use Different Ports:**
   Edit `docker-compose.yml`:
   ```yaml
   services:
     app:
       ports:
         - "5001:5000"  # Use port 5001 instead
     db:
       ports:
         - "5500:5432"  # Use port 5500 instead
   ```

## Production Deployment Notes

### Security Considerations
1. **Change Default Credentials:**
   - Update admin password in production
   - Use strong session secrets

2. **Environment Variables:**
   - Store OpenAI API key securely
   - Use environment-specific configurations

3. **Database Security:**
   - Use strong database passwords
   - Enable SSL connections
   - Regular backups

### Performance Optimization
1. **Resource Allocation:**
   ```yaml
   services:
     app:
       deploy:
         resources:
           limits:
             memory: 1G
             cpus: '0.5'
   ```

2. **Database Tuning:**
   - Adjust PostgreSQL configuration
   - Set up connection pooling
   - Monitor query performance

## Support

### Getting Help
- Check application logs: `docker-compose logs -f`
- Review this troubleshooting guide
- Test API endpoints manually
- Verify environment configuration

### Common Issues Resolution Time
- Port conflicts: 2-5 minutes (change ports)
- Database initialization: 1-2 minutes (wait for completion)
- OpenAI API configuration: 5-10 minutes (get/configure API key)
- Admin login: 1-2 minutes (wait for user creation)

### Successful Deployment Indicators
✅ Both containers running (`docker-compose ps`)
✅ Admin user created (check logs)
✅ Application accessible at http://localhost:5000
✅ Admin login works with admin/admin123
✅ Chat widget responds with AI-powered messages
✅ Public APIs return sample data

This setup ensures a fully functional ReArt Events platform with working chat functionality in any Docker-compatible environment.