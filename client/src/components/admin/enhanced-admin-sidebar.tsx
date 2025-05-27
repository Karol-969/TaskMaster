
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  BarChart3, 
  Users, 
  Music, 
  Calendar, 
  Activity, 
  MapPin, 
  DollarSign, 
  Settings,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  UserCheck,
  UserPlus,
  Shield,
  Mail,
  FileText,
  Bell,
  Database,
  Headphones,
  Star,
  CreditCard,
  PieChart,
  LogOut,
  Home
} from 'lucide-react';

interface TabConfig {
  id: string;
  label: string;
  icon: any;
  component: any;
  badge?: string;
  children?: TabConfig[];
}

interface EnhancedAdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabConfig: TabConfig[];
}

export function EnhancedAdminSidebar({ activeTab, setActiveTab, tabConfig }: EnhancedAdminSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const enhancedTabConfig = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: BarChart3,
      component: null,
      children: [
        { id: 'overview', label: 'Overview', icon: TrendingUp, component: null },
        { id: 'analytics', label: 'Analytics', icon: PieChart, component: null, badge: 'New' },
        { id: 'reports', label: 'Reports', icon: FileText, component: null }
      ]
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      component: null,
      children: [
        { id: 'users', label: 'All Users', icon: Users, component: null },
        { id: 'user-roles', label: 'User Roles', icon: Shield, component: null },
        { id: 'user-verification', label: 'Verification', icon: UserCheck, component: null, badge: '12' },
        { id: 'user-activity', label: 'Activity Logs', icon: Activity, component: null }
      ]
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: Music,
      component: null,
      children: [
        { id: 'artists', label: 'Artists', icon: Music, component: null },
        { id: 'events', label: 'Events', icon: Calendar, component: null },
        { id: 'venues', label: 'Venues', icon: MapPin, component: null },
        { id: 'sound-systems', label: 'Sound Systems', icon: Headphones, component: null }
      ]
    },
    {
      id: 'operations',
      label: 'Operations',
      icon: Activity,
      component: null,
      children: [
        { id: 'bookings', label: 'Bookings', icon: Activity, component: null, badge: '8' },
        { id: 'payments', label: 'Payments', icon: CreditCard, component: null },
        { id: 'reviews', label: 'Reviews', icon: Star, component: null }
      ]
    },
    {
      id: 'financial',
      label: 'Financial',
      icon: DollarSign,
      component: null,
      children: [
        { id: 'financial', label: 'Overview', icon: DollarSign, component: null },
        { id: 'revenue', label: 'Revenue', icon: TrendingUp, component: null },
        { id: 'commissions', label: 'Commissions', icon: PieChart, component: null }
      ]
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: Mail,
      component: null,
      children: [
        { id: 'notifications', label: 'Notifications', icon: Bell, component: null, badge: '5' },
        { id: 'email-campaigns', label: 'Email Campaigns', icon: Mail, component: null },
        { id: 'support', label: 'Support Tickets', icon: FileText, component: null }
      ]
    },
    {
      id: 'system',
      label: 'System',
      icon: Settings,
      component: null,
      children: [
        { id: 'settings', label: 'Settings', icon: Settings, component: null },
        { id: 'database', label: 'Database', icon: Database, component: null },
        { id: 'logs', label: 'System Logs', icon: FileText, component: null }
      ]
    }
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/admin-login';
  };

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-700 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">ReArt Admin</h2>
            <p className="text-slate-400 text-xs">Advanced Control Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Quick Actions */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => window.open('/', '_blank')}
            className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Home className="h-4 w-4 mr-2" />
            View Live Site
          </Button>
        </div>

        {enhancedTabConfig.map((section) => (
          <Collapsible
            key={section.id}
            open={expandedSections.includes(section.id)}
            onOpenChange={() => toggleSection(section.id)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between hover:bg-slate-700/50 text-slate-300 hover:text-white"
              >
                <div className="flex items-center space-x-3">
                  <section.icon className="h-5 w-5" />
                  <span className="font-medium">{section.label}</span>
                </div>
                {expandedSections.includes(section.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-4 space-y-1 mt-2"
              >
                {section.children?.map((child) => (
                  <Button
                    key={child.id}
                    variant="ghost"
                    onClick={() => setActiveTab(child.id)}
                    className={`w-full justify-start text-sm pl-8 ${
                      activeTab === child.id
                        ? 'bg-blue-600/20 text-blue-300 border-r-2 border-blue-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                    }`}
                  >
                    <child.icon className="h-4 w-4 mr-3" />
                    <span>{child.label}</span>
                    {child.badge && (
                      <Badge 
                        variant="secondary" 
                        className="ml-auto bg-red-500/20 text-red-300 text-xs"
                      >
                        {child.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-700 space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">Admin User</p>
            <p className="text-slate-400 text-xs">admin@reart-events.com</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-start border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
