-- Seed data for the database

-- Insert admin user (default password: admin123)
INSERT INTO users (username, email, password_hash, is_admin) 
VALUES ('admin', 'admin@reart-events.com', '$2b$10$GQ1Kb7wP8iwjCRY0HUY0Xu0d8TKq3XXKRtPW0nU2aMjEI8t6f5zfm', TRUE)
ON CONFLICT (username) DO NOTHING;

-- Insert sample artists with languages and music styles
INSERT INTO artists (name, genre, description, image_url, rating, languages, music_style)
VALUES
  ('Aditya Rikhari', 'Pop / Rock', 'Versatile vocalist with powerful stage presence and wide vocal range.', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80', 5, 'English, Hindi, Nepali', 'Modern Pop, Classic Rock'),
  ('Bipul Chettri', 'Folk / Indie', 'Soulful folk artist with authentic mountain melodies and storytelling.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80', 5, 'Nepali, English', 'Folk, Acoustic'),
  ('Bartika Eam Rai', 'Indie / Folk', 'Emotive songstress with intimate lyrics and haunting melodies.', 'https://images.unsplash.com/photo-1534126511673-b6899657816a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80', 5, 'Nepali, English', 'Indie Folk, Alternative'),
  ('Samriddhi Rai', 'Pop / R&B', 'Contemporary artist blending modern pop sensibilities with soulful vocals.', 'https://images.unsplash.com/photo-1593697972422-2a5b4d4a4479?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80', 5, 'English, Nepali', 'Modern Pop, R&B')
ON CONFLICT (id) DO NOTHING;

-- Insert sample events
INSERT INTO events (title, description, image_url, event_date, location, price, capacity)
VALUES
  ('Summer Music Festival', 'Annual summer music celebration featuring top artists from around the country.', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80', NOW() + INTERVAL '30 days', 'Central Park, Kathmandu', 2500.00, 1000),
  ('Acoustic Night', 'Intimate acoustic performances by leading indie artists in a cozy setting.', 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80', NOW() + INTERVAL '14 days', 'Cafe Terrace, Lalitpur', 1200.00, 150),
  ('Corporate Launch Party', 'Exclusive product launch event with premium entertainment and networking.', 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80', NOW() + INTERVAL '45 days', 'Grand Ballroom, Soaltee Hotel', 5000.00, 300)
ON CONFLICT (id) DO NOTHING;

-- Insert sample testimonials
INSERT INTO testimonials (user_id, text, rating)
VALUES
  (1, 'ReArt Events delivered beyond our expectations. Their attention to detail and artist selection for our corporate event was exceptional. Every guest was impressed!', 5),
  (1, 'The monthly calendar service has transformed our venue. We now have consistent quality entertainment that our patrons love. Highly recommended!', 5),
  (1, 'Working with ReArt for our product launch was the best decision. Their promotion strategy brought in the perfect audience and the event was a huge success.', 5)
ON CONFLICT (id) DO NOTHING;