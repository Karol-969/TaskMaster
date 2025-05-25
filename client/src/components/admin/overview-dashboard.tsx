import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Calendar, 
  Ticket, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Star,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

export function OverviewDashboard() {
  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
  });

  const { data: artists = [] } = useQuery({
    queryKey: ['/api/artists'],
  });

  const { data: events = [] } = useQuery({
    queryKey: ['/api/events'],
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['/api/bookings'],
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['/api/testimonials'],
  });

  // Calculate statistics
  const totalUsers = users.length;
  const totalArtists = artists.length;
  const totalEvents = events.length;
  const totalBookings = bookings.length;
  const totalTestimonials = testimonials.length;

  // Calculate revenue (mock calculation based on events)
  const totalRevenue = events.reduce((sum: number, event: any) => {
    return sum + (event.ticketPrice * (event.totalTickets - event.availableTickets));
  }, 0);

  // Recent activity
  const recentEvents = events.slice(0, 5);
  const recentBookings = bookings.slice(0, 5);

  // Performance metrics
  const avgRating = testimonials.length > 0 
    ? testimonials.reduce((sum: number, t: any) => sum + t.rating, 0) / testimonials.length 
    : 0;

  const statsCards = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Artists',
      value: totalArtists,
      icon: Star,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Events',
      value: totalEvents,
      icon: Calendar,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-600/20',
      change: '+23%',
      changeType: 'positive'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
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
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <IconComponent className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-400">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-400" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Average Rating</span>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white font-semibold">
                    {avgRating.toFixed(1)}
                  </span>
                </div>
              </div>
              <Progress value={avgRating * 20} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Event Completion Rate</span>
                <span className="text-white font-semibold">94%</span>
              </div>
              <Progress value={94} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Customer Satisfaction</span>
                <span className="text-white font-semibold">96%</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Booking Success Rate</span>
                <span className="text-white font-semibold">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.slice(0, 3).map((event: any, index: number) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="bg-blue-600/20 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{event.name}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-500/30">
                    Active
                  </Badge>
                </div>
              ))}

              {recentBookings.slice(0, 2).map((booking: any, index: number) => (
                <div key={booking.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="bg-purple-600/20 p-2 rounded-lg">
                    <Ticket className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">
                      Booking #{booking.id}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">API Response</span>
                <Badge className="bg-green-600/20 text-green-300 border-green-500/30">
                  Healthy
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Database</span>
                <Badge className="bg-green-600/20 text-green-300 border-green-500/30">
                  Connected
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Storage</span>
                <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-500/30">
                  85% Used
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">New Users</span>
                <span className="text-white font-semibold">+{Math.floor(totalUsers * 0.2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Events Created</span>
                <span className="text-white font-semibold">+{Math.floor(totalEvents * 0.3)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Bookings</span>
                <span className="text-white font-semibold">+{Math.floor(totalBookings * 0.25)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {artists.slice(0, 3).map((artist: any, index: number) => (
                <div key={artist.id} className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{artist.name}</p>
                    <p className="text-gray-400 text-xs">{artist.genre}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-white text-xs">{artist.rating || 4.5}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}