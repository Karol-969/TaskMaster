import { motion } from 'framer-motion';

export function TrustedBySection() {
  const partners = [
    // Top Row - Hotels with Logos
    { 
      name: "Radisson Hotel Kathmandu", 
      logo: "/logos/radisson.png",
      hasLogo: true,
      category: "hotel"
    },
    { 
      name: "The Malla Hotel", 
      logo: "/logos/malla.png", 
      hasLogo: true,
      category: "hotel"
    },
    { 
      name: "The Soaltee Kathmandu", 
      logo: "/logos/soaltee.png",
      hasLogo: true,
      category: "hotel"
    },
    { 
      name: "Holiday Inn Express", 
      logo: "/logos/holiday-inn.png",
      hasLogo: true,
      category: "hotel"
    },
    { 
      name: "Hotel Himalaya", 
      logo: "/logos/himalaya.png",
      hasLogo: true,
      category: "hotel"
    },
    { 
      name: "The Everest Hotel", 
      logo: "/logos/everest.png",
      hasLogo: true,
      category: "hotel"
    },
    
    // Second Row
    { 
      name: "Dusit Thani", 
      logo: "/logos/dusit.png",
      hasLogo: true,
      category: "hotel"
    },
    { 
      name: "SkyPark", 
      logo: "/logos/skypark.png",
      hasLogo: true,
      category: "venue"
    },
    { 
      name: "Aloft Kathmandu", 
      logo: "/logos/aloft.png",
      hasLogo: true,
      category: "hotel"
    },
    { 
      name: "Marriott Kathmandu", 
      logo: "/logos/marriott.png",
      hasLogo: true,
      category: "hotel"
    },
    { 
      name: "Fairfield by Marriott", 
      logo: "/logos/fairfield.png",
      hasLogo: true,
      category: "hotel"
    },
    { 
      name: "Privé Nepal", 
      logo: "/logos/prive.png",
      hasLogo: true,
      category: "venue"
    },
    { 
      name: "Shangri-La", 
      logo: "/logos/shangri-la.png",
      hasLogo: true,
      category: "hotel"
    },
    
    // Third Row
    { 
      name: "Hyatt Centric", 
      logo: "/logos/hyatt.png",
      hasLogo: true,
      category: "hotel"
    },
    { 
      name: "Agricus", 
      displayName: "agricus",
      hasLogo: false,
      category: "restaurant"
    },
    { 
      name: "Dhokaima Cafe", 
      logo: "/logos/dhokaima.png",
      hasLogo: true,
      category: "restaurant"
    },
    { 
      name: "मसिंग", 
      displayName: "मसिंग",
      subtitle: "२५९०",
      hasLogo: false,
      category: "restaurant"
    },
    { 
      name: "Dust Princess", 
      displayName: "DUST PRINCESS",
      hasLogo: false,
      category: "venue"
    },
    { 
      name: "The Weavers", 
      logo: "/logos/weavers.png",
      hasLogo: true,
      category: "restaurant"
    },
    { 
      name: "Vin D'Oliva", 
      logo: "/logos/vin-doliva.png",
      hasLogo: true,
      category: "restaurant"
    },
    { 
      name: "JRB", 
      logo: "/logos/jrb.png",
      hasLogo: true,
      category: "brand"
    }
  ];

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
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gray-900 dark:text-white">TRUSTED </span>
            <span className="text-purple-500">BY</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Leading hotels, restaurants, and venues across Nepal trust us to deliver exceptional event experiences.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              variants={itemVariants}
              className="group flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700 min-h-[80px]"
            >
              {partner.hasLogo ? (
                <div className="w-full h-16 flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      const target = e.target as HTMLImageElement;
                      const container = target.parentElement;
                      if (container) {
                        container.innerHTML = `
                          <div class="text-center">
                            <div class="font-semibold text-gray-700 dark:text-gray-300 text-sm leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              ${partner.name}
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <div className="font-semibold text-gray-700 dark:text-gray-300 text-sm leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {partner.displayName || partner.name}
                  </div>
                  {partner.subtitle && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                      {partner.subtitle}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Join 50+ premium establishments that trust Reart Events for their entertainment needs
          </p>
        </motion.div>
      </div>
    </section>
  );
}