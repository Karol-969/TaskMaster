import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Plus } from 'lucide-react';

export function SoundSystemsManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Sound Systems Management</h2>
          <p className="text-gray-300">Manage audio equipment and sound systems</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Sound System
        </Button>
      </div>
      
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Volume2 className="h-5 w-5 text-blue-400" />
            <span>Sound Systems Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">Sound systems management features will be available soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}