import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export function CommunicationCenter() {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Communication Center</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">Messaging and notification features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}