import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2, Construction } from 'lucide-react';
import { motion } from 'framer-motion';

export function SoundSystemsManagement() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="text-center">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-orange-600/20">
                <Construction className="h-12 w-12 text-orange-400" />
              </div>
            </div>
            <CardTitle className="text-white text-3xl mb-4">
              Sound Systems Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              The sound systems management feature is currently under development. This feature will include:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Volume2 className="h-4 w-4 text-blue-400" />
                  <span className="text-white font-semibold">Equipment Catalog</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Complete inventory of audio equipment, speakers, and sound systems
                </p>
              </div>
              
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Volume2 className="h-4 w-4 text-green-400" />
                  <span className="text-white font-semibold">Rental Management</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Track rentals, availability, and maintenance schedules
                </p>
              </div>
              
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Volume2 className="h-4 w-4 text-purple-400" />
                  <span className="text-white font-semibold">Technical Specs</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Detailed specifications, power requirements, and compatibility
                </p>
              </div>
              
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Volume2 className="h-4 w-4 text-yellow-400" />
                  <span className="text-white font-semibold">Quality Assurance</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Equipment testing, quality checks, and performance monitoring
                </p>
              </div>
            </div>
            
            <div className="pt-4">
              <Badge variant="outline" className="bg-orange-600/20 text-orange-300 border-orange-500/30">
                Coming in Next Release
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}