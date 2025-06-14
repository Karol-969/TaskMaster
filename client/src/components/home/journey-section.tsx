import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Fetch journey content from database - hooks must be called unconditionally
  const { data: homeContent, isLoading } = useQuery({
    queryKey: ['/api/home-content'],
    retry: false,
  });

  // Parallax effect for background
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Extract journey data with fallback - must be before any conditional returns
  const journeyData = (homeContent && Array.isArray(homeContent)) 
    ? homeContent.find((item: any) => item.section === 'journey')?.content || {}
    : {};
  const timelineData = journeyData.timeline || [];
  
  // Intersection observer to trigger animations when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-700 rounded-lg w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-700 rounded-lg w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 overflow-hidden" ref={containerRef}>
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0 z-0" 
        style={{ y: backgroundY }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black to-gray-900" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-accent"
              style={{
                width: Math.random() * 5 + 2 + "px",
                height: Math.random() * 5 + 2 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5 + 0.25,
                animationDuration: Math.random() * 50 + 30 + "s",
                animationDelay: Math.random() * 5 + "s"
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {journeyData.title || "Our Journey"}
          </motion.h2>
          {journeyData.subtitle && (
            <motion.p 
              className="text-xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              {journeyData.subtitle}
            </motion.p>
          )}
        </motion.div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-accent/50 z-0"></div>
          
          {/* Timeline items */}
          {timelineData.map((item: TimelineItem, index: number) => (
            <motion.div 
              key={index}
              className={`flex items-center mb-20 relative ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.2, ease: "easeOut" }}
            >
              {/* Year bubble */}
              <motion.div 
                className="absolute left-1/2 transform -translate-x-1/2 z-10 w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-lg"
                initial={{ scale: 0 }}
                animate={isVisible ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.2, type: "spring" }}
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-white font-bold">{item.year}</span>
              </motion.div>
              
              {/* Content box */}
              <motion.div 
                className={`w-5/12 ${index % 2 === 0 ? 'pr-16' : 'pl-16'}`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-accent/20">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </motion.div>
              
              <div className="w-1/2"></div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Animated decorative elements */}
      <motion.div 
        className="absolute bottom-0 right-0 w-64 h-64 opacity-20 z-0"
        animate={{ 
          rotate: 360,
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
          duration: 30, 
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        <div className="w-full h-full rounded-full border-4 border-accent"></div>
      </motion.div>
      
      <motion.div 
        className="absolute top-20 left-10 w-32 h-32 opacity-10 z-0"
        animate={{ 
          rotate: -360,
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        <div className="w-full h-full rounded-full border-2 border-white"></div>
      </motion.div>
    </section>
  );
}