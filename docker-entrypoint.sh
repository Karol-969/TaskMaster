#!/bin/sh
set -e

# Wait for database to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z db 5432; do
  sleep 0.5
done
echo "PostgreSQL is ready!"

# Wait a bit more to ensure database is fully initialized
sleep 2

# Run database migrations
echo "Running database migrations..."
npm run db:push

# Check if data initialization is needed
echo "Checking database initialization..."
if [ -f "/app/init-db/01-init-data.sql" ]; then
  echo "Running data initialization..."
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f /app/init-db/01-init-data.sql
  echo "Data initialization completed!"
else
  echo "No initialization script found, skipping..."
fi

# Start the application
echo "Starting the application..."
exec "$@"