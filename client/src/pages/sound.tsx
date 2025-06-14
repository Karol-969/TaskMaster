import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Volume2, Mic, Music, Zap, ChevronDown, Star, Users, Calendar, CheckCircle } from 'lucide-react';
import { SoundEquipmentGallery } from '@/components/booking/sound-equipment-gallery';
import { SoundPackageSelector } from '@/components/booking/sound-package-selector';
import { SoundEquipmentBookingModal } from '@/components/booking/sound-equipment-booking-modal';

interface SoundSystem {
  id: number;
  name: string;
  type: string;
  description: string;
  specifications: string;
  pricing: string;
  powerRating: string;
  coverageArea: string;
  imageUrl: string;
  category: string;
  features: string[];
  available: boolean;
}

export default function SoundPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Equipment');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const equipmentRef = useRef<HTMLDivElement>(null);

  const { data: soundSystems = [], isLoading } = useQuery<SoundSystem[]>({
    queryKey: ['/api/sound-equipment-admin-bypass'],
  });

  const categories = [
    { name: 'All Equipment', icon: Volume2, count: soundSystems.length },
    { name: 'PA Systems', icon: Volume2, count: soundSystems.filter(s => s.category === 'PA Systems').length },
    { name: 'Mixers', icon: Music, count: soundSystems.filter(s => s.category === 'Mixers').length },
    { name: 'Microphones', icon: Mic, count: soundSystems.filter(s => s.category === 'Microphones').length },
    { name: 'Monitors', icon: Volume2, count: soundSystems.filter(s => s.category === 'Monitors').length },
    { name: 'Lighting', icon: Zap, count: soundSystems.filter(s => s.category === 'Lighting').length },
  ];

  const filteredSystems = soundSystems.filter(system => {
    const matchesSearch = system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         system.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Equipment' || system.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollToEquipment = () => {
    equipmentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const packages = [
    {
      id: 'basic',
      name: 'Basic Package',
      description: 'Perfect for small venues (50-100 people)',
      price: 'NPR 25,000',
      duration: '4 hours',
      features: [
        '2x Main speakers',
        '1x Mixer',
        '2x Microphones',
        'Basic lighting setup',
        'Setup/breakdown included'
      ],
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'
    },
    {
      id: 'standard',
      name: 'Standard Package',
      description: 'Ideal for medium venues (100-300 people)',
      price: 'NPR 45,000',
      duration: '6 hours',
      features: [
        '4x Main speakers',
        '1x Subwoofer',
        'Professional mixer',
        'Wireless microphone system',
        'Enhanced lighting package',
        'Technical support included'
      ],
      image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'
    },
    {
      id: 'premium',
      name: 'Premium Package',
      description: 'Complete solution for large venues (300+ people)',
      price: 'NPR 85,000',
      duration: '8 hours',
      features: [
        'Full PA system with line arrays',
        'Professional mixing console',
        'Complete wireless microphone system',
        'Professional lighting rig',
        'Dedicated sound engineer',
        'Full technical support'
      ],
      image: 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Professional Sound Systems | ReArt Events</title>
        <meta name="description" content="Rent professional sound systems and audio equipment for your events. From PA systems to lighting, we provide complete audio solutions with expert support." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-accent rounded-full opacity-30"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.sin(i) * 50, 0],
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                left: `${15 + i * 15}%`,
                top: `${60 + (i % 2) * 20}%`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-accent text-black font-semibold px-4 py-2">
              Professional Audio Solutions
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Professional <span className="text-accent">Sound Systems</span>
              <br />for Every Event
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Create the perfect audio experience with our premium sound equipment rental service. 
              From intimate gatherings to large-scale events, we provide top-quality audio solutions 
              with expert technical support.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-black px-8 py-6 text-lg font-semibold"
                onClick={scrollToEquipment}
              >
                Browse Equipment
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => setShowBookingForm(true)}
              >
                Get Quote
              </Button>
            </div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="cursor-pointer"
              onClick={scrollToEquipment}
            >
              <ChevronDown className="h-8 w-8 text-accent mx-auto" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Package Selection Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Choose Your Perfect Package
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Pre-configured sound packages for every event size and budget
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-2 hover:border-accent/20">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-accent text-black font-bold">{pkg.price}</Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-2xl text-slate-900 dark:text-white">{pkg.name}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-300">{pkg.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{pkg.duration} rental</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                      onClick={() => setShowBookingForm(true)}
                    >
                      Book This Package
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Categories & Gallery Section */}
      <section ref={equipmentRef} className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Professional Audio Equipment
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Browse our extensive collection of professional sound equipment
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </motion.div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={category.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.name
                      ? 'bg-accent text-black shadow-lg'
                      : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </motion.button>
              );
            })}
          </div>

          {/* Equipment Gallery */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-700 rounded-lg p-6 animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-slate-600 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <SoundEquipmentGallery 
              equipment={filteredSystems}
              onBookEquipment={() => setShowBookingForm(true)}
            />
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose Our Sound Systems?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Professional audio solutions with comprehensive support
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Volume2 className="h-12 w-12 text-accent" />,
                title: "Premium Quality",
                description: "Top-tier audio equipment from leading brands"
              },
              {
                icon: <Users className="h-12 w-12 text-accent" />,
                title: "Expert Support",
                description: "Professional sound engineers available"
              },
              {
                icon: <Zap className="h-12 w-12 text-accent" />,
                title: "Complete Setup",
                description: "Full installation and breakdown service"
              },
              {
                icon: <Star className="h-12 w-12 text-accent" />,
                title: "Reliable Service",
                description: "On-time delivery and 24/7 support"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-blue-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Create Amazing Audio Experiences?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get professional sound equipment for your next event with expert support and setup
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-black px-8 py-6"
                onClick={() => setShowBookingForm(true)}
              >
                Book Equipment Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-slate-900 px-8 py-6"
              >
                Contact for Custom Quote
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking Form Modal */}
      <SoundEquipmentBookingModal
        isOpen={showBookingForm}
        onClose={() => setShowBookingForm(false)}
      />
    </Layout>
  );
}