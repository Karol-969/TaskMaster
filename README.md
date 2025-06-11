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

2. (Optional) Set up OpenAI API key for AI chat features:

```bash
# Create a .env file or export the variable
export OPENAI_API_KEY=your_openai_api_key_here
```

If you don't have an OpenAI API key, the application will still work - the chat feature will fall back to informational responses without AI assistance.

3. Start the application with Docker Compose:

```bash
docker compose up --build
```

This will:
- Build the Node.js application container
- Start a PostgreSQL database on port 5499
- Run database migrations automatically
- Initialize the database with the necessary tables
- Start the application on port 5000

4. Access the application:

Open your browser and navigate to:
```
http://localhost:5000
```

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

### Troubleshooting

If you encounter issues:

1. **Application won't start**: Ensure ports 5000 and 5499 are not in use
2. **Database connection issues**: Wait a few seconds for the database to fully initialize
3. **Build issues**: Try `docker compose down` then `docker compose up --build`
4. **Chat features not working**: Ensure you have a valid OpenAI API key set

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