import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Quote, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: number;
  text: string;
  authorName: string;
  authorPosition: string;
  authorCompany: string;
  avatarUrl?: string;
  rating: number;
  eventType: string;
}

export function EnhancedTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const testimonialRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Parallax effect setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  
  // Smooth animations with spring physics
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  // Fetch testimonials from API
  const { data: apiTestimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
    throwOnError: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sample testimonials if API returns empty
  const testimonials: Testimonial[] = apiTestimonials.length > 0 ? apiTestimonials : [
    {
      id: 1,
      text: "Working with Reart Events for our corporate gala was seamless. Their attention to detail and ability to book top-tier talent transformed our event from standard to spectacular.",
      authorName: "Michael Johnson",
      authorPosition: "Marketing Director",
      authorCompany: "Tech Innovations",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      eventType: "Corporate Gala"
    },
    {
      id: 2,
      text: "The sound system and venue we booked through Reart Events exceeded our expectations. The team was responsive, professional, and delivered exactly what we needed for our music festival.",
      authorName: "Sarah Parker",
      authorPosition: "Events Manager",
      authorCompany: "Rhythm Productions",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      eventType: "Music Festival"
    },
    {
      id: 3,
      text: "We hired an artist through Reart Events for our product launch, and the performance elevated the entire experience. Our clients were impressed, and the social media engagement was off the charts.",
      authorName: "David Chen",
      authorPosition: "CEO",
      authorCompany: "Innovate Design",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      rating: 4.5,
      eventType: "Product Launch"
    },
    {
      id: 4,
      text: "The influencer we booked through Reart Events helped us reach a whole new audience. The collaboration was smooth, and the results exceeded our marketing goals by 200%.",
      authorName: "Priya Sharma",
      authorPosition: "Social Media Director",
      authorCompany: "Global Brands",
      avatarUrl: "https://i.pravatar.cc/150?img=10",
      rating: 5,
      eventType: "Brand Promotion"
    },
    {
      id: 5,
      text: "Our wedding reception was absolutely magical thanks to Reart Events. The venue, music, and coordination were perfect. Our guests are still talking about it months later!",
      authorName: "James & Emma Wilson",
      authorPosition: "Newlyweds",
      authorCompany: "",
      avatarUrl: "https://i.pravatar.cc/150?img=8",
      rating: 5,
      eventType: "Wedding"
    }
  ];

  // Auto-advance testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  // Pause auto-play when hovering
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Navigation functions
  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };
  
  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const goToSpecific = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { type: "spring", stiffness: 300, damping: 30 }
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 }
      }
    })
  };

  // Background patterns animation
  const backgroundPatterns = [
    { id: 1, top: "10%", left: "5%", size: "150px", delay: 0 },
    { id: 2, top: "60%", left: "8%", size: "120px", delay: 0.2 },
    { id: 3, top: "20%", right: "5%", size: "180px", delay: 0.4 },
    { id: 4, top: "70%", right: "10%", size: "140px", delay: 0.6 },
    { id: 5, top: "40%", left: "45%", size: "200px", delay: 0.8 },
  ];

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Random testimonial card angles for a more dynamic look
  const getRandomAngle = (id: number) => {
    const angles = [-2, -1, 0, 1, 2];
    return angles[id % angles.length];
  };

  return (
    <section 
      ref={containerRef}
      className="py-32 relative overflow-hidden bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated background patterns */}
      {backgroundPatterns.map((pattern) => (
        <motion.div
          key={pattern.id}
          className="absolute rounded-full bg-gradient-to-r from-accent/10 to-accent/5 blur-3xl"
          style={{
            top: pattern.top,
            ...(pattern.left ? { left: pattern.left } : {}),
            ...(pattern.right ? { right: pattern.right } : {}),
            width: pattern.size,
            height: pattern.size,
          }}
          initial={{ opacity: 0.2, scale: 0.8 }}
          animate={{ 
            opacity: [0.2, 0.3, 0.2],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: pattern.delay,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Animated particles - Quote marks with higher opacity */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-accent"
            style={{ 
              opacity: 0.2 + Math.random() * 0.4, // Higher opacity between 0.2 and 0.6
              filter: `blur(${Math.random() * 2}px)`,
              transform: `rotate(${Math.random() * 40 - 20}deg)`
            }}
            initial={{ 
              y: "110vh", 
              x: `${Math.random() * 100}%`,
              scale: 0.5 + Math.random() * 1.5
            }}
            animate={{ 
              y: "-10vh", 
              opacity: [
                0.2 + Math.random() * 0.4, 
                0.4 + Math.random() * 0.4, 
                0.2 + Math.random() * 0.3
              ]
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 30,
              ease: "linear"
            }}
          >
            {Math.random() > 0.5 ? (
              <Quote size={15 + Math.random() * 40} strokeWidth={1.5} />
            ) : (
              <svg width={15 + Math.random() * 40} height={15 + Math.random() * 40} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  fill="none"
                  opacity="0.7"
                />
                <path 
                  d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.004c1 0 .996 0 .996 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  fill="none" 
                  opacity="0.7"
                />
              </svg>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Main content */}
      <motion.div 
        className="container mx-auto px-4 relative z-10"
        style={{ 
          y: springY,
          opacity: springOpacity,
          scale: springScale
        }}
      >
        {/* Section heading */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.2 }}
          >
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-accent to-accent/70 flex items-center justify-center shadow-lg shadow-accent/20">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Hear from those who have experienced the excellence of Reart Events.
          </motion.p>
        </motion.div>
        
        {/* Testimonials carousel */}
        <div className="max-w-5xl mx-auto relative">
          {/* Main testimonial display */}
          <div className="relative min-h-[400px] md:min-h-[280px]">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={testimonials[currentIndex].id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-full"
                ref={el => testimonialRefs.current[currentIndex] = el}
              >
                <div className="bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-xl border border-gray-800/50 relative overflow-hidden">
                  {/* Background grain effect */}
                  <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>
                
                  {/* Quote icon */}
                  <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 text-accent/20">
                    <Quote size={100} strokeWidth={1} />
                  </div>
                  
                  {/* Content */}
                  <div className="relative">
                    {/* Event type tag */}
                    <div className="mb-5 inline-block">
                      <span className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-full">
                        {testimonials[currentIndex].eventType}
                      </span>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={18} 
                          className={cn(
                            "mr-1",
                            i < Math.floor(testimonials[currentIndex].rating) 
                              ? "text-yellow-400 fill-yellow-400" 
                              : i < testimonials[currentIndex].rating 
                                ? "text-yellow-400 fill-yellow-400 opacity-50" 
                                : "text-gray-500"
                          )} 
                        />
                      ))}
                    </div>
                    
                    {/* Testimonial text */}
                    <p className="text-white text-lg md:text-xl font-medium mb-6 relative">
                      "{testimonials[currentIndex].text}"
                    </p>
                    
                    {/* Author info */}
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 md:h-16 md:w-16 border-2 border-accent/30">
                        {testimonials[currentIndex].avatarUrl ? (
                          <AvatarImage src={testimonials[currentIndex].avatarUrl} alt={testimonials[currentIndex].authorName} />
                        ) : null}
                        <AvatarFallback className="bg-accent/20 text-white">
                          {getInitials(testimonials[currentIndex].authorName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <h3 className="text-white font-semibold text-lg">{testimonials[currentIndex].authorName}</h3>
                        <p className="text-gray-400">
                          {testimonials[currentIndex].authorPosition}
                          {testimonials[currentIndex].authorCompany && (
                            <>, {testimonials[currentIndex].authorCompany}</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation arrows */}
          <div className="flex justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 px-4 pointer-events-none">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToPrevious}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-900/80 backdrop-blur-sm shadow-lg border border-gray-800/50 flex items-center justify-center text-white pointer-events-auto"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToNext}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-900/80 backdrop-blur-sm shadow-lg border border-gray-800/50 flex items-center justify-center text-white pointer-events-auto"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </motion.button>
          </div>
        </div>
        
        {/* Testimonial cards - additional visual */}
        <div className="mt-20 flex justify-center flex-wrap gap-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={cn(
                "w-16 h-16 cursor-pointer rounded-full border-2 transition-all duration-300 overflow-hidden relative",
                currentIndex === index
                  ? "border-accent scale-110 shadow-lg shadow-accent/20"
                  : "border-gray-800 opacity-60"
              )}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => goToSpecific(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transform: `rotate(${getRandomAngle(testimonial.id)}deg)`,
                zIndex: currentIndex === index ? 10 : 1
              }}
            >
              {testimonial.avatarUrl ? (
                <img 
                  src={testimonial.avatarUrl} 
                  alt={testimonial.authorName}
                  className="object-cover w-full h-full" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-accent/20 text-white font-medium">
                  {getInitials(testimonial.authorName)}
                </div>
              )}
              
              {/* Hover preview */}
              {hoveredIndex === index && (
                <motion.div 
                  className="absolute -bottom-20 left-1/2 -translate-x-1/2 z-20 w-48 bg-gray-900 rounded-md p-2 text-center shadow-xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-xs font-medium text-white truncate">{testimonial.authorName}</div>
                  <div className="text-xs text-gray-400 truncate">{testimonial.authorPosition}</div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Progress bar */}
        <div className="max-w-3xl mx-auto mt-10">
          <div className="bg-gray-800 h-1 rounded-full overflow-hidden">
            <motion.div 
              className="bg-accent h-full"
              initial={{ width: `${(currentIndex / testimonials.length) * 100}%` }}
              animate={{ width: `${((currentIndex + 1) / testimonials.length) * 100}%` }}
              transition={{ duration: isAutoPlaying ? 5 : 0.5, ease: "linear" }}
            />
          </div>
        </div>
        
        {/* CTA Button */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(var(--accent-rgb), 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-accent hover:bg-accent/90 text-white py-3 px-8 rounded-full font-medium text-lg shadow-lg shadow-accent/20"
          >
            Share Your Experience
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Helper function for rendering star ratings
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star 
          key={i} 
          size={18} 
          className={cn(
            "mr-1",
            i < Math.floor(rating) 
              ? "text-yellow-400 fill-yellow-400" 
              : i < rating 
                ? "text-yellow-400 fill-yellow-400 opacity-50" 
                : "text-gray-500"
          )} 
        />
      ))}
    </div>
  );
}