import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Music, 
  DollarSign,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface DashboardOverviewProps {
  stats?: any;
  recentActivity?: any;
}

export function DashboardOverview({ stats, recentActivity }: DashboardOverviewProps) {
  // Real-time metrics with trend indicators
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$142,650',
      change: '+15.2%',
      trend: 'up',
      period: 'vs last month',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Active Users',
      value: '2,847',
      change: '+8.5%',
      trend: 'up',
      period: 'vs last week',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Event Bookings',
      value: '456',
      change: '+23.1%',
      trend: 'up',
      period: 'this month',
      icon: Calendar,
      color: 'purple'
    },
    {
      title: 'Artist Registrations',
      value: '89',
      change: '-2.3%',
      trend: 'down',
      period: 'vs last month',
      icon: Music,
      color: 'orange'
    }
  ];

  const recentActivities = [
    {
      type: 'user_registration',
      message: 'New user registered: Sarah Johnson',
      time: '2 minutes ago',
      icon: Users,
      color: 'blue'
    },
    {
      type: 'event_booking',
      message: 'Event booked: "Jazz Night at Blue Moon"',
      time: '5 minutes ago',
      icon: Calendar,
      color: 'green'
    },
    {
      type: 'artist_verification',
      message: 'Artist verified: Mike Thompson',
      time: '12 minutes ago',
      icon: CheckCircle,
      color: 'purple'
    },
    {
      type: 'payment_received',
      message: 'Payment received: $2,450',
      time: '18 minutes ago',
      icon: DollarSign,
      color: 'yellow'
    },
    {
      type: 'system_alert',
      message: 'Server maintenance scheduled',
      time: '1 hour ago',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  const topEvents = [
    { name: 'Summer Music Festival', bookings: 234, revenue: '$45,600', status: 'active' },
    { name: 'Jazz Night Series', bookings: 156, revenue: '$28,900', status: 'active' },
    { name: 'Corporate Gala 2024', bookings: 89, revenue: '$67,800', status: 'upcoming' },
    { name: 'Acoustic Sessions', bookings: 67, revenue: '$12,400', status: 'active' }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-slate-400 text-sm font-medium">{metric.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                    <div className="flex items-center mt-2 space-x-1">
                      {metric.trend === 'up' ? (
                        <ArrowUpRight className="h-3 w-3 text-green-400" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-400" />
                      )}
                      <span className={`text-xs font-medium ${
                        metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {metric.change}
                      </span>
                      <span className="text-slate-400 text-xs">{metric.period}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-${metric.color}-500/20`}>
                    <metric.icon className={`h-6 w-6 text-${metric.color}-400`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg"
              >
                <div className={`p-2 rounded-lg bg-${activity.color}-500/20`}>
                  <activity.icon className={`h-4 w-4 text-${activity.color}-400`} />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{activity.message}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-400 text-xs">{activity.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performing Events */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Top Performing Events</CardTitle>
            <Button variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {topEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-white font-medium text-sm">{event.name}</h4>
                    <Badge 
                      variant={event.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-slate-400 text-xs">
                      {event.bookings} bookings
                    </span>
                    <span className="text-green-400 text-xs font-medium">
                      {event.revenue}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">User Management</h3>
            <p className="text-blue-200 text-sm mb-4">Manage users, roles, and permissions</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Event Creation</h3>
            <p className="text-purple-200 text-sm mb-4">Create and manage events</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Create Event
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Financial Reports</h3>
            <p className="text-green-200 text-sm mb-4">View revenue and analytics</p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}