import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  Music, 
  Calendar, 
  Activity, 
  MapPin, 
  DollarSign, 
  Settings,
  Bell,
  Shield,
  MessageSquare,
  FileText,
  TrendingUp,
  HeadphonesIcon,
  Image,
  UserCheck
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabConfig: Array<{
    id: string;
    label: string;
    icon: any;
    component: any;
  }>;
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const navigationItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3, badge: null },
    { id: 'users', label: 'User Management', icon: Users, badge: '1,234' },
    { id: 'artists', label: 'Artist Management', icon: Music, badge: '89' },
    { id: 'influencers', label: 'Influencer Management', icon: UserCheck, badge: '6' },
    { id: 'events', label: 'Event Management', icon: Calendar, badge: '45' },
    { id: 'sound-systems', label: 'Sound Systems', icon: HeadphonesIcon, badge: '67' },
    { id: 'communication', label: 'Communication Center', icon: MessageSquare, badge: '12' },
    { id: 'content', label: 'Content Management', icon: Image, badge: '34' },
    { id: 'reports', label: 'Analytics & Reports', icon: FileText, badge: null },
    { id: 'security', label: 'Security & Audit', icon: Shield, badge: '3' },
    { id: 'settings', label: 'System Settings', icon: Settings, badge: null },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col">
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
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigationItems.map((item, index) => {
            const isActive = activeTab === item.id;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start h-12 px-4 text-sm ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-400 border-l-2 border-l-blue-500' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant="outline" 
                      className="ml-auto bg-slate-700 border-slate-600 text-slate-300 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* System Status */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">System Status</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs">Online</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Server Load</span>
              <span className="text-white">24%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '24%' }}></div>
            </div>
          </div>
          
          <div className="space-y-2 mt-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Database</span>
              <span className="text-white">68%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '68%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Bell className="h-3 w-3 mr-1" />
            Alerts
          </Button>
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Config
          </Button>
        </div>
      </div>
    </div>
  );
}