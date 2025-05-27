
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Calendar, 
  Music, 
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  UserPlus,
  CalendarPlus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Star,
  MapPin
} from 'lucide-react';

export function EnhancedDashboardOverview() {
  const [timeRange, setTimeRange] = useState('7d');

  // Simulated real-time data - in a real app, this would come from your API
  const dashboardStats = {
    totalUsers: { value: 2847, change: 12.5, trend: 'up' },
    activeEvents: { value: 156, change: 8.2, trend: 'up' },
    totalRevenue: { value: 284650, change: 23.1, trend: 'up' },
    pendingBookings: { value: 23, change: -15.3, trend: 'down' },
    verifiedArtists: { value: 89, change: 15.3, trend: 'up' },
    averageRating: { value: 4.8, change: 2.1, trend: 'up' }
  };

  const recentActivity = [
    { type: 'booking', user: 'John Smith', action: 'booked artist "The Adapters"', time: '2 minutes ago', status: 'success' },
    { type: 'user', user: 'Sarah Wilson', action: 'registered new account', time: '5 minutes ago', status: 'info' },
    { type: 'payment', user: 'Mike Johnson', action: 'payment confirmed for event', time: '12 minutes ago', status: 'success' },
    { type: 'artist', user: 'Lisa Chen', action: 'artist verification pending', time: '18 minutes ago', status: 'warning' },
    { type: 'event', user: 'Admin', action: 'created new event "Jazz Night"', time: '25 minutes ago', status: 'info' }
  ];

  const quickActions = [
    { label: 'Create Event', icon: CalendarPlus, action: () => {}, color: 'blue' },
    { label: 'Add Artist', icon: UserPlus, action: () => {}, color: 'purple' },
    { label: 'View Analytics', icon: TrendingUp, action: () => {}, color: 'green' },
    { label: 'Manage Users', icon: Users, action: () => {}, color: 'orange' }
  ];

  const StatCard = ({ title, value, change, trend, icon: Icon, prefix = '', suffix = '' }) => (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
              )}
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-slate-400 text-xs ml-1">vs last {timeRange}</span>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <Icon className={`h-6 w-6 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-slate-400">Real-time insights and platform metrics</p>
        </div>
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList className="bg-slate-800">
            <TabsTrigger value="24h">24H</TabsTrigger>
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="30d">30D</TabsTrigger>
            <TabsTrigger value="90d">90D</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={dashboardStats.totalUsers.value}
          change={dashboardStats.totalUsers.change}
          trend={dashboardStats.totalUsers.trend}
          icon={Users}
        />
        <StatCard
          title="Active Events"
          value={dashboardStats.activeEvents.value}
          change={dashboardStats.activeEvents.change}
          trend={dashboardStats.activeEvents.trend}
          icon={Calendar}
        />
        <StatCard
          title="Total Revenue"
          value={dashboardStats.totalRevenue.value}
          change={dashboardStats.totalRevenue.change}
          trend={dashboardStats.totalRevenue.trend}
          icon={DollarSign}
          prefix="$"
        />
        <StatCard
          title="Pending Bookings"
          value={dashboardStats.pendingBookings.value}
          change={dashboardStats.pendingBookings.change}
          trend={dashboardStats.pendingBookings.trend}
          icon={Clock}
        />
        <StatCard
          title="Verified Artists"
          value={dashboardStats.verifiedArtists.value}
          change={dashboardStats.verifiedArtists.change}
          trend={dashboardStats.verifiedArtists.trend}
          icon={Music}
        />
        <StatCard
          title="Average Rating"
          value={dashboardStats.averageRating.value}
          change={dashboardStats.averageRating.change}
          trend={dashboardStats.averageRating.trend}
          icon={Star}
          suffix="/5"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <Button variant="outline" size="sm" className="border-slate-600">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 bg-slate-700/30 rounded-lg"
              >
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-400' :
                  activity.status === 'warning' ? 'bg-yellow-400' :
                  'bg-blue-400'
                }`} />
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-slate-400 text-xs">{activity.time}</p>
                </div>
                <Badge variant={activity.status === 'success' ? 'default' : 'secondary'} className="text-xs">
                  {activity.type}
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={action.action}
                className="w-full justify-start border-slate-600 hover:bg-slate-700"
              >
                <action.icon className="h-4 w-4 mr-3" />
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-white font-medium">API Status</p>
            <p className="text-green-400 text-sm">Operational</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-white font-medium">Database</p>
            <p className="text-green-400 text-sm">Connected</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-white font-medium">Storage</p>
            <p className="text-yellow-400 text-sm">85% Used</p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-white font-medium">Payments</p>
            <p className="text-green-400 text-sm">Processing</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
