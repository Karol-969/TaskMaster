import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Star, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch data
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const res = await fetch('/api/users', { credentials: 'include' });
      return res.ok ? res.json() : [];
    }
  });

  const { data: artists = [], isLoading: artistsLoading } = useQuery({
    queryKey: ['/api/artists'],
    queryFn: async () => {
      const res = await fetch('/api/artists', { credentials: 'include' });
      return res.ok ? res.json() : [];
    }
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/events'],
    queryFn: async () => {
      const res = await fetch('/api/events', { credentials: 'include' });
      return res.ok ? res.json() : [];
    }
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/bookings'],
    queryFn: async () => {
      const res = await fetch('/api/bookings', { credentials: 'include' });
      return res.ok ? res.json() : [];
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your event platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{artists.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <p>Loading users...</p>
                ) : (
                  <div className="space-y-4">
                    {users.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{user.username}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="text-sm">
                          {user.role === 'admin' ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Admin</span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">User</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="artists" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Artist Management</CardTitle>
                <CardDescription>Manage platform artists</CardDescription>
              </CardHeader>
              <CardContent>
                {artistsLoading ? (
                  <p>Loading artists...</p>
                ) : (
                  <div className="space-y-4">
                    {artists.map((artist: any) => (
                      <div key={artist.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={artist.imageUrl} 
                            alt={artist.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold">{artist.name}</h3>
                            <p className="text-sm text-muted-foreground">{artist.genre}</p>
                          </div>
                        </div>
                        <div className="text-sm">
                          ⭐ {artist.rating || 'No rating'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Management</CardTitle>
                <CardDescription>Manage platform events</CardDescription>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <p>Loading events...</p>
                ) : (
                  <div className="space-y-4">
                    {events.map((event: any) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={event.imageUrl} 
                            alt={event.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <h3 className="font-semibold">{event.name}</h3>
                            <p className="text-sm text-muted-foreground">{event.venue}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm">
                          ${event.ticketPrice}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>Manage platform bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <p>Loading bookings...</p>
                ) : bookings.length === 0 ? (
                  <p>No bookings yet.</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">Booking #{booking.id}</h3>
                          <p className="text-sm text-muted-foreground">Type: {booking.type}</p>
                          <p className="text-sm text-muted-foreground">
                            Event: {new Date(booking.eventDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-sm">
                          ${booking.totalAmount}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}