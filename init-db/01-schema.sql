-- Initialize the database schema
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artists (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  genre VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  rating DECIMAL(2,1) DEFAULT 5.0,
  languages VARCHAR(255),
  music_style VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS influencers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255),
  description TEXT,
  bio TEXT,
  image_url VARCHAR(255),
  portfolio_images TEXT,
  instagram_handle VARCHAR(255),
  instagram_followers INTEGER,
  tiktok_handle VARCHAR(255),
  tiktok_followers INTEGER,
  youtube_handle VARCHAR(255),
  youtube_subscribers INTEGER,
  twitter_handle VARCHAR(255),
  twitter_followers INTEGER,
  engagement_rate DECIMAL(4,2),
  average_views INTEGER,
  total_reach INTEGER,
  post_price DECIMAL(10,2),
  story_price DECIMAL(10,2),
  video_price DECIMAL(10,2),
  package_price DECIMAL(10,2),
  contact_email VARCHAR(255),
  phone VARCHAR(32),
  location VARCHAR(255),
  languages VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(2,1) DEFAULT 5.0,
  total_collaborations INTEGER,
  available_dates TEXT,
  collaboration_types TEXT,
  brand_restrictions TEXT,
  target_audience TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  price DECIMAL(10, 2),
  capacity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  event_id INTEGER REFERENCES events(id),
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  name VARCHAR(255),
  company VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
     id SERIAL PRIMARY KEY,
     userId INTEGER,
     subject VARCHAR(255),
     status VARCHAR(32),
     adminId INTEGER,
     guestName VARCHAR(255),
     guestEmail VARCHAR(255),
     conversationType VARCHAR(32) DEFAULT 'ai_assistant',
     createdAt TIMESTAMP DEFAULT NOW(),
     updatedAt TIMESTAMP DEFAULT NOW()
   );

ALTER TABLE conversations ADD COLUMN IF NOT EXISTS userId INTEGER;