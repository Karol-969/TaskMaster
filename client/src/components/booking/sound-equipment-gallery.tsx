import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, Zap, Users, Star, X } from 'lucide-react';

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

interface SoundEquipmentGalleryProps {
  equipment: SoundSystem[];
  onBookEquipment: (equipment?: SoundSystem) => void;
}

export function SoundEquipmentGallery({ equipment, onBookEquipment }: SoundEquipmentGalleryProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<SoundSystem | null>(null);

  const getEquipmentImage = (system: SoundSystem) => {
    // Use appropriate images based on equipment category
    const imageMap: Record<string, string> = {
      'PA Systems': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
      'Mixers': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
      'Microphones': 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
      'Monitors': 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
      'Lighting': 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'
    };
    
    return system.imageUrl || imageMap[system.category] || imageMap['PA Systems'];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Lighting':
        return <Zap className="h-4 w-4" />;
      default:
        return <Volume2 className="h-4 w-4" />;
    }
  };

  if (equipment.length === 0) {
    return (
      <div className="text-center py-12">
        <Volume2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
          No equipment found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {equipment.map((system, index) => (
        <motion.div
          key={system.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
        >
          <Card className="h-full hover:shadow-xl transition-shadow duration-300 group">
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <img
                src={getEquipmentImage(system)}
                alt={system.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <Badge 
                  variant={system.available ? "default" : "destructive"}
                  className="bg-white/90 text-black"
                >
                  {system.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <Badge className="bg-accent text-black font-semibold">
                  {system.pricing}
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center space-x-1">
                {getCategoryIcon(system.category)}
                <Badge variant="secondary" className="text-xs">
                  {system.category}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                {system.name}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {system.description}
              </p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Power Rating:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{system.powerRating}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Coverage:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{system.coverageArea}</span>
                </div>
                {system.features && system.features.length > 0 && (
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Features:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {system.features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {system.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{system.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedEquipment(system)}
                  disabled={!system.available}
                >
                  View Details
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white purple-glow"
                  onClick={() => onBookEquipment(system)}
                  disabled={!system.available}
                >
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Equipment Details Modal */}
      <AnimatePresence>
        {selectedEquipment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEquipment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={getEquipmentImage(selectedEquipment)}
                  alt={selectedEquipment.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                  onClick={() => setSelectedEquipment(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute top-4 left-4">
                  <Badge 
                    variant={selectedEquipment.available ? "default" : "destructive"}
                    className="bg-white/90 text-black"
                  >
                    {selectedEquipment.available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedEquipment.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      {getCategoryIcon(selectedEquipment.category)}
                      <Badge variant="secondary">{selectedEquipment.category}</Badge>
                    </div>
                  </div>
                  <Badge className="bg-accent text-black font-semibold text-lg px-3 py-1">
                    {selectedEquipment.pricing}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                    <p className="text-gray-600 dark:text-gray-300">{selectedEquipment.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Specifications</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Power Rating:</span>
                          <span className="font-medium">{selectedEquipment.powerRating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Coverage Area:</span>
                          <span className="font-medium">{selectedEquipment.coverageArea}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Type:</span>
                          <span className="font-medium">{selectedEquipment.type}</span>
                        </div>
                      </div>
                    </div>

                    {selectedEquipment.features && selectedEquipment.features.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Features</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedEquipment.features.map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Technical Details</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                        {selectedEquipment.specifications}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedEquipment(null)}
                    >
                      Close
                    </Button>
                    <Button
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white purple-glow"
                      onClick={() => {
                        onBookEquipment(selectedEquipment);
                        setSelectedEquipment(null);
                      }}
                      disabled={!selectedEquipment.available}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}