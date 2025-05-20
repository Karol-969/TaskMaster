#!/bin/sh
set -e

# Wait for database to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z db 5432; do
  sleep 0.5
done
echo "PostgreSQL is ready!"

# Run database migrations
echo "Running database migrations..."
npm run db:push

# Start the application
echo "Starting the application..."
exec "$@"