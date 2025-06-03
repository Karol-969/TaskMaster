import { motion } from 'framer-motion';

export function TrustedBySection() {
  const partners = [
    // Top Row
    { 
      name: "Radisson Hotel Kathmandu", 
      displayName: "Radisson",
      subtitle: "HOTEL KATHMANDU",
      category: "hotel"
    },
    { 
      name: "The Malla Hotel", 
      displayName: "The Malla Hotel",
      subtitle: "",
      category: "hotel"
    },
    { 
      name: "The Soaltee Kathmandu", 
      displayName: "The Soaltee",
      subtitle: "KATHMANDU",
      category: "hotel"
    },
    { 
      name: "Holiday Inn Express", 
      displayName: "Holiday Inn Express",
      subtitle: "AN IHG HOTEL",
      category: "hotel"
    },
    { 
      name: "Hotel Himalaya", 
      displayName: "Hotel Himalaya",
      subtitle: "",
      category: "hotel"
    },
    { 
      name: "The Everest Hotel", 
      displayName: "The Everest Hotel",
      subtitle: "KATHMANDU",
      category: "hotel"
    },
    
    // Second Row
    { 
      name: "Dusit Thani", 
      displayName: "Dusit Thani",
      subtitle: "",
      category: "hotel"
    },
    { 
      name: "SkyPark", 
      displayName: "SkyPark",
      subtitle: "ADVENTURE VENUE",
      category: "venue"
    },
    { 
      name: "Aloft Kathmandu", 
      displayName: "aloft",
      subtitle: "KATHMANDU THAMEL",
      category: "hotel"
    },
    { 
      name: "Marriott Kathmandu", 
      displayName: "Marriott",
      subtitle: "KATHMANDU",
      category: "hotel"
    },
    { 
      name: "Fairfield by Marriott", 
      displayName: "Fairfield",
      subtitle: "BY MARRIOTT",
      category: "hotel"
    },
    { 
      name: "Privé Nepal", 
      displayName: "privé",
      subtitle: "NEPAL",
      category: "venue"
    },
    { 
      name: "Shangri-La", 
      displayName: "Shangri-La",
      subtitle: "",
      category: "hotel"
    },
    
    // Third Row
    { 
      name: "Hyatt Centric", 
      displayName: "HYATT",
      subtitle: "CENTRIC",
      category: "hotel"
    },
    { 
      name: "Agricus", 
      displayName: "agricus",
      subtitle: "",
      category: "restaurant"
    },
    { 
      name: "Dhokaima Cafe", 
      displayName: "DHOKAIMA",
      subtitle: "Cafe",
      category: "restaurant"
    },
    { 
      name: "मसिंग", 
      displayName: "मसिंग",
      subtitle: "२५९०",
      category: "restaurant"
    },
    { 
      name: "Dust Princess", 
      displayName: "DUST PRINCESS",
      subtitle: "",
      category: "venue"
    },
    { 
      name: "The Weavers", 
      displayName: "THE WEAVERS",
      subtitle: "",
      category: "restaurant"
    },
    { 
      name: "Vin D'Oliva", 
      displayName: "VIN D'OLIVA",
      subtitle: "",
      category: "restaurant"
    },
    { 
      name: "JRB", 
      displayName: "JRB",
      subtitle: "",
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
              <div className="text-center">
                <div className="font-semibold text-gray-700 dark:text-gray-300 text-sm leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {partner.displayName}
                </div>
                {partner.subtitle && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                    {partner.subtitle}
                  </div>
                )}
              </div>
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