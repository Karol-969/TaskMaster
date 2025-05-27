import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Music, 
  Search, 
  Star,
  UserCheck,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

export function ArtistManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: artists = [], isLoading } = useQuery({
    queryKey: ['/api/artists'],
  });

  const artistStats = {
    total: artists.length,
    verified: artists.filter((artist: any) => artist.verified).length,
    pending: artists.filter((artist: any) => !artist.verified).length,
    topEarner: artists.length > 0 ? artists[0] : null,
  };

  return (
    <div className="space-y-6">
      {/* Artist Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Artists</p>
                <p className="text-2xl font-bold text-white">{artistStats.total}</p>
              </div>
              <Music className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Verified Artists</p>
                <p className="text-2xl font-bold text-green-400">{artistStats.verified}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending Verification</p>
                <p className="text-2xl font-bold text-yellow-400">{artistStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Rating</p>
                <p className="text-2xl font-bold text-blue-400">4.8</p>
              </div>
              <Star className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Artist Management Panel */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle className="text-white flex items-center space-x-2">
              <Music className="h-5 w-5" />
              <span>Artist Management</span>
            </CardTitle>
            
            <div className="flex space-x-2">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <UserCheck className="h-4 w-4 mr-2" />
                Verify Artists
              </Button>
              <Button variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Payment Reports
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search artists by name, genre, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600"
            />
          </div>

          {/* Artists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-700 rounded-lg h-64"></div>
                </div>
              ))
            ) : (
              artists.map((artist: any, index: number) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-slate-700/50 border-slate-600 hover:border-purple-500/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-purple-600 text-white text-lg">
                            {artist.name?.charAt(0).toUpperCase() || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-bold text-white">{artist.name}</h3>
                          <p className="text-slate-400 text-sm">{artist.genre}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {artist.verified ? (
                              <Badge className="bg-green-500/20 text-green-400">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-500/20 text-yellow-400">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Rating</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-white">{artist.rating || '4.5'}</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Events</span>
                          <span className="text-white">{artist.eventCount || '12'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Revenue</span>
                          <span className="text-green-400">${artist.revenue || '2,450'}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        {!artist.verified && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verify
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}