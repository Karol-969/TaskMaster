import { useState } from 'react';
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
  Settings,
  BarChart3,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSimple() {
  const [activeTab, setActiveTab] = useState('overview');

  const quickStats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12.5%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Events',
      value: '45',
      change: '+8.2%',
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Verified Artists',
      value: '89',
      change: '+15.3%',
      icon: Music,
      color: 'purple'
    },
    {
      title: 'Monthly Revenue',
      value: '$142,650',
      change: '+23.1%',
      icon: DollarSign,
      color: 'yellow'
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Admin Dashboard - ReArt Events</title>
        <meta name="description" content="Comprehensive admin panel for managing ReArt Events platform operations, users, artists, events, and analytics." />
      </Helmet>

      <div className="min-h-screen bg-slate-900">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">ReArt Admin</h2>
                  <p className="text-slate-400 text-xs">Control Panel</p>
                </div>
              </div>
            </div>

            <div className="flex-1 py-4">
              <nav className="space-y-1 px-3">
                {[
                  { id: 'overview', label: 'Dashboard', icon: BarChart3 },
                  { id: 'users', label: 'Users', icon: Users },
                  { id: 'artists', label: 'Artists', icon: Music },
                  { id: 'events', label: 'Events', icon: Calendar },
                  { id: 'venues', label: 'Venues', icon: MapPin },
                  { id: 'financial', label: 'Financial', icon: DollarSign },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Button
                      variant={activeTab === item.id ? "secondary" : "ghost"}
                      className={`w-full justify-start h-12 px-4 ${
                        activeTab === item.id 
                          ? 'bg-blue-600/20 text-blue-400 border-l-2 border-l-blue-500' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      <span className="flex-1 text-left">{item.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-slate-700">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">System Status</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                  <p className="text-slate-400">Manage your ReArt Events platform</p>
                </div>
                
                <Badge variant="outline" className="border-green-500 text-green-400">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  System Online
                </Badge>
              </div>
            </div>

            <div className="p-6">
              {/* Quick Stats */}
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

              {/* Content Area */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">Welcome to Admin Dashboard</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 mb-4">
                          You have full administrative access to manage all aspects of the ReArt Events platform.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center text-slate-300">
                            <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                            <span>User Management System</span>
                          </div>
                          <div className="flex items-center text-slate-300">
                            <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                            <span>Artist & Event Management</span>
                          </div>
                          <div className="flex items-center text-slate-300">
                            <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                            <span>Financial Analytics</span>
                          </div>
                          <div className="flex items-center text-slate-300">
                            <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                            <span>System Configuration</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                          <Users className="h-4 w-4 mr-2" />
                          Manage Users
                        </Button>
                        <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                          <Calendar className="h-4 w-4 mr-2" />
                          Create Event
                        </Button>
                        <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Analytics
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="users">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">User Management System</h3>
                        <p className="text-slate-400">Comprehensive user management tools and analytics</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="artists">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Artist Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Music className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Artist Management System</h3>
                        <p className="text-slate-400">Manage artist profiles, verification, and performance tracking</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="events">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Event Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Event Management System</h3>
                        <p className="text-slate-400">Create, schedule, and manage events with advanced tools</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="venues">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Venue Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Venue Management System</h3>
                        <p className="text-slate-400">Manage venues, capacity, and booking availability</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="financial">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Financial Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <DollarSign className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Financial Management System</h3>
                        <p className="text-slate-400">Revenue tracking, commission management, and financial analytics</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">System Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Settings className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">System Configuration</h3>
                        <p className="text-slate-400">Platform settings, security, and system maintenance</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}