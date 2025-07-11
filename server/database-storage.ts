import { eq, desc, or, isNull, lte, gte, sql } from "drizzle-orm";
import { db } from "./db";
import { 
  users, type User, type UpsertUser,
  artists, type Artist, type InsertArtist,
  influencers, type Influencer, type InsertInfluencer,
  events, type Event, type InsertEvent,
  testimonials, type Testimonial, type InsertTestimonial,
  blogPosts, type BlogPost, type InsertBlogPost,
  homePageContent, type HomePageContent, type InsertHomePageContent,
  soundSystems, type SoundSystem, type InsertSoundSystem,
  payments, type Payment, type InsertPayment,
  bookings, type Booking, type InsertBooking,
  conversations, chatMessages,
  bannerAds, type BannerAd, type InsertBannerAd
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
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt));
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

  async getConversation(id: number): Promise<any> {
    // Ensure conversationType is selected and returned
    const [conversation] = await db.select({
      id: conversations.id,
      userId: conversations.userId,
      subject: conversations.subject,
      status: conversations.status,
      adminId: conversations.adminId,
      guestName: conversations.guestName,
      guestEmail: conversations.guestEmail,
      conversationType: conversations.conversationType, // <-- ensure this is included
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt
    }).from(conversations).where(eq(conversations.id, id));
    return conversation || undefined;
  }

  async getUserConversations(userId: number): Promise<any[]> {
    // Ensure conversationType is selected and returned
    return await db.select({
      id: conversations.id,
      userId: conversations.userId,
      subject: conversations.subject,
      status: conversations.status,
      adminId: conversations.adminId,
      guestName: conversations.guestName,
      guestEmail: conversations.guestEmail,
      conversationType: conversations.conversationType,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt
    }).from(conversations).where(eq(conversations.userId, userId));
  }

  async getAllConversations(): Promise<any[]> {
    // Ensure conversationType is selected and returned
    return await db.select({
      id: conversations.id,
      userId: conversations.userId,
      subject: conversations.subject,
      status: conversations.status,
      adminId: conversations.adminId,
      guestName: conversations.guestName,
      guestEmail: conversations.guestEmail,
      conversationType: conversations.conversationType,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt
    }).from(conversations);
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

  async getPaymentByPidx(pidx: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.pidx, pidx));
    return payment || undefined;
  }

  async updatePayment(id: number, paymentData: any): Promise<Payment | undefined> {
    const [updatedPayment] = await db
      .update(payments)
      .set({ ...paymentData, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment || undefined;
  }

  async getUserPayments(userId: number): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
  }

  async getAllPayments(): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .orderBy(desc(payments.createdAt));
  }

  // Chat operations
  async createConversation(conversation: any): Promise<any> {
    const [newConversation] = await db.insert(conversations).values(conversation).returning();
    return newConversation;
  }

  async createMessage(message: any): Promise<any> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  async getConversationMessages(conversationId: number): Promise<any[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(chatMessages.createdAt);
  }

  // Banner Ads operations
  async getAllBannerAds(): Promise<BannerAd[]> {
    return await db
      .select()
      .from(bannerAds)
      .orderBy(desc(bannerAds.priority), desc(bannerAds.createdAt));
  }

  async getBannerAd(id: number): Promise<BannerAd | undefined> {
    const [banner] = await db.select().from(bannerAds).where(eq(bannerAds.id, id));
    return banner || undefined;
  }

  async getActiveBannerAds(page?: string, position?: string): Promise<BannerAd[]> {
    let query = db
      .select()
      .from(bannerAds)
      .where(eq(bannerAds.isActive, true));

    // Add date filtering for active banners
    const now = new Date();
    query = query.where(
      or(
        isNull(bannerAds.startDate),
        lte(bannerAds.startDate, now)
      )
    ).where(
      or(
        isNull(bannerAds.endDate),
        gte(bannerAds.endDate, now)
      )
    );

    if (position) {
      query = query.where(eq(bannerAds.position, position));
    }

    const results = await query.orderBy(desc(bannerAds.priority), desc(bannerAds.createdAt));

    // Filter by page if specified
    if (page) {
      return results.filter(banner => 
        !banner.pages || 
        banner.pages.length === 0 || 
        banner.pages.includes(page) || 
        banner.pages.includes('all')
      );
    }

    return results;
  }

  async createBannerAd(banner: InsertBannerAd): Promise<BannerAd> {
    const [newBanner] = await db.insert(bannerAds).values(banner).returning();
    return newBanner;
  }

  async updateBannerAd(id: number, banner: Partial<InsertBannerAd>): Promise<BannerAd | undefined> {
    const [updated] = await db
      .update(bannerAds)
      .set({ ...banner, updatedAt: new Date() })
      .where(eq(bannerAds.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteBannerAd(id: number): Promise<boolean> {
    const result = await db.delete(bannerAds).where(eq(bannerAds.id, id));
    return result.rowCount > 0;
  }

  async incrementBannerClicks(id: number): Promise<void> {
    await db
      .update(bannerAds)
      .set({ 
        clickCount: sql`${bannerAds.clickCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(bannerAds.id, id));
  }

  async incrementBannerImpressions(id: number): Promise<void> {
    await db
      .update(bannerAds)
      .set({ 
        impressionCount: sql`${bannerAds.impressionCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(bannerAds.id, id));
  }

  // Blog Post methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values({
      ...blogPost,
      publishedAt: blogPost.published ? new Date() : null
    }).returning();
    return newPost;
  }

  async updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const updateData = {
      ...blogPost,
      updatedAt: new Date()
    };

    // Set publishedAt if publishing for the first time
    if (blogPost.published) {
      const [existingPost] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
      if (existingPost && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const [updated] = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
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

  // Home Page Content methods
  async getAllHomeContent(): Promise<HomePageContent[]> {
    return await db.select().from(homePageContent);
  }

  async getHomeContentBySection(section: string): Promise<HomePageContent | undefined> {
    const [content] = await db.select().from(homePageContent).where(eq(homePageContent.section, section));
    return content || undefined;
  }

  async createHomeContent(content: InsertHomePageContent): Promise<HomePageContent> {
    const [newContent] = await db.insert(homePageContent).values(content).returning();
    return newContent;
  }

  async updateHomeContent(section: string, content: any): Promise<HomePageContent | undefined> {
    const [updated] = await db
      .update(homePageContent)
      .set({ content, updatedAt: new Date() })
      .where(eq(homePageContent.section, section))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();