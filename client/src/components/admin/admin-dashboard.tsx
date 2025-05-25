import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OverviewDashboard } from './overview-dashboard';
import { UsersManagement } from './users-management';
import { ArtistsManagement } from './artists-management';
import { EventsManagement } from './events-management';
import { BookingsManagement } from './bookings-management';
import { TestimonialsManagement } from './testimonials-management';
import { 
  BarChart3, 
  Users, 
  Mic2, 
  Calendar, 
  Ticket,
  MessageSquare,
  Building2,
  Volume2,
  Settings
} from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      component: OverviewDashboard,
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      component: UsersManagement,
    },
    {
      id: 'artists',
      label: 'Artists',
      icon: Mic2,
      component: ArtistsManagement,
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
      component: EventsManagement,
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Ticket,
      component: BookingsManagement,
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      icon: MessageSquare,
      component: TestimonialsManagement,
    },
    {
      id: 'venues',
      label: 'Venues',
      icon: Building2,
      component: () => <ComingSoonSection title="Venues Management" />,
      disabled: true,
    },
    {
      id: 'sound',
      label: 'Sound Systems',
      icon: Volume2,
      component: () => <ComingSoonSection title="Sound Systems Management" />,
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage your platform with powerful tools and insights</p>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 bg-slate-800/50 backdrop-blur-sm border-slate-700 p-1 h-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  disabled={tab.disabled}
                  className="flex flex-col items-center space-y-2 p-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                  {tab.disabled && (
                    <span className="text-xs text-yellow-400">Soon</span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Content */}
          {tabs.map((tab) => {
            const ComponentToRender = tab.component;
            return (
              <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                <ComponentToRender />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}

function ComingSoonSection({ title }: { title: string }) {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Settings className="h-6 w-6 text-blue-400" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-16">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto">
            <Settings className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Coming Soon</h3>
          <p className="text-gray-300 max-w-md mx-auto">
            This feature is currently under development and will be available in a future update.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}