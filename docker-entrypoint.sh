#!/bin/sh
set -e

# Wait for database to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z db 5432; do
  sleep 0.5
done
echo "PostgreSQL is ready!"

# Wait a bit more to ensure database is fully initialized
sleep 5

# Run database migrations first to create tables
echo "Running database migrations..."
npm run db:push

# Wait for migrations to complete
sleep 2

# Check if data initialization is needed
echo "Checking database initialization..."

# Check if tables exist and have data
echo "Checking if sample data already exists..."
EXISTING_ARTISTS=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM artists;" 2>/dev/null | xargs || echo "0")

if [ "$EXISTING_ARTISTS" -eq "0" ]; then
  echo "No existing data found. Creating sample data programmatically..."
  
  # Insert admin user
  echo "Creating admin user..."
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "INSERT INTO users (username, password, email, full_name, role, phone) VALUES ('admin', 'admin123', 'admin@reartevents.com', 'Admin User', 'admin', '555-1234') ON CONFLICT (username) DO NOTHING;" 2>/dev/null || echo "Admin user creation skipped"
  
  # Insert sample artists
  echo "Creating sample artists..."
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "INSERT INTO artists (name, genre, description, image_url, languages, music_style, bio, contact_email, phone, location, availability) VALUES 
  ('SUJITA DANGOL', 'Folk/Traditional', 'Talented folk singer specializing in traditional Nepali music', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'Nepali, English', 'Folk', 'Professional folk artist with 10+ years experience', 'sujita@reartevents.com', '+977-1234567', 'Kathmandu, Nepal', true),
  ('MAYA SHRESTHA', 'Pop/Contemporary', 'Contemporary pop artist with powerful vocals', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 'Nepali, English, Hindi', 'Pop', 'Rising pop star with international recognition', 'maya@reartevents.com', '+977-2345678', 'Pokhara, Nepal', true),
  ('DJ KARMA', 'Electronic/Dance', 'Electronic music producer and DJ', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'English, Nepali', 'Electronic', 'Leading electronic music artist in Nepal', 'karma@reartevents.com', '+977-3456789', 'Lalitpur, Nepal', true);" 2>/dev/null || echo "Artists creation skipped"
  
  # Insert sample sound systems
  echo "Creating sample sound equipment..."
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "INSERT INTO sound_systems (name, type, description, specifications, price, pricing, power_rating, coverage_area, image_url, category, features, available) VALUES 
  ('Premium PA System', 'Complete PA', 'High-quality professional PA system suitable for medium to large venues', 'Professional grade amplifiers, Digital mixing console', '$299/day', '$299/day', '2000W', 'Up to 500 people', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'PA Systems', ARRAY['Professional mixing console', 'Wireless microphones', 'Stage monitors'], true),
  ('Compact Sound Setup', 'Portable Setup', 'Portable sound system ideal for small gatherings and intimate events', 'Compact speakers, Built-in amplifier', '$149/day', '$149/day', '500W', 'Up to 100 people', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 'Portable', ARRAY['Bluetooth connectivity', 'Easy setup'], true),
  ('Festival Grade System', 'Festival System', 'Large-scale sound system designed for outdoor festivals and major events', 'Line array configuration, Weather protection', '$799/day', '$799/day', '5000W', 'Up to 2000+ people', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'Festival', ARRAY['Line array speakers', 'Weather resistant'], true);" 2>/dev/null || echo "Sound systems creation skipped"
  
  # Insert sample venues
  echo "Creating sample venues..."
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "INSERT INTO venues (name, location, description, image_url, capacity, amenities, price) VALUES 
  ('Grand Heritage Hall', 'Thamel, Kathmandu', 'Elegant heritage venue for cultural events', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 300, ARRAY['Stage lighting', 'Sound system ready', 'Catering kitchen'], 500),
  ('Modern Event Center', 'New Baneshwor, Kathmandu', 'State-of-the-art event facility', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 800, ARRAY['LED screens', 'Climate control', 'VIP areas'], 800),
  ('Outdoor Garden Venue', 'Bhaktapur', 'Beautiful outdoor space with traditional architecture', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 500, ARRAY['Garden setting', 'Weather protection'], 400);" 2>/dev/null || echo "Venues creation skipped"
  
  # Insert sample events
  echo "Creating sample events..."
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "INSERT INTO events (name, description, date, start_time, end_time, venue, capacity, price, status, event_type, organizer_id, images) VALUES 
  ('Traditional Music Festival', 'Celebrate traditional Nepali music with performances by renowned folk artists', '2025-07-15 18:00:00', '18:00', '23:00', 'Patan Durbar Square', 500, 25, 'published', 'cultural', 1, ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400']),
  ('Modern Beats Concert', 'Contemporary music event featuring pop and electronic artists', '2025-08-20 19:30:00', '19:30', '01:00', 'Kathmandu Event Center', 800, 45, 'published', 'concert', 1, ARRAY['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400']),
  ('Classical Evening', 'An evening of classical music performances in an intimate setting', '2025-09-10 17:00:00', '17:00', '21:00', 'Heritage Hotel Ballroom', 200, 35, 'published', 'classical', 1, ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400']);" 2>/dev/null || echo "Events creation skipped"
  
  # Insert sample testimonials
  echo "Creating sample testimonials..."
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "INSERT INTO testimonials (user_id, content, rating) VALUES 
  (1, 'ReArt Events made our celebration absolutely perfect. Professional service throughout.', 5),
  (1, 'Outstanding service for our corporate event. Everything was organized perfectly.', 5),
  (1, 'Great experience working with ReArt Events. Highly recommended.', 4),
  (1, 'Professional team that understands client needs. Excellent service.', 5);" 2>/dev/null || echo "Testimonials creation skipped"
  
  echo "Sample data creation completed!"
  
  # Verify data was loaded correctly
  echo "Verifying data integrity..."
  ARTIST_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM artists;" 2>/dev/null | xargs || echo "0")
  EVENT_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM events;" 2>/dev/null | xargs || echo "0")
  SOUND_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM sound_systems;" 2>/dev/null | xargs || echo "0")
  VENUE_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM venues;" 2>/dev/null | xargs || echo "0")
  USER_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs || echo "0")
  TESTIMONIAL_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM testimonials;" 2>/dev/null | xargs || echo "0")
  
  echo "Data verification complete:"
  echo "- Artists: $ARTIST_COUNT"
  echo "- Events: $EVENT_COUNT"
  echo "- Sound Systems: $SOUND_COUNT"
  echo "- Venues: $VENUE_COUNT"
  echo "- Users: $USER_COUNT"
  echo "- Testimonials: $TESTIMONIAL_COUNT"
else
  echo "Sample data already exists ($EXISTING_ARTISTS artists found). Skipping initialization."
fi

# Start the application
echo "Starting the application..."
exec "$@"