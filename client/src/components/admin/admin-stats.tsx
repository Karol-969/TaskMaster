import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Music, 
  Calendar, 
  MapPin, 
  Volume2, 
  Star, 
  TrendingUp,
  DollarSign,
  UserCheck,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminStats() {
  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => fetch('/api/users').then(res => res.json()),
  });

  const { data: artists = [] } = useQuery({
    queryKey: ['/api/artists'],
    queryFn: () => fetch('/api/artists').then(res => res.json()),
  });

  const { data: events = [] } = useQuery({
    queryKey: ['/api/events'],
    queryFn: () => fetch('/api/events').then(res => res.json()),
  });

  const { data: venues = [] } = useQuery({
    queryKey: ['/api/venues'],
    queryFn: () => fetch('/api/venues').then(res => res.json()),
  });

  const { data: soundSystems = [] } = useQuery({
    queryKey: ['/api/sound-systems'],
    queryFn: () => fetch('/api/sound-systems').then(res => res.json()),
  });

  const { data: influencers = [] } = useQuery({
    queryKey: ['/api/influencers'],
    queryFn: () => fetch('/api/influencers').then(res => res.json()),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['/api/bookings'],
    queryFn: () => fetch('/api/bookings').then(res => res.json()),
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['/api/testimonials'],
    queryFn: () => fetch('/api/testimonials').then(res => res.json()),
  });

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'bg-blue-600',
      change: '+12% from last month',
      positive: true
    },
    {
      title: 'Active Artists',
      value: artists.length,
      icon: Music,
      color: 'bg-green-600',
      change: '+8% from last month',
      positive: true
    },
    {
      title: 'Total Events',
      value: events.length,
      icon: Calendar,
      color: 'bg-purple-600',
      change: '+15% from last month',
      positive: true
    },
    {
      title: 'Available Venues',
      value: venues.length,
      icon: MapPin,
      color: 'bg-orange-600',
      change: '+5% from last month',
      positive: true
    },
    {
      title: 'Sound Systems',
      value: soundSystems.length,
      icon: Volume2,
      color: 'bg-red-600',
      change: '+3% from last month',
      positive: true
    },
    {
      title: 'Influencers',
      value: influencers.length,
      icon: Star,
      color: 'bg-yellow-600',
      change: '+20% from last month',
      positive: true
    },
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: UserCheck,
      color: 'bg-indigo-600',
      change: '+25% from last month',
      positive: true
    },
    {
      title: 'Testimonials',
      value: testimonials.length,
      icon: TrendingUp,
      color: 'bg-pink-600',
      change: '+18% from last month',
      positive: true
    }
  ];

  const recentActivity = [
    { action: 'New user registered', time: '2 minutes ago', type: 'user' },
    { action: 'Event created', time: '15 minutes ago', type: 'event' },
    { action: 'Artist profile updated', time: '1 hour ago', type: 'artist' },
    { action: 'Venue booking confirmed', time: '2 hours ago', type: 'booking' },
    { action: 'New testimonial received', time: '4 hours ago', type: 'testimonial' }
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-blue-500/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}/20`}>
                    <Icon className={`h-4 w-4 text-white`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${stat.positive ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'}`}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-400" />
                <span>Platform Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">User Engagement</span>
                    <span className="text-white font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Event Success Rate</span>
                    <span className="text-white font-medium">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Artist Satisfaction</span>
                    <span className="text-white font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Venue Utilization</span>
                    <span className="text-white font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">
                        {activity.action}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}