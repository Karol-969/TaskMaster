import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { FloatingMusicElements } from "@/components/home/floating-music-elements";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  ArrowRight,
  Music,
  Music2,
  Users,
  Filter,
  Check,
  BookOpen,
  X,
  SearchX
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
    queryKey: ["/api/artists"],
    throwOnError: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Authentic artists data from Reart Events website
  const allArtists =
    artists.length > 0
      ? artists
      : [
          {
            id: 1,
            name: "SUJITA DANGOL",
            genre: "Solo Artist",
            description:
              "Versatile vocalist performing in English, Nepali, and Hindi languages. Her repertoire spans multiple genres including Pop, Rock, and Classical music, creating the perfect atmosphere for various events.",
            imageUrl:
              "artist/sujita_dangol.jpg",
            rating: 4.8,
            languages: "English, Nepali, Hindi",
            musicStyle: "Pop, Rock, Classical",
          },
          {
            id: 2,
            name: "SAMIKSHYA DAHAL",
            genre: "Solo Artist",
            description:
              "Talented performer specializing in English and Nepali songs across Pop, Rock, Classical genres as well as original compositions. Her powerful vocals and stage presence make any event memorable.",
            imageUrl:
              "artist/samikshya dahal.jpg",
            rating: 4.7,
            languages: "English, Nepali",
            musicStyle: "Pop, Rock, Originals, Classical",
          },
          {
            id: 3,
            name: "ASHIM THAPA",
            genre: "Solo Artist",
            description:
              "Versatile vocalist with expertise in English, Nepali, and Hindi music across Pop, Rock, and Classical genres. His dynamic performance style adapts perfectly to the mood of any event.",
            imageUrl:
              "artist/ashim thapa.jpg",
            rating: 4.7,
            languages: "English, Nepali, Hindi",
            musicStyle: "Pop, Rock, Classical",
          },
          {
            id: 4,
            name: "PRABHAT MAHARJAN",
            genre: "Solo Artist",
            description:
              "Accomplished vocalist performing English, Nepali, and Hindi songs with emphasis on Pop and Classical styles. His smooth vocals create an elegant atmosphere for upscale events and gatherings.",
            imageUrl: "artist/prabhat maharjan.jpg",
            rating: 4.6,
            languages: "English, Nepali, Hindi",
            musicStyle: "Pop, Classical",
          },
          {
            id: 5,
            name: "SOHEL KHADGI",
            genre: "Solo Artist",
            description:
              "Energetic performer specializing in English, Nepali, and Hindi Pop and Rock music. His high-energy performances are perfect for creating an exciting atmosphere at parties and celebrations.",
            imageUrl: "sohel khadgi.jpg",
            rating: 4.6,
            languages: "English, Nepali, Hindi",
            musicStyle: "Pop, Rock",
          },
          {
            id: 6,
            name: "SUMIT SUNAM",
            genre: "Solo Artist",
            description:
              "Talented vocalist with expertise in English, Nepali, and Hindi music spanning Pop, Rock, and Classical genres. His versatile style and crowd engagement make him suitable for various event types.",
            imageUrl: "smit sunam.jpg",
            rating: 4.7,
            languages: "English, Nepali, Hindi",
            musicStyle: "Pop, Rock, Classical",
          },
          {
            id: 7,
            name: "NEHARIKA SHAHI",
            genre: "Solo Artist",
            description:
              "Captivating female vocalist performing in English, Nepali, and Hindi with expertise in Pop, Rock, and Classical styles. Her soulful voice creates a sophisticated atmosphere for any occasion.",
            imageUrl: "neharika shahi.jpg",
            rating: 4.8,
            languages: "English, Nepali, Hindi",
            musicStyle: "Pop, Rock, Classical",
          },
          {
            id: 8,
            name: "PRACHIN RIMAL",
            genre: "Solo Artist",
            description:
              "Versatile performer with a wide repertoire of English, Nepali, and Hindi songs across Pop, Rock, and Classical genres. His adaptable style makes him suitable for various event atmospheres.",
            imageUrl: "prachin rimal.jpg",
            rating: 4.7,
            languages: "English, Nepali, Hindi",
            musicStyle: "Pop, Rock, Classical",
          },
          {
            id: 9,
            name: "UTSAV NEPAL",
            genre: "Solo Artist",
            description:
              "Dynamic vocalist performing English, Nepali, and Hindi music spanning Pop, Rock, and Classical styles. His engaging performances create memorable experiences for events of all sizes.",
            imageUrl: "utsav nepal.jpg",
            rating: 4.7,
            languages: "English, Nepali, Hindi",
            musicStyle: "Pop, Rock, Classical",
          },
          {
            id: 10,
            name: "ROSELYN SHRESTHA",
            genre: "Duo",
            description:
              "This musical duo performs a diverse selection of English, Nepali, and Hindi songs across Pop, Rock, and Classical genres. Their harmonized performances create a rich, immersive musical experience.",
            imageUrl: "roselyn shrestha.jpg",
            rating: 4.8,
            languages: "English, Nepali, Hindi",
            musicStyle: "Pop, Rock, Classical",
          },
          {
            id: 11,
            name: "THE ADAPTERS",
            genre: "Band",
            description:
              "Versatile band performing English, Nepali, and Hindi music spanning Pop, Rock, and Classical styles. Their full-band arrangement provides a dynamic sound perfect for larger events.",
            imageUrl: "the adapters.jpg",
            rating: 4.9,
            languages: "English, Nepali, Hindi",
            musicStyle: "Pop, Rock, Classical",
          },
          {
            id: 12,
            name: "ESTHER X SUBASH",
            genre: "Duo",
            description:
              "Musical duo specializing in English, Nepali, and Hindi songs across Pop, Rock, and Classical genres. Their complementary vocal styles create beautiful harmonies for a range of events.",
            imageUrl: "esther x subash.jpg",
            rating: 4.7,
            languages: "English, Nepali, Hindi",
            musicStyle: "Pop, Rock, Classical",
          },
          {
            id: 13,
            name: "THE TERNIONS",
            genre: "Trio",
            description:
              "This musical trio performs English, Nepali, and Hindi songs across Pop, Rock, and Classical genres. Their three-part harmonies and instrumental arrangements create a full, rich sound.",
            imageUrl: "the ternions.jpg",
            rating: 4.8,
            languages: "English, Nepali, Hindi",
            musicStyle: "Pop, Rock, Classical",
          },
          {
            id: 14,
            name: "COUSINS BAND",
            genre: "Band",
            description:
              "Full band performing a diverse range of English, Nepali, and Hindi music spanning Pop, Rock, and Classical styles. Their polished performances are ideal for weddings and large celebrations.",
            imageUrl: "cousins band.jpg",
            rating: 4.8,
            languages: "English, Nepali, Hindi",
            musicStyle: "Pop, Rock, Classical",
          },
          {
            id: 15,
            name: "TWO-TONE",
            genre: "Duo",
            description:
              "Musical duo specializing in English and Nepali Pop, Rock, Jazz, and Blues. Their unique arrangements and improvisational skills create a sophisticated atmosphere for upscale events.",
            imageUrl: "two tone.jpg",
            rating: 4.7,
            languages: "English, Nepali",
            musicStyle: "Pop, Rock, Jazz, Blues",
          },
          {
            id: 16,
            name: "MEGA BOOM",
            genre: "Trio/Band",
            description:
              "Versatile ensemble performing English, Nepali, and Hindi music across Pop, Rock, and Classical genres. They can perform as a trio or full band, adapting to different venue sizes and event requirements.",
            imageUrl: "mega boom.jpg",
            rating: 4.8,
            languages: "English, Nepali, Hindi",
            musicStyle: "Pop, Rock, Classical",
          },
        ];

  // Extract all genres for filtering
  // Use a simple object to track unique genres then convert to array
  const genreMap: Record<string, boolean> = {};
  allArtists.forEach((artist) => {
    if (artist.genre) genreMap[artist.genre] = true;
  });
  const genres = Object.keys(genreMap);

  // Filter artists based on search term and selected genre
  const filteredArtists = allArtists.filter((artist) => {
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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <Layout>
      <Helmet>
        <title>Book Top Artists | Reart Events</title>
        <meta
          name="description"
          content="Explore and book our diverse roster of world-class artists for your next event. From DJs and bands to classical musicians and vocalists, find the perfect musical talent to make your event unforgettable."
        />
      </Helmet>

      <div className="relative min-h-screen">
        {/* Hero section */}
        <section className="relative py-24 bg-gradient-to-b from-black to-gray-900 overflow-hidden">
          {/* Background image with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)",
              backgroundAttachment: "fixed",
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
                Exceptional Artists for{" "}
                <span className="text-accent">Unforgettable</span> Events
              </h1>
              <p className="text-xl text-gray-300 mb-10">
                Discover our curated selection of world-class performers to
                elevate your next event
              </p>

              {/* Just a CTA button here */}
              <Button
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white font-medium text-lg px-10 py-6 rounded-full"
                onClick={() => {
                  const element = document.getElementById('genre-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Explore Artists
              </Button>
            </motion.div>
          </div>
        </section>
        
        {/* Genre selector section */}
        <section id="genre-section" className="py-12 bg-gray-900 border-b border-gray-800">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Browse by Genre</h2>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGenre(null)}
                  className={`px-5 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                    selectedGenre === null 
                      ? "bg-accent text-white shadow-lg shadow-accent/30" 
                      : "bg-gray-800/70 text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  All Artists ({allArtists.length})
                </motion.button>
                
                {genres.map(genre => (
                  <motion.button
                    key={genre}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-5 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                      selectedGenre === genre 
                        ? "bg-accent text-white shadow-lg shadow-accent/30" 
                        : "bg-gray-800/70 text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    {genre} ({allArtists.filter(a => a.genre === genre).length})
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search artists by name or description..."
                className="w-full bg-gray-800/90 text-white border border-gray-700 rounded-full py-3 pl-12 pr-4 focus:ring-accent focus:border-accent shadow-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </section>
            
        {/* Artists listing section */}
        <section className="py-16 bg-gray-950">
          <div className="container mx-auto px-4">
            {/* Section title */}
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-white">
                {selectedGenre ? `${selectedGenre} Artists` : "All Artists"}
                <span className="text-accent ml-2">
                  ({filteredArtists.length})
                </span>
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
                  <div
                    key={i}
                    className="bg-gray-900/50 rounded-xl overflow-hidden animate-pulse h-96"
                  ></div>
                ))}
              </div>
            ) : filteredArtists.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredArtists.map((artist) => (
                  <motion.div
                    key={artist.id}
                    variants={itemVariants}
                    whileHover={{
                      y: -10,
                      transition: { duration: 0.3 },
                    }}
                    className="group bg-gray-900/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-800/50 flex flex-col hover:border-accent/50 transition-all duration-300"
                  >
                    {/* Artist image */}
                    <div className="relative h-96 overflow-hidden">
                      <img
                        src={`/artist/${artist.imageUrl}`}
                        alt={`${artist.name} - ${artist.genre}`}
                        className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />

                      {/* Genre badge */}
                      <div className="absolute top-6 left-6">
                        <span className="text-sm font-medium px-4 py-2 bg-accent/90 text-white rounded-full flex items-center shadow-lg backdrop-blur-sm">
                          <Music className="w-4 h-4 mr-2" />
                          {artist.genre}
                        </span>
                      </div>

                      {/* Rating */}
                      {artist.rating && (
                        <div className="absolute top-6 right-6">
                          <span className="text-sm font-medium px-4 py-2 bg-gray-800/80 text-white rounded-full flex items-center backdrop-blur-sm shadow-lg">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(artist.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
                              />
                            ))}
                            <span className="ml-2">{artist.rating}</span>
                          </span>
                        </div>
                      )}

                    </div>
                    
                    {/* Artist details */}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors duration-300">
                        {artist.name}
                      </h3>
                      <p className="text-gray-300 text-base line-clamp-3 mb-4">
                        {artist.description}
                      </p>
                      
                      {/* Languages and Music Style */}
                      <div className="mb-6 space-y-2">
                        {artist.languages && (
                          <div className="flex items-center text-sm text-gray-300">
                            <span className="inline-block bg-gray-800 rounded-full px-3 py-1 mr-2">Languages:</span>
                            <span className="text-accent">{artist.languages}</span>
                          </div>
                        )}
                        
                        {artist.musicStyle && (
                          <div className="flex items-center text-sm text-gray-300">
                            <span className="inline-block bg-gray-800 rounded-full px-3 py-1 mr-2">Music:</span>
                            <span className="text-accent">{artist.musicStyle}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-end">
                        <Link to={`/artists/${artist.id}`}>
                          <Button
                            className="bg-accent hover:bg-accent/90 text-white px-6 py-6 rounded-full text-base shadow-lg"
                            size="lg"
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  No artists found
                </h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search or filter criteria
                </p>
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
                {
                  icon: <Music className="h-8 w-8" />,
                  name: "Musicians & Bands",
                  count: 120,
                },
                {
                  icon: <Music className="h-8 w-8" />,
                  name: "Vocalists",
                  count: 75,
                },
                { icon: <Music className="h-8 w-8" />, name: "DJs", count: 50 },
                {
                  icon: <Users className="h-8 w-8" />,
                  name: "Performers",
                  count: 40,
                },
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
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {category.name}
                  </h3>
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
              backgroundImage:
                "url(https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)",
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
                  Our team of experts can help you find the perfect artist for
                  your event, even if they're not listed on our platform. We
                  have connections with artists worldwide.
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
