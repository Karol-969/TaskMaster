import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User related schemas
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"), // user or admin
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Artist schema
export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  genre: text("genre").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: integer("rating").default(5),
  languages: text("languages"),
  musicStyle: text("music_style"),
  bio: text("bio"),
  totalShows: integer("total_shows").default(0),
  contactEmail: text("contact_email"),
  phone: text("phone"),
  location: text("location"),
  availability: boolean("availability").default(true),
});

export const insertArtistSchema = createInsertSchema(artists).omit({
  id: true,
});

// Enhanced Influencer schema
export const influencers = pgTable("influencers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // Fashion, Tech, Lifestyle, Food, Travel, Gaming, etc.
  description: text("description").notNull(),
  bio: text("bio"),
  imageUrl: text("image_url").notNull(),
  portfolioImages: text("portfolio_images").array().default([]),
  
  // Social Media Data
  instagramHandle: text("instagram_handle"),
  instagramFollowers: integer("instagram_followers").default(0),
  tiktokHandle: text("tiktok_handle"),
  tiktokFollowers: integer("tiktok_followers").default(0),
  youtubeHandle: text("youtube_handle"),
  youtubeSubscribers: integer("youtube_subscribers").default(0),
  twitterHandle: text("twitter_handle"),
  twitterFollowers: integer("twitter_followers").default(0),
  
  // Analytics & Performance
  engagementRate: integer("engagement_rate").default(0), // Stored as percentage * 100 (e.g., 3.5% = 350)
  averageViews: integer("average_views").default(0),
  totalReach: integer("total_reach").default(0),
  
  // Pricing Structure
  postPrice: integer("post_price").notNull(), // Price per sponsored post
  storyPrice: integer("story_price").default(0), // Price per story
  videoPrice: integer("video_price").default(0), // Price per video content
  packagePrice: integer("package_price").default(0), // Price for full campaign package
  
  // Professional Info
  contactEmail: text("contact_email"),
  phone: text("phone"),
  location: text("location"),
  languages: text("languages").array().default([]),
  
  // Status & Verification
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  rating: integer("rating").default(5),
  totalCollaborations: integer("total_collaborations").default(0),
  
  // Availability & Preferences
  availableDates: jsonb("available_dates"), // Calendar data
  collaborationTypes: text("collaboration_types").array().default([]), // Sponsored posts, reviews, events, etc.
  brandRestrictions: text("brand_restrictions").array().default([]),
  targetAudience: jsonb("target_audience"), // Demographics data
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Influencer Collaboration Bookings
export const influencerBookings = pgTable("influencer_bookings", {
  id: serial("id").primaryKey(),
  influencerId: integer("influencer_id").notNull(),
  userId: integer("user_id").notNull(),
  campaignName: text("campaign_name").notNull(),
  collaborationType: text("collaboration_type").notNull(), // post, story, video, package
  brandName: text("brand_name").notNull(),
  campaignObjectives: text("campaign_objectives"),
  contentRequirements: text("content_requirements"),
  timeline: text("timeline"),
  budget: integer("budget").notNull(),
  targetAudience: jsonb("target_audience"),
  specialRequirements: text("special_requirements"),
  status: text("status").default("pending"), // pending, approved, in_progress, completed, cancelled
  deliverables: jsonb("deliverables"), // Expected deliverables
  actualResults: jsonb("actual_results"), // Campaign results
  clientRating: integer("client_rating"), // Rating from client
  influencerRating: integer("influencer_rating"), // Rating from influencer
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInfluencerSchema = createInsertSchema(influencers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInfluencerBookingSchema = createInsertSchema(influencerBookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Sound schema
export const soundSystems = pgTable("sound_systems", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  specifications: text("specifications").notNull(),
  price: text("price").notNull(),
  pricing: text("pricing").notNull(),
  powerRating: text("power_rating").notNull(),
  coverageArea: text("coverage_area").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  features: text("features").array(),
  available: boolean("available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSoundSystemSchema = createInsertSchema(soundSystems).omit({
  id: true,
  createdAt: true,
});

// Venue schema
export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  capacity: integer("capacity").notNull(),
  amenities: text("amenities").notNull(),
  price: integer("price").notNull(),
});

export const insertVenueSchema = createInsertSchema(venues).omit({
  id: true,
});

// Event schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  venue: text("venue").notNull(),
  capacity: integer("capacity").notNull(),
  price: integer("price").notNull(),
  status: text("status").notNull().default("draft"), // draft, published, cancelled
  eventType: text("event_type").notNull(),
  organizerId: integer("organizer_id").notNull(),
  images: text("images").array(), // Array of base64 image strings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Booking schema
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // artist, influencer, sound, venue, ticket
  itemId: integer("item_id").notNull(),
  eventDate: timestamp("event_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid
  quantity: integer("quantity").default(1),
  totalAmount: integer("total_amount").notNull(),
  qrCode: text("qr_code"),
  additionalInfo: jsonb("additional_info"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  qrCode: true,
});

// Testimonial schema
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),  // Optional to allow anonymous testimonials
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

// Blog Posts schema
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  featuredImage: text("featured_image"),
  images: text("images").array().default([]),
  tags: text("tags").array().default([]),
  status: text("status").notNull().default("draft"), // draft, published, archived
  authorId: integer("author_id").references(() => users.id),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Chat conversations schema
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  adminId: integer("admin_id"),
  status: text("status").notNull().default("active"), // active, closed, pending_human
  subject: text("subject"),
  conversationType: text("conversation_type").notNull().default("ai_assistant"), // ai_assistant, human_support
  guestName: text("guest_name"),
  guestEmail: text("guest_email"),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  lastMessageAt: true,
});

// Chat messages schema
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  senderId: integer("sender_id").notNull(),
  senderType: text("sender_type").notNull(), // user, admin
  message: text("message").notNull(),
  messageType: text("message_type").notNull().default("text"), // text, image, file
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

// Payment schema for Khalti integration
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  userId: integer("user_id"), // Nullable for guest payments - Khalti handles customer verification
  amount: integer("amount").notNull(), // Amount in paisa (1 NPR = 100 paisa)
  currency: text("currency").notNull().default("NPR"),
  status: text("status").notNull().default("pending"), // pending, completed, failed, refunded
  paymentMethod: text("payment_method").notNull().default("khalti"), // khalti, cash, bank_transfer
  khaltiTransactionId: text("khalti_transaction_id"),
  khaltiPaymentId: text("khalti_payment_id"),
  khaltiRefundId: text("khalti_refund_id"),
  khaltiToken: text("khalti_token"),
  khaltiIdx: text("khalti_idx"),
  merchantReference: text("merchant_reference"),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  productName: text("product_name"),
  productIdentity: text("product_identity"),
  productUrl: text("product_url"),
  remarks: text("remarks"),
  paymentDate: timestamp("payment_date"),
  refundDate: timestamp("refund_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Artist = typeof artists.$inferSelect;
export type InsertArtist = z.infer<typeof insertArtistSchema>;

export type Influencer = typeof influencers.$inferSelect;
export type InsertInfluencer = z.infer<typeof insertInfluencerSchema>;

export type InfluencerBooking = typeof influencerBookings.$inferSelect;
export type InsertInfluencerBooking = z.infer<typeof insertInfluencerBookingSchema>;

export type SoundSystem = typeof soundSystems.$inferSelect;
export type InsertSoundSystem = z.infer<typeof insertSoundSystemSchema>;

export type Venue = typeof venues.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
