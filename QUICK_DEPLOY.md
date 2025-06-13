# Quick Deploy Guide - ReArt Events Platform

Deploy the complete ReArt Events platform with working chat functionality in under 5 minutes.

## Prerequisites
- Docker and Docker Compose installed
- OpenAI API key (get from https://platform.openai.com/api-keys)

## 1-Command Deployment

```bash
# Clone, configure, and deploy
git clone <repository-url> && cd reart-events && \
echo "OPENAI_API_KEY=sk-your_actual_openai_api_key_here" > .env && \
docker-compose up --build
```

Replace `sk-your_actual_openai_api_key_here` with your actual OpenAI API key.

## Access Points

After deployment completes (2-3 minutes):

- **Website**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin/login
  - Username: `admin`
  - Password: `admin123`

## Test Chat Functionality

1. Open http://localhost:5000
2. Click purple chat icon (bottom-right)
3. Choose "AI Assistant"
4. Send: "What services do you offer?"
5. Verify AI response about ReArt Events services

## Success Indicators

✅ Both containers running (`docker-compose ps`)
✅ Admin login works with admin/admin123
✅ Chat responds with detailed service information
✅ All pages load without errors
✅ Sample data visible (artists, events, equipment)

## If Chat Shows Fallback Message

The chat will show "experiencing technical difficulties" if:
- OpenAI API key missing or invalid
- Network connectivity issues

**Fix**: Update `.env` file with valid API key and restart:
```bash
docker-compose restart
```

## Complete Environment Template

Create `.env` with this content:
```env
OPENAI_API_KEY=sk-your_actual_openai_api_key_here
DATABASE_URL=postgresql://postgres:postgres@db:5432/reart_events
NODE_ENV=production
SESSION_SECRET=reart-events-session-2024
```

This deployment includes:
- Complete event management platform
- Admin panel with full CRUD operations
- AI-powered chat widget
- Sample data (artists, events, venues, equipment)
- PostgreSQL database with automatic initialization
- Production-ready Docker configuration