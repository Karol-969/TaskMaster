import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Plus } from 'lucide-react';

export function InfluencersManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Influencers Management</h2>
          <p className="text-gray-300">Manage influencer partnerships and collaborations</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Influencer
        </Button>
      </div>
      
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Star className="h-5 w-5 text-blue-400" />
            <span>Influencers Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">Influencer management features will be available soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}