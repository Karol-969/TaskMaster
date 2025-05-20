import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Music, Mic, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Artist {
  id: number;
  name: string;
  genre: string;
  description: string;
  imageUrl: string;
  rating: number | null;
  price: number;
}

export function EnhancedArtistsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredArtist, setHoveredArtist] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const controls = useAnimation();
  const [isMobile, setIsMobile] = useState(false);

  const { data: artists = [] } = useQuery<Artist[]>({
    queryKey: ['/api/artists'],
    throwOnError: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Trigger animations when section comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const nextArtist = () => {
    setCurrentIndex((prev) => (prev + 1) % artists.length);
  };

  const prevArtist = () => {
    setCurrentIndex((prev) => (prev === 0 ? artists.length - 1 : prev - 1));
  };

  // Get artists to display (either all for desktop or a subset for mobile)
  const getVisibleArtists = () => {
    if (artists.length === 0) return [];
    if (isMobile) return [artists[currentIndex]];
    
    const visibleCount = Math.min(3, artists.length);
    const endIndex = currentIndex + visibleCount;
    
    if (endIndex <= artists.length) {
      return artists.slice(currentIndex, endIndex);
    } else {
      // Handle wrap-around
      return [
        ...artists.slice(currentIndex),
        ...artists.slice(0, endIndex - artists.length)
      ];
    }
  };

  const visibleArtists = getVisibleArtists();

  // Create a mock gradient background for artist profile
  const generateGradient = (genre: string) => {
    const genreColors: Record<string, string> = {
      'Electronic': 'from-blue-900 to-purple-900',
      'Jazz': 'from-amber-800 to-red-900',
      'Rock': 'from-red-800 to-gray-900',
      'Pop': 'from-pink-700 to-purple-900',
      'Hip Hop': 'from-gray-800 to-yellow-900',
      'Classical': 'from-emerald-900 to-blue-900',
      'R&B': 'from-purple-900 to-pink-900',
      'Folk': 'from-amber-900 to-brown-900',
      'Country': 'from-yellow-800 to-amber-900',
    };
    
    return genreColors[genre] || 'from-gray-900 to-black';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const artistTextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.3,
        duration: 0.6 
      }
    }
  };

  // If no artists are available yet, show a placeholder
  if (artists.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-black to-gray-900" ref={containerRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Featured Artists</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Loading our amazing talent roster...</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-gray-900/50 rounded-xl p-8 h-80 flex flex-col items-center justify-center"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 mb-6 flex items-center justify-center">
                  <Music className="w-12 h-12 text-gray-600" />
                </div>
                <div className="w-3/4 h-4 bg-gray-800 rounded mb-3"></div>
                <div className="w-2/4 h-3 bg-gray-800 rounded"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900 overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-4 relative">
        {/* Floating music notes decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute text-accent/20"
              initial={{ y: 0, opacity: 0 }}
              animate={{ 
                y: [-20, -40],
                opacity: [0, 0.5, 0],
                scale: [0.7, 1, 0.7]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 10 + i * 2,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`
              }}
            >
              {Math.random() > 0.5 ? "♪" : "♫"}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={artistTextVariants}
          className="text-center mb-12 relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Featured Artists</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Book exceptional talent curated from our exclusive roster of world-class artists
          </p>
        </motion.div>

        {/* Navigation buttons */}
        <div className="flex justify-center mb-8 gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevArtist}
            className="bg-accent/20 hover:bg-accent/40 text-white p-2 rounded-full transition-colors duration-300"
            aria-label="Previous artist"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextArtist}
            className="bg-accent/20 hover:bg-accent/40 text-white p-2 rounded-full transition-colors duration-300"
            aria-label="Next artist"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="wait">
            {visibleArtists.map((artist, i) => (
              <motion.div
                key={`${artist.id}-${i}`}
                variants={cardVariants}
                initial="hidden" 
                animate="visible"
                exit={{ opacity: 0, y: 50, transition: { duration: 0.3 } }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                onHoverStart={() => setHoveredArtist(artist.id)}
                onHoverEnd={() => setHoveredArtist(null)}
                className="relative overflow-hidden rounded-xl"
              >
                <div
                  className={`h-96 relative rounded-xl overflow-hidden group cursor-pointer`}
                >
                  {/* Background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${generateGradient(artist.genre)} opacity-70 z-0`}></div>
                  
                  {/* Artist image with parallax effect on hover */}
                  <motion.div 
                    className="absolute inset-0 bg-cover bg-center z-0"
                    animate={{
                      scale: hoveredArtist === artist.id ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                    style={{ 
                      backgroundImage: `url(${artist.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />

                  {/* Content overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10"></div>
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 * i, duration: 0.5 }}
                    >
                      <div className="bg-accent/20 text-white rounded-full px-3 py-1 text-sm inline-flex items-center mb-3 backdrop-blur-sm">
                        <Music className="h-3 w-3 mr-1" />
                        <span>{artist.genre}</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                        {artist.name}
                      </h3>
                      
                      {artist.rating && (
                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < artist.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} 
                            />
                          ))}
                          <span className="ml-2 text-gray-300 text-sm">{artist.rating}/5</span>
                        </div>
                      )}
                      
                      <p className="text-gray-300 mb-4 line-clamp-2">{artist.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">
                          ${artist.price.toLocaleString()} <span className="text-gray-400 text-sm">per event</span>
                        </span>
                        
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link href={`/artists/${artist.id}`}>
                            <Button variant="default" className="bg-accent hover:bg-accent/80 text-white">
                              Book Now
                            </Button>
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={artistTextVariants}
          className="mt-12 text-center"
        >
          <Link href="/artists">
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
              View All Artists
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}