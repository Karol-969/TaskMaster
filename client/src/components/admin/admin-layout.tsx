import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard,
  Users,
  Music,
  Calendar,
  MapPin,
  Speaker,
  DollarSign,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Shield,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check admin authentication
    const isAdminAuthenticated = sessionStorage.getItem('adminAuthenticated');
    const storedUser = sessionStorage.getItem('adminUser');

    if (!isAdminAuthenticated || !storedUser) {
      navigate('/admin/login');
      return;
    }

    try {
      setAdminUser(JSON.parse(storedUser));
    } catch (error) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminUser');
    
    toast({
      title: "Logged out successfully",
      description: "You have been securely logged out of the admin panel.",
    });
    
    navigate('/admin/login');
  };

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: LayoutDashboard,
      current: location === '/admin/dashboard'
    },
    { 
      name: 'User Management', 
      href: '/admin/users', 
      icon: Users,
      current: location === '/admin/users'
    },
    { 
      name: 'Artist Management', 
      href: '/admin/artists', 
      icon: Music,
      current: location === '/admin/artists'
    },
    { 
      name: 'Event Management', 
      href: '/admin/events', 
      icon: Calendar,
      current: location === '/admin/events'
    },
    { 
      name: 'Booking Management', 
      href: '/admin/bookings', 
      icon: FileText,
      current: location === '/admin/bookings'
    },
    { 
      name: 'Venue Management', 
      href: '/admin/venues', 
      icon: MapPin,
      current: location === '/admin/venues'
    },
    { 
      name: 'Equipment', 
      href: '/admin/equipment', 
      icon: Speaker,
      current: location === '/admin/equipment'
    },
    { 
      name: 'Financial', 
      href: '/admin/financial', 
      icon: DollarSign,
      current: location === '/admin/financial'
    },
    { 
      name: 'Content Management', 
      href: '/admin/content', 
      icon: FileText,
      current: location === '/admin/content'
    },
    { 
      name: 'Communications', 
      href: '/admin/communications', 
      icon: MessageSquare,
      current: location === '/admin/communications'
    },
    { 
      name: 'Analytics', 
      href: '/admin/analytics', 
      icon: BarChart3,
      current: location === '/admin/analytics'
    },
    { 
      name: 'System Settings', 
      href: '/admin/settings', 
      icon: Settings,
      current: location === '/admin/settings'
    }
  ];

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl lg:hidden"
          >
            <SidebarContent 
              navigation={navigation} 
              adminUser={adminUser}
              onLogout={handleLogout}
              onClose={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
          <SidebarContent 
            navigation={navigation} 
            adminUser={adminUser}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="lg:hidden ml-2">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Admin Panel
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>
              
              <ThemeToggle />
              
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={adminUser?.profileImage} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {adminUser?.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Administrator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  navigation: any[];
  adminUser: any;
  onLogout: () => void;
  onClose?: () => void;
}

function SidebarContent({ navigation, adminUser, onLogout, onClose }: SidebarContentProps) {
  const [, navigate] = useLocation();

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              ReArt Admin
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Control Panel
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.href)}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              item.current
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="flex-1 text-left">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* User info & logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={adminUser?.profileImage} />
            <AvatarFallback className="bg-blue-600 text-white">
              {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {adminUser?.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Administrator
            </p>
          </div>
        </div>
        
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
}