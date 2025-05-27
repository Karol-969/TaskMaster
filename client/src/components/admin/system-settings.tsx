import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, Database, Bell, Globe, Lock } from 'lucide-react';

export function SystemSettings() {
  const systemStatus = {
    uptime: '99.9%',
    version: '2.1.0',
    lastBackup: '2 hours ago',
    activeUsers: 247
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">System Uptime</p>
                <p className="text-2xl font-bold text-green-400">{systemStatus.uptime}</p>
              </div>
              <Settings className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Platform Version</p>
                <p className="text-2xl font-bold text-blue-400">{systemStatus.version}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Last Backup</p>
                <p className="text-2xl font-bold text-purple-400">{systemStatus.lastBackup}</p>
              </div>
              <Database className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-yellow-400">{systemStatus.activeUsers}</p>
              </div>
              <Shield className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div>
                <h4 className="text-white font-medium">Maintenance Mode</h4>
                <p className="text-slate-400 text-sm">Enable maintenance mode for system updates</p>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400">
                Disabled
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div>
                <h4 className="text-white font-medium">Auto Backup</h4>
                <p className="text-slate-400 text-sm">Automatic database backups every 6 hours</p>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400">
                Enabled
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div>
                <h4 className="text-white font-medium">Email Notifications</h4>
                <p className="text-slate-400 text-sm">System alerts and notifications</p>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div>
                <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                <p className="text-slate-400 text-sm">Enhanced security for admin accounts</p>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400">
                Required
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div>
                <h4 className="text-white font-medium">API Rate Limiting</h4>
                <p className="text-slate-400 text-sm">Protect against API abuse</p>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
              <div>
                <h4 className="text-white font-medium">Session Timeout</h4>
                <p className="text-slate-400 text-sm">Auto-logout after 30 minutes</p>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400">
                Enabled
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col space-y-2">
              <Database className="h-6 w-6" />
              <span>Backup Database</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex flex-col space-y-2">
              <Bell className="h-6 w-6" />
              <span>Send Notifications</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex flex-col space-y-2">
              <Lock className="h-6 w-6" />
              <span>Security Audit</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}