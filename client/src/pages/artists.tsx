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
      name: "SUJITA DANGOL",
      genre: "Solo Artist",
      description: "Versatile vocalist performing in English, Nepali, and Hindi languages. Her repertoire spans multiple genres including Pop, Rock, and Classical music, creating the perfect atmosphere for various events.",
      imageUrl: "sujita_dangol.jpg",
      rating: 4.8,
      price: 25000
    },
    {
      id: 2,
      name: "SAMIKSHYA DAHAL",
      genre: "Solo Artist",
      description: "Talented performer specializing in English and Nepali songs across Pop, Rock, Classical genres as well as original compositions. Her powerful vocals and stage presence make any event memorable.",
      imageUrl: "samikshya dahal.jpg",
      rating: 4.7,
      price: 25000
    },
    {
      id: 3,
      name: "ASHIM THAPA",
      genre: "Solo Artist",
      description: "Versatile vocalist with expertise in English, Nepali, and Hindi music across Pop, Rock, and Classical genres. His dynamic performance style adapts perfectly to the mood of any event.",
      imageUrl: "ashim thapa.jpg",
      rating: 4.7,
      price: 25000
    },
    {
      id: 4,
      name: "PRABHAT MAHARJAN",
      genre: "Solo Artist",
      description: "Accomplished vocalist performing English, Nepali, and Hindi songs with emphasis on Pop and Classical styles. His smooth vocals create an elegant atmosphere for upscale events and gatherings.",
      imageUrl: "prabhat maharjan.jpg",
      rating: 4.6,
      price: 25000
    },
    {
      id: 5,
      name: "SOHEL KHADGI",
      genre: "Solo Artist",
      description: "Energetic performer specializing in English, Nepali, and Hindi Pop and Rock music. His high-energy performances are perfect for creating an exciting atmosphere at parties and celebrations.",
      imageUrl: "sohel khadgi.jpg",
      rating: 4.6,
      price: 25000
    },
    {
      id: 6,
      name: "SUMIT SUNAM",
      genre: "Solo Artist",
      description: "Talented vocalist with expertise in English, Nepali, and Hindi music spanning Pop, Rock, and Classical genres. His versatile style and crowd engagement make him suitable for various event types.",
      imageUrl: "smit sunam.jpg",
      rating: 4.7,
      price: 25000
    },
    {
      id: 7,
      name: "NEHARIKA SHAHI",
      genre: "Solo Artist",
      description: "Captivating female vocalist performing in English, Nepali, and Hindi with expertise in Pop, Rock, and Classical styles. Her soulful voice creates a sophisticated atmosphere for any occasion.",
      imageUrl: "neharika shahi.jpg",
      rating: 4.8,
      price: 25000
    },
    {
      id: 8,
      name: "PRACHIN RIMAL",
      genre: "Solo Artist",
      description: "Versatile performer with a wide repertoire of English, Nepali, and Hindi songs across Pop, Rock, and Classical genres. His adaptable style makes him suitable for various event atmospheres.",
      imageUrl: "prachin rimal.jpg",
      rating: 4.7,
      price: 25000
    },
    {
      id: 9,
      name: "UTSAV NEPAL",
      genre: "Solo Artist",
      description: "Dynamic vocalist performing English, Nepali, and Hindi music spanning Pop, Rock, and Classical styles. His engaging performances create memorable experiences for events of all sizes.",
      imageUrl: "utsav nepal.jpg",
      rating: 4.7,
      price: 25000
    },
    {
      id: 10,
      name: "ROSELYN SHRESTHA",
      genre: "Duo",
      description: "This musical duo performs a diverse selection of English, Nepali, and Hindi songs across Pop, Rock, and Classical genres. Their harmonized performances create a rich, immersive musical experience.",
      imageUrl: "roselyn shrestha.jpg",
      rating: 4.8,
      price: 35000
    },
    {
      id: 11,
      name: "THE ADAPTERS",
      genre: "Band",
      description: "Versatile band performing English, Nepali, and Hindi music spanning Pop, Rock, and Classical styles. Their full-band arrangement provides a dynamic sound perfect for larger events.",
      imageUrl: "the adapters.jpg",
      rating: 4.9,
      price: 50000
    },
    {
      id: 12,
      name: "ESTHER X SUBASH",
      genre: "Duo",
      description: "Musical duo specializing in English, Nepali, and Hindi songs across Pop, Rock, and Classical genres. Their complementary vocal styles create beautiful harmonies for a range of events.",
      imageUrl: "esther x subash.jpg",
      rating: 4.7,
      price: 35000
    },
    {
      id: 13,
      name: "THE TERNIONS",
      genre: "Trio",
      description: "This musical trio performs English, Nepali, and Hindi songs across Pop, Rock, and Classical genres. Their three-part harmonies and instrumental arrangements create a full, rich sound.",
      imageUrl: "the ternions.jpg",
      rating: 4.8,
      price: 45000
    },
    {
      id: 14,
      name: "COUSINS BAND",
      genre: "Band",
      description: "Full band performing a diverse range of English, Nepali, and Hindi music spanning Pop, Rock, and Classical styles. Their polished performances are ideal for weddings and large celebrations.",
      imageUrl: "cousins band.jpg",
      rating: 4.8,
      price: 50000
    },
    {
      id: 15,
      name: "TWO-TONE",
      genre: "Duo",
      description: "Musical duo specializing in English and Nepali Pop, Rock, Jazz, and Blues. Their unique arrangements and improvisational skills create a sophisticated atmosphere for upscale events.",
      imageUrl: "two tone.jpg",
      rating: 4.7,
      price: 35000
    },
    {
      id: 16,
      name: "MEGA BOOM",
      genre: "Trio/Band",
      description: "Versatile ensemble performing English, Nepali, and Hindi music across Pop, Rock, and Classical genres. They can perform as a trio or full band, adapting to different venue sizes and event requirements.",
      imageUrl: "mega boom.jpg",
      rating: 4.8,
      price: 45000
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
                      <img 
                        src={`/artist/${artist.imageUrl}`}
                        alt={`${artist.name} - ${artist.genre}`}
                        className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
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