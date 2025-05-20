import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Music, Star, Calendar, Play, Pause, Volume2 } from "lucide-react";

interface Artist {
  id: number;
  name: string;
  genre: string;
  description: string;
  imageUrl: string;
  rating: number | null;
  price: number;
}

export function FeaturedArtistsShowcase() {
  const [activeArtist, setActiveArtist] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const artistsRef = useRef<HTMLDivElement>(null);
  
  // Set up parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);
  const opacitySection = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Fetch artists from the API
  const { data: artists = [] } = useQuery<Artist[]>({
    queryKey: ['/api/artists'],
    throwOnError: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // When there are artists, create demo data if the API returns empty
  const featuredArtists = artists.length > 0 ? artists : [
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
    }
  ];
  
  // Auto-rotate through featured artists
  useEffect(() => {
    if (featuredArtists.length === 0) return;
    
    const interval = setInterval(() => {
      if (!isPlaying) {
        setActiveArtist((prev) => (prev + 1) % featuredArtists.length);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredArtists.length, isPlaying]);
  
  // Handle image preloading
  const handleImageLoad = (artistId: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [artistId]: true
    }));
  };
  
  // Preload all images on mount
  useEffect(() => {
    featuredArtists.forEach((artist) => {
      const img = new Image();
      img.src = artist.imageUrl;
      img.onload = () => handleImageLoad(artist.id);
    });
  }, [featuredArtists]);
  
  // Cinematic reveal animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const artistItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Generate 3D card rotation effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!artistsRef.current) return;
    
    const rect = artistsRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation based on mouse position
    const rotateX = mouseY / 40;
    const rotateY = -mouseX / 40;
    
    if (artistsRef.current) {
      artistsRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  };
  
  const handleMouseLeave = () => {
    if (artistsRef.current) {
      artistsRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <section 
      ref={containerRef}
      className="py-32 relative overflow-hidden bg-gradient-to-b from-black to-gray-900"
    >
      {/* Parallax background effect */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center opacity-40 bg-fixed"
        style={{ 
          backgroundImage: "url(https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&h=1300&q=80)",
          y: backgroundY 
        }}
      />
      
      {/* Animated overlay with music instruments and notes */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent">
        {Array.from({ length: 45 }).map((_, i) => {
          // Randomly select different musical elements
          const musicElement = Math.floor(Math.random() * 10); // 0-9: variety of instruments and notes
          const opacityValue = 0.4 + Math.random() * 0.5; // Higher opacity between 0.4 and 0.9
          const size = 18 + Math.random() * 40; // Varied sizes
          
          return (
            <motion.div
              key={i}
              className="absolute text-accent"
              style={{
                opacity: opacityValue,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: `blur(${Math.random() * 1}px)`,
              }}
              animate={{
                y: [-20, -120, -220],
                opacity: [0, opacityValue, 0],
                scale: [0.5, 1.2, 0.5],
                rotate: [Math.random() * 20 - 10, Math.random() * 40 - 20, Math.random() * 20 - 10]
              }}
              transition={{
                repeat: Infinity,
                duration: 15 + Math.random() * 25,
                delay: Math.random() * 10,
                ease: "easeInOut"
              }}
            >
              {/* Simple notes */}
              {musicElement === 0 && (
                <span style={{ fontSize: `${size}px` }}>♪</span>
              )}
              {musicElement === 1 && (
                <span style={{ fontSize: `${size}px` }}>♫</span>
              )}
              {musicElement === 2 && (
                <span style={{ fontSize: `${size}px` }}>♬</span>
              )}
              {musicElement === 3 && (
                <span style={{ fontSize: `${size}px` }}>♩</span>
              )}
              
              {/* Guitar SVG */}
              {musicElement === 4 && (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M14.5 2.5c1 .5 2 2 2 3.5m-6 18c-2.5 0-5.5-2-5.5-6 0-2 .5-4.5 2.5-6.5 1-1 2-1.5 3-1.5 1.5 0 2.5 1 3 2 .5 1 .5 2.5-.5 3.5s-1.5 1-2 1c-.5 0-1.5 0-1.5-1 0-1 1-1 1-1" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    fill={Math.random() > 0.5 ? "rgba(var(--accent-rgb), 0.15)" : "none"}
                  />
                  <path 
                    d="m8.5 8.5 3-3m1 4 1-1m-1 4 1-1" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              
              {/* Drum SVG */}
              {musicElement === 5 && (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M12 14a4 4 0 0 1 0-8 4 4 0 0 1 0 8z" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                    fill={Math.random() > 0.5 ? "rgba(var(--accent-rgb), 0.15)" : "none"} 
                  />
                  <path 
                    d="M12 14v8m-8-8h16" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M6 6c-1.5 1.5-2 3-2 8s.5 6.5 2 8h12c1.5-1.5 2-3 2-8s-.5-6.5-2-8H6z" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    fill={Math.random() > 0.7 ? "rgba(var(--accent-rgb), 0.1)" : "none"}
                  />
                  <path 
                    d="M12 14c1 0 1.5.5 2 2s.5 3 0 4.5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                  />
                </svg>
              )}
              
              {/* Saxophone SVG */}
              {musicElement === 6 && (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M16.5 21.5c-1-.5-1.5-2-1.5-3.5 0-2 3-7 3-12.5 0-1.5-.5-2.5-1.5-3.5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M11.5 21.5c-3 0-7-1.5-7-5.5 0-2.5 2-5.5 4.5-5.5 1.5 0 2.5 1 2.5 2 0 1.5-1 2.5-2.5 2.5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    fill={Math.random() > 0.5 ? "rgba(var(--accent-rgb), 0.15)" : "none"}
                  />
                  <path 
                    d="M16.5 9.5 11 15m0-1.5c0 1.5-1 2.5-2.5 2.5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                  />
                </svg>
              )}
              
              {/* Piano/Keyboard SVG */}
              {musicElement === 7 && (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect 
                    x="2" 
                    y="4" 
                    width="20" 
                    height="16" 
                    rx="2" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                    fill={Math.random() > 0.6 ? "rgba(var(--accent-rgb), 0.1)" : "none"} 
                  />
                  <path 
                    d="M2 10h20M7 10v10M12 10v10M17 10v10M9 4v6M14 4v6" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                  />
                </svg>
              )}
              
              {/* Headphones SVG */}
              {musicElement === 8 && (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M4 13.5V13c0-4.97 3.582-9 8-9s8 4.03 8 9v.5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d="M2 17.438v-4.875a2 2 0 0 1 2-2h1.5a2 2 0 0 1 2 2v4.875a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                    fill={Math.random() > 0.5 ? "rgba(var(--accent-rgb), 0.15)" : "none"} 
                  />
                  <path 
                    d="M22 17.438v-4.875a2 2 0 0 0-2-2h-1.5a2 2 0 0 0-2 2v4.875a2 2 0 0 0 2 2H20a2 2 0 0 0 2-2Z" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                    fill={Math.random() > 0.5 ? "rgba(var(--accent-rgb), 0.15)" : "none"} 
                  />
                </svg>
              )}
              
              {/* Microphone SVG */}
              {musicElement === 9 && (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M12 19v3m-4-3h8" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <rect 
                    x="8" 
                    y="2" 
                    width="8" 
                    height="13" 
                    rx="4" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                    fill={Math.random() > 0.5 ? "rgba(var(--accent-rgb), 0.2)" : "none"} 
                  />
                  <path 
                    d="M19 10v1a7 7 0 0 1-7 7v0a7 7 0 0 1-7-7v-1" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Main content with parallax effect */}
      <motion.div
        className="container mx-auto px-4 relative z-10"
        style={{ y: contentY, opacity: opacitySection }}
      >
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            delay: 0.2
          }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">Featured Artists</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Elevate your event with our exclusive selection of world-class talent
          </p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Artist Showcase - Left Side */}
          <motion.div 
            className="w-full lg:w-2/3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div 
              ref={artistsRef}
              className="relative rounded-xl overflow-hidden transition-all duration-700 ease-out bg-gray-900/50 backdrop-blur-sm shadow-2xl"
              style={{ transformStyle: 'preserve-3d', transition: 'transform 0.5s ease' }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredArtists[activeArtist]?.id}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8 }}
                  className="aspect-video bg-cover bg-center relative"
                >
                  {/* Image placeholder while loading */}
                  {!loadedImages[featuredArtists[activeArtist]?.id] && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 animate-pulse flex items-center justify-center">
                      <Music className="w-16 h-16 text-gray-700" />
                    </div>
                  )}
                  
                  {/* Actual artist image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${featuredArtists[activeArtist]?.imageUrl})`,
                      opacity: loadedImages[featuredArtists[activeArtist]?.id] ? 1 : 0,
                      transition: 'opacity 0.5s ease'
                    }}
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  
                  {/* Play/pause controls */}
                  <div className="absolute bottom-8 right-8 flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg backdrop-blur-sm"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </motion.button>
                    
                    <motion.div
                      animate={{ 
                        width: isPlaying ? '80px' : '0px',
                        opacity: isPlaying ? 1 : 0 
                      }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-900/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center overflow-hidden"
                    >
                      <Volume2 className="w-4 h-4 text-white mr-2 flex-shrink-0" />
                      <div className="h-1 bg-gray-700 rounded-full flex-grow">
                        <motion.div 
                          className="h-full bg-accent rounded-full"
                          animate={{ 
                            width: ['0%', '100%']
                          }}
                          transition={{ 
                            duration: 5, 
                            repeat: isPlaying ? Infinity : 0,
                            repeatType: "loop"
                          }}
                        />
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Artist info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-xs px-3 py-1 bg-accent text-white rounded-full inline-flex items-center">
                          <Music className="w-3 h-3 mr-1" />
                          {featuredArtists[activeArtist]?.genre || 'Music'}
                        </span>
                        
                        {featuredArtists[activeArtist]?.rating && (
                          <span className="text-xs px-3 py-1 bg-gray-900/60 text-white rounded-full inline-flex items-center backdrop-blur-sm">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < Math.floor(featuredArtists[activeArtist]?.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} 
                              />
                            ))}
                            <span className="ml-1">{featuredArtists[activeArtist]?.rating}</span>
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">
                        {featuredArtists[activeArtist]?.name}
                      </h3>
                      
                      <p className="text-gray-300 max-w-2xl mb-6 line-clamp-2 md:line-clamp-none">
                        {featuredArtists[activeArtist]?.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg md:text-xl text-white font-semibold">
                          ${featuredArtists[activeArtist]?.price.toLocaleString()}
                          <span className="text-gray-400 text-sm"> per event</span>
                        </span>
                        
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link href={`/artists/${featuredArtists[activeArtist]?.id}`}>
                            <Button size="lg" className="bg-accent hover:bg-accent/80 text-white">
                              Book Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Artist Selection - Right Side */}
          <motion.div 
            className="w-full lg:w-1/3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            variants={containerVariants}
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-6">Popular Artists</h3>
              
              <div className="space-y-3">
                {featuredArtists.map((artist, index) => (
                  <motion.div
                    key={artist.id}
                    variants={artistItemVariants}
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      setActiveArtist(index);
                      setIsPlaying(false);
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors duration-300 flex items-center ${
                      activeArtist === index 
                        ? 'bg-accent/20 border border-accent/30' 
                        : 'bg-gray-800/50 hover:bg-gray-800'
                    }`}
                  >
                    <div 
                      className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${artist.imageUrl})` }}
                    />
                    
                    <div className="ml-3 flex-grow">
                      <h4 className="text-white font-medium">{artist.name}</h4>
                      <p className="text-gray-400 text-sm">{artist.genre}</p>
                    </div>
                    
                    {activeArtist === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                      >
                        <Play className="w-3 h-3 text-white ml-0.5" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-800">
                <Link href="/artists">
                  <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-white">
                    View All Artists
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Artist categories */}
        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { icon: <Music className="h-8 w-8" />, name: "Musicians & Bands", count: 120 },
            { icon: <Mic className="h-8 w-8" />, name: "Vocalists", count: 75 },
            { icon: <Music2 className="h-8 w-8" />, name: "DJs", count: 50 },
            { icon: <Users className="h-8 w-8" />, name: "Performers", count: 40 },
          ].map((category, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 text-accent">
                {category.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">{category.name}</h3>
              <p className="text-gray-400">{category.count}+ available</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// Custom Music2, Mic, and Users icons components
function Music2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="18" r="4" />
      <path d="M12 18V2l7 4" />
    </svg>
  );
}

function Mic(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}