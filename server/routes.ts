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
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
};

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Internal server error" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Add express session
  const session = require('express-session');
  const MemoryStore = require('memorystore')(session);
  
  app.use(session({
    cookie: { maxAge: 86400000 }, // 1 day
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'reart-events-secret'
  }));
  


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
      
      // Update the booking with QR code
      const updatedBooking = await storage.updateBooking(newBooking.id, { ...newBooking, qrCode: qrCodeData });
      
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
  
  app.post('/api/testimonials', authMiddleware, async (req, res, next) => {
    try {
      const testimonialData = {
        ...req.body,
        userId: req.user.id
      };
      
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
