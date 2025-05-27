import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  Ticket,
  Mic2,
  Building2,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 45000, bookings: 120 },
  { month: 'Feb', revenue: 52000, bookings: 135 },
  { month: 'Mar', revenue: 48000, bookings: 128 },
  { month: 'Apr', revenue: 61000, bookings: 165 },
  { month: 'May', revenue: 55000, bookings: 142 },
  { month: 'Jun', revenue: 67000, bookings: 178 },
];

const userGrowthData = [
  { month: 'Jan', total: 1200, new: 150 },
  { month: 'Feb', total: 1350, new: 180 },
  { month: 'Mar', total: 1530, new: 165 },
  { month: 'Apr', total: 1695, new: 195 },
  { month: 'May', total: 1890, new: 210 },
  { month: 'Jun', total: 2100, new: 225 },
];

const bookingStatusData = [
  { name: 'Confirmed', value: 68, color: '#10B981' },
  { name: 'Pending', value: 22, color: '#F59E0B' },
  { name: 'Cancelled', value: 10, color: '#EF4444' },
];

const topArtists = [
  { name: 'DJ Alex', bookings: 45, revenue: 18500, rating: 4.9 },
  { name: 'Sophia Lee', bookings: 38, revenue: 15200, rating: 4.8 },
  { name: 'The Resonance', bookings: 32, revenue: 24000, rating: 4.7 },
  { name: 'Aria Strings', bookings: 28, revenue: 12600, rating: 4.9 },
];

const recentActivity = [
  { type: 'booking', message: 'New booking for Summer Music Festival', time: '2 minutes ago', status: 'success' },
  { type: 'user', message: 'New artist registration: Jazz Ensemble', time: '15 minutes ago', status: 'info' },
  { type: 'payment', message: 'Payment of $2,500 received', time: '1 hour ago', status: 'success' },
  { type: 'alert', message: 'Server response time above threshold', time: '2 hours ago', status: 'warning' },
];

export function DashboardOverview() {
  const { data: users = [] } = useQuery({ queryKey: ['/api/users'] });
  const { data: artists = [] } = useQuery({ queryKey: ['/api/artists'] });
  const { data: events = [] } = useQuery({ queryKey: ['/api/events'] });
  const { data: bookings = [] } = useQuery({ queryKey: ['/api/bookings'] });

  const stats = {
    totalUsers: users.length || 2100,
    totalArtists: artists.length || 85,
    totalEvents: events.length || 142,
    totalBookings: bookings.length || 478,
    monthlyRevenue: 67000,
    averageBookingValue: 1250,
    userGrowthRate: 12.5,
    artistApprovalRate: 94.2
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-white">${stats.monthlyRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+12.5%</span>
                  <span className="text-gray-400 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-blue-400 mr-1" />
                  <span className="text-blue-400 text-sm">+{stats.userGrowthRate}%</span>
                  <span className="text-gray-400 text-sm ml-1">growth rate</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Active Bookings</p>
                <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 text-purple-400 mr-1" />
                  <span className="text-purple-400 text-sm">{bookingStatusData[0].value}%</span>
                  <span className="text-gray-400 text-sm ml-1">confirmed</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Ticket className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Active Artists</p>
                <p className="text-3xl font-bold text-white">{stats.totalArtists}</p>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-yellow-400 text-sm">{stats.artistApprovalRate}%</span>
                  <span className="text-gray-400 text-sm ml-1">approval rate</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Mic2 className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span>Revenue & Bookings Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  fill="url(#revenueGradient)" 
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Status */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Ticket className="h-5 w-5 text-purple-400" />
              <span>Booking Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {bookingStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Artists */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Mic2 className="h-5 w-5 text-yellow-400" />
              <span>Top Performing Artists</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topArtists.map((artist, index) => (
                <div key={artist.name} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{artist.name}</p>
                      <p className="text-gray-400 text-sm">{artist.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">${artist.revenue.toLocaleString()}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-gray-300 text-sm">{artist.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-400" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800/30 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-400' :
                    activity.status === 'warning' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 border-slate-700 text-gray-300 hover:text-white">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Activity className="h-5 w-5 text-green-400" />
            <span>System Health</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Server Uptime</span>
                <span className="text-green-400">99.9%</span>
              </div>
              <Progress value={99.9} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Database Health</span>
                <span className="text-green-400">Excellent</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">API Response</span>
                <span className="text-yellow-400">120ms</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Memory Usage</span>
                <span className="text-blue-400">67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}