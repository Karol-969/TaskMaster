import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

// Artist API
export async function fetchArtists() {
  const res = await apiRequest("GET", "/api/artists");
  return await res.json();
}

export async function fetchArtist(id: number) {
  const res = await apiRequest("GET", `/api/artists/${id}`);
  return await res.json();
}

// Influencer API
export async function fetchInfluencers() {
  const res = await apiRequest("GET", "/api/influencers");
  return await res.json();
}

export async function fetchInfluencer(id: number) {
  const res = await apiRequest("GET", `/api/influencers/${id}`);
  return await res.json();
}

// Sound System API
export async function fetchSoundSystems() {
  const res = await apiRequest("GET", "/api/sound-systems");
  return await res.json();
}

export async function fetchSoundSystem(id: number) {
  const res = await apiRequest("GET", `/api/sound-systems/${id}`);
  return await res.json();
}

// Venue API
export async function fetchVenues() {
  const res = await apiRequest("GET", "/api/venues");
  return await res.json();
}

export async function fetchVenue(id: number) {
  const res = await apiRequest("GET", `/api/venues/${id}`);
  return await res.json();
}

// Event API
export async function fetchEvents() {
  const res = await apiRequest("GET", "/api/events");
  return await res.json();
}

export async function fetchEvent(id: number) {
  const res = await apiRequest("GET", `/api/events/${id}`);
  return await res.json();
}

// Booking API
export async function fetchBookings() {
  const res = await apiRequest("GET", "/api/bookings");
  return await res.json();
}

export async function fetchBooking(id: number) {
  const res = await apiRequest("GET", `/api/bookings/${id}`);
  return await res.json();
}

export async function createBooking(bookingData: any) {
  const res = await apiRequest("POST", "/api/bookings", bookingData);
  const booking = await res.json();
  
  // Invalidate bookings query to refresh the list
  queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
  
  return booking;
}

export async function cancelBooking(id: number) {
  const res = await apiRequest("PUT", `/api/bookings/${id}/cancel`);
  const booking = await res.json();
  
  // Invalidate bookings query to refresh the list
  queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
  queryClient.invalidateQueries({ queryKey: [`/api/bookings/${id}`] });
  
  return booking;
}

// Testimonial API
export async function fetchTestimonials() {
  const res = await apiRequest("GET", "/api/testimonials");
  return await res.json();
}

export async function createTestimonial(testimonialData: any) {
  const res = await apiRequest("POST", "/api/testimonials", testimonialData);
  const testimonial = await res.json();
  
  // Invalidate testimonials query to refresh the list
  queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
  
  return testimonial;
}

// Admin API
export async function createArtist(artistData: any) {
  const res = await apiRequest("POST", "/api/artists", artistData);
  const artist = await res.json();
  
  // Invalidate artists query to refresh the list
  queryClient.invalidateQueries({ queryKey: ["/api/artists"] });
  
  return artist;
}

export async function updateArtist(id: number, artistData: any) {
  const res = await apiRequest("PUT", `/api/artists/${id}`, artistData);
  const artist = await res.json();
  
  // Invalidate queries to refresh the data
  queryClient.invalidateQueries({ queryKey: ["/api/artists"] });
  queryClient.invalidateQueries({ queryKey: [`/api/artists/${id}`] });
  
  return artist;
}

export async function deleteArtist(id: number) {
  await apiRequest("DELETE", `/api/artists/${id}`);
  
  // Invalidate artists query to refresh the list
  queryClient.invalidateQueries({ queryKey: ["/api/artists"] });
}

// Event API functions
export async function createEvent(eventData: any) {
  const res = await apiRequest("POST", "/api/events", eventData);
  const event = await res.json();
  
  // Invalidate events query to refresh the list
  queryClient.invalidateQueries({ queryKey: ["/api/events"] });
  
  return event;
}

export async function updateEvent(id: number, eventData: any) {
  const res = await apiRequest("PUT", `/api/events/${id}`, eventData);
  const event = await res.json();
  
  // Invalidate queries to refresh the data
  queryClient.invalidateQueries({ queryKey: ["/api/events"] });
  queryClient.invalidateQueries({ queryKey: [`/api/events/${id}`] });
  
  return event;
}

export async function deleteEvent(id: number) {
  await apiRequest("DELETE", `/api/events/${id}`);
  
  // Invalidate events query to refresh the list
  queryClient.invalidateQueries({ queryKey: ["/api/events"] });
}
