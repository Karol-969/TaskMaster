import { useState } from 'react';
import { Link } from 'wouter';
import { Music, Calendar, Sparkles, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  linkTo: string;
  index: number;
}

function ServiceCard({ title, description, icon, image, linkTo, index }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="relative h-[400px] rounded-2xl overflow-hidden group"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.15,
        ease: [0.43, 0.13, 0.23, 0.96] 
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Gradient overlay with animated pulse */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10 
                    group-hover:via-blue-900/30 transition-all duration-700"></div>
      
      {/* Animated particles effect on hover */}
      {isHovered && (
        <motion.div 
          className="absolute inset-0 z-10 opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-blue-300 rounded-full animate-ping"></div>
          <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-blue-200 rounded-full animate-pulse"></div>
        </motion.div>
      )}
      
      {/* Background image with parallax effect */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
      
      {/* Glowing icon with animation */}
      <motion.div 
        className="absolute top-6 right-6 z-20 rounded-full p-3 bg-blue-900/50 backdrop-blur-sm shadow-lg"
        animate={{ 
          boxShadow: isHovered 
            ? '0 0 25px 5px rgba(59, 130, 246, 0.6), 0 0 10px 2px rgba(59, 130, 246, 0.4) inset' 
            : '0 0 0px 0px rgba(59, 130, 246, 0)'
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ 
            rotate: isHovered ? [0, 10, -10, 0] : 0,
            scale: isHovered ? [1, 1.2, 1] : 1,
          }}
          transition={{ 
            duration: 0.5,
            times: [0, 0.2, 0.5, 1],
            repeat: isHovered ? Infinity : 0,
            repeatDelay: 3
          }}
        >
          <div className="text-blue-300">{icon}</div>
        </motion.div>
      </motion.div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <motion.h3 
          className="text-2xl font-bold text-white mb-3"
          animate={{ 
            y: isHovered ? -5 : 0,
            textShadow: isHovered ? '0 0 8px rgba(59, 130, 246, 0.6)' : '0 0 0px rgba(0, 0, 0, 0)'
          }}
          transition={{ duration: 0.4 }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-gray-200 mb-6 text-sm max-w-[90%] leading-relaxed"
          animate={{ opacity: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        >
          {description}
        </motion.p>
        
        <motion.div
          animate={{ 
            y: isHovered ? 0 : 10,
            opacity: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.5 }}
        >
          <Link href={linkTo}>
            <div className="block w-full">
              <motion.button 
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-medium
                          shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore
              </motion.button>
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  const services = [
    {
      title: 'Weekly Live Music',
      description: 'Regular weekly live music arrangements featuring talented artists for venues seeking consistent entertainment.',
      icon: <Music className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
      linkTo: '/services/weekly-music',
    },
    {
      title: 'Monthly Calendar Events',
      description: 'Strategic planning and execution of monthly event calendars for venues and corporate clients.',
      icon: <Calendar className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
      linkTo: '/services/monthly-calendar',
    },
    {
      title: 'Event Concepts',
      description: 'Innovative and bespoke event concept creation and full-service management for special occasions.',
      icon: <Sparkles className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
      linkTo: '/services/event-concepts',
    },
    {
      title: 'Promotion & Sponsorships',
      description: 'Comprehensive marketing solutions and sponsorship acquisition for maximum event exposure and revenue.',
      icon: <BarChart className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
      linkTo: '/services/promotion-sponsorships',
    },
  ];

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-black to-slate-900">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Our Premium Services
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Elevate your events with our comprehensive suite of services designed to create unforgettable experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.title}
              {...service}
              index={index}
            />
          ))}
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
    </section>
  );
}
