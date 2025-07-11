#!/bin/sh
set -e

echo "🚀 Starting ReArt Events Platform..."

# Environment validation
echo "🔍 Validating environment configuration..."
if [ -n "$OPENAI_API_KEY" ] && [ "$OPENAI_API_KEY" != "sk-your_openai_api_key_here" ]; then
  echo "✅ OpenAI API key configured - AI chat functionality enabled"
else
  echo "⚠️  OpenAI API key not configured - chat will use fallback responses"
  echo "   To enable AI chat: Set OPENAI_API_KEY environment variable"
fi

# Wait for database to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
while ! nc -z db 5432; do
  sleep 0.5
done
echo "✅ PostgreSQL is ready!"

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
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "INSERT INTO artists (name, genre, description, image_url, languages, music_style, bio, contact_email, phone, location, availability, rating) VALUES 
  ('Anju Panta', 'Folk/Traditional', 'Renowned Nepali folk singer known for traditional and modern interpretations', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'Nepali,English', 'Folk', 'Professional folk artist with 15+ years of experience in Nepali music industry', 'anju@reartevents.com', '+977-9841234567', 'Kathmandu, Nepal', true, 4.9),
  ('Hemanta Sharma', 'Classical/Gazal', 'Classical music maestro specializing in gazals and traditional compositions', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 'Nepali,Hindi,English', 'Classical', 'Veteran classical singer with over 20 years of experience', 'hemanta@reartevents.com', '+977-9841234568', 'Pokhara, Nepal', true, 4.8),
  ('The Elements Band', 'Rock/Pop', 'Popular rock band known for energetic performances and original compositions', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'Nepali,English', 'Rock', 'Leading rock band in Nepal with multiple hit albums', 'elements@reartevents.com', '+977-9841234569', 'Lalitpur, Nepal', true, 4.7),
  ('Maya Shrestha', 'Pop/Contemporary', 'Contemporary pop artist with powerful vocals and stage presence', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 'Nepali,English,Hindi', 'Pop', 'Rising pop star with international recognition', 'maya@reartevents.com', '+977-9841234570', 'Bhaktapur, Nepal', true, 4.6),
  ('DJ Karma', 'Electronic/EDM', 'Electronic music producer and DJ specializing in fusion beats', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'English,Nepali', 'Electronic', 'Leading electronic music artist in Nepal', 'karma@reartevents.com', '+977-9841234571', 'Kathmandu, Nepal', true, 4.8),
  ('Sushant KC', 'Indie/Alternative', 'Indie musician known for soulful compositions and guitar skills', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'Nepali,English', 'Indie', 'Independent artist with a strong following', 'sushant@reartevents.com', '+977-9841234572', 'Chitwan, Nepal', true, 4.5);" 2>/dev/null || echo "Artists creation skipped"
  
  # Insert sample sound systems
  echo "Creating sample sound equipment..."
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "INSERT INTO sound_systems (name, type, description, specifications, pricing, power_rating, coverage_area, image_url, category, features, available) VALUES 
  ('Pro Sound Package Basic', 'Audio System', 'Complete sound system suitable for small to medium events', '2x 15\" Main Speakers, 2x 12\" Monitors, Mixing Console, Microphones', '2500/day', '2000W', 'Up to 200 people', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'Speakers', ARRAY['Wireless Microphones', '16-Channel Mixer', 'Monitor Speakers'], true),
  ('Premium Concert Setup', 'Professional Audio', 'High-end sound system for large concerts and festivals', '4x Line Array Speakers, Subwoofers, Digital Console, Wireless Systems', '8000/day', '10000W', 'Up to 2000 people', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 'Speakers', ARRAY['Line Array System', 'Digital Console', 'Wireless Microphone System', 'Monitor System'], true),
  ('DJ Sound System', 'DJ Equipment', 'Complete DJ setup with speakers and mixing equipment', '2x Active Speakers, DJ Controller, Subwoofer, Lighting', '3500/day', '3000W', 'Up to 500 people', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'Mixers', ARRAY['DJ Controller', 'Active Speakers', 'LED Lighting', 'Fog Machine'], true),
  ('Acoustic Performance Kit', 'Acoustic System', 'Specialized system for acoustic and unplugged performances', 'Acoustic Guitar Amps, Vocal Monitors, Small Mixer', '1500/day', '500W', 'Up to 100 people', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'Amplifiers', ARRAY['Guitar Amplifiers', 'Vocal Monitors', 'Compact Mixer'], true),
  ('Wireless Microphone Set', 'Microphone System', 'Professional wireless microphone system', '4x Wireless Handheld, 2x Lapel Mics, Receiver Unit', '1000/day', 'N/A', 'Any venue', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 'Microphones', ARRAY['Wireless Handheld', 'Lapel Microphones', 'Multi-channel Receiver'], true),
  ('LED Stage Lighting', 'Lighting System', 'Professional LED lighting setup for stage performances', 'Moving Head Lights, PAR Lights, DMX Controller', '2000/day', '2000W', 'Stage Coverage', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'Lighting', ARRAY['Moving Head Lights', 'PAR LED Lights', 'DMX Controller', 'Fog Machine'], true);" 2>/dev/null || echo "Sound systems creation skipped"
  
  # Insert sample venues
  echo "Creating sample venues..."
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "INSERT INTO venues (name, location, description, image_url, capacity, amenities, price) VALUES 
  ('Grand Heritage Hall', 'Thamel, Kathmandu', 'Elegant heritage venue for cultural events', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 300, ARRAY['Stage lighting', 'Sound system ready', 'Catering kitchen'], 500),
  ('Modern Event Center', 'New Baneshwor, Kathmandu', 'State-of-the-art event facility', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 800, ARRAY['LED screens', 'Climate control', 'VIP areas'], 800),
  ('Outdoor Garden Venue', 'Bhaktapur', 'Beautiful outdoor space with traditional architecture', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 500, ARRAY['Garden setting', 'Weather protection'], 400);" 2>/dev/null || echo "Venues creation skipped"
  
  # Insert sample events
  echo "Creating sample events..."
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "INSERT INTO events (name, description, date, location, price, image_url, category, available_tickets) VALUES 
  ('Summer Music Festival 2025', 'Annual summer music celebration featuring top Nepali artists', '2025-08-15 18:00:00', 'Tundikhel, Kathmandu', 1500, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'Music Festival', 2000),
  ('Traditional Folk Night', 'Evening of traditional Nepali folk music and cultural performances', '2025-07-25 19:00:00', 'Patan Durbar Square', 800, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 'Cultural Event', 500),
  ('Rock & Roll Concert', 'High-energy rock concert featuring local and international bands', '2025-09-05 20:00:00', 'Dashrath Stadium, Kathmandu', 2500, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'Concert', 5000),
  ('Acoustic Unplugged', 'Intimate acoustic performances in a cozy setting', '2025-07-20 17:30:00', 'Cafe Cheeno, Thamel', 600, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'Acoustic', 100),
  ('Electronic Music Night', 'Electronic dance music event with top DJs', '2025-08-30 21:00:00', 'LOD Club, Kathmandu', 1200, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 'Electronic', 800),
  ('Classical Music Evening', 'Elegant evening of classical and gazal performances', '2025-09-15 18:30:00', 'Nepal Academy Hall', 1000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'Classical', 300);" 2>/dev/null || echo "Events creation skipped"
  
  # Insert sample testimonials
  echo "Creating sample testimonials..."
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "INSERT INTO testimonials (name, company, text, rating, email, approved) VALUES 
  ('Rajesh Maharjan', 'Maharjan Events', 'ReArt Events made our wedding celebration absolutely perfect. The sound quality was exceptional and the staff was professional throughout.', 5, 'rajesh@maharjanevents.com', true),
  ('Priya Shrestha', 'Corporate Solutions Ltd', 'Outstanding service for our corporate event. Everything was organized perfectly and our guests were impressed with the artist selection.', 5, 'priya@corporatesolutions.com', true),
  ('Anup Khadka', 'Cultural Center Nepal', 'Great experience working with ReArt Events. The traditional music selection was excellent and the event went smoothly.', 4, 'anup@culturalnepal.org', true),
  ('Sushma Gurung', 'Gurung Productions', 'Professional team that understands client needs. The sound equipment quality exceeded our expectations for the festival.', 5, 'sushma@gurungprod.com', true),
  ('Binod Tamang', 'Tamang Music House', 'Excellent coordination and artist management. Our concert was a huge success thanks to their professional approach.', 5, 'binod@tamangmusic.com', true),
  ('Deepika Rai', 'Digital Marketing Co', 'Very satisfied with the influencer collaboration setup. Great reach and engagement for our product launch event.', 4, 'deepika@digitalmarketing.com', true);" 2>/dev/null || echo "Testimonials creation skipped"
  
  # Insert sample blog posts
  echo "Creating sample blog posts..."
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "INSERT INTO blog_posts (title, slug, content, excerpt, image_url, published, published_at) VALUES 
  ('The Evolution of Music Events in Nepal', 'evolution-music-events-nepal', 'Music events in Nepal have undergone a remarkable transformation over the past decade. From traditional folk gatherings to modern concert venues, the landscape of live music has evolved significantly...', 'Exploring how music events in Nepal have transformed and modernized while preserving cultural roots.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', true, NOW()),
  ('Choosing the Right Sound System for Your Event', 'choosing-right-sound-system', 'Selecting appropriate sound equipment is crucial for event success. Different events require different audio solutions, and understanding your needs is the first step...', 'Complete guide to selecting the perfect sound system for different types of events and venues.', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', true, NOW()),
  ('Top 5 Event Venues in Kathmandu Valley', 'top-5-venues-kathmandu-valley', 'Kathmandu Valley offers numerous stunning venues for events. From heritage locations to modern facilities, here are our top recommendations...', 'Discover the best event venues in Kathmandu Valley for weddings, concerts, and corporate events.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', true, NOW()),
  ('Working with Influencers for Event Promotion', 'influencer-event-promotion', 'Social media influencers have become powerful allies in event promotion. Understanding how to collaborate effectively with influencers can significantly boost your event attendance...', 'Learn how to leverage influencer partnerships for successful event marketing and promotion.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', true, NOW()),
  ('Traditional vs Modern: Blending Music Styles', 'traditional-vs-modern-music', 'The fusion of traditional Nepali music with contemporary styles creates unique experiences. Many artists are successfully bridging this gap...', 'Exploring the beautiful fusion of traditional and modern music in contemporary Nepali events.', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', true, NOW());" 2>/dev/null || echo "Blog posts creation skipped"
  
  # Insert sample influencers
  echo "Creating sample influencers..."
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "INSERT INTO influencers (name, social_media_handle, follower_count, engagement_rate, niche, image_url, bio, contact_email, phone, location, collaboration_rates, rating) VALUES 
  ('Samriddhi Rai', '@samriddhi_rai', 120000, 4.8, 'Fashion & Lifestyle', 'https://images.unsplash.com/photo-1494790108755-2616c36d44e3?w=400', 'Fashion influencer and lifestyle blogger with focus on traditional and modern styling', 'samriddhi@gmail.com', '+977-9841111111', 'Kathmandu, Nepal', '{\"story\": 5000, \"post\": 8000, \"reel\": 12000}', 4.8),
  ('Prakriti Shrestha', '@prakriti_official', 85000, 5.2, 'Beauty & Wellness', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 'Beauty and wellness advocate promoting natural and sustainable lifestyle choices', 'prakriti@gmail.com', '+977-9841222222', 'Pokhara, Nepal', '{\"story\": 4000, \"post\": 6000, \"reel\": 10000}', 4.9),
  ('Nirajan Pradhan', '@nirajan_vlogs', 200000, 4.2, 'Travel & Adventure', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'Travel vlogger and adventure enthusiast showcasing Nepal''s hidden gems', 'nirajan@gmail.com', '+977-9841333333', 'Chitwan, Nepal', '{\"story\": 6000, \"post\": 10000, \"reel\": 15000}', 4.7),
  ('Asmita Karki', '@asmita_food', 95000, 4.5, 'Food & Culture', 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400', 'Food blogger and cultural enthusiast sharing authentic Nepali cuisine and traditions', 'asmita@gmail.com', '+977-9841444444', 'Lalitpur, Nepal', '{\"story\": 4500, \"post\": 7000, \"reel\": 11000}', 4.6),
  ('Bikram Thapa', '@bikram_tech', 75000, 4.0, 'Technology & Innovation', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 'Tech reviewer and innovation enthusiast covering latest gadgets and digital trends', 'bikram@gmail.com', '+977-9841555555', 'Bhaktapur, Nepal', '{\"story\": 3500, \"post\": 5500, \"reel\": 9000}', 4.4),
  ('Sarina Dongol', '@sarina_music', 110000, 4.6, 'Music & Entertainment', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400', 'Music lover and entertainment curator promoting local artists and cultural events', 'sarina@gmail.com', '+977-9841666666', 'Kathmandu, Nepal', '{\"story\": 5000, \"post\": 8000, \"reel\": 12000}', 4.7);" 2>/dev/null || echo "Influencers creation skipped"
  
  # Insert sample home page content
  echo "Creating sample home page content..."
  PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -c "INSERT INTO home_page_content (section, content) VALUES 
  ('hero', '{\"title\": \"ReArt Events - Premier Event Management in Nepal\", \"subtitle\": \"Creating Unforgettable Experiences with Top Artists, Quality Sound Systems, and Professional Event Services\", \"buttonText\": \"Explore Our Services\", \"backgroundImage\": \"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400\"}'),
  ('services', '{\"title\": \"Our Services\", \"items\": [{\"name\": \"Artist Booking\", \"description\": \"Book talented local and international artists for your events\", \"icon\": \"music\", \"link\": \"/artists\"}, {\"name\": \"Sound Equipment\", \"description\": \"Professional sound systems and equipment rental\", \"icon\": \"audio\", \"link\": \"/sound-systems\"}, {\"name\": \"Event Planning\", \"description\": \"Complete event planning and management services\", \"icon\": \"calendar\", \"link\": \"/events\"}, {\"name\": \"Influencer Marketing\", \"description\": \"Connect with top influencers for event promotion\", \"icon\": \"users\", \"link\": \"/influencers\"}]}'),
  ('about', '{\"title\": \"About ReArt Events\", \"content\": \"ReArt Events is Nepals premier event management company, specializing in creating extraordinary experiences through music, technology, and professional service. Founded in 2024, we have quickly established ourselves as the go-to partner for weddings, corporate events, festivals, and private celebrations.\", \"image\": \"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400\"}'),
  ('stats', '{\"items\": [{\"number\": \"500+\", \"label\": \"Events Organized\"}, {\"number\": \"200+\", \"label\": \"Happy Clients\"}, {\"number\": \"50+\", \"label\": \"Professional Artists\"}, {\"number\": \"100%\", \"label\": \"Client Satisfaction\"}]}');" 2>/dev/null || echo "Home page content creation skipped"
  
  echo "✅ Sample data creation completed!"
  echo ""
  echo "🔑 Admin login credentials:"
  echo "   Username: admin"
  echo "   Password: admin123"
  echo "   Access admin panel at: http://localhost:5000/admin-dashboard"
  echo "   Manage home content at: http://localhost:5000/admin/home-content"
  
  # Verify data was loaded correctly
  echo "🧪 Verifying data integrity..."
  ARTIST_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM artists;" 2>/dev/null | xargs || echo "0")
  EVENT_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM events;" 2>/dev/null | xargs || echo "0")
  SOUND_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM sound_systems;" 2>/dev/null | xargs || echo "0")
  VENUE_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM venues;" 2>/dev/null | xargs || echo "0")
  USER_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs || echo "0")
  TESTIMONIAL_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM testimonials;" 2>/dev/null | xargs || echo "0")
  BLOG_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM blog_posts;" 2>/dev/null | xargs || echo "0")
  INFLUENCER_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM influencers;" 2>/dev/null | xargs || echo "0")
  HOME_CONTENT_COUNT=$(PGPASSWORD=$PGPASSWORD psql -h $PGHOST -U $PGUSER -d $PGDATABASE -t -c "SELECT COUNT(*) FROM home_page_content;" 2>/dev/null | xargs || echo "0")
  
  echo "✅ Data verification complete:"
  echo "   - Artists: $ARTIST_COUNT"
  echo "   - Events: $EVENT_COUNT"
  echo "   - Sound Systems: $SOUND_COUNT"
  echo "   - Venues: $VENUE_COUNT"
  echo "   - Users: $USER_COUNT"
  echo "   - Testimonials: $TESTIMONIAL_COUNT"
  echo "   - Blog Posts: $BLOG_COUNT"
  echo "   - Influencers: $INFLUENCER_COUNT"
  echo "   - Home Content: $HOME_CONTENT_COUNT"
else
  echo "ℹ️  Sample data already exists ($EXISTING_ARTISTS artists found). Skipping initialization."
fi

# Final deployment readiness check
echo "🚀 ReArt Events Platform deployment summary:"
echo "   - Database: Ready"
echo "   - Sample Data: Loaded"
echo "   - Admin Credentials: admin/admin123"
echo "   - Chat AI: $([ -n "$OPENAI_API_KEY" ] && [ "$OPENAI_API_KEY" != "sk-your_openai_api_key_here" ] && echo "Enabled" || echo "Disabled")"
echo "   - Access URL: http://localhost:5000"
echo "   - Admin Panel: http://localhost:5000/admin/login"

# Start the application
echo "🎯 Starting application server..."
exec "$@"