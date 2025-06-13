# ReArt Events - Event Management Platform

A dynamic event management platform that connects artists and event organizers through an innovative and interactive booking experience.

## Features

- Weekly Live Music Arrangement
- Monthly Calendar Event Planning
- Event Concepts and Management
- Promotion and Sponsorships

## Docker Deployment

This project is configured to run easily with Docker and Docker Compose.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Application

1. Clone the repository:

```bash
git clone https://github.com/your-username/reart-events.git
cd reart-events
```

2. Configure OpenAI API key for AI chat features:

The chat widget requires an OpenAI API key to provide AI-powered responses. Without it, the chat will show fallback messages.

**Option A: Using .env file (Recommended)**
```bash
# Create .env file in project root
echo "OPENAI_API_KEY=sk-your_actual_openai_api_key_here" > .env
```

**Option B: Using environment variable**
```bash
export OPENAI_API_KEY=sk-your_actual_openai_api_key_here
```

**Getting an OpenAI API Key:**
1. Visit https://platform.openai.com/api-keys
2. Sign up or log in to your OpenAI account
3. Create a new API key
4. Copy the key (starts with 'sk-')
5. Add it to your environment configuration

**Without OpenAI API Key:**
The application will still function fully, but the AI Assistant will show informative fallback messages. Human Support chat remains fully functional.

3. Start the application with Docker Compose:

```bash
docker compose up --build
```

This will:
- Build the Node.js application container
- Start a PostgreSQL database on port 5499
- Run database migrations automatically
- Initialize the database with comprehensive sample data
- Create admin user with default credentials
- Start the application on port 5000

### Sample Data Included

The Docker deployment automatically loads comprehensive sample data:

**Artists (4 entries):**
- SUJITA DANGOL - Folk/Traditional singer
- MAYA SHRESTHA - Pop/Contemporary artist
- DJ KARMA - Electronic/Dance music producer
- CLASSICAL ENSEMBLE - Traditional classical music group

**Events (3 entries):**
- Traditional Music Festival - July 15, 2025 at Patan Durbar Square
- Modern Beats Concert - August 20, 2025 at Kathmandu Event Center  
- Classical Evening - September 10, 2025 at Heritage Hotel Ballroom

**Sound Equipment (3 systems):**
- Premium PA System (2000W, up to 500 people) - $299/day
- Compact Sound Setup (500W, up to 100 people) - $149/day
- Festival Grade System (5000W, up to 2000+ people) - $799/day

**Venues (3 locations):**
- Grand Heritage Hall - Thamel, Kathmandu (300 capacity)
- Modern Event Center - New Baneshwor, Kathmandu (800 capacity)
- Outdoor Garden Venue - Bhaktapur (500 capacity)

**Additional Data:**
- Blog posts with event planning guides
- Customer testimonials and reviews
- User accounts for testing (admin, user1, user2)

All data is accessible through public API endpoints without authentication.

4. Access the application:

Open your browser and navigate to:
```
http://localhost:5000
```

### Admin Panel Access

Once deployed, you can access the admin panel with these credentials:
- **Username:** admin
- **Password:** admin123
- **Admin URL:** http://localhost:5000/admin/login

Features available in admin panel:
- User management
- Artist management  
- Event management
- Sound equipment management
- Chat support management
- Dashboard analytics

### Environment Variables

The application supports the following environment variables:

- `OPENAI_API_KEY` - Optional. Required for AI-powered chat features
- `DATABASE_URL` - Database connection string (automatically configured in Docker)
- `NODE_ENV` - Application environment (production/development)

### Database Access

The PostgreSQL database is accessible at:
- Host: localhost
- Port: 5499
- Username: postgres
- Password: postgres
- Database: reart_events

### Chat Widget Testing

The application includes an AI-powered chat widget available on all pages:
1. Click the chat icon in the bottom right corner
2. Choose "AI Assistant" or "Human Support"
3. Test the conversation functionality
4. Admin users can manage chat conversations from the admin panel

### Troubleshooting

If you encounter issues:

1. **Database initialization errors**: 
   - If you see "relation 'users' does not exist", stop containers and remove volumes: `docker compose down -v`
   - Then rebuild: `docker compose up --build`
   - The application now handles schema creation before data seeding

2. **Application won't start**: Ensure ports 5000 and 5499 are not in use
3. **Database connection issues**: Wait for the full initialization sequence (may take 30-60 seconds)
4. **Build issues**: Clean rebuild with `docker compose down -v && docker compose up --build`
5. **Chat features not working**: Check browser console for errors, ensure proper network connectivity
6. **Admin login fails**: Use credentials admin/admin123, wait for database initialization to complete
7. **Data not loading**: Check container logs for "Data verification complete" message

### Container Logs

View real-time logs to debug issues:
```bash
# All containers
docker compose logs -f

# Application only
docker compose logs -f app

# Database only  
docker compose logs -f db
```

## Development

If you want to run the application in development mode without Docker:

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables (create a .env file):

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5499/reart_events
```

3. Run the development server:

```bash
npm run dev
```

## Production Deployment

For production deployment, consider:

1. Setting up proper environment variables for production
2. Using a production-ready database setup with proper backups
3. Implementing proper authentication and authorization
4. Setting up HTTPS