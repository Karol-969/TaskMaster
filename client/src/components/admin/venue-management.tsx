import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Users, Star, Calendar } from 'lucide-react';

export function VenueManagement() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Venues</p>
                <p className="text-2xl font-bold text-white">25</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Venue Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">Venue management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}