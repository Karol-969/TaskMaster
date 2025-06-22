import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  decimal,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique(),
  fullName: varchar("full_name"),
  username: varchar("username").unique(),
  password: varchar("password"),
  role: varchar("role").default("user"),
  phone: varchar("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Artists table
export const artists = pgTable("artists", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  genre: text("genre").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  rating: integer("rating"),
  languages: text("languages"),
  musicStyle: text("music_style"),
  bio: text("bio"),
  totalShows: integer("total_shows").default(0),
  contactEmail: text("contact_email"),
  phone: text("phone"),
  location: text("location"),
  availability: boolean("availability").default(true),
});

export type Artist = typeof artists.$inferSelect;
export type InsertArtist = typeof artists.$inferInsert;

// Influencers table
export const influencers = pgTable("influencers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  bio: text("bio"),
  imageUrl: text("image_url"),
  portfolioImages: text("portfolio_images").array(),
  instagramHandle: text("instagram_handle"),
  instagramFollowers: integer("instagram_followers"),
  tiktokHandle: text("tiktok_handle"),
  tiktokFollowers: integer("tiktok_followers"),
  youtubeHandle: text("youtube_handle"),
  youtubeSubscribers: integer("youtube_subscribers"),
  twitterHandle: text("twitter_handle"),
  twitterFollowers: integer("twitter_followers"),
  engagementRate: integer("engagement_rate"),
  averageViews: integer("average_views"),
  totalReach: integer("total_reach"),
  postPrice: integer("post_price"),
  storyPrice: integer("story_price"),
  videoPrice: integer("video_price"),
  packagePrice: integer("package_price"),
  contactEmail: text("contact_email"),
  phone: text("phone"),
  location: text("location"),
  languages: text("languages").array(),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  rating: integer("rating"),
  totalCollaborations: integer("total_collaborations"),
  availableDates: jsonb("available_dates"),
  collaborationTypes: text("collaboration_types").array(),
  brandRestrictions: text("brand_restrictions").array(),
  targetAudience: jsonb("target_audience"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Influencer = typeof influencers.$inferSelect;
export type InsertInfluencer = typeof influencers.$inferInsert;

// Events table
export const events = pgTable("events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  location: varchar("location", { length: 255 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  imageUrl: varchar("image_url", { length: 500 }),
  category: varchar("category", { length: 100 }),
  availableTickets: integer("available_tickets").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  imageUrl: varchar("image_url", { length: 500 }),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  text: text("text").notNull(),
  rating: integer("rating").notNull(),
  email: varchar("email", { length: 255 }),
  approved: boolean("approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

// Home page content management table
export const homePageContent = pgTable("home_page_content", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  section: varchar("section", { length: 100 }).notNull().unique(),
  content: jsonb("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type HomePageContent = typeof homePageContent.$inferSelect;
export type InsertHomePageContent = typeof homePageContent.$inferInsert;

// Sound Systems table
export const soundSystems = pgTable("sound_systems", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }),
  description: text("description"),
  specifications: text("specifications"),
  pricing: varchar("pricing", { length: 100 }),
  powerRating: varchar("power_rating", { length: 50 }),
  coverageArea: varchar("coverage_area", { length: 100 }),
  imageUrl: varchar("image_url", { length: 500 }),
  category: varchar("category", { length: 100 }),
  features: text("features").array(),
  available: boolean("available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type SoundSystem = typeof soundSystems.$inferSelect;
export type InsertSoundSystem = typeof soundSystems.$inferInsert;

// Payments table
export const payments = pgTable("payments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  pidx: varchar("pidx", { length: 255 }).unique().notNull(),
  txnId: varchar("txn_id", { length: 255 }),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 10 }).default("NPR"),
  status: varchar("status", { length: 50 }).default("Pending"),
  productIdentity: varchar("product_identity", { length: 255 }),
  productName: varchar("product_name", { length: 255 }),
  productUrl: varchar("product_url", { length: 500 }),
  customerName: varchar("customer_name", { length: 255 }),
  customerEmail: varchar("customer_email", { length: 255 }),
  customerPhone: varchar("customer_phone", { length: 50 }),
  returnUrl: varchar("return_url", { length: 500 }),
  websiteUrl: varchar("website_url", { length: 500 }),
  bookingType: varchar("booking_type", { length: 50 }),
  bookingData: jsonb("booking_data"),
  khaltiResponse: jsonb("khalti_response"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// Create insert schemas
export const insertArtistSchema = createInsertSchema(artists);
export const insertInfluencerSchema = createInsertSchema(influencers);
export const insertEventSchema = createInsertSchema(events);
export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const insertTestimonialSchema = createInsertSchema(testimonials);
export const insertHomePageContentSchema = createInsertSchema(homePageContent);
export const insertSoundSystemSchema = createInsertSchema(soundSystems);
export const insertPaymentSchema = createInsertSchema(payments);

// Define content schemas for different sections
export const heroSectionSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  backgroundImage: z.string().url(),
  ctaButtons: z.array(z.object({
    text: z.string(),
    link: z.string(),
    variant: z.enum(['primary', 'secondary'])
  }))
});

export const aboutSectionSchema = z.object({
  title: z.string(),
  description: z.string(),
  longDescription: z.string(),
  image: z.string().url(),
  stats: z.array(z.object({
    value: z.string(),
    label: z.string(),
    icon: z.string()
  }))
});

export const servicesSectionSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  services: z.array(z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().url(),
    icon: z.string(),
    linkTo: z.string()
  }))
});

export const journeySectionSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  timeline: z.array(z.object({
    year: z.string(),
    title: z.string(),
    description: z.string()
  }))
});

export const contactSectionSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string(),
    icon: z.string()
  }))
});

export type HeroSectionContent = z.infer<typeof heroSectionSchema>;
export type AboutSectionContent = z.infer<typeof aboutSectionSchema>;
export type ServicesSectionContent = z.infer<typeof servicesSectionSchema>;
export type JourneySectionContent = z.infer<typeof journeySectionSchema>;
export type ContactSectionContent = z.infer<typeof contactSectionSchema>;