import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Clock, Volume2 } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  image: string;
  recommended?: boolean;
}

interface SoundPackageSelectorProps {
  packages: Package[];
  selectedPackage?: string;
  onSelectPackage: (packageId: string) => void;
}

export function SoundPackageSelector({ packages, selectedPackage, onSelectPackage }: SoundPackageSelectorProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {packages.map((pkg, index) => (
        <motion.div
          key={pkg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card className={`h-full cursor-pointer transition-all duration-300 ${
            selectedPackage === pkg.id 
              ? 'ring-2 ring-accent shadow-xl' 
              : 'hover:shadow-lg'
          } ${pkg.recommended ? 'border-accent border-2' : ''}`}
          onClick={() => onSelectPackage(pkg.id)}>
            {pkg.recommended && (
              <div className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-accent text-black font-bold px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              </div>
            )}
            
            <div className="relative h-32 overflow-hidden rounded-t-lg">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-black/70 text-white font-bold">
                  {pkg.price}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl">{pkg.name}</span>
                {selectedPackage === pkg.id && (
                  <CheckCircle className="h-5 w-5 text-accent" />
                )}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {pkg.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Volume2 className="h-4 w-4" />
                  <span>Professional</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}