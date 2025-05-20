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

  // Authentic artists data from Reart Events website
  const allArtists = artists.length > 0 ? artists : [
    {
      id: 1,
      name: "DJ Ravi",
      genre: "DJ",
      description: "DJ Ravi is a well-known Nepali DJ who has been in the industry for over a decade. He specializes in Bollywood, EDM, Hip-hop, and commercial music, making him perfect for corporate events, weddings, and private parties.",
      imageUrl: "https://reartevents.com.np/storage/artists/djravi.jpg",
      rating: 4.8,
      price: 25000
    },
    {
      id: 2,
      name: "DJ A-Rufu",
      genre: "DJ",
      description: "DJ A-Rufu is one of the most celebrated DJs in Nepal with expertise in multiple genres including Hip-hop, EDM, House, and Top 40 hits. His energetic sets create an unforgettable atmosphere for any event.",
      imageUrl: "https://reartevents.com.np/storage/artists/djarufu.jpg",
      rating: 4.9,
      price: 30000
    },
    {
      id: 3,
      name: "DJ Rex",
      genre: "DJ",
      description: "DJ Rex is renowned for his versatile style and seamless mixing abilities. With experience performing at major clubs and events across Nepal, he brings professional sound and lighting setups to elevate any occasion.",
      imageUrl: "https://reartevents.com.np/storage/artists/djrex.jpg",
      rating: 4.7,
      price: 28000
    },
    {
      id: 4,
      name: "DJ Bidhan",
      genre: "DJ",
      description: "DJ Bidhan is known for his ability to read the crowd and create the perfect musical atmosphere. With expertise in multiple genres, he's perfect for weddings, corporate events, and private celebrations.",
      imageUrl: "https://reartevents.com.np/storage/artists/djbidhan.jpg",
      rating: 4.8,
      price: 25000
    },
    {
      id: 5,
      name: "Fireball Band",
      genre: "Band",
      description: "Fireball is a dynamic musical group that brings energy and excitement to any event. Their diverse repertoire covers everything from classic rock to contemporary hits, making them ideal for weddings and corporate functions.",
      imageUrl: "https://reartevents.com.np/storage/artists/fireballband.jpg",
      rating: 4.9,
      price: 45000
    },
    {
      id: 6,
      name: "Urja Band",
      genre: "Band",
      description: "Urja Band is known for their powerful performances and wide musical range. From Nepali folk to international hits, they create memorable musical experiences for weddings, corporate events, and private parties.",
      imageUrl: "https://reartevents.com.np/storage/artists/urjaband.jpg",
      rating: 4.8,
      price: 40000
    },
    {
      id: 7,
      name: "Jyovan Bhuju",
      genre: "Singer",
      description: "Jyovan Bhuju is a versatile vocalist with a soulful voice that captivates audiences. His repertoire spans Nepali classics, Bollywood favorites, and international hits, perfect for creating a sophisticated atmosphere at any event.",
      imageUrl: "https://reartevents.com.np/storage/artists/jyovanbhuju.jpg",
      rating: 4.7,
      price: 20000
    },
    {
      id: 8,
      name: "Shisir Yogi",
      genre: "Singer",
      description: "Shisir Yogi brings a unique vocal talent to events with his versatile singing style. Specializing in Nepali and Bollywood songs, his performances add a touch of class to weddings, corporate gatherings, and private celebrations.",
      imageUrl: "https://reartevents.com.np/storage/artists/shisiryogi.jpg",
      rating: 4.7,
      price: 22000
    },
    {
      id: 9,
      name: "Albatross",
      genre: "Band",
      description: "Albatross is one of Nepal's pioneering heavy metal bands, known for their powerful original compositions and energetic stage presence. They bring a unique musical experience to festivals and special events.",
      imageUrl: "https://reartevents.com.np/storage/artists/albatross.jpg",
      rating: 4.9,
      price: 50000
    },
    {
      id: 10,
      name: "Bar BQ Tonight",
      genre: "Band",
      description: "Bar BQ Tonight delivers spectacular performances with their fusion of rock, pop, and folk music. Their dynamic stage presence and musical versatility make them perfect for large-scale events and private parties.",
      imageUrl: "https://reartevents.com.np/storage/artists/barbqtonight.jpg",
      rating: 4.8,
      price: 45000
    },
    {
      id: 11,
      name: "The Elements",
      genre: "Band",
      description: "The Elements is a popular Nepali band known for their engaging performances and versatile musical style. With expertise in multiple genres, they create the perfect musical atmosphere for corporate events and celebrations.",
      imageUrl: "https://reartevents.com.np/storage/artists/theelements.jpg",
      rating: 4.7,
      price: 38000
    },
    {
      id: 12,
      name: "Rock Guitar School",
      genre: "Band",
      description: "Rock Guitar School is known for their exceptional musicianship and diverse repertoire. Their performances feature classic rock hits and contemporary favorites, ideal for creating an energetic atmosphere at any event.",
      imageUrl: "https://reartevents.com.np/storage/artists/rockguitarschool.jpg",
      rating: 4.6,
      price: 35000
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