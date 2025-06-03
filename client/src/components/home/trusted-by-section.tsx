import { motion } from 'framer-motion';

export function TrustedBySection() {
  const partners = [
    // Top Row
    { 
      name: "Radisson Hotel Kathmandu", 
      logo: "https://logos-world.net/wp-content/uploads/2020/06/Radisson-Logo.png",
      category: "hotel"
    },
    { 
      name: "The Malla Hotel", 
      logo: "https://www.themalla.com/assets/images/logo.png",
      category: "hotel"
    },
    { 
      name: "The Soaltee Kathmandu", 
      logo: "https://soalteehotels.com/wp-content/uploads/2021/09/soaltee-logo-1.png",
      category: "hotel"
    },
    { 
      name: "Holiday Inn Express", 
      logo: "https://logos-world.net/wp-content/uploads/2021/02/Holiday-Inn-Logo.png",
      category: "hotel"
    },
    { 
      name: "Hotel Himalaya", 
      logo: "https://hotelhimalaya.com/images/logo.png",
      category: "hotel"
    },
    { 
      name: "The Everest Hotel", 
      logo: "https://www.everesthotel.com.np/assets/images/logo.png",
      category: "hotel"
    },
    
    // Second Row
    { 
      name: "Dusit Thani", 
      logo: "https://logos-world.net/wp-content/uploads/2022/01/Dusit-Logo.png",
      category: "hotel"
    },
    { 
      name: "SkyPark", 
      logo: "https://via.placeholder.com/120x60/4338ca/ffffff?text=SkyPark",
      category: "venue"
    },
    { 
      name: "Aloft Kathmandu", 
      logo: "https://logos-world.net/wp-content/uploads/2021/02/Aloft-Logo.png",
      category: "hotel"
    },
    { 
      name: "Marriott Kathmandu", 
      logo: "https://logos-world.net/wp-content/uploads/2020/06/Marriott-Logo.png",
      category: "hotel"
    },
    { 
      name: "Fairfield by Marriott", 
      logo: "https://logos-world.net/wp-content/uploads/2021/11/Fairfield-by-Marriott-Logo.png",
      category: "hotel"
    },
    { 
      name: "Privé Nepal", 
      logo: "https://via.placeholder.com/120x60/8b5cf6/ffffff?text=PRIVÉ",
      category: "venue"
    },
    { 
      name: "Shangri-La", 
      logo: "https://logos-world.net/wp-content/uploads/2020/12/Shangri-La-Logo.png",
      category: "hotel"
    },
    
    // Third Row
    { 
      name: "Hyatt Centric", 
      logo: "https://logos-world.net/wp-content/uploads/2020/06/Hyatt-Logo.png",
      category: "hotel"
    },
    { 
      name: "Agricus", 
      logo: "https://via.placeholder.com/120x60/22c55e/ffffff?text=agricus",
      category: "restaurant"
    },
    { 
      name: "Dhokaima Cafe", 
      logo: "https://via.placeholder.com/120x60/a16207/ffffff?text=DHOKAIMA",
      category: "restaurant"
    },
    { 
      name: "मसिंग (Masing)", 
      logo: "https://via.placeholder.com/120x60/dc2626/ffffff?text=मसिंग",
      category: "restaurant"
    },
    { 
      name: "Dust Princess", 
      logo: "https://via.placeholder.com/120x60/84cc16/ffffff?text=DUST+PRINCESS",
      category: "venue"
    },
    { 
      name: "The Weavers", 
      logo: "https://via.placeholder.com/120x60/b45309/ffffff?text=THE+WEAVERS",
      category: "restaurant"
    },
    { 
      name: "Vin D'Oliva", 
      logo: "https://via.placeholder.com/120x60/7c2d12/ffffff?text=VIN+D'OLIVA",
      category: "restaurant"
    },
    { 
      name: "JRB", 
      logo: "https://via.placeholder.com/120x60/ea580c/ffffff?text=JRB",
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
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6 items-center"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              variants={itemVariants}
              className="group flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-full h-16 flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to text logo if image fails
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="text-center">
                          <div class="text-xs font-semibold text-gray-600 dark:text-gray-300 leading-tight">
                            ${partner.name}
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
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