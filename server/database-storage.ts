import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  users, type User, type InsertUser,
  artists, type Artist, type InsertArtist,
  influencers, type Influencer, type InsertInfluencer,
  influencerBookings, type InfluencerBooking, type InsertInfluencerBooking,
  soundSystems, type SoundSystem, type InsertSoundSystem,
  venues, type Venue, type InsertVenue,
  events, type Event, type InsertEvent,
  bookings, type Booking, type InsertBooking,
  testimonials, type Testimonial, type InsertTestimonial,
  blogPosts, type BlogPost, type InsertBlogPost,
  conversations, type Conversation, type InsertConversation,
  chatMessages, type ChatMessage, type InsertChatMessage,
  payments, type Payment, type InsertPayment
} from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Artist methods
  async getArtist(id: number): Promise<Artist | undefined> {
    const [artist] = await db.select().from(artists).where(eq(artists.id, id));
    return artist || undefined;
  }

  async getAllArtists(): Promise<Artist[]> {
    return await db.select().from(artists);
  }

  async createArtist(artist: InsertArtist): Promise<Artist> {
    const [newArtist] = await db.insert(artists).values(artist).returning();
    return newArtist;
  }

  async updateArtist(id: number, artist: Partial<InsertArtist>): Promise<Artist | undefined> {
    const [updatedArtist] = await db
      .update(artists)
      .set(artist)
      .where(eq(artists.id, id))
      .returning();
    return updatedArtist || undefined;
  }

  async deleteArtist(id: number): Promise<boolean> {
    await db.delete(artists).where(eq(artists.id, id));
    return true; // Assuming deletion was successful if no errors
  }

  // Influencer methods
  async getInfluencer(id: number): Promise<Influencer | undefined> {
    const [influencer] = await db.select().from(influencers).where(eq(influencers.id, id));
    return influencer || undefined;
  }

  async getAllInfluencers(): Promise<Influencer[]> {
    return await db.select().from(influencers);
  }

  async createInfluencer(influencer: InsertInfluencer): Promise<Influencer> {
    const [newInfluencer] = await db.insert(influencers).values(influencer).returning();
    return newInfluencer;
  }

  async updateInfluencer(id: number, influencer: Partial<InsertInfluencer>): Promise<Influencer | undefined> {
    const [updatedInfluencer] = await db
      .update(influencers)
      .set(influencer)
      .where(eq(influencers.id, id))
      .returning();
    return updatedInfluencer || undefined;
  }

  async deleteInfluencer(id: number): Promise<boolean> {
    await db.delete(influencers).where(eq(influencers.id, id));
    return true;
  }

  // Influencer Booking methods
  async getInfluencerBooking(id: number): Promise<InfluencerBooking | undefined> {
    const [booking] = await db.select().from(influencerBookings).where(eq(influencerBookings.id, id));
    return booking || undefined;
  }

  async getAllInfluencerBookings(): Promise<InfluencerBooking[]> {
    return await db.select().from(influencerBookings);
  }

  async getInfluencerBookingsByUser(userId: number): Promise<InfluencerBooking[]> {
    return await db.select().from(influencerBookings).where(eq(influencerBookings.userId, userId));
  }

  async getInfluencerBookingsByInfluencer(influencerId: number): Promise<InfluencerBooking[]> {
    return await db.select().from(influencerBookings).where(eq(influencerBookings.influencerId, influencerId));
  }

  async createInfluencerBooking(booking: InsertInfluencerBooking): Promise<InfluencerBooking> {
    const [newBooking] = await db.insert(influencerBookings).values(booking).returning();
    return newBooking;
  }

  async updateInfluencerBooking(id: number, booking: Partial<InsertInfluencerBooking>): Promise<InfluencerBooking | undefined> {
    const [updatedBooking] = await db
      .update(influencerBookings)
      .set(booking)
      .where(eq(influencerBookings.id, id))
      .returning();
    return updatedBooking || undefined;
  }

  async deleteInfluencerBooking(id: number): Promise<boolean> {
    await db.delete(influencerBookings).where(eq(influencerBookings.id, id));
    return true;
  }

  // Sound System methods
  async getSoundSystem(id: number): Promise<SoundSystem | undefined> {
    const [soundSystem] = await db.select().from(soundSystems).where(eq(soundSystems.id, id));
    return soundSystem || undefined;
  }

  async getAllSoundSystems(): Promise<SoundSystem[]> {
    return await db.select().from(soundSystems);
  }

  async createSoundSystem(sound: InsertSoundSystem): Promise<SoundSystem> {
    const [newSoundSystem] = await db.insert(soundSystems).values(sound).returning();
    return newSoundSystem;
  }

  async updateSoundSystem(id: number, sound: Partial<InsertSoundSystem>): Promise<SoundSystem | undefined> {
    const [updatedSoundSystem] = await db
      .update(soundSystems)
      .set(sound)
      .where(eq(soundSystems.id, id))
      .returning();
    return updatedSoundSystem || undefined;
  }

  async deleteSoundSystem(id: number): Promise<boolean> {
    await db.delete(soundSystems).where(eq(soundSystems.id, id));
    return true;
  }

  // Venue methods
  async getVenue(id: number): Promise<Venue | undefined> {
    const [venue] = await db.select().from(venues).where(eq(venues.id, id));
    return venue || undefined;
  }

  async getAllVenues(): Promise<Venue[]> {
    return await db.select().from(venues);
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const [newVenue] = await db.insert(venues).values(venue).returning();
    return newVenue;
  }

  async updateVenue(id: number, venue: Partial<InsertVenue>): Promise<Venue | undefined> {
    const [updatedVenue] = await db
      .update(venues)
      .set(venue)
      .where(eq(venues.id, id))
      .returning();
    return updatedVenue || undefined;
  }

  async deleteVenue(id: number): Promise<boolean> {
    await db.delete(venues).where(eq(venues.id, id));
    return true;
  }

  // Event methods
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updatedEvent] = await db
      .update(events)
      .set(event)
      .where(eq(events.id, id))
      .returning();
    return updatedEvent || undefined;
  }

  async deleteEvent(id: number): Promise<boolean> {
    await db.delete(events).where(eq(events.id, id));
    return true;
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined> {
    const [updatedBooking] = await db
      .update(bookings)
      .set(booking)
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking || undefined;
  }

  async deleteBooking(id: number): Promise<boolean> {
    await db.delete(bookings).where(eq(bookings.id, id));
    return true;
  }

  // Testimonial methods
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial || undefined;
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return newTestimonial;
  }

  // Blog Post methods
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.status, 'published')).orderBy(blogPosts.publishedAt);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const [newPost] = await db.insert(blogPosts).values({
      ...post,
      slug,
      updatedAt: new Date()
    }).returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db.update(blogPosts)
      .set({
        ...post,
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost || undefined;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Chat methods
  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [newConversation] = await db
      .insert(conversations)
      .values(conversation)
      .returning();
    return newConversation;
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation || undefined;
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return await db.select().from(conversations).where(eq(conversations.userId, userId));
  }

  async getAllConversations(): Promise<Conversation[]> {
    return await db.select().from(conversations);
  }

  async updateConversationStatus(id: number, status: string): Promise<Conversation | undefined> {
    const [updated] = await db
      .update(conversations)
      .set({ status, lastMessageAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    return updated || undefined;
  }

  async assignAdminToConversation(conversationId: number, adminId: number): Promise<Conversation | undefined> {
    const [updated] = await db
      .update(conversations)
      .set({ adminId })
      .where(eq(conversations.id, conversationId))
      .returning();
    return updated || undefined;
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();

    // Update conversation last message time
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, message.conversationId));

    return newMessage;
  }

  async getConversationMessages(conversationId: number): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(chatMessages.createdAt);
  }

  async markMessagesAsRead(conversationId: number, userId: number): Promise<void> {
    await db
      .update(chatMessages)
      .set({ isRead: true })
      .where(eq(chatMessages.conversationId, conversationId));
  }

  async getUnreadMessageCount(conversationId: number): Promise<number> {
    const result = await db
      .select({ count: chatMessages.id })
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId));
    return result.length;
  }

  // Payment methods
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async getPaymentByKhaltiIdx(khaltiIdx: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.khaltiIdx, khaltiIdx));
    return payment || undefined;
  }

  async getPaymentByPidx(pidx: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.khaltiIdx, pidx));
    return payment || undefined;
  }

  async updatePaymentStatus(id: number, status: string, additionalData?: any): Promise<Payment | undefined> {
    const updateData: any = { status, updatedAt: new Date() };
    
    if (additionalData) {
      Object.assign(updateData, additionalData);
    }

    const [updated] = await db
      .update(payments)
      .set(updateData)
      .where(eq(payments.id, id))
      .returning();
    return updated || undefined;
  }

  async getUserPayments(userId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.userId, userId));
  }

  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments);
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const [updated] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();