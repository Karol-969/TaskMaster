import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  Music, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Activity,
  MessageSquare,
  Settings,
  BarChart3,
  UserPlus,
  CalendarPlus,
  Eye,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
// Import enhanced admin components
import { EnhancedAdminSidebar } from '@/components/admin/enhanced-admin-sidebar';
import { EnhancedDashboardOverview } from '@/components/admin/enhanced-dashboard-overview';
import { UserManagement } from '@/components/admin/user-management';
import { ArtistManagement } from '@/components/admin/artist-management';
import { EventManagement } from '@/components/admin/event-management';
import { BookingManagement } from '@/components/admin/booking-management';
import { VenueManagement } from '@/components/admin/venue-management';
import { FinancialManagement } from '@/components/admin/financial-management';
import { SystemSettings } from '@/components/admin/system-settings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const quickStats = [
    {
      title: 'Total Users',
      value: 1234,
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Events',
      value: 45,
      change: '+8.2%',
      changeType: 'positive',
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Verified Artists',
      value: 89,
      change: '+15.3%',
      changeType: 'positive',
      icon: Music,
      color: 'purple'
    },
    {
      title: 'Monthly Revenue',
      value: '$142,650',
      change: '+23.1%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'yellow'
    }
  ];

  const tabConfig = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3, component: DashboardOverview },
    { id: 'users', label: 'Users', icon: Users, component: UserManagement },
    { id: 'artists', label: 'Artists', icon: Music, component: ArtistManagement },
    { id: 'events', label: 'Events', icon: Calendar, component: EventManagement },
    { id: 'bookings', label: 'Bookings', icon: Activity, component: BookingManagement },
    { id: 'venues', label: 'Venues', icon: MapPin, component: VenueManagement },
    { id: 'financial', label: 'Financial', icon: DollarSign, component: FinancialManagement },
    { id: 'settings', label: 'Settings', icon: Settings, component: SystemSettings },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Admin Dashboard - ReArt Events</title>
        <meta name="description" content="Comprehensive admin panel for managing ReArt Events platform operations, users, artists, events, and analytics." />
      </Helmet>

      <div className="flex min-h-screen bg-slate-900">
        {/* Enhanced Sidebar */}
        <EnhancedAdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          tabConfig={tabConfig}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-400">Manage your ReArt Events platform</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="border-green-500 text-green-400">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  System Online
                </Badge>
                
                <Button variant="outline" size="sm">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  View Alerts
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                          <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                          <div className="flex items-center mt-2">
                            <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                            <span className="text-green-400 text-xs font-medium">{stat.change}</span>
                            <span className="text-slate-400 text-xs ml-1">vs last month</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                          <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Tab Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsContent value="overview">
                <EnhancedDashboardOverview />
              </TabsContent>
              
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
              
              <TabsContent value="artists">
                <ArtistManagement />
              </TabsContent>
              
              <TabsContent value="events">
                <EventManagement />
              </TabsContent>
              
              <TabsContent value="bookings">
                <BookingManagement />
              </TabsContent>
              
              <TabsContent value="venues">
                <VenueManagement />
              </TabsContent>
              
              <TabsContent value="financial">
                <FinancialManagement />
              </TabsContent>
              
              <TabsContent value="settings">
                <SystemSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}