-- Initialize ReArt Events Database with Essential Data

-- Create admin user (if not exists)
INSERT INTO users (username, password, email, "fullName", role, phone, "createdAt")
VALUES ('admin', 'admin123', 'admin@reartevents.com', 'Admin User', 'admin', '555-1234', NOW())
ON CONFLICT (username) DO NOTHING;

-- Insert additional test users
INSERT INTO users (username, password, email, "fullName", role, phone, "createdAt") VALUES
('user1', 'password123', 'user1@example.com', 'Test User One', 'user', '555-0001', NOW()),
('user2', 'password123', 'user2@example.com', 'Test User Two', 'user', '555-0002', NOW())
ON CONFLICT (username) DO NOTHING;

-- Insert sample artists
INSERT INTO artists (name, genre, description, "imageUrl", languages, "musicStyle", bio, "contactEmail", phone, location, availability, "createdAt") VALUES
('SUJITA DANGOL', 'Folk/Traditional', 'Talented folk singer specializing in traditional Nepali music with modern interpretations', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'Nepali, English', 'Folk', 'Professional folk artist with 10+ years of experience', 'sujita@reartevents.com', '+977-1234567', 'Kathmandu, Nepal', true, NOW()),
('MAYA SHRESTHA', 'Pop/Contemporary', 'Contemporary pop artist known for powerful vocals and engaging stage presence', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 'Nepali, English, Hindi', 'Pop', 'Rising pop star with international recognition', 'maya@reartevents.com', '+977-2345678', 'Pokhara, Nepal', true, NOW()),
('DJ KARMA', 'Electronic/Dance', 'Electronic music producer and DJ specializing in fusion of traditional and modern beats', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'English, Nepali', 'Electronic', 'Leading electronic music artist in Nepal', 'karma@reartevents.com', '+977-3456789', 'Lalitpur, Nepal', true, NOW()),
('CLASSICAL ENSEMBLE', 'Classical', 'Traditional classical music ensemble featuring authentic instruments and arrangements', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'Nepali, Sanskrit', 'Classical', 'Preserving classical traditions through performance', 'ensemble@reartevents.com', '+977-4567890', 'Bhaktapur, Nepal', true, NOW());

-- Insert sample sound equipment
INSERT INTO sound_systems (name, description, power_rating, coverage, price_per_day, image, features) VALUES
('Premium PA System', 'High-quality professional PA system perfect for medium to large venues', '2000W', 'Up to 500 people', 299, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', ARRAY['Professional mixing console', '4x 15" main speakers', 'Wireless microphone system', 'Stage monitors']),
('Compact Sound Setup', 'Portable sound system ideal for small gatherings and intimate events', '500W', 'Up to 100 people', 149, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', ARRAY['Bluetooth connectivity', '2x 12" speakers', 'Wireless microphones', 'Easy setup']),
('Festival Grade System', 'Large-scale sound system designed for outdoor festivals and major events', '5000W', 'Up to 2000+ people', 799, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', ARRAY['Line array speakers', 'Digital mixing console', 'Professional grade amplifiers', 'Weather resistant']);

-- Insert sample events
INSERT INTO events (name, description, date, location, ticket_price, image_url, max_attendees) VALUES
('Traditional Music Festival', 'Celebrate traditional Nepali music with performances by renowned folk artists', '2025-07-15 18:00:00', 'Patan Durbar Square', 25, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 500),
('Modern Beats Concert', 'Contemporary music event featuring pop and electronic artists', '2025-08-20 19:30:00', 'Kathmandu Event Center', 45, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 800),
('Classical Evening', 'An evening of classical music performances in an intimate setting', '2025-09-10 17:00:00', 'Heritage Hotel Ballroom', 35, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 200);

-- Insert sample venues
INSERT INTO venues (name, location, description, image_url, capacity, amenities, price) VALUES
('Grand Heritage Hall', 'Thamel, Kathmandu', 'Elegant heritage venue perfect for cultural events and celebrations', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 300, ARRAY['Stage lighting', 'Sound system ready', 'Catering kitchen', 'Parking'], 500),
('Modern Event Center', 'New Baneshwor, Kathmandu', 'State-of-the-art event facility with modern amenities', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', 800, ARRAY['LED screens', 'Climate control', 'Green rooms', 'VIP areas'], 800),
('Outdoor Garden Venue', 'Bhaktapur', 'Beautiful outdoor space surrounded by traditional architecture', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 500, ARRAY['Garden setting', 'Weather protection', 'Traditional decor', 'Photo spots'], 400);

-- Insert sample testimonials
INSERT INTO testimonials ("customerName", rating, comment, "eventType", "createdAt") VALUES
('Rajesh Maharjan', 5, 'ReArt Events made our wedding celebration absolutely perfect. The sound quality was exceptional and the staff was professional throughout.', 'Wedding', NOW()),
('Priya Shrestha', 5, 'Outstanding service for our corporate event. Everything was organized perfectly and our guests were impressed.', 'Corporate Event', NOW()),
('Anup Khadka', 4, 'Great experience working with ReArt Events. The artist selection was excellent and the event went smoothly.', 'Cultural Event', NOW()),
('Sushma Gurung', 5, 'Professional team that understands client needs. Would definitely recommend for any event planning requirements.', 'Private Party', NOW());

-- Create sample blog posts
INSERT INTO "blogPosts" (title, content, excerpt, slug, "featuredImage", tags, status, "authorId", "publishedAt", "createdAt") VALUES
('The Future of Event Management in Nepal', 'Event management in Nepal is evolving rapidly with new technologies and changing client expectations...', 'Exploring how event management is transforming in Nepal with modern approaches and technology integration.', 'future-event-management-nepal', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', ARRAY['events', 'technology', 'nepal'], 'published', 1, NOW(), NOW()),
('Traditional Music: Preserving Culture Through Events', 'Traditional Nepali music plays a vital role in cultural preservation and community building...', 'How traditional music events help preserve Nepali culture and bring communities together.', 'traditional-music-culture-events', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', ARRAY['culture', 'music', 'tradition'], 'published', 1, NOW(), NOW()),
('Sound Equipment Guide for Event Organizers', 'Choosing the right sound equipment can make or break your event. Here is a comprehensive guide...', 'Essential guide for selecting appropriate sound equipment for different types of events.', 'sound-equipment-guide', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', ARRAY['sound', 'equipment', 'guide'], 'published', 1, NOW(), NOW());