import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardOverview } from './dashboard-overview';
import { UserManagement } from './user-management';
import { ArtistManagement } from './artist-management';
import { EventManagement } from './event-management';
import { BookingManagement } from './booking-management';
import { VenueManagement } from './venue-management';
import { EquipmentManagement } from './equipment-management';
import { FinancialManagement } from './financial-management';
import { ContentManagement } from './content-management';
import { CommunicationCenter } from './communication-center';
import { AnalyticsReporting } from './analytics-reporting';
import { SystemManagement } from './system-management';
import { 
  BarChart3, 
  Users, 
  Mic2, 
  Calendar, 
  Ticket,
  Building2,
  Volume2,
  DollarSign,
  FileText,
  MessageSquare,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { Input } from '@/components/ui/input';

const adminTabs = [
  {
    id: 'overview',
    label: 'Dashboard',
    icon: BarChart3,
    component: DashboardOverview,
    description: 'Real-time analytics and KPIs'
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    component: UserManagement,
    description: 'User management and roles'
  },
  {
    id: 'artists',
    label: 'Artists',
    icon: Mic2,
    component: ArtistManagement,
    description: 'Artist profiles and portfolios'
  },
  {
    id: 'events',
    label: 'Events',
    icon: Calendar,
    component: EventManagement,
    description: 'Event creation and management'
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: Ticket,
    component: BookingManagement,
    description: 'Booking tracking and analytics'
  },
  {
    id: 'venues',
    label: 'Venues',
    icon: Building2,
    component: VenueManagement,
    description: 'Venue registration and management'
  },
  {
    id: 'equipment',
    label: 'Equipment',
    icon: Volume2,
    component: EquipmentManagement,
    description: 'Sound systems and equipment'
  },
  {
    id: 'financial',
    label: 'Financial',
    icon: DollarSign,
    component: FinancialManagement,
    description: 'Revenue and commission tracking'
  },
  {
    id: 'content',
    label: 'Content',
    icon: FileText,
    component: ContentManagement,
    description: 'Content and media management'
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: MessageSquare,
    component: CommunicationCenter,
    description: 'Messaging and notifications'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: TrendingUp,
    component: AnalyticsReporting,
    description: 'Advanced reporting and insights'
  },
  {
    id: 'system',
    label: 'System',
    icon: Settings,
    component: SystemManagement,
    description: 'Platform configuration and monitoring'
  }
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();

  const activeTabData = adminTabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component || DashboardOverview;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 overflow-hidden">
      {/* Admin Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-slate-800 px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ReArt Events</h1>
                <p className="text-sm text-gray-400">Admin Control Panel</p>
              </div>
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

      {/* Admin Content */}
      <div className="flex pt-20">
        {/* Sidebar Navigation */}
        <aside className="w-80 bg-black/30 backdrop-blur-sm border-r border-slate-800 h-[calc(100vh-80px)] overflow-y-auto fixed left-0 top-20">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Management</h2>
            <nav className="space-y-2">
              {adminTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs opacity-75">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-80 p-6 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Active Tab Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                {activeTabData && (
                  <>
                    <activeTabData.icon className="h-8 w-8 text-blue-400" />
                    <h2 className="text-3xl font-bold text-white">{activeTabData.label}</h2>
                  </>
                )}
              </div>
              <p className="text-gray-400">{activeTabData?.description}</p>
            </div>

            {/* Active Component */}
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
}