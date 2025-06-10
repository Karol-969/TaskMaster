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

// Influencer schema
export const influencers = pgTable("influencers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  socialStats: text("social_stats").notNull(),
  rating: integer("rating").default(5),
  price: integer("price").notNull(),
});

export const insertInfluencerSchema = createInsertSchema(influencers).omit({
  id: true,
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
  text: text("text").notNull(),
  rating: integer("rating").notNull(),
  name: text("name"),          // For anonymous testimonials
  company: text("company"),    // Organization/company name 
  email: text("email"),        // Email for contact (not displayed publicly)
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
  status: text("status").notNull().default("active"), // active, closed
  subject: text("subject"),
  guestName: varchar("guest_name", { length: 255 }),
  guestEmail: varchar("guest_email", { length: 255 }),
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

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Artist = typeof artists.$inferSelect;
export type InsertArtist = z.infer<typeof insertArtistSchema>;

export type Influencer = typeof influencers.$inferSelect;
export type InsertInfluencer = z.infer<typeof insertInfluencerSchema>;

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
