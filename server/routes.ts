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
    
    if (!session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await storage.getUser(session.userId);
    
    if (!user || user.role !== "admin") {
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
    cookie: { maxAge: 86400000 }, // 1 day
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'reart-events-secret'
  }));
  
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

  // ADMIN ARTIST MANAGEMENT ROUTES  
  app.get('/api/admin/artists', adminMiddleware, async (req: Request, res: Response) => {
    try {
      // Use the same storage instance as the public artists endpoint
      const artists = await storage.getAllArtists();
      console.log('Admin fetching artists:', artists.length, 'artists found');
      
      // If no artists in database storage, check memory storage
      if (artists.length === 0) {
        console.log('No artists found in database, checking memory storage...');
        // Initialize memory storage temporarily to migrate data
        const { MemStorage } = await import('./storage');
        const memStorage = new MemStorage();
        const memArtists = await memStorage.getAllArtists();
        console.log('Found', memArtists.length, 'artists in memory storage');
        
        // Migrate artists from memory to database
        for (const artist of memArtists) {
          const { id, ...artistData } = artist;
          await storage.createArtist(artistData);
        }
        
        // Fetch updated list
        const updatedArtists = await storage.getAllArtists();
        console.log('After migration:', updatedArtists.length, 'artists in database');
        res.json(updatedArtists);
      } else {
        res.json(artists);
      }
    } catch (error) {
      console.error('Error fetching artists for admin:', error);
      res.status(500).json({ message: 'Error fetching artists' });
    }
  });

  app.post('/api/admin/artists', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const artistData = req.body;
      const newArtist = await storage.createArtist(artistData);
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

  // Apply error handling middleware
  app.use(errorHandler);

  const httpServer = createServer(app);
  return httpServer;
}
