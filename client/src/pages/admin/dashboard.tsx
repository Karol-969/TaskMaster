import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  Music, 
  DollarSign, 
  TrendingUp, 
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  BarChart3,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/admin-layout';
import { useQuery } from '@tanstack/react-query';

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real-time dashboard data
  const { data: dashboardStats } = useQuery({
    queryKey: ['/api/admin/dashboard/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['/api/admin/dashboard/activity'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const stats = [
    {
      title: 'Total Revenue',
      value: dashboardStats?.totalRevenue || '$142,650',
      change: '+23.1%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Active Users',
      value: dashboardStats?.activeUsers || '1,234',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Active Events',
      value: dashboardStats?.activeEvents || '45',
      change: '+8.2%',
      changeType: 'positive',
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Verified Artists',
      value: dashboardStats?.verifiedArtists || '89',
      change: '+15.3%',
      changeType: 'positive',
      icon: Music,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  const quickActions = [
    {
      title: 'Create Event',
      description: 'Add a new event to the platform',
      icon: Calendar,
      action: () => {}, // Navigate to create event
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Approve Artists',
      description: 'Review pending artist applications',
      icon: Music,
      action: () => {}, // Navigate to artist approvals
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'View Reports',
      description: 'Access analytics and reports',
      icon: BarChart3,
      action: () => {}, // Navigate to reports
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: Settings,
      action: () => {}, // Navigate to settings
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  const activityData = recentActivity || [
    {
      id: 1,
      type: 'booking',
      message: 'New booking for "Summer Music Festival"',
      user: 'John Doe',
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'artist',
      message: 'Artist "DJ Mike" submitted verification documents',
      user: 'DJ Mike',
      timestamp: '15 minutes ago',
      status: 'pending'
    },
    {
      id: 3,
      type: 'payment',
      message: 'Payment of $2,500 processed successfully',
      user: 'Sarah Wilson',
      timestamp: '1 hour ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'event',
      message: 'New event "Jazz Night" created',
      user: 'Admin',
      timestamp: '2 hours ago',
      status: 'info'
    }
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Dashboard - ReArt Events</title>
        <meta name="description" content="ReArt Events admin dashboard with real-time analytics and management tools" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              System Online
            </Badge>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 inline mr-1" />
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {stat.value}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-green-600 dark:text-green-400 text-xs font-medium">
                          {stat.change}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                          vs last month
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    onClick={action.action}
                    className={`w-full justify-start h-auto p-4 ${action.color}`}
                  >
                    <div className="flex items-center space-x-3">
                      <action.icon className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm opacity-90">{action.description}</div>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityData.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className={`p-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                      activity.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                      'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      {activity.status === 'success' ? (
                        <CheckCircle2 className={`h-4 w-4 ${
                          activity.status === 'success' ? 'text-green-600 dark:text-green-400' :
                          activity.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-blue-600 dark:text-blue-400'
                        }`} />
                      ) : activity.status === 'pending' ? (
                        <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.user}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}