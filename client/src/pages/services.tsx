import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { motion } from 'framer-motion';
import { ChevronRight, Music, Calendar, Users, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function ServicesPage() {
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

  // Service data
  const services = [
    {
      id: 1,
      title: "Weekly Live Music Arrangement",
      description: "Arrangement of various artists for three days a week i.e. Wednesday, Friday and Saturday.",
      longDescription: "Our weekly live music arrangement service provides high-quality performers for your venue on a consistent schedule. We handle artist selection, scheduling, and all logistics to ensure smooth performances on Wednesdays, Fridays, and Saturdays. Each artist is carefully vetted to match your venue's atmosphere and audience preferences.",
      icon: <Music className="h-10 w-10 text-accent" />,
      image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      link: "/services/weekly-music"
    },
    {
      id: 2,
      title: "Working on Monthly Calendar Basis",
      description: "Arranging dedicated artists for every month on a calendar basis, which will be auditioned and fixed.",
      longDescription: "Our monthly calendar service provides a structured approach to your venue's entertainment needs. We create a comprehensive monthly plan with dedicated artists who are auditioned and confirmed in advance. This service includes performance schedules, artist profiles, and promotional materials to help you market upcoming performances.",
      icon: <Calendar className="h-10 w-10 text-accent" />,
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      link: "/services/monthly-artists"
    },
    {
      id: 3,
      title: "Monthly Event Concepts/Management",
      description: "Quality focus will be on crowd-engaging event ideas/concepts every month on basis of proper theme.",
      longDescription: "Our event concept and management service takes your events to the next level. We develop unique, crowd-engaging themes and experiences tailored to your audience and venue. From concept development to execution, our team handles all aspects of event planning, including themed decor, special performances, and interactive elements to ensure a memorable experience for your guests.",
      icon: <Users className="h-10 w-10 text-accent" />,
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      link: "/services/event-concepts"
    },
    {
      id: 4,
      title: "Promotion and Sponsorships",
      description: "Promoting the business on both digital and physical platform along-side handling sponsorship deals.",
      longDescription: "Our promotion and sponsorship service helps maximize your event's reach and financial success. We develop comprehensive marketing strategies across digital and physical platforms, creating engaging content that drives attendance. Additionally, our team identifies and secures relevant sponsorship opportunities, negotiating deals that benefit both your event and the sponsor while maintaining the integrity of your brand.",
      icon: <BarChart className="h-10 w-10 text-accent" />,
      image: "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      link: "/services/promotion-sponsorships"
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Our Services | ReArt Events</title>
        <meta name="description" content="Explore our range of event management services including weekly live music arrangements, monthly artist arrangements, event concepts, and promotion services." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gray-900">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our <span className="text-accent">Services</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              We provide comprehensive event management services focused on live music solutions and unique event experiences.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-accent hover:bg-accent/90 text-white px-6 py-6" size="lg">
                Book Now
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-6" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ReArt Events provides specialized services to make your events memorable and engaging.
              From arranging live music to creating unique event concepts, we've got you covered.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {services.map((service) => (
              <motion.div 
                key={service.id}
                className="service-card group relative overflow-hidden rounded-2xl shadow-2xl border border-gray-800/50 hover:border-accent/30 transition-all duration-500 bg-black/60 backdrop-blur-sm hover:shadow-accent/20 hover:shadow-xl"
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Overlay with better gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  
                  {/* Glowing icon */}
                  <div className="absolute top-6 left-6 bg-accent/90 text-white p-4 rounded-full shadow-[0_0_15px_rgba(120,120,255,0.5)] backdrop-blur-sm group-hover:shadow-[0_0_25px_rgba(120,120,255,0.7)] transition-all duration-500">
                    {service.icon}
                  </div>
                  
                  {/* Title overlaid on image with gradient background */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white group-hover:text-accent transition-colors duration-300">
                      {service.title}
                    </h3>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="mb-6">
                    <p className="text-gray-300 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  
                  <Link href={service.link}>
                    <Button 
                      variant="default" 
                      className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white py-6 text-base transition-all rounded-xl shadow-lg hover:shadow-accent/30 hover:shadow-md"
                    >
                      Explore Service
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ReArt Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine creativity with functionality to deliver exceptional event experiences that exceed expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-accent/50 transition-all duration-300">
              <div className="bg-accent/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Music className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Musicians</h3>
              <p className="text-gray-400">
                Access to a diverse network of professional artists across different genres and styles.
              </p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-accent/50 transition-all duration-300">
              <div className="bg-accent/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Reliable Scheduling</h3>
              <p className="text-gray-400">
                Organized management of performances with dedicated artists on fixed weekly schedules.
              </p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-accent/50 transition-all duration-300">
              <div className="bg-accent/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Creative Concepts</h3>
              <p className="text-gray-400">
                Innovative and engaging event ideas tailored to your specific needs and audience preferences.
              </p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-accent/50 transition-all duration-300">
              <div className="bg-accent/20 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <BarChart className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Marketing Support</h3>
              <p className="text-gray-400">
                Comprehensive promotion across digital and physical platforms to maximize your event's reach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/10 backdrop-blur-sm" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 p-12 rounded-2xl border border-gray-700/50 shadow-2xl backdrop-blur-sm">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Plan Your Next Event?</h2>
              <p className="text-lg text-gray-300 mb-8">
                Let's create a memorable experience for your audience. Contact us today to discuss how we can help bring your vision to life.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-accent hover:bg-accent/90 text-white px-8 py-7" size="lg">
                  Get Started
                </Button>
                <Button variant="outline" className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-7" size="lg">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}