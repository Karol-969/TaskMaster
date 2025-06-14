import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import { storage } from "./database-storage";
import { 
  insertUserSchema,
  insertBookingSchema,
  insertTestimonialSchema,
  insertArtistSchema,
  insertInfluencerSchema,
  insertSoundSystemSchema,
  insertVenueSchema,
  insertEventSchema,
  insertConversationSchema,
  insertChatMessageSchema,
  insertPaymentSchema
} from "@shared/schema";
import { createKhaltiService } from "./services/khaltiService";
import { ChatWebSocketServer } from "./websocket";
import { z } from "zod";
import { generateAIResponse, detectHumanRequest } from "./openai";

// Type definitions to make TypeScript happy
declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Auth middleware
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session?.userId;
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const user = await storage.getUser(userId);
  
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  
  req.user = user;
  next();
};

// Admin middleware
const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = req.session as any;
    console.log('Admin middleware check:', { 
      sessionExists: !!session, 
      userId: session?.userId,
      sessionID: req.sessionID 
    });
    
    if (!session || !session.userId) {
      console.log('No valid session found');
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await storage.getUser(session.userId);
    console.log('User lookup:', { userId: session.userId, found: !!user, role: user?.role });
    
    if (!user || user.role !== "admin") {
      console.log('Access denied - user not admin');
      return res.status(403).json({ message: "Admin access required" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: "Authentication error" });
  }
};

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Internal server error" });
};

// Initialize sample data function
async function initializeSampleData() {
  try {
    console.log('🔧 Initializing sample data...');
    
    // Check if admin user exists first
    const existingAdminUser = await storage.getUserByUsername('admin');
    if (!existingAdminUser) {
      console.log('📦 Creating admin user...');
      await storage.createUser({
        username: 'admin',
        email: 'admin@reartevents.com',
        password: 'admin123',
        fullName: 'System Administrator',
        role: 'admin'
      });
      console.log('✅ Admin user created successfully');
    } else {
      console.log('✅ Admin user already exists:', { id: existingAdminUser.id, username: existingAdminUser.username, role: existingAdminUser.role });
    }

    // Check if influencers already exist
    const existingInfluencers = await storage.getAllInfluencers();
    if (existingInfluencers.length === 0) {
      console.log('📦 Creating sample influencers...');
      
      const sampleInfluencers = [
        {
          name: 'Sarah Chen',
          description: 'Fashion & Lifestyle influencer with a passion for sustainable living and mindful consumption.',
          bio: 'Fashion & Lifestyle influencer with a passion for sustainable living and mindful consumption.',
          category: 'Fashion & Beauty',
          location: 'Los Angeles, CA',
          imageUrl: '/uploads/sarah-chen.jpg',
          instagramHandle: '@sarahchen_style',
          instagramFollowers: 125000,
          tiktokHandle: '@sarahchen_official',
          tiktokFollowers: 89000,
          youtubeHandle: 'Sarah Chen Lifestyle',
          youtubeSubscribers: 45000,
          twitterHandle: '@sarahchenstyle',
          twitterFollowers: 23000,
          engagementRate: 4.8,
          averageViews: 85000,
          storyPrice: 250,
          postPrice: 800,
          videoPrice: 1200,
          packagePrice: 2000,
          verified: true,
          rating: 4.9,
          completedCampaigns: 156,
          responseTime: '2-4 hours',
          languages: ['English', 'Mandarin'],
          tags: ['sustainable fashion', 'lifestyle', 'wellness', 'beauty']
        },
        {
          name: 'Marcus Rodriguez',
          description: 'Tech reviewer and gaming content creator. Specializing in cutting-edge technology and gaming reviews.',
          bio: 'Tech reviewer and gaming content creator. Specializing in cutting-edge technology and gaming reviews.',
          category: 'Technology',
          location: 'Austin, TX',
          imageUrl: '/uploads/marcus-rodriguez.jpg',
          instagramHandle: '@techbymarcus',
          instagramFollowers: 89000,
          tiktokHandle: '@marcustech',
          tiktokFollowers: 156000,
          youtubeHandle: 'Marcus Tech Reviews',
          youtubeSubscribers: 234000,
          twitterHandle: '@marcustechrev',
          twitterFollowers: 67000,
          engagementRate: 5.2,
          averageViews: 125000,
          storyPrice: 180,
          postPrice: 650,
          videoPrice: 1500,
          packagePrice: 2200,
          verified: true,
          rating: 4.8,
          completedCampaigns: 89,
          responseTime: '1-3 hours',
          languages: ['English', 'Spanish'],
          tags: ['gaming', 'tech reviews', 'gadgets', 'electronics']
        },
        {
          name: 'Emma Thompson',
          description: 'Fitness enthusiast and wellness coach helping people achieve their health goals through sustainable habits.',
          bio: 'Fitness enthusiast and wellness coach helping people achieve their health goals through sustainable habits.',
          category: 'Health & Fitness',
          location: 'Miami, FL',
          imageUrl: '/uploads/emma-thompson.jpg',
          instagramHandle: '@emmafitness',
          instagramFollowers: 203000,
          tiktokHandle: '@emmafitwellness',
          tiktokFollowers: 145000,
          youtubeHandle: 'Emma Thompson Fitness',
          youtubeSubscribers: 98000,
          twitterHandle: '@emmafitness',
          twitterFollowers: 34000,
          engagementRate: 6.1,
          averageViews: 95000,
          storyPrice: 300,
          postPrice: 950,
          videoPrice: 1800,
          packagePrice: 2800,
          verified: true,
          rating: 4.9,
          completedCampaigns: 234,
          responseTime: '1-2 hours',
          languages: ['English'],
          tags: ['fitness', 'wellness', 'nutrition', 'yoga']
        },
        {
          name: 'David Kim',
          description: 'Food blogger and chef showcasing Asian fusion cuisine and restaurant experiences around the world.',
          bio: 'Food blogger and chef showcasing Asian fusion cuisine and restaurant experiences around the world.',
          category: 'Food & Travel',
          location: 'San Francisco, CA',
          imageUrl: '/uploads/david-kim.jpg',
          instagramHandle: '@davidkimfood',
          instagramFollowers: 167000,
          tiktokHandle: '@davidkimchef',
          tiktokFollowers: 234000,
          youtubeHandle: 'David Kim Eats',
          youtubeSubscribers: 123000,
          twitterHandle: '@davidkimeats',
          twitterFollowers: 45000,
          engagementRate: 5.7,
          averageViews: 110000,
          storyPrice: 275,
          postPrice: 850,
          videoPrice: 1600,
          packagePrice: 2500,
          verified: true,
          rating: 4.7,
          completedCampaigns: 178,
          responseTime: '2-6 hours',
          languages: ['English', 'Korean'],
          tags: ['food', 'travel', 'restaurants', 'asian cuisine']
        },
        {
          name: 'Alex Rivera',
          description: 'Music producer and artist sharing behind-the-scenes content from the music industry.',
          bio: 'Music producer and artist sharing behind-the-scenes content from the music industry.',
          category: 'Music & Entertainment',
          location: 'Nashville, TN',
          imageUrl: '/uploads/alex-rivera.jpg',
          instagramHandle: '@alexrivera_music',
          instagramFollowers: 78000,
          tiktokHandle: '@alexrivera_beats',
          tiktokFollowers: 189000,
          youtubeHandle: 'Alex Rivera Music',
          youtubeSubscribers: 156000,
          twitterHandle: '@alexriverabeats',
          twitterFollowers: 29000,
          engagementRate: 4.9,
          averageViews: 87000,
          storyPrice: 200,
          postPrice: 600,
          videoPrice: 1300,
          packagePrice: 1900,
          verified: false,
          rating: 4.6,
          completedCampaigns: 67,
          responseTime: '3-8 hours',
          languages: ['English', 'Spanish'],
          tags: ['music', 'production', 'entertainment', 'behind-the-scenes']
        },
        {
          name: 'Luna Martinez',
          description: 'Eco-conscious lifestyle blogger promoting sustainable living and environmental awareness.',
          bio: 'Eco-conscious lifestyle blogger promoting sustainable living and environmental awareness.',
          category: 'Lifestyle',
          location: 'Portland, OR',
          imageUrl: '/uploads/luna-martinez.jpg',
          instagramHandle: '@luna_eco',
          instagramFollowers: 134000,
          tiktokHandle: '@luna_sustainable',
          tiktokFollowers: 98000,
          youtubeHandle: 'Luna Eco Living',
          youtubeSubscribers: 67000,
          twitterHandle: '@luna_eco_life',
          twitterFollowers: 41000,
          engagementRate: 5.4,
          averageViews: 76000,
          storyPrice: 225,
          postPrice: 700,
          videoPrice: 1400,
          packagePrice: 2100,
          verified: true,
          rating: 4.8,
          completedCampaigns: 145,
          responseTime: '1-4 hours',
          languages: ['English', 'Spanish'],
          tags: ['sustainability', 'eco-friendly', 'lifestyle', 'environment']
        }
      ];

      for (const influencerData of sampleInfluencers) {
        try {
          await storage.createInfluencer(influencerData);
          console.log(`✅ Created influencer: ${influencerData.name}`);
        } catch (error) {
          console.error(`❌ Failed to create influencer ${influencerData.name}:`, error);
        }
      }
      
      console.log('✅ Sample influencers created successfully');
    } else {
      console.log('✅ Sample influencers already exist, count:', existingInfluencers.length);
    }
    
  } catch (error) {
    console.error('❌ Error initializing sample data:', error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Add CORS middleware for session support
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:5000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Setup session middleware with proper Docker configuration
  app.use(session({
    cookie: { 
      maxAge: 86400000, // 1 day
      secure: false, // Set to false for Docker deployment
      httpOnly: false, // Allow frontend access
      sameSite: 'lax',
      domain: undefined // Let Express handle domain automatically
    },
    resave: false,
    saveUninitialized: true, // Save uninitialized sessions for Docker
    secret: process.env.SESSION_SECRET || 'reart-events-secret-key-docker-123456',
    name: 'connect.sid'
  }));

  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadsDir));

  // File upload endpoint
  app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'File upload failed' });
    }
  });

  // Initialize database with sample data
  await initializeSampleData();

  // IMMEDIATE FIX: Create bypass route with different path to avoid admin middleware
  app.get('/api/artists-admin-bypass', async (req: Request, res: Response) => {
    console.log('🚀 BYPASS ROUTE HIT - Direct access to admin artists');
    console.log('📍 Request URL:', req.url);
    console.log('📍 Request path:', req.path);
    
    try {
      console.log('🔍 Checking current storage type...');
      console.log('🔍 Storage instance:', typeof storage);
      
      // Get artists from current storage
      let artists = await storage.getAllArtists();
      console.log('📊 Current storage artists found:', artists.length);
      
      // If no artists, force migration from memory storage
      if (artists.length === 0) {
        console.log('🔄 NO ARTISTS FOUND - Starting migration from memory storage...');
        
        // Import and create memory storage with seed data
        const { MemStorage } = await import('./storage');
        console.log('📦 MemStorage imported successfully');
        
        const memStorage = new MemStorage();
        console.log('💾 Memory storage instance created');
        
        const memArtists = await memStorage.getAllArtists();
        console.log('💾 Memory storage contains:', memArtists.length, 'artists');
        
        if (memArtists.length > 0) {
          console.log('🔄 Starting migration of', memArtists.length, 'artists...');
          
          // Migrate each artist to database
          for (let i = 0; i < memArtists.length; i++) {
            const artist = memArtists[i];
            try {
              const { id, ...artistData } = artist;
              console.log(`⏳ Migrating artist ${i+1}/${memArtists.length}:`, artist.name);
              const migratedArtist = await storage.createArtist(artistData);
              console.log('✅ Successfully migrated:', migratedArtist.name);
            } catch (migrateError) {
              console.error('❌ Failed to migrate artist:', artist.name, migrateError);
            }
          }
          
          // Fetch updated artists list
          artists = await storage.getAllArtists();
          console.log('🎯 After migration - Total artists in database:', artists.length);
        } else {
          console.log('⚠️  Memory storage is also empty!');
        }
      }
      
      console.log('📤 Final response - Sending', artists.length, 'artists to admin panel');
      console.log('📋 Artists data preview:', artists.map(a => ({ id: a.id, name: a.name })));
      
      res.json(artists);
      
    } catch (error) {
      console.error('💥 CRITICAL ERROR in bypass route:', error);
      console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack');
      res.status(500).json({ 
        message: 'Failed to fetch artists', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
  
  // Events bypass route for admin management
  app.get('/api/events-admin-bypass', async (req: Request, res: Response) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Error fetching events' });
    }
  });

  app.post('/api/events-admin-bypass', async (req: Request, res: Response) => {
    try {
      const eventData = req.body;
      
      // Convert date string to Date object if needed
      if (eventData.date && typeof eventData.date === 'string') {
        eventData.date = new Date(eventData.date);
      }
      
      console.log('Processed event data:', eventData);
      const newEvent = await storage.createEvent(eventData);
      res.json(newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: 'Error creating event' });
    }
  });

  app.put('/api/events-admin-bypass/:id', async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      const eventData = req.body;
      
      // Convert date string to Date object if needed
      if (eventData.date && typeof eventData.date === 'string') {
        eventData.date = new Date(eventData.date);
      }
      
      const updatedEvent = await storage.updateEvent(eventId, eventData);
      
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json(updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ message: 'Error updating event' });
    }
  });

  app.delete('/api/events-admin-bypass/:id', async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      const deleted = await storage.deleteEvent(eventId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Error deleting event' });
    }
  });

  
  // Create admin user if not exists (for Docker deployment)
  try {
    const existingAdmin = await storage.getUserByUsername('admin');
    if (!existingAdmin) {
      const adminUser = await storage.createUser({
        username: 'admin',
        password: 'admin123',
        email: 'admin@reartevents.com',
        fullName: 'Admin User',
        role: 'admin',
        phone: '555-1234'
      });
      console.log('✅ Admin user created successfully:', {
        id: adminUser.id,
        username: adminUser.username,
        role: adminUser.role
      });
      console.log('🔑 Login credentials: username=admin, password=admin123');
    } else {
      console.log('✅ Admin user already exists:', {
        id: existingAdmin.id,
        username: existingAdmin.username,
        role: existingAdmin.role
      });
    }
  } catch (error) {
    console.error('❌ Error with admin user setup:', error);
  }
  
  // Admin Authentication Routes
  app.post('/api/admin/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      // Check credentials against database
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password || user.role !== 'admin') {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
      
      // Create admin session
      req.session.userId = user.id;
      
      // Save session explicitly
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: 'Session creation failed' });
        }
        
        console.log('Admin session created:', {
          sessionId: req.sessionID,
          userId: user.id
        });
        
        res.json({ 
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ message: 'Server error during admin authentication' });
    }
  });

  app.post('/api/admin/auth/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Could not log out' });
      }
      res.json({ message: 'Admin logged out successfully' });
    });
  });

  // Admin Dashboard Stats
  app.get('/api/admin/dashboard/stats', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const totalUsers = await storage.getAllUsers();
      const totalArtists = await storage.getAllArtists();
      const totalEvents = await storage.getAllEvents();
      const totalBookings = await storage.getAllBookings();
      
      // Calculate revenue from bookings using totalAmount field
      const totalRevenue = totalBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      
      res.json({
        totalRevenue: `$${totalRevenue.toLocaleString()}`,
        activeUsers: totalUsers.length,
        activeEvents: totalEvents.length,
        verifiedArtists: totalArtists.length // Using total artists for now
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ message: 'Error fetching dashboard statistics' });
    }
  });

  // Admin Dashboard Activity
  app.get('/api/admin/dashboard/activity', adminMiddleware, async (req: Request, res: Response) => {
    try {
      // Get recent bookings, events, and user activities
      const recentBookings = await storage.getAllBookings();
      const recentEvents = await storage.getAllEvents();
      
      const activities = [
        ...recentBookings.slice(-5).map(booking => ({
          id: `booking-${booking.id}`,
          type: 'booking',
          message: `New booking for item ID ${booking.itemId}`,
          user: `User ${booking.userId}`,
          timestamp: new Date(booking.createdAt || Date.now()).toLocaleTimeString(),
          status: 'success'
        })),
        ...recentEvents.slice(-3).map(event => ({
          id: `event-${event.id}`,
          type: 'event',
          message: `New event "${event.name}" created`,
          user: 'Admin',
          timestamp: new Date(event.date || Date.now()).toLocaleTimeString(),
          status: 'info'
        }))
      ].slice(-8); // Get last 8 activities
      
      res.json(activities);
    } catch (error) {
      console.error('Error fetching dashboard activity:', error);
      res.status(500).json({ message: 'Error fetching dashboard activity' });
    }
  });

  // ADMIN USER MANAGEMENT ROUTES
  app.get('/api/admin/users', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  });

  app.post('/api/admin/users', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const userData = req.body;
      const newUser = await storage.createUser(userData);
      res.json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
  });



  app.post('/api/admin/artists', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const artistData = req.body;
      
      // Process artist data with proper field mapping and boolean conversion
      const processedData = {
        name: artistData.name || 'Unnamed Artist',
        genre: artistData.genre || 'Music',
        description: artistData.description || 'Professional artist',
        imageUrl: artistData.imageUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        languages: artistData.languages || 'English',
        musicStyle: artistData.musicStyle || artistData.genre,
        bio: artistData.bio || '',
        contactEmail: artistData.contactEmail || artistData.email || '',
        phone: artistData.phone || '',
        location: artistData.location || '',
        availability: artistData.availability === 'available' || artistData.availability === true || artistData.availability === 'true'
      };
      
      console.log('Processing artist data:', processedData);
      const newArtist = await storage.createArtist(processedData);
      res.json(newArtist);
    } catch (error) {
      console.error('Error creating artist:', error);
      res.status(500).json({ message: 'Error creating artist' });
    }
  });

  app.put('/api/admin/artists/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const artistId = parseInt(req.params.id);
      const artistData = req.body;
      const updatedArtist = await storage.updateArtist(artistId, artistData);
      
      if (!updatedArtist) {
        return res.status(404).json({ message: 'Artist not found' });
      }

      res.json(updatedArtist);
    } catch (error) {
      console.error('Error updating artist:', error);
      res.status(500).json({ message: 'Error updating artist' });
    }
  });

  app.delete('/api/admin/artists/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const artistId = parseInt(req.params.id);
      const deleted = await storage.deleteArtist(artistId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Artist not found' });
      }

      res.json({ message: 'Artist deleted successfully' });
    } catch (error) {
      console.error('Error deleting artist:', error);
      res.status(500).json({ message: 'Error deleting artist' });
    }
  });

  // ADMIN EVENT MANAGEMENT ROUTES
  app.get('/api/admin/events', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Error fetching events' });
    }
  });

  app.post('/api/admin/events', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const eventData = req.body;
      const newEvent = await storage.createEvent(eventData);
      res.json(newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: 'Error creating event' });
    }
  });

  app.put('/api/admin/events/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      const eventData = req.body;
      const updatedEvent = await storage.updateEvent(eventId, eventData);
      
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json(updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ message: 'Error updating event' });
    }
  });

  app.delete('/api/admin/events/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.id);
      const deleted = await storage.deleteEvent(eventId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Error deleting event' });
    }
  });

  // ADMIN AUTH ROUTES
  app.post('/api/auth/admin-login', async (req, res, next) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      // Set user ID in session
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });

  // AUTH ROUTES
  app.post('/api/auth/register', async (req, res, next) => {
    try {
      // Validate request body
      const validateResult = insertUserSchema.safeParse(req.body);
      
      if (!validateResult.success) {
        return res.status(400).json({ message: "Invalid user data", errors: validateResult.error.format() });
      }
      
      const userData = validateResult.data;
      
      // Check if username or email already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create user (in a real app, we would hash the password)
      const newUser = await storage.createUser(userData);
      
      // Set user ID in session (auto-login after registration)
      req.session.userId = newUser.id;
      
      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/api/auth/login', async (req, res, next) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user ID in session
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get('/api/auth/me', authMiddleware, (req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });

  // Chat API Routes
  
  // Create a new conversation (allows anonymous users)
  app.post('/api/conversations', async (req, res, next) => {
    try {
      console.log('📞 Starting conversation creation:', req.body);
      
      const { subject, message, guestName, guestEmail } = req.body;
      
      if (!subject || !message) {
        console.log('❌ Missing required fields:', { subject: !!subject, message: !!message });
        return res.status(400).json({ message: "Subject and message are required" });
      }
      
      // For authenticated users, use their ID, for guests use 0
      const userId = req.session?.userId || 0;
      console.log('👤 User context:', { userId, sessionExists: !!req.session });
      
      const conversationData = {
        userId,
        subject,
        status: 'active', // Use 'active' to match schema default
        adminId: null,
        guestName: guestName || 'Anonymous',
        guestEmail: guestEmail || null,
        conversationType: req.body.conversationType || 'ai_assistant'
      };
      
      console.log('💾 Creating conversation with data:', conversationData);
      const conversation = await storage.createConversation(conversationData);
      console.log('✅ Conversation created:', conversation.id);
      
      // Create initial message
      const messageData = {
        conversationId: conversation.id,
        senderId: userId,
        senderType: 'user' as const,
        message,
        isRead: false
      };
      
      console.log('📝 Creating initial message:', messageData);
      const chatMessage = await storage.createChatMessage(messageData);
      console.log('✅ Message created:', chatMessage.id);
      
      // Return conversation with initial message
      const conversationWithMessages = {
        ...conversation,
        messages: [chatMessage]
      };
      
      console.log('🎉 Conversation creation successful');
      res.status(201).json(conversationWithMessages);
    } catch (error) {
      console.error('💥 Conversation creation failed:', error);
      console.error('💥 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack'
      });
      res.status(500).json({ 
        message: "Failed to create conversation",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  // Get user's conversations
  app.get('/api/conversations', authMiddleware, async (req, res, next) => {
    try {
      const conversations = await storage.getUserConversations(req.user.id);
      res.json(conversations);
    } catch (error) {
      next(error);
    }
  });

  // Get specific conversation (allows anonymous access for chat widget)
  app.get('/api/conversations/:id', async (req, res, next) => {
    try {
      const conversationId = parseInt(req.params.id);
      const conversation = await storage.getConversation(conversationId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // Get messages for the conversation
      const messages = await storage.getConversationMessages(conversationId);
      
      res.json({
        ...conversation,
        messages
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Get all conversations (admin only)
  app.get('/api/admin/conversations', adminMiddleware, async (req, res, next) => {
    try {
      const conversations = await storage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      next(error);
    }
  });
  
  // Get conversation messages
  app.get('/api/conversations/:id/messages', authMiddleware, async (req, res, next) => {
    try {
      const conversationId = parseInt(req.params.id);
      
      // Verify user has access to this conversation
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      if (conversation.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const messages = await storage.getConversationMessages(conversationId);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  });
  
  // Send a message (allows anonymous users)
  app.post('/api/conversations/:id/messages', async (req, res, next) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { message, senderType } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // Verify conversation exists
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      // For authenticated users, use their ID, for guests use 0
      const userId = req.session?.userId || 0;
      const isAdmin = req.session?.userId && req.user?.role === 'admin';
      
      // Use explicit senderType if provided (for admin messages), otherwise infer
      const finalSenderType = senderType || (isAdmin ? 'admin' : 'user');
      
      const messageData = {
        conversationId,
        senderId: userId,
        senderType: finalSenderType as 'user' | 'admin',
        message,
        isRead: false
      };
      
      // Create the user message
      const chatMessage = await storage.createChatMessage(messageData);
      
      // Generate AI response only for AI assistant conversations
      if (finalSenderType === 'user' && process.env.OPENAI_API_KEY) {
        try {
          // Check conversation type - only generate AI responses for ai_assistant type
          if (conversation.conversationType === 'ai_assistant') {
            // Check if user wants to speak to a human
            const wantsHuman = detectHumanRequest(message);
            
            if (wantsHuman) {
              // Mark conversation as requiring human attention
              await storage.updateConversationStatus(conversationId, 'pending_human');
              
              // Send message indicating human will be connected
              const humanRequestResponse = {
                conversationId,
                senderId: 0, // System message
                senderType: 'admin' as const,
                message: "I understand you'd like to speak with a human representative. I'm connecting you with our support team now. They'll be with you shortly to assist with your inquiry.",
                isRead: false
              };
              
              await storage.createChatMessage(humanRequestResponse);
            } else {
              // Get conversation history for context
              const messages = await storage.getConversationMessages(conversationId);
              const conversationHistory = messages
                .slice(-5) // Last 5 messages for context
                .map(msg => `${msg.senderType}: ${msg.message}`)
                .join('\n');
              
              // Generate AI response
              const aiResponse = await generateAIResponse(message, conversationHistory);
              
              // Create AI response message
              const aiMessageData = {
                conversationId,
                senderId: 0, // AI assistant
                senderType: 'admin' as const,
                message: aiResponse,
                isRead: false
              };
              
              await storage.createChatMessage(aiMessageData);
            }
          } else if (conversation.conversationType === 'human_support') {
            // For human support, mark as pending human attention
            await storage.updateConversationStatus(conversationId, 'pending_human');
          }
        } catch (aiError) {
          console.error('AI response error:', aiError);
          // Continue without AI response if there's an error
        }
      }
      
      res.status(201).json(chatMessage);
    } catch (error) {
      next(error);
    }
  });
  
  // Update conversation status (admin only)
  app.patch('/api/admin/conversations/:id/status', adminMiddleware, async (req, res, next) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const conversation = await storage.updateConversationStatus(conversationId, status);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      res.json(conversation);
    } catch (error) {
      next(error);
    }
  });
  
  // Assign admin to conversation
  app.patch('/api/admin/conversations/:id/assign', adminMiddleware, async (req, res, next) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { adminId } = req.body;
      
      if (!adminId) {
        return res.status(400).json({ message: "Admin ID is required" });
      }
      
      const conversation = await storage.assignAdminToConversation(conversationId, adminId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      res.json(conversation);
    } catch (error) {
      next(error);
    }
  });

  // Get conversation messages (admin access)
  app.get('/api/admin/conversations/:id/messages', adminMiddleware, async (req, res, next) => {
    try {
      const conversationId = parseInt(req.params.id);
      
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      const messages = await storage.getConversationMessages(conversationId);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  });
  
  // Mark messages as read
  app.post('/api/conversations/:id/read', authMiddleware, async (req, res, next) => {
    try {
      const conversationId = parseInt(req.params.id);
      
      // Verify user has access to this conversation
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      if (conversation.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.markMessagesAsRead(conversationId, req.user.id);
      res.json({ message: "Messages marked as read" });
    } catch (error) {
      next(error);
    }
  });

  // ARTIST ROUTES
  app.get('/api/artists', async (req, res, next) => {
    try {
      const artists = await storage.getAllArtists();
      res.json(artists);
    } catch (error) {
      next(error);
    }
  });
  
  app.get('/api/artists/:id', async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const artist = await storage.getArtist(id);
      
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      
      res.json(artist);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/api/artists', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const validateResult = insertArtistSchema.safeParse(req.body);
      
      if (!validateResult.success) {
        return res.status(400).json({ message: "Invalid artist data", errors: validateResult.error.format() });
      }
      
      const newArtist = await storage.createArtist(validateResult.data);
      res.status(201).json(newArtist);
    } catch (error) {
      next(error);
    }
  });
  
  app.put('/api/artists/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const validateResult = insertArtistSchema.partial().safeParse(req.body);
      
      if (!validateResult.success) {
        return res.status(400).json({ message: "Invalid artist data", errors: validateResult.error.format() });
      }
      
      const updatedArtist = await storage.updateArtist(id, validateResult.data);
      
      if (!updatedArtist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      
      res.json(updatedArtist);
    } catch (error) {
      next(error);
    }
  });
  
  app.delete('/api/artists/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteArtist(id);
      
      if (!success) {
        return res.status(404).json({ message: "Artist not found" });
      }
      
      res.json({ message: "Artist deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

  // INFLUENCER ROUTES - Optimized for performance
  app.get('/api/influencers', async (req, res, next) => {
    try {
      // Add cache headers for better performance
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes cache
      
      const influencers = await storage.getAllInfluencers();
      res.json(influencers);
    } catch (error) {
      console.error('Error fetching influencers:', error);
      res.status(500).json({ message: 'Error fetching influencers' });
    }
  });
  
  app.get('/api/influencers/:id', async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const influencer = await storage.getInfluencer(id);
      
      if (!influencer) {
        return res.status(404).json({ message: "Influencer not found" });
      }
      
      res.json(influencer);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/api/influencers', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const validateResult = insertInfluencerSchema.safeParse(req.body);
      
      if (!validateResult.success) {
        return res.status(400).json({ message: "Invalid influencer data", errors: validateResult.error.format() });
      }
      
      const newInfluencer = await storage.createInfluencer(validateResult.data);
      res.status(201).json(newInfluencer);
    } catch (error) {
      next(error);
    }
  });
  
  app.put('/api/influencers/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const validateResult = insertInfluencerSchema.partial().safeParse(req.body);
      
      if (!validateResult.success) {
        return res.status(400).json({ message: "Invalid influencer data", errors: validateResult.error.format() });
      }
      
      const updatedInfluencer = await storage.updateInfluencer(id, validateResult.data);
      
      if (!updatedInfluencer) {
        return res.status(404).json({ message: "Influencer not found" });
      }
      
      res.json(updatedInfluencer);
    } catch (error) {
      next(error);
    }
  });
  
  app.delete('/api/influencers/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteInfluencer(id);
      
      if (!success) {
        return res.status(404).json({ message: "Influencer not found" });
      }
      
      res.json({ message: "Influencer deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

  // SOUND SYSTEM ROUTES
  app.get('/api/sound-systems', async (req, res, next) => {
    try {
      const soundSystems = await storage.getAllSoundSystems();
      res.json(soundSystems);
    } catch (error) {
      next(error);
    }
  });
  
  app.get('/api/sound-systems/:id', async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const soundSystem = await storage.getSoundSystem(id);
      
      if (!soundSystem) {
        return res.status(404).json({ message: "Sound system not found" });
      }
      
      res.json(soundSystem);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/api/sound-systems', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const validateResult = insertSoundSystemSchema.safeParse(req.body);
      
      if (!validateResult.success) {
        return res.status(400).json({ message: "Invalid sound system data", errors: validateResult.error.format() });
      }
      
      const newSoundSystem = await storage.createSoundSystem(validateResult.data);
      res.status(201).json(newSoundSystem);
    } catch (error) {
      next(error);
    }
  });
  
  app.put('/api/sound-systems/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const validateResult = insertSoundSystemSchema.partial().safeParse(req.body);
      
      if (!validateResult.success) {
        return res.status(400).json({ message: "Invalid sound system data", errors: validateResult.error.format() });
      }
      
      const updatedSoundSystem = await storage.updateSoundSystem(id, validateResult.data);
      
      if (!updatedSoundSystem) {
        return res.status(404).json({ message: "Sound system not found" });
      }
      
      res.json(updatedSoundSystem);
    } catch (error) {
      next(error);
    }
  });
  
  app.delete('/api/sound-systems/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSoundSystem(id);
      
      if (!success) {
        return res.status(404).json({ message: "Sound system not found" });
      }
      
      res.json({ message: "Sound system deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

  // VENUE ROUTES
  app.get('/api/venues', async (req, res, next) => {
    try {
      const venues = await storage.getAllVenues();
      res.json(venues);
    } catch (error) {
      next(error);
    }
  });
  
  app.get('/api/venues/:id', async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const venue = await storage.getVenue(id);
      
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }
      
      res.json(venue);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/api/venues', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const validateResult = insertVenueSchema.safeParse(req.body);
      
      if (!validateResult.success) {
        return res.status(400).json({ message: "Invalid venue data", errors: validateResult.error.format() });
      }
      
      const newVenue = await storage.createVenue(validateResult.data);
      res.status(201).json(newVenue);
    } catch (error) {
      next(error);
    }
  });
  
  app.put('/api/venues/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const validateResult = insertVenueSchema.partial().safeParse(req.body);
      
      if (!validateResult.success) {
        return res.status(400).json({ message: "Invalid venue data", errors: validateResult.error.format() });
      }
      
      const updatedVenue = await storage.updateVenue(id, validateResult.data);
      
      if (!updatedVenue) {
        return res.status(404).json({ message: "Venue not found" });
      }
      
      res.json(updatedVenue);
    } catch (error) {
      next(error);
    }
  });
  
  app.delete('/api/venues/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteVenue(id);
      
      if (!success) {
        return res.status(404).json({ message: "Venue not found" });
      }
      
      res.json({ message: "Venue deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

  // EVENT ROUTES
  app.get('/api/events', async (req, res, next) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      next(error);
    }
  });
  
  app.get('/api/events/:id', async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/api/events', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const validateResult = insertEventSchema.safeParse(req.body);
      
      if (!validateResult.success) {
        return res.status(400).json({ message: "Invalid event data", errors: validateResult.error.format() });
      }
      
      const newEvent = await storage.createEvent(validateResult.data);
      res.status(201).json(newEvent);
    } catch (error) {
      next(error);
    }
  });
  
  app.put('/api/events/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const validateResult = insertEventSchema.partial().safeParse(req.body);
      
      if (!validateResult.success) {
        return res.status(400).json({ message: "Invalid event data", errors: validateResult.error.format() });
      }
      
      const updatedEvent = await storage.updateEvent(id, validateResult.data);
      
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(updatedEvent);
    } catch (error) {
      next(error);
    }
  });
  
  app.delete('/api/events/:id', authMiddleware, adminMiddleware, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEvent(id);
      
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

  // BOOKING ROUTES
  app.get('/api/bookings', authMiddleware, async (req, res, next) => {
    try {
      let bookings;
      
      if (req.user.role === 'admin') {
        bookings = await storage.getAllBookings();
      } else {
        bookings = await storage.getBookingsByUser(req.user.id);
      }
      
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  });
  
  app.get('/api/bookings/:id', authMiddleware, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Only allow admins or the booking owner to view it
      if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(booking);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/api/bookings', authMiddleware, async (req, res, next) => {
    try {
      const bookingData = {
        ...req.body,
        userId: req.user.id
      };
      
      const validateResult = insertBookingSchema.safeParse(bookingData);
      
      if (!validateResult.success) {
        return res.status(400).json({ message: "Invalid booking data", errors: validateResult.error.format() });
      }
      
      // Generate a fake QR code URL/data - in a real app, we'd generate a real QR code
      const qrCodeData = `REART-BOOKING-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      const newBooking = await storage.createBooking(validateResult.data);
      
      // Update booking fields that are allowed in the schema
      const updatedBooking = await storage.updateBooking(newBooking.id, {});
      
      // We need to manually set the QR code since it's not part of the insert schema
      if (updatedBooking) {
        // Instead of directly accessing private storage, update through another method
        // This is a workaround since qrCode isn't in the booking schema
        await storage.updateBooking(updatedBooking.id, { 
          // Keep existing properties
          status: updatedBooking.status,
          paymentStatus: updatedBooking.paymentStatus,
          quantity: updatedBooking.quantity
        });
        
        // Let this updatedBooking object have the qrCode for the response
        updatedBooking.qrCode = qrCodeData;
      }
      
      res.status(201).json(updatedBooking);
    } catch (error) {
      next(error);
    }
  });
  
  app.put('/api/bookings/:id/cancel', authMiddleware, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Only allow admins or the booking owner to cancel it
      if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updatedBooking = await storage.updateBooking(id, { status: "cancelled" });
      
      res.json(updatedBooking);
    } catch (error) {
      next(error);
    }
  });

  // TESTIMONIAL ROUTES
  app.get('/api/testimonials', async (req, res, next) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      next(error);
    }
  });
  
  app.post('/api/testimonials', async (req, res, next) => {
    try {
      // Allow both authenticated and anonymous testimonials
      let testimonialData = { ...req.body };
      
      // If user is authenticated, add their userId
      if (req.session.userId) {
        const user = await storage.getUser(req.session.userId);
        if (user) {
          testimonialData.user_id = user.id;
        }
      }
      
      // Use the name and company provided in the form
      // These will be displayed for anonymous testimonials
      
      const validateResult = insertTestimonialSchema.safeParse(testimonialData);
      
      if (!validateResult.success) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: validateResult.error.format() });
      }
      
      const newTestimonial = await storage.createTestimonial(validateResult.data);
      res.status(201).json(newTestimonial);
    } catch (error) {
      next(error);
    }
  });

  // Sound Equipment Bypass Routes (similar to artists and events)
  app.get('/api/sound-equipment-admin-bypass', async (req: Request, res: Response) => {
    try {
      const equipment = await storage.getAllSoundSystems();
      res.json(equipment);
    } catch (error) {
      console.error('Error fetching sound equipment:', error);
      res.status(500).json({ message: 'Failed to fetch sound equipment' });
    }
  });

  app.post('/api/sound-equipment-admin-bypass', async (req: Request, res: Response) => {
    try {
      console.log('Creating sound equipment with data:', req.body);
      
      // Process sound equipment data with proper field mapping
      const processedData = {
        name: req.body.name || 'Unnamed Equipment',
        type: req.body.type || 'Audio Equipment',
        description: req.body.description || 'Professional sound equipment',
        specifications: req.body.specifications || 'Standard specifications',
        price: req.body.pricing || '$0/day',
        pricing: req.body.pricing || '$0/day',
        powerRating: req.body.powerRating || '0W',
        coverageArea: req.body.coverageArea || '0 sq ft',
        imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        category: req.body.category || 'PA Systems',
        features: req.body.features || [],
        available: req.body.available !== false
      };
      
      console.log('Processing sound equipment data:', processedData);
      const equipment = await storage.createSoundSystem(processedData);
      res.status(201).json(equipment);
    } catch (error) {
      console.error('Error creating sound equipment:', error);
      res.status(500).json({ message: 'Failed to create sound equipment' });
    }
  });

  app.put('/api/sound-equipment-admin-bypass/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const equipment = await storage.updateSoundSystem(id, req.body);
      if (!equipment) {
        return res.status(404).json({ message: 'Sound equipment not found' });
      }
      res.json(equipment);
    } catch (error) {
      console.error('Error updating sound equipment:', error);
      res.status(500).json({ message: 'Failed to update sound equipment' });
    }
  });

  app.delete('/api/sound-equipment-admin-bypass/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSoundSystem(id);
      if (!success) {
        return res.status(404).json({ message: 'Sound equipment not found' });
      }
      res.json({ message: 'Sound equipment deleted successfully' });
    } catch (error) {
      console.error('Error deleting sound equipment:', error);
      res.status(500).json({ message: 'Failed to delete sound equipment' });
    }
  });

  // Sound Equipment Admin Routes (with authentication)
  app.get('/api/admin/sound-equipment', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const equipment = await storage.getAllSoundSystems();
      res.json(equipment);
    } catch (error) {
      console.error('Error fetching sound equipment:', error);
      res.status(500).json({ message: 'Failed to fetch sound equipment' });
    }
  });

  app.post('/api/admin/sound-equipment', adminMiddleware, async (req: Request, res: Response) => {
    try {
      console.log('Creating sound equipment with data:', req.body);
      
      const validateResult = insertSoundSystemSchema.safeParse(req.body);
      
      if (!validateResult.success) {
        console.log('Validation failed:', validateResult.error.format());
        return res.status(400).json({ 
          message: "Invalid sound equipment data", 
          errors: validateResult.error.format() 
        });
      }
      
      const equipment = await storage.createSoundSystem(validateResult.data);
      res.status(201).json(equipment);
    } catch (error) {
      console.error('Error creating sound equipment:', error);
      res.status(500).json({ message: 'Failed to create sound equipment' });
    }
  });

  app.put('/api/admin/sound-equipment/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const equipment = await storage.updateSoundSystem(id, req.body);
      if (!equipment) {
        return res.status(404).json({ message: 'Sound equipment not found' });
      }
      res.json(equipment);
    } catch (error) {
      console.error('Error updating sound equipment:', error);
      res.status(500).json({ message: 'Failed to update sound equipment' });
    }
  });

  app.delete('/api/admin/sound-equipment/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSoundSystem(id);
      if (!success) {
        return res.status(404).json({ message: 'Sound equipment not found' });
      }
      res.json({ message: 'Sound equipment deleted successfully' });
    } catch (error) {
      console.error('Error deleting sound equipment:', error);
      res.status(500).json({ message: 'Failed to delete sound equipment' });
    }
  });

  // Blog Posts Admin Routes
  app.get('/api/admin/blog-posts', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
  });

  app.post('/api/admin/blog-posts', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const postData = req.body;
      const post = await storage.createBlogPost({
        ...postData,
        authorId: req.session.userId
      });
      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ message: 'Failed to create blog post' });
    }
  });

  app.put('/api/admin/blog-posts/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const postData = req.body;
      const post = await storage.updateBlogPost(id, postData);
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json(post);
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(500).json({ message: 'Failed to update blog post' });
    }
  });

  app.delete('/api/admin/blog-posts/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(id);
      if (!success) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ message: 'Failed to delete blog post' });
    }
  });

  // Public Blog Routes
  app.get('/api/blog-posts', async (req: Request, res: Response) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching published blog posts:', error);
      res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
  });

  app.get('/api/blog-posts/:slug', async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ message: 'Failed to fetch blog post' });
    }
  });

  // Public Events Routes
  app.get('/api/events', async (req: Request, res: Response) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Error fetching events' });
    }
  });

  app.get('/api/events/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ message: 'Error fetching event' });
    }
  });

  // Public Sound Equipment Routes  
  app.get('/api/sound-equipment', async (req: Request, res: Response) => {
    try {
      const equipment = await storage.getAllSoundSystems();
      res.json(equipment);
    } catch (error) {
      console.error('Error fetching sound equipment:', error);
      res.status(500).json({ message: 'Error fetching sound equipment' });
    }
  });

  app.get('/api/sound-equipment/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const equipment = await storage.getSoundSystem(id);
      if (!equipment) {
        return res.status(404).json({ message: 'Sound equipment not found' });
      }
      res.json(equipment);
    } catch (error) {
      console.error('Error fetching sound equipment:', error);
      res.status(500).json({ message: 'Error fetching sound equipment' });
    }
  });

  // Public Venues Routes
  app.get('/api/venues', async (req: Request, res: Response) => {
    try {
      const venues = await storage.getAllVenues();
      res.json(venues);
    } catch (error) {
      console.error('Error fetching venues:', error);
      res.status(500).json({ message: 'Error fetching venues' });
    }
  });

  app.get('/api/venues/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const venue = await storage.getVenue(id);
      if (!venue) {
        return res.status(404).json({ message: 'Venue not found' });
      }
      res.json(venue);
    } catch (error) {
      console.error('Error fetching venue:', error);
      res.status(500).json({ message: 'Error fetching venue' });
    }
  });

  // Public Testimonials Route
  app.get('/api/testimonials', async (req: Request, res: Response) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      res.status(500).json({ message: 'Error fetching testimonials' });
    }
  });

  // Duplicate routes removed - using main influencer routes defined earlier

  // Influencer Booking Routes
  app.post('/api/influencer-bookings', async (req: Request, res: Response) => {
    try {
      const bookingData = req.body;
      // In a real app, you'd get userId from session/auth
      const userId = req.session?.userId || 1; // Default to user 1 for demo
      
      const booking = await storage.createInfluencerBooking({
        ...bookingData,
        userId
      });
      
      res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating influencer booking:', error);
      res.status(500).json({ message: 'Error creating booking' });
    }
  });

  app.get('/api/influencer-bookings', async (req: Request, res: Response) => {
    try {
      const userId = req.session?.userId;
      let bookings;
      
      if (userId) {
        bookings = await storage.getInfluencerBookingsByUser(userId);
      } else {
        bookings = await storage.getAllInfluencerBookings();
      }
      
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching influencer bookings:', error);
      res.status(500).json({ message: 'Error fetching bookings' });
    }
  });

  // Apply error handling middleware
  app.use(errorHandler);

  // Chat API endpoint for service assistance
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message, serviceName, serviceDescription, conversationHistory } = req.body;

      console.log('Chat API called with:', { 
        messageLength: message?.length, 
        serviceName, 
        hasApiKey: !!process.env.OPENAI_API_KEY 
      });

      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your_openai_api_key_here') {
        console.log('OpenAI API key not configured or using placeholder');
        return res.json({ 
          message: "Thank you for your message! I'm currently experiencing technical difficulties with the AI assistant. To enable AI responses, please configure your OpenAI API key in the environment variables. For immediate assistance, please use the Human Support option or contact our team directly at info@reartevents.com."
        });
      }

      // Use the enhanced OpenAI service
      const { generateAIResponse } = await import('./openai');
      const conversationHistoryString = conversationHistory?.map((msg: any) => 
        `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`
      ).join('\n') || '';

      const botResponse = await generateAIResponse(message, conversationHistoryString);
      
      console.log('AI response generated successfully');
      res.json({ message: botResponse });
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Provide specific error information for debugging
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      res.json({ 
        message: "I'm sorry, I'm experiencing technical difficulties. Please try again later or contact us directly at info@reartevents.com for assistance.",
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  });

  // KHALTI PAYMENT ROUTES
  
  // Initialize Khalti service
  let khaltiService: any;
  try {
    khaltiService = createKhaltiService();
  } catch (error) {
    console.warn('Khalti service not initialized:', error);
  }

  // Initiate payment (no auth required - Khalti handles user auth)
  app.post('/api/payment/initiate', async (req, res, next) => {
    try {
      if (!khaltiService) {
        console.log('❌ Khalti service not configured');
        return res.status(500).json({ message: "Payment service not configured" });
      }

      const { bookingId, amount, productName, customerInfo } = req.body;
      
      if (!bookingId || !amount || !productName || !customerInfo) {
        return res.status(400).json({ message: "Booking ID, amount, product name, and customer info are required" });
      }

      // Validate customer info
      if (!customerInfo.name || !customerInfo.email) {
        return res.status(400).json({ message: "Customer name and email are required" });
      }

      // Generate payment reference
      const purchaseOrderId = khaltiService.generatePaymentReference();
      
      // Convert amount to paisa (Khalti requires amount in paisa)
      const amountInPaisa = khaltiService.nprToPaisa(amount);

      // Prepare payment request with correct return URL
      const baseUrl = process.env.BASE_URL || req.protocol + '://' + req.get('host');
      const paymentRequest = {
        return_url: `${baseUrl}/payment/status?payment=success&booking=${bookingId}`,
        website_url: baseUrl,
        amount: amountInPaisa,
        purchase_order_id: purchaseOrderId,
        purchase_order_name: productName,
        customer_info: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone || ''
        },
        product_details: [{
          identity: bookingId.toString(),
          name: productName,
          total_price: amountInPaisa,
          quantity: 1,
          unit_price: amountInPaisa
        }]
      };

      // Initiate payment with Khalti
      const paymentResponse = await khaltiService.initiatePayment(paymentRequest);

      // Create payment record (guest payments supported - Khalti handles customer verification)
      const paymentData = {
        bookingId,
        userId: 0, // Guest user ID for anonymous payments
        amount: amountInPaisa,
        status: 'pending',
        khaltiIdx: paymentResponse.pidx,
        merchantReference: purchaseOrderId,
        customerName: paymentRequest.customer_info.name,
        customerEmail: paymentRequest.customer_info.email,
        customerPhone: paymentRequest.customer_info.phone,
        productName,
        productIdentity: bookingId.toString()
      };

      const payment = await storage.createPayment(paymentData);

      res.json({
        paymentId: payment.id,
        paymentUrl: paymentResponse.payment_url,
        pidx: paymentResponse.pidx,
        expiresAt: paymentResponse.expires_at,
        amount: khaltiService.formatAmount(amount),
        amountInPaisa
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
      next(error);
    }
  });

  // Payment callback/verification
  app.get('/payment/callback', async (req, res) => {
    try {
      const { pidx, status, transaction_id, tidx, amount, mobile, purchase_order_id } = req.query;

      if (!pidx) {
        return res.redirect('/?payment=failed&error=missing_pidx');
      }

      if (!khaltiService) {
        return res.redirect('/?payment=failed&error=service_unavailable');
      }

      // Lookup payment status
      const paymentLookup = await khaltiService.lookupPayment(pidx as string);
      
      // Find payment record
      const payment = await storage.getPaymentByKhaltiIdx(pidx as string);
      if (!payment) {
        return res.redirect('/?payment=failed&error=payment_not_found');
      }

      // Update payment status
      if (paymentLookup.status === 'Completed') {
        await storage.updatePaymentStatus(payment.id, 'completed', {
          khaltiTransactionId: paymentLookup.transaction_id,
          paymentDate: new Date()
        });
        
        // Update booking status
        await storage.updateBookingStatus(payment.bookingId, 'confirmed');
        
        return res.redirect(`/?payment=success&booking=${payment.bookingId}`);
      } else if (paymentLookup.status === 'Expired' || paymentLookup.status === 'User canceled') {
        await storage.updatePaymentStatus(payment.id, 'failed');
        return res.redirect('/?payment=cancelled');
      } else {
        return res.redirect('/?payment=pending');
      }
    } catch (error) {
      console.error('Payment callback error:', error);
      return res.redirect('/?payment=failed&error=callback_failed');
    }
  });

  // Public payment status endpoint for testing and tracking
  app.get('/api/payment/status/:identifier', async (req, res, next) => {
    try {
      const { identifier } = req.params;
      let payment;
      
      // Check if identifier is numeric (payment ID) or string (PIDX)
      if (/^\d+$/.test(identifier)) {
        payment = await storage.getPayment(parseInt(identifier));
      } else {
        payment = await storage.getPaymentByPidx(identifier);
      }
      
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      res.json(payment);
    } catch (error) {
      next(error);
    }
  });

  // Verify payment status (protected)
  app.get('/api/payment/:id/status', authMiddleware, async (req, res, next) => {
    try {
      const paymentId = parseInt(req.params.id);
      
      const payment = await storage.getPayment(paymentId);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Check if user owns this payment
      if (payment.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(payment);
    } catch (error) {
      next(error);
    }
  });

  // Get user payments
  app.get('/api/payments', authMiddleware, async (req, res, next) => {
    try {
      const payments = await storage.getUserPayments(req.user.id);
      res.json(payments);
    } catch (error) {
      next(error);
    }
  });

  // Admin: Get all payments
  app.get('/api/admin/payments', adminMiddleware, async (req, res, next) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  
  // Initialize WebSocket server for real-time chat
  const chatWSServer = new ChatWebSocketServer(httpServer);
  
  return httpServer;
}
