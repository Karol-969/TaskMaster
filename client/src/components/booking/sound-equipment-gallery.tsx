import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, Zap, Users, Star } from 'lucide-react';

interface SoundSystem {
  id: number;
  name: string;
  type: string;
  description: string;
  specifications: string;
  pricing: string;
  powerRating: string;
  coverageArea: string;
  image: string;
  category: string;
  features: string[];
  available: boolean;
}

interface SoundEquipmentGalleryProps {
  equipment: SoundSystem[];
  onBookEquipment: (equipment?: SoundSystem) => void;
}

export function SoundEquipmentGallery({ equipment, onBookEquipment }: SoundEquipmentGalleryProps) {
  const getEquipmentImage = (system: SoundSystem) => {
    // Use appropriate images based on equipment category
    const imageMap: Record<string, string> = {
      'PA Systems': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
      'Mixers': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
      'Microphones': 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
      'Monitors': 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
      'Lighting': 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'
    };
    
    return system.image || imageMap[system.category] || imageMap['PA Systems'];
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
                  disabled={!system.available}
                >
                  View Details
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-accent hover:bg-accent/90 text-black"
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
    </div>
  );
}