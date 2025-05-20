import { 
  users, type User, type InsertUser,
  artists, type Artist, type InsertArtist,
  influencers, type Influencer, type InsertInfluencer,
  soundSystems, type SoundSystem, type InsertSoundSystem,
  venues, type Venue, type InsertVenue,
  events, type Event, type InsertEvent,
  bookings, type Booking, type InsertBooking,
  testimonials, type Testimonial, type InsertTestimonial
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Artist methods
  getArtist(id: number): Promise<Artist | undefined>;
  getAllArtists(): Promise<Artist[]>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  updateArtist(id: number, artist: Partial<InsertArtist>): Promise<Artist | undefined>;
  deleteArtist(id: number): Promise<boolean>;

  // Influencer methods
  getInfluencer(id: number): Promise<Influencer | undefined>;
  getAllInfluencers(): Promise<Influencer[]>;
  createInfluencer(influencer: InsertInfluencer): Promise<Influencer>;
  updateInfluencer(id: number, influencer: Partial<InsertInfluencer>): Promise<Influencer | undefined>;
  deleteInfluencer(id: number): Promise<boolean>;

  // Sound System methods
  getSoundSystem(id: number): Promise<SoundSystem | undefined>;
  getAllSoundSystems(): Promise<SoundSystem[]>;
  createSoundSystem(sound: InsertSoundSystem): Promise<SoundSystem>;
  updateSoundSystem(id: number, sound: Partial<InsertSoundSystem>): Promise<SoundSystem | undefined>;
  deleteSoundSystem(id: number): Promise<boolean>;

  // Venue methods
  getVenue(id: number): Promise<Venue | undefined>;
  getAllVenues(): Promise<Venue[]>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  updateVenue(id: number, venue: Partial<InsertVenue>): Promise<Venue | undefined>;
  deleteVenue(id: number): Promise<boolean>;

  // Event methods
  getEvent(id: number): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;

  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
  deleteBooking(id: number): Promise<boolean>;

  // Testimonial methods
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private artists: Map<number, Artist>;
  private influencers: Map<number, Influencer>;
  private soundSystems: Map<number, SoundSystem>;
  private venues: Map<number, Venue>;
  private events: Map<number, Event>;
  private bookings: Map<number, Booking>;
  private testimonials: Map<number, Testimonial>;
  
  currentUserId: number;
  currentArtistId: number;
  currentInfluencerId: number;
  currentSoundSystemId: number;
  currentVenueId: number;
  currentEventId: number;
  currentBookingId: number;
  currentTestimonialId: number;

  constructor() {
    this.users = new Map();
    this.artists = new Map();
    this.influencers = new Map();
    this.soundSystems = new Map();
    this.venues = new Map();
    this.events = new Map();
    this.bookings = new Map();
    this.testimonials = new Map();

    this.currentUserId = 1;
    this.currentArtistId = 1;
    this.currentInfluencerId = 1;
    this.currentSoundSystemId = 1;
    this.currentVenueId = 1;
    this.currentEventId = 1;
    this.currentBookingId = 1;
    this.currentTestimonialId = 1;

    // Initialize with seed data
    this.seedData();
  }

  private seedData() {
    // Add admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@reartevents.com",
      fullName: "Admin User",
      role: "admin",
      phone: "555-1234"
    });

    // Add regular user
    this.createUser({
      username: "user",
      password: "user123",
      email: "user@example.com",
      fullName: "Sample User",
      role: "user",
      phone: "555-5678"
    });

    // Add artists
    this.createArtist({
      name: "DJ Alex",
      genre: "Electronic",
      description: "Renowned for energetic sets that blend house, techno, and electronic dance music.",
      imageUrl: "https://pixabay.com/get/gbaf65198fcd4e765400f2f2d30fce4c1d9cd47c37c3fc820aa75818b5146382ca62efe681ee4ce06ca8adcfa0ad0388df0219aafa6fe63b32390d06a5bf50b23_1280.jpg",
      rating: 5,
      price: 2000
    });

    this.createArtist({
      name: "Sophia Lee",
      genre: "Jazz & Soul",
      description: "Captivating vocalist with a soulful voice perfect for elegant events and intimate gatherings.",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      rating: 5,
      price: 1800
    });

    this.createArtist({
      name: "The Resonance",
      genre: "Rock Band",
      description: "A dynamic 4-piece band known for their versatile repertoire and high-energy performances.",
      imageUrl: "https://images.unsplash.com/photo-1598387993211-5c4c0fda4248?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      rating: 4,
      price: 2500
    });

    this.createArtist({
      name: "Aria Strings",
      genre: "Classical",
      description: "A sophisticated string quartet bringing elegance and refinement to weddings and formal events.",
      imageUrl: "https://images.unsplash.com/photo-1560365163-3e8d64e762ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      rating: 5,
      price: 1500
    });

    // Add Influencers
    this.createInfluencer({
      name: "Emma Style",
      category: "Fashion",
      description: "Fashion influencer with 2M+ followers across platforms. Known for trendsetting styles and brand partnerships.",
      imageUrl: "https://images.unsplash.com/photo-1603561596112-0a132b757442?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      socialStats: "Instagram: 1.5M, TikTok: 800K, YouTube: 500K",
      rating: 5,
      price: 3000
    });

    this.createInfluencer({
      name: "Tech with Mike",
      category: "Technology",
      description: "Tech reviewer and digital content creator with an engaged audience of tech enthusiasts.",
      imageUrl: "https://images.unsplash.com/photo-1582152629442-4a864303fb96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      socialStats: "YouTube: 1.2M, Instagram: 500K, Twitter: 300K",
      rating: 4,
      price: 2500
    });

    // Add Sound Systems
    this.createSoundSystem({
      name: "Premium PA System",
      type: "Complete PA",
      description: "Professional-grade sound system suitable for indoor venues up to 500 people.",
      imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      price: 1000
    });

    this.createSoundSystem({
      name: "Concert Audio Package",
      type: "Large Venue",
      description: "Comprehensive sound setup for concerts and large events with up to 2000 attendees.",
      imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      price: 2500
    });

    // Add Venues
    this.createVenue({
      name: "Crystal Ballroom",
      location: "Downtown, Metropolis City",
      description: "Elegant ballroom with crystal chandeliers and spacious dance floor, perfect for weddings and galas.",
      imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      capacity: 300,
      amenities: "Catering kitchen, Bridal suite, AV equipment, Valet parking",
      price: 5000
    });

    this.createVenue({
      name: "Garden Terrace",
      location: "West End, Metropolis City",
      description: "Beautiful outdoor venue with landscaped gardens and covered terrace area.",
      imageUrl: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      capacity: 150,
      amenities: "Garden lighting, Outdoor bar, Restroom facilities, Rain contingency",
      price: 3500
    });

    // Add Events
    this.createEvent({
      name: "Summer Music Festival",
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      description: "Annual music festival featuring top artists across multiple genres.",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      venue: "City Park Amphitheater",
      ticketPrice: 75,
      totalTickets: 2000,
      availableTickets: 1800
    });

    this.createEvent({
      name: "Tech Conference 2023",
      date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      description: "Leading industry conference featuring keynotes, workshops, and networking opportunities.",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      venue: "Metro Convention Center",
      ticketPrice: 200,
      totalTickets: 500,
      availableTickets: 350
    });

    // Add Testimonials
    this.createTestimonial({
      userId: 2,
      content: "Working with Reart Events for our corporate gala was seamless. Their attention to detail and ability to book top-tier talent transformed our event from standard to spectacular.",
      rating: 5
    });

    this.createTestimonial({
      userId: 2,
      content: "The sound system and venue we booked through Reart Events exceeded our expectations. The team was responsive, professional, and delivered exactly what we needed for our music festival.",
      rating: 5
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      role: insertUser.role || "user",
      phone: insertUser.phone || null
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Artist methods
  async getArtist(id: number): Promise<Artist | undefined> {
    return this.artists.get(id);
  }

  async getAllArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values());
  }

  async createArtist(artist: InsertArtist): Promise<Artist> {
    const id = this.currentArtistId++;
    const newArtist: Artist = { 
      ...artist, 
      id,
      rating: artist.rating || null
    };
    this.artists.set(id, newArtist);
    return newArtist;
  }

  async updateArtist(id: number, artist: Partial<InsertArtist>): Promise<Artist | undefined> {
    const existingArtist = this.artists.get(id);
    if (!existingArtist) return undefined;

    const updatedArtist = { ...existingArtist, ...artist };
    this.artists.set(id, updatedArtist);
    return updatedArtist;
  }

  async deleteArtist(id: number): Promise<boolean> {
    return this.artists.delete(id);
  }

  // Influencer methods
  async getInfluencer(id: number): Promise<Influencer | undefined> {
    return this.influencers.get(id);
  }

  async getAllInfluencers(): Promise<Influencer[]> {
    return Array.from(this.influencers.values());
  }

  async createInfluencer(influencer: InsertInfluencer): Promise<Influencer> {
    const id = this.currentInfluencerId++;
    const newInfluencer: Influencer = { 
      ...influencer, 
      id,
      rating: influencer.rating || null
    };
    this.influencers.set(id, newInfluencer);
    return newInfluencer;
  }

  async updateInfluencer(id: number, influencer: Partial<InsertInfluencer>): Promise<Influencer | undefined> {
    const existingInfluencer = this.influencers.get(id);
    if (!existingInfluencer) return undefined;

    const updatedInfluencer = { ...existingInfluencer, ...influencer };
    this.influencers.set(id, updatedInfluencer);
    return updatedInfluencer;
  }

  async deleteInfluencer(id: number): Promise<boolean> {
    return this.influencers.delete(id);
  }

  // Sound System methods
  async getSoundSystem(id: number): Promise<SoundSystem | undefined> {
    return this.soundSystems.get(id);
  }

  async getAllSoundSystems(): Promise<SoundSystem[]> {
    return Array.from(this.soundSystems.values());
  }

  async createSoundSystem(sound: InsertSoundSystem): Promise<SoundSystem> {
    const id = this.currentSoundSystemId++;
    const newSound: SoundSystem = { ...sound, id };
    this.soundSystems.set(id, newSound);
    return newSound;
  }

  async updateSoundSystem(id: number, sound: Partial<InsertSoundSystem>): Promise<SoundSystem | undefined> {
    const existingSound = this.soundSystems.get(id);
    if (!existingSound) return undefined;

    const updatedSound = { ...existingSound, ...sound };
    this.soundSystems.set(id, updatedSound);
    return updatedSound;
  }

  async deleteSoundSystem(id: number): Promise<boolean> {
    return this.soundSystems.delete(id);
  }

  // Venue methods
  async getVenue(id: number): Promise<Venue | undefined> {
    return this.venues.get(id);
  }

  async getAllVenues(): Promise<Venue[]> {
    return Array.from(this.venues.values());
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const id = this.currentVenueId++;
    const newVenue: Venue = { ...venue, id };
    this.venues.set(id, newVenue);
    return newVenue;
  }

  async updateVenue(id: number, venue: Partial<InsertVenue>): Promise<Venue | undefined> {
    const existingVenue = this.venues.get(id);
    if (!existingVenue) return undefined;

    const updatedVenue = { ...existingVenue, ...venue };
    this.venues.set(id, updatedVenue);
    return updatedVenue;
  }

  async deleteVenue(id: number): Promise<boolean> {
    return this.venues.delete(id);
  }

  // Event methods
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const newEvent: Event = { ...event, id };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return undefined;

    const updatedEvent = { ...existingEvent, ...event };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const createdAt = new Date();
    const newBooking: Booking = { 
      ...booking, 
      id, 
      createdAt, 
      status: booking.status || "pending",
      paymentStatus: booking.paymentStatus || "pending",
      quantity: booking.quantity || null,
      qrCode: null,
      additionalInfo: booking.additionalInfo || null
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined> {
    const existingBooking = this.bookings.get(id);
    if (!existingBooking) return undefined;

    const updatedBooking = { ...existingBooking, ...booking };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async deleteBooking(id: number): Promise<boolean> {
    return this.bookings.delete(id);
  }

  // Testimonial methods
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const createdAt = new Date();
    const newTestimonial: Testimonial = { ...testimonial, id, createdAt };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }
}

export const storage = new MemStorage();
