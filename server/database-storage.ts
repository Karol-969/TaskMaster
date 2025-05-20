import { eq } from "drizzle-orm";
import { db } from "./db";
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
}