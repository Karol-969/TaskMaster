import { 
  users, type User, type InsertUser,
  artists, type Artist, type InsertArtist,
  influencers, type Influencer, type InsertInfluencer,
  soundSystems, type SoundSystem, type InsertSoundSystem,
  venues, type Venue, type InsertVenue,
  events, type Event, type InsertEvent,
  bookings, type Booking, type InsertBooking,
  testimonials, type Testimonial, type InsertTestimonial,
  homePageContent, type HomePageContent, type InsertHomePageContent,
  type BlogPost, type InsertBlogPost,
  type Conversation, type InsertConversation,
  type ChatMessage, type InsertChatMessage
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

  // Blog Post methods
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Chat methods
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: number): Promise<Conversation | undefined>;
  getUserConversations(userId: number): Promise<Conversation[]>;
  getAllConversations(): Promise<Conversation[]>;
  updateConversationStatus(id: number, status: string): Promise<Conversation | undefined>;
  assignAdminToConversation(conversationId: number, adminId: number): Promise<Conversation | undefined>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getConversationMessages(conversationId: number): Promise<ChatMessage[]>;
  markMessagesAsRead(conversationId: number, userId: number): Promise<void>;
  getUnreadMessageCount(conversationId: number): Promise<number>;

  // Payment methods
  createPayment(payment: any): Promise<any>;
  getPayment(id: number): Promise<any | undefined>;
  getPaymentByPidx(pidx: string): Promise<any | undefined>;
  updatePayment(id: number, payment: any): Promise<any | undefined>;
  getAllPayments(): Promise<any[]>;
  getUserPayments(userId: number): Promise<any[]>;
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

    // Add Comprehensive Influencer Portfolio
    this.createInfluencer({
      name: "Suhana Thapa",
      category: "Lifestyle",
      description: "Nepal's leading lifestyle influencer specializing in travel, fashion, and cultural content. Known for authentic storytelling and brand collaborations.",
      imageUrl: "https://images.unsplash.com/photo-1494790108755-2616c6d8e95a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      bio: "Passionate about showcasing Nepal's beauty and culture to the world. Collaborated with 50+ brands.",
      postPrice: 15000,
      storyPrice: 8000,
      videoPrice: 35000,
      packagePrice: 50000,
      phone: "+977-9841234567",
      contactEmail: "suhana@example.com",
      languages: ["Nepali", "English", "Hindi"],
      location: "Kathmandu",
      instagramFollowers: 280000,
      tiktokFollowers: 150000,
      youtubeSubscribers: 45000,
      engagementRate: 620, // 6.2% stored as 620
      averageViews: 25000,
      totalReach: 475000,
      rating: 5,
      totalCollaborations: 52,
      portfolioImages: [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      ],
      targetAudience: {
        ageRange: "18-35",
        gender: "60% Female, 40% Male",
        interests: ["Travel", "Fashion", "Culture", "Food"]
      },
      isVerified: true,
      isActive: true
    });

    this.createInfluencer({
      name: "Rajesh Gaming",
      category: "Gaming",
      description: "Top gaming content creator in Nepal with focus on mobile gaming, reviews, and esports content.",
      imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      bio: "Professional gamer and content creator. Specializing in mobile gaming content and esports commentary.",
      postPrice: 12000,
      storyPrice: 6000,
      videoPrice: 40000,
      packagePrice: 75000,
      phone: "+977-9856789012",
      contactEmail: "rajesh.gaming@example.com",
      languages: ["Nepali", "English"],
      location: "Pokhara",
      instagramFollowers: 180000,
      tiktokFollowers: 320000,
      youtubeSubscribers: 85000,
      engagementRate: 750, // 7.5% stored as 750
      averageViews: 35000,
      totalReach: 585000,
      rating: 4,
      totalCollaborations: 38,
      portfolioImages: [
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      ],
      targetAudience: {
        ageRange: "16-30",
        gender: "75% Male, 25% Female",
        interests: ["Gaming", "Technology", "Entertainment", "Esports"]
      },
      isVerified: true,
      isActive: true
    });

    this.createInfluencer({
      name: "Priya Cooking",
      category: "Food",
      description: "Authentic Nepali cuisine expert and cooking instructor. Promotes traditional recipes and modern twists.",
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      bio: "Traditional Nepali cooking with modern presentation. Teaching authentic recipes to preserve our culinary heritage.",
      postPrice: 10000,
      storyPrice: 5000,
      videoPrice: 25000,
      packagePrice: 40000,
      phone: "+977-9812345678",
      contactEmail: "priya.cooking@example.com",
      languages: ["Nepali", "English", "Hindi"],
      location: "Lalitpur",
      instagramFollowers: 120000,
      tiktokFollowers: 95000,
      youtubeSubscribers: 65000,
      engagementRate: 850, // 8.5% stored as 850
      averageViews: 28000,
      totalReach: 280000,
      rating: 5,
      totalCollaborations: 29,
      portfolioImages: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      ],
      targetAudience: {
        ageRange: "25-50",
        gender: "70% Female, 30% Male",
        interests: ["Cooking", "Food", "Culture", "Health"]
      },
      isVerified: true,
      isActive: true
    });

    this.createInfluencer({
      name: "Adventure Nepal",
      category: "Travel",
      description: "Adventure travel specialist promoting Nepal's trekking routes, adventure sports, and hidden gems.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      bio: "Exploring Nepal's hidden gems and promoting sustainable tourism. Professional mountain guide and photographer.",
      postPrice: 18000,
      storyPrice: 9000,
      videoPrice: 45000,
      packagePrice: 100000,
      phone: "+977-9823456789",
      contactEmail: "adventure.nepal@example.com",
      languages: ["Nepali", "English"],
      location: "Base Camp Areas",
      instagramFollowers: 350000,
      tiktokFollowers: 120000,
      youtubeSubscribers: 95000,
      engagementRate: 580, // 5.8% stored as 580
      averageViews: 42000,
      totalReach: 565000,
      rating: 4,
      totalCollaborations: 45,
      portfolioImages: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      ],
      targetAudience: {
        ageRange: "20-45",
        gender: "55% Male, 45% Female",
        interests: ["Adventure", "Travel", "Photography", "Nature"]
      },
      isVerified: true,
      isActive: true
    });

    this.createInfluencer({
      name: "Tech Guru Nepal",
      category: "Technology",
      description: "Technology reviewer and educator focusing on latest gadgets, software, and tech trends in Nepal.",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      bio: "Simplifying technology for everyone. Honest reviews and tutorials to help people make informed tech decisions.",
      postPrice: 14000,
      storyPrice: 7000,
      videoPrice: 35000,
      packagePrice: 80000,
      phone: "+977-9834567890",
      contactEmail: "techguru@example.com",
      languages: ["Nepali", "English"],
      location: "Kathmandu",
      instagramFollowers: 200000,
      tiktokFollowers: 180000,
      youtubeSubscribers: 120000,
      engagementRate: 680, // 6.8% stored as 680
      averageViews: 38000,
      totalReach: 500000,
      rating: 5,
      totalCollaborations: 56,
      portfolioImages: [
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      ],
      targetAudience: {
        ageRange: "18-40",
        gender: "65% Male, 35% Female",
        interests: ["Technology", "Gadgets", "Innovation", "Reviews"]
      },
      isVerified: true,
      isActive: true
    });

    this.createInfluencer({
      name: "Fitness Motivator",
      category: "Fitness",
      description: "Certified fitness trainer and wellness coach promoting healthy lifestyle and fitness routines.",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80",
      bio: "Certified personal trainer helping people achieve their fitness goals. Promoting healthy lifestyle choices.",
      postPrice: 11000,
      storyPrice: 6000,
      videoPrice: 28000,
      packagePrice: 60000,
      phone: "+977-9845678901",
      contactEmail: "fitness.motivator@example.com",
      languages: ["Nepali", "English"],
      location: "Kathmandu",
      instagramFollowers: 160000,
      tiktokFollowers: 140000,
      youtubeSubscribers: 55000,
      engagementRate: 920, // 9.2% stored as 920
      averageViews: 22000,
      totalReach: 355000,
      rating: 4,
      totalCollaborations: 33,
      portfolioImages: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        "https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
      ],
      targetAudience: {
        ageRange: "20-40",
        gender: "50% Male, 50% Female",
        interests: ["Fitness", "Health", "Wellness", "Sports"]
      },
      isVerified: false,
      isActive: true
    });

    // Add Sound Systems with enhanced data
    this.createSoundSystem({
      name: "Premium PA System",
      type: "Complete PA",
      description: "Professional-grade sound system suitable for indoor venues up to 500 people.",
      specifications: "2x 15-inch main speakers, 1x 18-inch subwoofer, digital mixer, wireless microphones",
      pricing: "NPR 8,000/day",
      powerRating: "2000W RMS",
      coverageArea: "500 people",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      category: "PA Systems",
      features: ["Digital mixing console", "Wireless microphones", "Full range coverage", "Professional setup"],
      available: true
    });

    this.createSoundSystem({
      name: "Concert Audio Package",
      type: "Line Array System",
      description: "High-power line array system for large outdoor events and concerts.",
      specifications: "4x line array elements, 2x subwoofers, 32-channel digital console, monitoring system",
      pricing: "NPR 25,000/day",
      powerRating: "8000W RMS",
      coverageArea: "2000+ people",
      image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      category: "PA Systems",
      features: ["Line array technology", "Long throw coverage", "Digital signal processing", "Professional engineer included"],
      available: true
    });

    this.createSoundSystem({
      name: "Digital Mixing Console",
      type: "32-Channel Mixer",
      description: "Professional digital mixing console with built-in effects and recording capabilities.",
      specifications: "32 input channels, 16 mix buses, built-in effects, USB recording interface",
      pricing: "NPR 3,500/day",
      powerRating: "100W",
      coverageArea: "Mixing control",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      category: "Mixers",
      features: ["Digital processing", "Built-in effects", "Scene recall", "Remote control"],
      available: true
    });

    this.createSoundSystem({
      name: "Wireless Microphone Set",
      type: "UHF Wireless System",
      description: "Professional wireless microphone system with 4 channels and rechargeable transmitters.",
      specifications: "4x wireless handheld mics, 4x bodypack transmitters, diversity receivers",
      pricing: "NPR 2,500/day",
      powerRating: "50mW",
      coverageArea: "100m range",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      category: "Microphones",
      features: ["UHF frequency", "Rechargeable batteries", "Diversity reception", "Low latency"],
      available: true
    });

    this.createSoundSystem({
      name: "Stage Monitor System",
      type: "Active Monitors",
      description: "Professional stage monitoring system for performers with individual mix control.",
      specifications: "6x 12-inch active monitors, monitor mixing console, in-ear system options",
      pricing: "NPR 4,000/day",
      powerRating: "1200W total",
      coverageArea: "Stage monitoring",
      image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      category: "Monitors",
      features: ["Individual control", "Low latency", "High SPL capability", "Feedback suppression"],
      available: true
    });

    this.createSoundSystem({
      name: "LED Stage Lighting Package",
      type: "Complete Lighting System",
      description: "Professional LED lighting system with DMX control for stage and event illumination.",
      specifications: "12x LED par lights, 4x moving head lights, DMX controller, haze machine",
      pricing: "NPR 6,000/day",
      powerRating: "2400W",
      coverageArea: "Full stage coverage",
      image: "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      category: "Lighting",
      features: ["RGB color mixing", "DMX control", "Moving head effects", "Synchronized operation"],
      available: true
    });

    this.createSoundSystem({
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

// Import the database storage implementation
import { DatabaseStorage } from "./database-storage";

// Switch from memory storage to database storage
export const storage = new DatabaseStorage();
