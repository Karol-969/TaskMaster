import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Calendar, Star, MapPin, Plus, Edit, Trash2, Music, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Form schemas
const artistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  genre: z.string().min(1, 'Genre is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Valid image URL is required'),
  rating: z.number().min(1).max(5).optional(),
});

const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  date: z.string().min(1, 'Date is required'),
  venue: z.string().min(1, 'Venue is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Valid image URL is required'),
  ticketPrice: z.number().min(0, 'Price must be positive'),
  totalTickets: z.number().min(1, 'Total tickets must be at least 1'),
});

const venueSchema = z.object({
  name: z.string().min(1, 'Venue name is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Valid image URL is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  amenities: z.string().min(1, 'Amenities are required'),
  price: z.number().min(0, 'Price must be positive'),
});

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
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

  const { data: venues = [], isLoading: venuesLoading } = useQuery({
    queryKey: ['/api/venues'],
    queryFn: async () => {
      const res = await fetch('/api/venues', { credentials: 'include' });
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

  // Mutations for CRUD operations
  const createArtistMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create artist');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] });
      toast({ title: 'Artist created successfully!' });
      setDialogOpen(false);
    },
  });

  const updateArtistMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await fetch(`/api/artists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update artist');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] });
      toast({ title: 'Artist updated successfully!' });
      setDialogOpen(false);
    },
  });

  const deleteArtistMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/artists/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete artist');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] });
      toast({ title: 'Artist deleted successfully!' });
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create event');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({ title: 'Event created successfully!' });
      setDialogOpen(false);
    },
  });

  const createVenueMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create venue');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/venues'] });
      toast({ title: 'Venue created successfully!' });
      setDialogOpen(false);
    },
  });

  // Form instances
  const artistForm = useForm({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: '',
      genre: '',
      description: '',
      imageUrl: '',
      rating: 5,
    },
  });

  const eventForm = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      date: '',
      venue: '',
      description: '',
      imageUrl: '',
      ticketPrice: 0,
      totalTickets: 100,
    },
  });

  const venueForm = useForm({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: '',
      location: '',
      description: '',
      imageUrl: '',
      capacity: 100,
      amenities: '',
      price: 0,
    },
  });

  // Helper functions
  const openCreateDialog = (type: string) => {
    setEditMode(false);
    setSelectedItem(null);
    setActiveTab(type);
    setDialogOpen(true);
  };

  const openEditDialog = (item: any, type: string) => {
    setEditMode(true);
    setSelectedItem(item);
    setActiveTab(type);
    
    if (type === 'artists') {
      artistForm.reset(item);
    } else if (type === 'events') {
      eventForm.reset({
        ...item,
        date: new Date(item.date).toISOString().split('T')[0],
      });
    } else if (type === 'venues') {
      venueForm.reset(item);
    }
    
    setDialogOpen(true);
  };

  const handleSubmit = (data: any, type: string) => {
    if (type === 'artists') {
      if (editMode && selectedItem) {
        updateArtistMutation.mutate({ id: selectedItem.id, data });
      } else {
        createArtistMutation.mutate(data);
      }
    } else if (type === 'events') {
      createEventMutation.mutate(data);
    } else if (type === 'venues') {
      createVenueMutation.mutate(data);
    }
  };

  const handleDelete = (id: number, type: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (type === 'artists') {
        deleteArtistMutation.mutate(id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your event platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{venues.length}</div>
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
            <TabsTrigger value="venues">Venues</TabsTrigger>
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
                          <p className="text-xs text-muted-foreground">{user.fullName}</p>
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
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Artist Management</CardTitle>
                  <CardDescription>Manage platform artists</CardDescription>
                </div>
                <Button onClick={() => openCreateDialog('artists')} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Artist
                </Button>
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
                            <p className="text-xs text-muted-foreground">{artist.description?.substring(0, 60)}...</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">⭐ {artist.rating || 'No rating'}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(artist, 'artists')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(artist.id, 'artists')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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