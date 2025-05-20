import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { FloatingMusicElements } from "@/components/home/floating-music-elements";
import { motion } from "framer-motion";
import { 
  Search, Star, ArrowRight, Music, 
  Users, Filter, Check, BookOpen
} from "lucide-react";

// Artist type from shared schema
interface Artist {
  id: number;
  name: string;
  genre: string;
  description: string;
  imageUrl: string;
  rating: number | null;
  price: number;
}

export default function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  // Fetch artists from the API
  const { data: artists = [], isLoading } = useQuery<Artist[]>({
    queryKey: ['/api/artists'],
    throwOnError: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sample demo artists if the API returns empty
  const allArtists = artists.length > 0 ? artists : [
    {
      id: 1,
      name: "DJ Alex",
      genre: "Electronic",
      description: "One of the most sought-after electronic DJs with over 500 performances worldwide. Known for energetic sets that blend house, techno, and EDM.",
      imageUrl: "https://images.unsplash.com/photo-1571151429199-a3371c9c8c8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      price: 2500
    },
    {
      id: 2,
      name: "Lisa Jazz Quartet",
      genre: "Jazz",
      description: "An elegant jazz ensemble perfect for upscale events. Their repertoire includes classic jazz standards and modern interpretations.",
      imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      price: 1800
    },
    {
      id: 3,
      name: "The Rockers",
      genre: "Rock",
      description: "A high-energy rock band that brings the house down with their powerful performances of rock classics and original compositions.",
      imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      price: 2200
    },
    {
      id: 4,
      name: "Pop Sensations",
      genre: "Pop",
      description: "Chart-topping pop hits performed by this dynamic group. Perfect for corporate events and large celebrations.",
      imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      rating: 4.5,
      price: 3000
    },
    {
      id: 5,
      name: "Hip Hop Heroes",
      genre: "Hip Hop",
      description: "Authentic hip hop performers who bring the urban vibe to any event. Known for their engaging crowd interaction.",
      imageUrl: "https://images.unsplash.com/photo-1559676786-22373325c6c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      rating: 4.5,
      price: 2800
    },
    {
      id: 6,
      name: "Symphony Orchestra",
      genre: "Classical",
      description: "A world-class orchestra featuring talented musicians who deliver breathtaking classical performances for elegant events.",
      imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      price: 5000
    },
    {
      id: 7,
      name: "Party Starters",
      genre: "Variety",
      description: "A versatile ensemble that covers hits from the 70s to today's top charts. Perfect for weddings and corporate events.",
      imageUrl: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      price: 2200
    },
    {
      id: 8,
      name: "Fusion Collective",
      genre: "World Music",
      description: "An innovative ensemble blending global music traditions with modern sounds. Their unique style creates an unforgettable atmosphere.",
      imageUrl: "https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      price: 2400
    },
    {
      id: 9,
      name: "Acoustic Duo",
      genre: "Folk/Acoustic",
      description: "A charming duo offering intimate acoustic performances perfect for cocktail hours and smaller gatherings.",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      rating: 4.5,
      price: 1200
    },
    {
      id: 10,
      name: "Bollywood Beats",
      genre: "Bollywood",
      description: "A high-energy group specializing in Bollywood hits that will get everyone on the dance floor. Perfect for weddings and cultural celebrations.",
      imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      price: 2600
    },
    {
      id: 11,
      name: "Country Roads",
      genre: "Country",
      description: "Authentic country music performers bringing Southern charm to any event. Their repertoire includes classics and modern country hits.",
      imageUrl: "https://images.unsplash.com/photo-1543443258-92b04ad5ec6b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      price: 2100
    },
    {
      id: 12,
      name: "Blues Brothers",
      genre: "Blues",
      description: "Soulful blues musicians who create an atmosphere of timeless cool. Perfect for jazz clubs, lounges, and sophisticated events.",
      imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      price: 2200
    }
  ];

  // Extract all genres for filtering
  // Use a simple object to track unique genres then convert to array
  const genreMap: Record<string, boolean> = {};
  allArtists.forEach(artist => {
    if (artist.genre) genreMap[artist.genre] = true;
  });
  const genres = Object.keys(genreMap);

  // Filter artists based on search term and selected genre
  const filteredArtists = allArtists.filter(artist => {
    const matchesSearch = 
      artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenre ? artist.genre === selectedGenre : true;
    
    return matchesSearch && matchesGenre;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Book Top Artists | Reart Events</title>
        <meta name="description" content="Explore and book our diverse roster of world-class artists for your next event. From DJs and bands to classical musicians and vocalists, find the perfect musical talent to make your event unforgettable." />
      </Helmet>
      
      <div className="relative min-h-screen">
        {/* Hero section */}
        <section className="relative py-24 bg-gradient-to-b from-black to-gray-900 overflow-hidden">
          {/* Background image with overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ 
              backgroundImage: "url(https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)",
              backgroundAttachment: "fixed"
            }}
          />
          
          {/* Floating music elements */}
          <FloatingMusicElements />
          
          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Exceptional Artists for <span className="text-accent">Unforgettable</span> Events
              </h1>
              <p className="text-xl text-gray-300 mb-10">
                Discover our curated selection of world-class performers to elevate your next event
              </p>
              
              {/* Search and filter */}
              <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-xl shadow-xl">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search artists by name or description..."
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:ring-accent focus:border-accent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="relative min-w-[200px]">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 pl-10 pr-4 appearance-none focus:ring-accent focus:border-accent"
                      value={selectedGenre || ""}
                      onChange={(e) => setSelectedGenre(e.target.value || null)}
                    >
                      <option value="">All Genres</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                      <ArrowRight className="rotate-90 w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Artists listing section */}
        <section className="py-16 bg-gray-950">
          <div className="container mx-auto px-4">
            {/* Section title */}
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-white">
                {selectedGenre ? `${selectedGenre} Artists` : "All Artists"}
                <span className="text-accent ml-2">({filteredArtists.length})</span>
              </h2>
              
              {selectedGenre && (
                <Button 
                  variant="outline"
                  onClick={() => setSelectedGenre(null)}
                  className="border-accent text-accent hover:bg-accent hover:text-white"
                >
                  Clear Filter
                </Button>
              )}
            </div>
            
            {/* Artists grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-900/50 rounded-xl overflow-hidden animate-pulse h-96"></div>
                ))}
              </div>
            ) : filteredArtists.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredArtists.map((artist) => (
                  <motion.div 
                    key={artist.id} 
                    variants={itemVariants}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.3 }
                    }}
                    className="group bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-800/50 flex flex-col"
                  >
                    {/* Artist image */}
                    <div className="relative h-64 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        style={{ backgroundImage: `url(${artist.imageUrl})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                      
                      {/* Genre badge */}
                      <div className="absolute top-4 left-4">
                        <span className="text-xs font-medium px-3 py-1 bg-accent/90 text-white rounded-full flex items-center">
                          <Music className="w-3 h-3 mr-1" />
                          {artist.genre}
                        </span>
                      </div>
                      
                      {/* Rating */}
                      {artist.rating && (
                        <div className="absolute top-4 right-4">
                          <span className="text-xs font-medium px-3 py-1 bg-gray-800/80 text-white rounded-full flex items-center backdrop-blur-sm">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < Math.floor(artist.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} 
                              />
                            ))}
                            <span className="ml-1">{artist.rating}</span>
                          </span>
                        </div>
                      )}
                      
                      {/* Gradient overlay for text */}
                      <div className="absolute bottom-0 left-0 right-0">
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-1">
                            {artist.name}
                          </h3>
                          <p className="text-gray-300 line-clamp-2 mb-2 text-sm">
                            {artist.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price and booking */}
                    <div className="p-6 mt-auto flex items-center justify-between">
                      <div>
                        <span className="text-accent font-bold text-lg">
                          ${artist.price.toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-sm"> per event</span>
                      </div>
                      
                      <Link href={`/artists/${artist.id}`}>
                        <Button 
                          className="bg-accent hover:bg-accent/80 text-white"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No artists found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedGenre(null);
                  }}
                  className="border-accent text-accent hover:bg-accent hover:text-white"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Artist categories */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Browse by Category
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <Music className="h-8 w-8" />, name: "Musicians & Bands", count: 120 },
                { icon: <Music className="h-8 w-8" />, name: "Vocalists", count: 75 },
                { icon: <Music className="h-8 w-8" />, name: "DJs", count: 50 },
                { icon: <Users className="h-8 w-8" />, name: "Performers", count: 40 },
              ].map((category, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * i }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gray-900/70 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 text-accent">
                    {category.icon}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">{category.name}</h3>
                  <p className="text-gray-400">{category.count}+ available</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-20 bg-gradient-to-b from-gray-950 to-black relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ 
              backgroundImage: "url(https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)",
            }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Can't find what you're looking for?
                </h2>
                <p className="text-gray-300 mb-8 text-lg">
                  Our team of experts can help you find the perfect artist for your event, even if they're not listed on our platform. We have connections with artists worldwide.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-accent hover:bg-accent/80 text-white"
                  >
                    Contact Our Team
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Schedule Consultation
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

// Import custom icons components from a separate file when needed