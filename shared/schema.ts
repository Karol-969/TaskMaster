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
  name: varchar("name", { length: 255 }).notNull(),
  genre: varchar("genre", { length: 100 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  languages: varchar("languages", { length: 255 }),
  musicStyle: varchar("music_style", { length: 255 }),
  bio: text("bio"),
  totalShows: integer("total_shows").default(0),
  contactEmail: varchar("contact_email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 255 }),
  availability: boolean("availability").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Artist = typeof artists.$inferSelect;
export type InsertArtist = typeof artists.$inferInsert;

// Influencers table
export const influencers = pgTable("influencers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }),
  followers: integer("followers").default(0),
  engagement: decimal("engagement", { precision: 5, scale: 2 }),
  platforms: jsonb("platforms").$type<string[]>(),
  contactEmail: varchar("contact_email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 255 }),
  availability: boolean("availability").default(true),
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

// Create insert schemas
export const insertArtistSchema = createInsertSchema(artists);
export const insertInfluencerSchema = createInsertSchema(influencers);
export const insertEventSchema = createInsertSchema(events);
export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const insertTestimonialSchema = createInsertSchema(testimonials);
export const insertHomePageContentSchema = createInsertSchema(homePageContent);

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