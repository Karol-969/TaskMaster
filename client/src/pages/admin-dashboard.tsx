import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/providers/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  BarChart3, 
  Users, 
  Calendar, 
  DollarSign, 
  Ticket,
  Mic2,
  Building2,
  Activity,
  TrendingUp,
  Search,
  Bell,
  Settings,
  LogOut,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  Filter
} from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 45000, bookings: 120 },
  { month: 'Feb', revenue: 52000, bookings: 135 },
  { month: 'Mar', revenue: 48000, bookings: 128 },
  { month: 'Apr', revenue: 61000, bookings: 165 },
  { month: 'May', revenue: 55000, bookings: 142 },
  { month: 'Jun', revenue: 67000, bookings: 178 },
];

const bookingStatusData = [
  { name: 'Confirmed', value: 68, color: '#10B981' },
  { name: 'Pending', value: 22, color: '#F59E0B' },
  { name: 'Cancelled', value: 10, color: '#EF4444' },
];

export default function AdminDashboardPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isLoading, isAuthenticated, isAdmin, logout } = useAuth();
  
  const { data: users = [] } = useQuery({ queryKey: ['/api/users'] });
  const { data: artists = [] } = useQuery({ queryKey: ['/api/artists'] });
  const { data: events = [] } = useQuery({ queryKey: ['/api/events'] });
  const { data: bookings = [] } = useQuery({ queryKey: ['/api/bookings'] });
  
  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !isAdmin) {
        navigate('/admin');
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  const handleLogout = async () => {
    await logout();
  };

  const stats = {
    totalUsers: Array.isArray(users) ? users.length : 2100,
    totalArtists: Array.isArray(artists) ? artists.length : 85,
    totalEvents: Array.isArray(events) ? events.length : 142,
    totalBookings: Array.isArray(bookings) ? bookings.length : 478,
    monthlyRevenue: 67000,
    userGrowthRate: 12.5,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading Admin Dashboard...</div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-6">
        <Card className="bg-red-900/20 border-red-800 max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-white text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-300">Administrator privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      <Helmet>
        <title>Admin Dashboard - ReArt Events</title>
        <meta name="description" content="Comprehensive administrative dashboard for managing the ReArt Events platform." />
      </Helmet>
      
      {/* Fixed Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-slate-800 px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ReArt Events Admin</h1>
              <p className="text-sm text-gray-400">Administrative Control Panel</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5 text-gray-300" />
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5">
                3
              </Badge>
            </Button>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-white font-medium">{user?.fullName || user?.username}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {(user?.fullName || user?.username || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Logout */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user?.fullName || user?.username}!
            </h2>
            <p className="text-gray-400 text-lg">
              Here's what's happening with your ReArt Events platform today.
            </p>
          </div>

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
                      <span className="text-purple-400 text-sm">68%</span>
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
                      <span className="text-yellow-400 text-sm">94.2%</span>
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

          {/* Charts Section */}
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

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">User Management</h3>
                <p className="text-gray-400 text-sm">Manage users and roles</p>
                <Button className="w-full mt-4" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Users
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Mic2 className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Artist Management</h3>
                <p className="text-gray-400 text-sm">Manage artist profiles</p>
                <Button className="w-full mt-4" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Artists
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Event Management</h3>
                <p className="text-gray-400 text-sm">Create and manage events</p>
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Event
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Financial Reports</h3>
                <p className="text-gray-400 text-sm">Revenue and analytics</p>
                <Button className="w-full mt-4" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
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
      </main>
    </div>
  );
}