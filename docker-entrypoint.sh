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
  echo "Checking if sample data already exists..."
  EXISTING_ARTISTS=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM artists;" 2>/dev/null | xargs || echo "0")
  
  if [ "$EXISTING_ARTISTS" -eq "0" ]; then
    echo "No existing data found. Running data initialization..."
    PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f /app/init-db/01-init-data.sql
    echo "Data initialization completed!"
    
    # Verify data was loaded correctly
    echo "Verifying data integrity..."
    ARTIST_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM artists;" 2>/dev/null | xargs || echo "0")
    EVENT_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM events;" 2>/dev/null | xargs || echo "0")
    SOUND_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM \"soundSystems\";" 2>/dev/null | xargs || echo "0")
    BLOG_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM \"blogPosts\";" 2>/dev/null | xargs || echo "0")
    VENUE_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM venues;" 2>/dev/null | xargs || echo "0")
    USER_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs || echo "0")
    
    echo "Data verification complete:"
    echo "- Artists: $ARTIST_COUNT"
    echo "- Events: $EVENT_COUNT"
    echo "- Sound Systems: $SOUND_COUNT"
    echo "- Blog Posts: $BLOG_COUNT"
    echo "- Venues: $VENUE_COUNT"
    echo "- Users: $USER_COUNT"
  else
    echo "Sample data already exists ($EXISTING_ARTISTS artists found). Skipping initialization."
  fi
else
  echo "No initialization script found, skipping..."
fi

# Start the application
echo "Starting the application..."
exec "$@"