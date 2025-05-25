import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Music, 
  Calendar, 
  MapPin, 
  Volume2, 
  Star, 
  TrendingUp,
  Activity,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ArtistsManagement } from './artists-management';
import { EventsManagement } from './events-management';
import { VenuesManagement } from './venues-management';
import { SoundSystemsManagement } from './sound-systems-management';
import { InfluencersManagement } from './influencers-management';
import { UsersManagement } from './users-management';
import { BookingsManagement } from './bookings-management';
import { TestimonialsManagement } from './testimonials-management';
import { AdminStats } from './admin-stats';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabItems = [
    {
      value: 'overview',
      label: 'Overview',
      icon: Activity,
      description: 'Dashboard overview and statistics'
    },
    {
      value: 'users',
      label: 'Users',
      icon: Users,
      description: 'Manage user accounts'
    },
    {
      value: 'artists',
      label: 'Artists',
      icon: Music,
      description: 'Manage artists and performers'
    },
    {
      value: 'events',
      label: 'Events',
      icon: Calendar,
      description: 'Manage events and bookings'
    },
    {
      value: 'venues',
      label: 'Venues',
      icon: MapPin,
      description: 'Manage event venues'
    },
    {
      value: 'sound-systems',
      label: 'Sound Systems',
      icon: Volume2,
      description: 'Manage audio equipment'
    },
    {
      value: 'influencers',
      label: 'Influencers',
      icon: Star,
      description: 'Manage influencer partnerships'
    },
    {
      value: 'bookings',
      label: 'Bookings',
      icon: UserCheck,
      description: 'Manage all bookings'
    },
    {
      value: 'testimonials',
      label: 'Testimonials',
      icon: TrendingUp,
      description: 'Manage customer reviews'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-300 text-lg">
                Manage all aspects of your event management platform
              </p>
            </div>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30 px-4 py-2">
              Administrator
            </Badge>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <TabsList className="grid grid-cols-3 lg:grid-cols-9 gap-2 bg-slate-800/50 p-2 rounded-xl">
              {tabItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="flex flex-col items-center space-y-1 p-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium hidden sm:block">{item.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TabsContent value="overview" className="space-y-6">
              <AdminStats />
              
              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tabItems.slice(1).map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Card
                      key={item.value}
                      className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                      onClick={() => setActiveTab(item.value)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-600/20 rounded-lg">
                            <Icon className="h-6 w-6 text-blue-400" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{item.label}</CardTitle>
                            <CardDescription className="text-gray-400 text-sm">
                              {item.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="users">
              <UsersManagement />
            </TabsContent>

            <TabsContent value="artists">
              <ArtistsManagement />
            </TabsContent>

            <TabsContent value="events">
              <EventsManagement />
            </TabsContent>

            <TabsContent value="venues">
              <VenuesManagement />
            </TabsContent>

            <TabsContent value="sound-systems">
              <SoundSystemsManagement />
            </TabsContent>

            <TabsContent value="influencers">
              <InfluencersManagement />
            </TabsContent>

            <TabsContent value="bookings">
              <BookingsManagement />
            </TabsContent>

            <TabsContent value="testimonials">
              <TestimonialsManagement />
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
}