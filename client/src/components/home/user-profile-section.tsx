import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, Calendar, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useAuth as useAuthActions } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

export function UserProfileSection() {
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const { toast } = useToast();

  if (!user) return null;
  
  // Redirect admin users to dedicated admin dashboard
  if (user.role === 'admin') {
    window.location.href = '/admin/dashboard';
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to logout",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const memberSince = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-blue-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 bg-blue-600">
              <AvatarFallback className="bg-blue-600 text-white text-lg font-bold">
                {getInitials(user.fullName || user.username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-white text-xl">
                Welcome back!
              </CardTitle>
              <p className="text-blue-200 text-sm">
                {user.fullName || user.username}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Details Card */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-400" />
            <span>Profile Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide">Username</p>
                <p className="text-white font-medium">{user.username}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide">Email</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
            </div>
            
            {(user as any).phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Phone</p>
                  <p className="text-white font-medium">{(user as any).phone}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide">Member Since</p>
                <p className="text-white font-medium">{memberSince}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
              {user.role === 'admin' ? 'Administrator' : 'Member'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full justify-start border-slate-600 hover:bg-slate-700">
              <Settings className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          

          
          <Button 
            variant="outline" 
            className="w-full justify-start border-red-600 text-red-400 hover:bg-red-600/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}