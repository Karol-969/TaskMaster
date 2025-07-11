import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { FloatingMusicElements } from "@/components/home/floating-music-elements";
import { motion } from "framer-motion";
import { 
  Calendar, Clock, MapPin, Music, Star, 
  Award, Users, DollarSign, MessageCircle, ArrowLeft, 
  Heart, Share2, CalendarCheck
} from "lucide-react";
import { ArtistBookingModal } from '@/components/booking/artist-booking-modal';

// Artist type
interface Artist {
  id: number;
  name: string;
  genre: string;
  description: string;
  imageUrl: string;
  rating: number | null;
  price: number;
  location?: string;
  duration?: string;
  memberCount?: number;
  experience?: string;
  events?: string[];
  photos?: string[];
  testimonials?: {
    author: string;
    text: string;
    rating: number;
    event?: string;
  }[];
}

export default function ArtistDetailPage() {
  const [match, params] = useRoute("/artists/:id");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const artistId = params?.id ? parseInt(params.id) : 0;
  
  // Fetch artist from API
  const { data: artist, isLoading, error } = useQuery<Artist>({
    queryKey: [`/api/artists/${artistId}`],
    enabled: !!artistId,
    throwOnError: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fallback artist data if API fails - using authentic data from Reart Events
  const demoArtist: Artist = {
    id: artistId || 1,
    name: "SUJITA DANGOL",
    genre: "Solo Artist",
    description: "Sujita Dangol is a versatile vocalist with an impressive repertoire spanning multiple languages and genres. She performs expertly in English, Nepali, and Hindi, covering Pop, Rock, and Classical styles. With her powerful and emotive voice, Sujita creates the perfect musical atmosphere for any event, from intimate gatherings to large celebrations. Her extensive experience and professional approach ensure a seamless performance that captivates audiences and elevates the experience of any occasion.",
    imageUrl: "https://reartevents.com.np/storage/artists/default-artist.jpg",
    rating: 4.8,
    price: 25000,
    location: "Kathmandu, Nepal",
    duration: "2-3 hours per event",
    memberCount: 1,
    experience: "8+ years",
    events: [
      "Corporate Events",
      "Weddings",
      "Private Parties",
      "Hotel Performances",
      "Restaurant Gigs",
      "Festival Celebrations"
    ],
    photos: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1461784180009-27c193d5cfc9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    ],
    testimonials: [
      {
        author: "Anisha Thapa, Wedding Client",
        text: "Sujita performed at our wedding reception and created a magical atmosphere. Her voice is absolutely stunning, and she was able to perform songs in multiple languages that satisfied all our guests. Her English and Hindi songs were perfect, and her Nepali selections created a special connection with our local guests.",
        rating: 5,
        event: "Wedding Reception"
      },
      {
        author: "Himalaya Hotel, Events Manager",
        text: "We've had Sujita perform regularly at our hotel for special events, and she consistently impresses our guests with her versatile repertoire and professional performance. Her ability to transition between classical and contemporary styles makes her perfect for our diverse clientele.",
        rating: 5,
        event: "Hotel Performance Series"
      },
      {
        author: "Nepal Corporate Association",
        text: "Sujita performed at our annual gala dinner, and her selection of English, Nepali, and Hindi songs across various genres was perfect for our multinational attendees. Her classical pieces during dinner and pop/rock selections afterward created the perfect progression for our event.",
        rating: 4.8,
        event: "Corporate Gala"
      }
    ]
  };

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading artist details...</div>
        </div>
      </Layout>
    );
  }

  // Show error or not found state
  if (error || !artist) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Artist not found</div>
        </div>
      </Layout>
    );
  }

  // Use the fetched artist data
  const displayArtist = artist;

  return (
    <Layout>
      <Helmet>
        <title>{artist?.name || 'Artist'} | Book Now | Reart Events</title>
        <meta name="description" content={`Book ${artist?.name || 'this artist'} for your next event. ${artist?.description ? artist.description.substring(0, 120) : 'Professional artist available for bookings'}...`} />
      </Helmet>
      
      <div className="relative min-h-screen">
        {/* Hero section with artist image */}
        <section className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
          {/* Large artist image background */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${displayArtist.imageUrl?.startsWith('/uploads/') ? displayArtist.imageUrl : displayArtist.imageUrl?.startsWith('http') ? displayArtist.imageUrl : `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80`})`,
            }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          
          {/* Floating music elements */}
          <FloatingMusicElements />
          
          {/* Back button */}
          <div className="absolute top-8 left-8 z-20">
            <Link href="/artists">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-black/40 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Artists
              </Button>
            </Link>
          </div>
          
          {/* Artist info card positioned at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-4">
            <div className="container mx-auto max-w-6xl">
              <motion.div 
                className="bg-black/80 backdrop-blur-lg p-8 rounded-t-xl border-t border-x border-gray-800"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs px-3 py-1 bg-accent text-white rounded-full inline-flex items-center">
                        <Music className="w-3 h-3 mr-1" />
                        {displayArtist.genre}
                      </span>
                      
                      {displayArtist.rating && (
                        <span className="text-xs px-3 py-1 bg-gray-800 text-white rounded-full inline-flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < Math.floor(displayArtist.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} 
                            />
                          ))}
                          <span className="ml-1">{displayArtist.rating}</span>
                        </span>
                      )}
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                      {displayArtist.name}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-300">
                      {displayArtist.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-accent" />
                          <span>{displayArtist.location}</span>
                        </div>
                      )}
                      
                      {displayArtist.duration && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-accent" />
                          <span>{displayArtist.duration}</span>
                        </div>
                      )}
                      
                      {displayArtist.memberCount && (
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-accent" />
                          <span>{displayArtist.memberCount} Members</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex md:flex-col items-center md:items-end gap-4 md:gap-2">
                    <div className="text-white">
                      <span className="text-accent font-bold text-lg md:text-xl">
                        Available for Booking
                      </span>
                      <span className="text-gray-400 text-sm block"> Contact for pricing</span>
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="bg-accent hover:bg-accent/80 text-white"
                      onClick={() => setIsBookingModalOpen(true)}
                    >
                      <CalendarCheck className="mr-2 h-5 w-5" />
                      Book Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Main content section */}
        <section className="bg-gray-950 py-12">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main info column */}
              <div className="w-full lg:w-2/3">
                {/* About section */}
                <div className="bg-gray-900/50 rounded-xl p-8 mb-8 border border-gray-800/50">
                  <h2 className="text-2xl font-bold text-white mb-4">About This Artist</h2>
                  <p className="text-gray-300 whitespace-pre-line">
                    {displayArtist.description}
                  </p>
                  
                  {/* Social sharing and save */}
                  <div className="mt-8 flex items-center space-x-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
                
                {/* Event types section */}
                {displayArtist.events && displayArtist.events.length > 0 && (
                  <div className="bg-gray-900/50 rounded-xl p-8 mb-8 border border-gray-800/50">
                    <h2 className="text-2xl font-bold text-white mb-6">Perfect For</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {displayArtist.events.map((event, index) => (
                        <div 
                          key={index}
                          className="flex items-center bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
                        >
                          <Calendar className="w-5 h-5 text-accent mr-2 flex-shrink-0" />
                          <span className="text-gray-200">{event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Photos gallery */}
                {displayArtist.photos && displayArtist.photos.length > 0 && (
                  <div className="bg-gray-900/50 rounded-xl p-8 mb-8 border border-gray-800/50">
                    <h2 className="text-2xl font-bold text-white mb-6">Photos & Videos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayArtist.photos.map((photo, index) => (
                        <motion.div 
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="relative rounded-lg overflow-hidden aspect-video cursor-pointer"
                        >
                          <img 
                            src={photo} 
                            alt={`${displayArtist.name} performance ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Reviews & testimonials */}
                {displayArtist.testimonials && displayArtist.testimonials.length > 0 && (
                  <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800/50">
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Client Reviews
                      {displayArtist.rating && (
                        <span className="ml-2 text-accent">
                          ({displayArtist.rating})
                        </span>
                      )}
                    </h2>
                    
                    <div className="space-y-6">
                      {displayArtist.testimonials.map((testimonial, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="border border-gray-800 rounded-lg p-6 bg-gray-800/30"
                        >
                          <div className="flex items-center mb-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(testimonial.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                              />
                            ))}
                            
                            {testimonial.event && (
                              <span className="text-xs px-3 py-1 bg-gray-800 text-gray-300 rounded-full ml-3">
                                {testimonial.event}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-300 mb-4 italic">
                            "{testimonial.text}"
                          </p>
                          
                          <div className="text-gray-400 text-sm">
                            <span className="font-medium">{testimonial.author}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sidebar */}
              <div className="w-full lg:w-1/3">
                {/* Booking form card */}
                <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Book {displayArtist.name}
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between py-3 border-b border-gray-800">
                      <div className="flex items-center text-gray-300">
                        <Calendar className="w-5 h-5 text-accent mr-2" />
                        <span>Select Date</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-accent text-accent hover:bg-accent hover:text-white"
                      >
                        Choose
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-800">
                      <div className="flex items-center text-gray-300">
                        <Clock className="w-5 h-5 text-accent mr-2" />
                        <span>Event Duration</span>
                      </div>
                      <select className="bg-gray-800 text-white border border-gray-700 rounded-md py-1 px-2 text-sm">
                        <option>2 hours</option>
                        <option>3 hours</option>
                        <option>4 hours</option>
                        <option>Custom</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-800">
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-5 h-5 text-accent mr-2" />
                        <span>Event Location</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-accent text-accent hover:bg-accent hover:text-white"
                      >
                        Add
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center text-gray-300">
                        <MessageCircle className="w-5 h-5 text-accent mr-2" />
                        <span>Special Requests</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-accent text-accent hover:bg-accent hover:text-white"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/70 rounded-lg p-4 mb-6">
                    <div className="flex justify-between mb-2 text-gray-300">
                      <span>Booking type</span>
                      <span>Professional Event</span>
                    </div>
                    <div className="flex justify-between mb-4 text-gray-300">
                      <span>Contact for</span>
                      <span>Custom Pricing</span>
                    </div>
                    <div className="flex justify-between font-bold text-white text-lg">
                      <span>Status</span>
                      <span className="text-accent">Available</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-accent hover:bg-accent/80 text-white"
                    size="lg"
                    onClick={() => setIsBookingModalOpen(true)}
                  >
                    Book Now
                  </Button>
                  
                  <p className="text-gray-400 text-xs text-center mt-4">
                    You won't be charged yet. Price will be confirmed after artist acceptance.
                  </p>
                </div>
                
                {/* Artist info card */}
                <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Artist Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <Award className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                      <div>
                        <span className="block font-medium">Experience</span>
                        <span className="text-sm text-gray-400">{displayArtist.experience || "8+ years"}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <Users className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                      <div>
                        <span className="block font-medium">Group Size</span>
                        <span className="text-sm text-gray-400">{displayArtist.memberCount || 4} members</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                      <div>
                        <span className="block font-medium">Performance Duration</span>
                        <span className="text-sm text-gray-400">{displayArtist.duration || "2-3 hours per event"}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <DollarSign className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                      <div>
                        <span className="block font-medium">Equipment</span>
                        <span className="text-sm text-gray-400">Instruments provided, sound system required</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <Button 
                      variant="outline" 
                      className="w-full border-accent text-accent hover:bg-accent hover:text-white"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Artist
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Similar artists section */}
        <section className="bg-black py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-white mb-8">
              You Might Also Like
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800/50"
                >
                  <div className="h-48 bg-gray-800 relative">
                    <img 
                      src={`https://images.unsplash.com/photo-${1511192336575 + i * 10000}-5a79af67a629?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                      alt={`Similar artist ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-xs px-2 py-1 bg-accent text-white rounded-full">
                        {["Jazz", "Classical", "Rock"][i]}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-white font-bold">
                      {["Smooth Jazz Trio", "Symphony Strings", "Rock Legends"][i]}
                    </h3>
                    <div className="flex items-center mt-2 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star 
                          key={j} 
                          className={`w-3 h-3 ${j < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} 
                        />
                      ))}
                      <span className="text-gray-400 text-xs ml-1">(4.0)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-accent font-semibold">
                        ${[1600, 2200, 1900][i]}
                      </span>
                      <Link href={`/artists/${5 + i}`}>
                        <Button size="sm" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Artist Booking Modal */}
      {displayArtist && (
        <ArtistBookingModal
          artist={displayArtist}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </Layout>
  );
}