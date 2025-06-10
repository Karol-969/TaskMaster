import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertBookingSchema,
  insertTestimonialSchema,
  insertArtistSchema,
  insertInfluencerSchema,
  insertSoundSystemSchema,
  insertVenueSchema,
  insertEventSchema
} from "@shared/schema";
import { z } from "zod";

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

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Internal server error" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware FIRST
  app.use(session({
    cookie: { 
      maxAge: 86400000, // 1 day
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      sameSite: 'lax'
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'reart-events-secret',
    name: 'admin.session'
  }));

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

  
  // Create admin user if not exists (for development)
  try {
    const existingAdmin = await storage.getUserByUsername('admin');
    if (!existingAdmin) {
      await storage.createUser({
        username: 'admin',
        password: 'admin123',
        email: 'admin@reartevents.com',
        fullName: 'Admin User',
        role: 'admin',
        phone: '555-1234'
      });
      console.log('Admin user created: username=admin, password=admin123');
    }
  } catch (error) {
    console.log('Admin user already exists or error creating admin user');
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
      const session = req.session as any;
      session.userId = user.id;
      
      res.json({ 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
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

  // INFLUENCER ROUTES
  app.get('/api/influencers', async (req, res, next) => {
    try {
      const influencers = await storage.getAllInfluencers();
      res.json(influencers);
    } catch (error) {
      next(error);
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

  // Apply error handling middleware
  app.use(errorHandler);

  // Chat API endpoint for service assistance
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message, serviceName, serviceDescription, conversationHistory } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          message: "Chat service is currently unavailable. Please contact us directly for assistance with our services.",
          error: "API key not configured"
        });
      }

      // Import OpenAI (only when needed)
      const { OpenAI } = await import('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Create context for the service
      const systemPrompt = `You are a helpful customer service assistant for ReArt Events, a professional event management company. You are specifically helping with questions about the "${serviceName}" service.

Service Description: ${serviceDescription}

Company Background: ReArt Events is an event management company established in 2024. We specialize in live music arrangements, monthly artist booking, event concepts and management, and promotion/sponsorship services.

Guidelines:
- Be friendly, professional, and helpful
- Focus on the specific service the user is asking about
- Provide accurate information about ReArt Events services
- If asked about pricing, suggest contacting the company for a custom quote
- If asked about booking, guide them to contact the company
- Keep responses concise but informative
- Always maintain a professional tone
- If you don't know specific details, be honest and suggest they contact ReArt Events directly`;

      // Build conversation messages
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map((msg: any) => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: message }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: messages as any,
        max_tokens: 500,
        temperature: 0.7,
      });

      const botResponse = completion.choices[0]?.message?.content || 
        "I apologize, but I'm having trouble generating a response right now. Please try again or contact us directly.";

      res.json({ message: botResponse });
    } catch (error) {
      console.error('Chat API error:', error);
      res.status(500).json({ 
        message: "I'm sorry, I'm experiencing technical difficulties. Please try again later or contact us directly for assistance.",
        error: "Internal server error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
