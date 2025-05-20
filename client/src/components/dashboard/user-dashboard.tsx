import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingHistory } from '@/components/dashboard/booking-history';
import { Button } from '@/components/ui/button';
import { CalendarDays, User, Clock, Ticket } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');
  const { user } = useAuth();
  
  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ['/api/bookings'],
    queryFn: async () => {
      const res = await fetch('/api/bookings', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      return res.json();
    }
  });
  
  // Current and past bookings
  const currentBookings = bookings.filter(
    (booking: any) => new Date(booking.eventDate) >= new Date() && booking.status !== 'cancelled'
  );
  
  const pastBookings = bookings.filter(
    (booking: any) => new Date(booking.eventDate) < new Date() || booking.status === 'cancelled'
  );
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.fullName || 'User'}
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingBookings ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                bookings.length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Bookings
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingBookings ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                currentBookings.length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Events that haven't happened yet
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Past Bookings
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingBookings ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                pastBookings.length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed or cancelled bookings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Details
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              {user?.role === 'admin' ? 'Administrator' : 'Regular Member'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">All Bookings</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings" className="space-y-4">
          <BookingHistory bookings={bookings} isLoading={isLoadingBookings} />
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <BookingHistory bookings={currentBookings} isLoading={isLoadingBookings} />
        </TabsContent>
        <TabsContent value="past" className="space-y-4">
          <BookingHistory bookings={pastBookings} isLoading={isLoadingBookings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
