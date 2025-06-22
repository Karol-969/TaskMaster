# Quick Deployment Guide

Deploy ReArt Events platform locally using Docker in under 5 minutes.

## Prerequisites
- Docker and Docker Compose installed
- OpenAI API key (optional, for AI chat features)

## Quick Start

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd reart-events

# (Optional) Set OpenAI API key for AI chat features
export OPENAI_API_KEY=sk-your-key-here
```

### 2. Deploy with Docker
```bash
# Single command deployment
docker compose up --build
```

### 3. Access the Application
- **Main Website**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin/login
- **Admin Credentials**: admin / admin123

## Features Included

### Core Services
- Artist booking system with Khalti payment integration
- Sound equipment rental with real-time pricing
- Influencer collaboration platform
- Event management and booking
- Admin dashboard for complete management

### AI-Powered Features
- Intelligent chat assistant (requires OpenAI API key)
- Automated customer support responses
- Context-aware conversation handling

### Technical Features
- PostgreSQL database with automatic migrations
- Real-time WebSocket chat functionality
- Responsive design for all devices
- Production-ready Docker configuration

## Configuration

### Environment Variables
```bash
# Required for production
NODE_ENV=production
DATABASE_URL=postgresql://postgres:postgres@db:5432/reart_events

# Optional - AI Chat Features
OPENAI_API_KEY=sk-your-key-here

# Security
SESSION_SECRET=your-session-secret
```

### Database Configuration
- **Host**: localhost:5499 (external access)
- **Database**: reart_events
- **Username**: postgres
- **Password**: postgres

## Troubleshooting

### Common Issues

**Port Already in Use**
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

**Chat Not Working**
- Ensure OPENAI_API_KEY is set correctly
- Check WebSocket connection at ws://localhost:5000/ws
- Verify chat tables exist in database

### Logs and Debugging
```bash
# View application logs
docker compose logs app -f

# View database logs
docker compose logs db -f

# Check container status
docker compose ps
```

## Development vs Production

### Development Mode
```bash
npm install
npm run dev
```

### Production Mode (Docker)
```bash
docker compose up --build
```

## Features Ready for Use

### Booking Systems
- Artist booking with payment processing
- Sound equipment rental
- Venue booking and management
- Event creation and ticketing

### Payment Integration
- Khalti payment gateway (Nepal)
- Real-time payment status tracking
- Secure transaction handling
- Payment confirmation system

### Admin Features
- User management dashboard
- Content management system
- Real-time analytics
- Booking and payment oversight

### Customer Features
- Interactive booking forms
- Real-time chat support
- Payment status tracking
- Event discovery and booking

The platform is production-ready and includes all necessary features for a complete event management solution.