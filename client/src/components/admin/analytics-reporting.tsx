import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export function AnalyticsReporting() {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Analytics & Reporting</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">Advanced reporting and insights features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}