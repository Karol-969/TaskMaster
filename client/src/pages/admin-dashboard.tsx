import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  Music, 
  BarChart3, 
  MapPin, 
  Volume2,
  TrendingUp,
  Activity,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import admin components
import { OverviewDashboard } from '@/components/admin/overview-dashboard';
import { UsersManagement } from '@/components/admin/users-management';
import { ArtistsManagement } from '@/components/admin/artists-management';
import { EventsManagement } from '@/components/admin/events-management';
import { VenuesManagement } from '@/components/admin/venues-management';
import { SoundSystemsManagement } from '@/components/admin/sound-systems-management';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  isActive: boolean;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      component: OverviewDashboard,
      isActive: true
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      component: UsersManagement,
      isActive: true
    },
    {
      id: 'artists',
      label: 'Artists',
      icon: Music,
      component: ArtistsManagement,
      isActive: true
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
      component: EventsManagement,
      isActive: true
    },
    {
      id: 'venues',
      label: 'Venues',
      icon: MapPin,
      component: VenuesManagement,
      isActive: false // Future feature
    },
    {
      id: 'sound-systems',
      label: 'Sound Systems',
      icon: Volume2,
      component: SoundSystemsManagement,
      isActive: false // Future feature
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Admin Dashboard - Reart Events</title>
        <meta name="description" content="Administrative dashboard for managing events, users, artists, and platform operations." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="container mx-auto px-4 py-8">
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
                  Admin <span className="text-blue-400">Dashboard</span>
                </h1>
                <p className="text-gray-300 text-lg">
                  Manage your platform with precision and control
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-green-600/20 text-green-300 border-green-500/30">
                  <Activity className="h-3 w-3 mr-1" />
                  System Online
                </Badge>
                
                <Button variant="outline" className="border-blue-500/30 text-blue-300 hover:bg-blue-600/10">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Dashboard Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tab Navigation */}
              <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700 mb-8">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      disabled={!tab.isActive}
                      className={`flex items-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 transition-all duration-200 ${
                        !tab.isActive ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      {!tab.isActive && (
                        <Badge variant="secondary" className="ml-1 text-xs bg-yellow-600/20 text-yellow-300">
                          Soon
                        </Badge>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* Tab Content */}
              {tabs.map((tab) => {
                const Component = tab.component;
                return (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0">
                    {tab.isActive ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Component />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-center py-16"
                      >
                        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 max-w-md mx-auto">
                          <CardHeader>
                            <div className="flex justify-center mb-4">
                              <tab.icon className="h-16 w-16 text-yellow-400" />
                            </div>
                            <CardTitle className="text-white text-2xl">
                              {tab.label} - Coming Soon
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-300 mb-6">
                              This feature is under development and will be available in a future update.
                            </p>
                            <Badge variant="outline" className="bg-yellow-600/20 text-yellow-300 border-yellow-500/30">
                              Feature in Development
                            </Badge>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}