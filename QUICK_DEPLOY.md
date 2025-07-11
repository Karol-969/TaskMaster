# Quick Deploy Guide - ReArt Events Platform

## 🚀 Deploy in 3 Steps

### Step 1: Environment Setup
Create `.env` file in root directory:
```env
# Required for AI Chat Feature
OPENAI_API_KEY=your_openai_api_key_here

# Database (auto-configured)
DATABASE_URL=postgresql://postgres:postgres@db:5432/reart_events
PGHOST=db
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=reart_events
PGPORT=5432

# Security
SESSION_SECRET=your_secure_session_secret_here
NODE_ENV=production
```

### Step 2: Get OpenAI API Key
1. Visit: https://platform.openai.com/api-keys
2. Create new API key
3. Replace `your_openai_api_key_here` in `.env`

### Step 3: Deploy
```bash
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f app
```

## ✅ Verification

### Access Your App
- **Main App**: http://localhost:5000
- **Database**: localhost:5499

### Test Chat Feature
1. Click chat button on website
2. Ask: "What services do you offer?"
3. AI should respond with current pricing

## 🔧 Troubleshooting

### Chat Not Working?
```bash
# Check logs
docker-compose logs app

# Look for these success messages:
# ✅ OpenAI API key configured - AI chat functionality enabled
# ✅ PostgreSQL is ready!
# 🔄 Real-time data fetched for AI: Data available
```

### Common Issues:
- **Invalid API Key**: Get new key from OpenAI
- **Port Conflicts**: Change ports in docker-compose.yml
- **Database Issues**: Run `docker-compose down -v` then `docker-compose up -d`

## 🎯 What's Included

- **AI Chat Assistant**: Real-time pricing and service info
- **Database**: PostgreSQL with sample data
- **Real-time Features**: WebSocket support
- **Admin Panel**: Login with admin/admin123

## 📞 Support
The chat feature will work automatically with proper OpenAI API key setup.