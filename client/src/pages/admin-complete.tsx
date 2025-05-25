import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Calendar, Star, MapPin, Plus, Edit, Trash2, Music, Building, TrendingUp, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Form schemas
const artistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  genre: z.string().min(1, 'Genre is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Valid image URL is required'),
  rating: z.number().min(1).max(5).optional(),
});

const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  date: z.string().min(1, 'Date is required'),
  venue: z.string().min(1, 'Venue is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Valid image URL is required'),
  ticketPrice: z.number().min(0, 'Price must be positive'),
  totalTickets: z.number().min(1, 'Total tickets must be at least 1'),
});

const venueSchema = z.object({
  name: z.string().min(1, 'Venue name is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Valid image URL is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  amenities: z.string().min(1, 'Amenities are required'),
  price: z.number().min(0, 'Price must be positive'),
});

export default function AdminCompletePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeDialog, setActiveDialog] = useState('');
  
  // Fetch all data
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

  // Mutations for Artists
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
      toast({ title: 'Success!', description: 'Artist created successfully!' });
      setDialogOpen(false);
      artistForm.reset();
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
      toast({ title: 'Success!', description: 'Artist updated successfully!' });
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
      toast({ title: 'Success!', description: 'Artist deleted successfully!' });
    },
  });

  // Mutations for Events
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
      toast({ title: 'Success!', description: 'Event created successfully!' });
      setDialogOpen(false);
      eventForm.reset();
    },
  });

  // Mutations for Venues
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
      toast({ title: 'Success!', description: 'Venue created successfully!' });
      setDialogOpen(false);
      venueForm.reset();
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
    setActiveDialog(type);
    setDialogOpen(true);
  };

  const openEditDialog = (item: any, type: string) => {
    setEditMode(true);
    setSelectedItem(item);
    setActiveDialog(type);
    
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

  // Calculate stats
  const totalRevenue = bookings.reduce((sum: number, booking: any) => sum + (booking.totalAmount || 0), 0);
  const upcomingEvents = events.filter((event: any) => new Date(event.date) > new Date()).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Complete platform management and analytics</p>
        </div>

        {/* Real-time Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</div>
              <p className="text-xs text-green-600">Active platform members</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Artists</CardTitle>
              <Music className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{artists.length}</div>
              <p className="text-xs text-green-600">Professional performers</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Events</CardTitle>
              <Calendar className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{events.length}</div>
              <p className="text-xs text-blue-600">{upcomingEvents} upcoming</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Venues</CardTitle>
              <Building className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{venues.length}</div>
              <p className="text-xs text-green-600">Available locations</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Bookings</CardTitle>
              <TrendingUp className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{bookings.length}</div>
              <p className="text-xs text-green-600">${totalRevenue.toLocaleString()} revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white dark:bg-gray-800 shadow-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="venues">Venues</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</CardTitle>
                  <CardDescription>Manage your platform efficiently</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={() => openCreateDialog('artists')} className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" /> Add New Artist
                  </Button>
                  <Button onClick={() => openCreateDialog('events')} className="w-full justify-start" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Create New Event
                  </Button>
                  <Button onClick={() => openCreateDialog('venues')} className="w-full justify-start" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Add New Venue
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</CardTitle>
                  <CardDescription>Latest platform activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Platform running smoothly</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{users.length} registered users</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Music className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">{artists.length} active artists</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">User Management</CardTitle>
                <CardDescription>Manage platform users and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.username?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{user.username}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.fullName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {user.role === 'admin' ? (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium">
                              Administrator
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded-full text-sm font-medium">
                              User
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Artists Tab */}
          <TabsContent value="artists" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Artist Management</CardTitle>
                  <CardDescription>Manage platform artists and their profiles</CardDescription>
                </div>
                <Button onClick={() => openCreateDialog('artists')} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Artist
                </Button>
              </CardHeader>
              <CardContent>
                {artistsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {artists.map((artist: any) => (
                      <div key={artist.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={artist.imageUrl} 
                            alt={artist.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{artist.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{artist.genre}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md">
                              {artist.description?.substring(0, 80)}...
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-center">
                            <div className="flex items-center text-yellow-500">
                              <Star className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">{artist.rating || 'N/A'}</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(artist, 'artists')}
                            className="hover:bg-blue-50 dark:hover:bg-blue-900"
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

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Event Management</CardTitle>
                  <CardDescription>Manage platform events and schedules</CardDescription>
                </div>
                <Button onClick={() => openCreateDialog('events')} className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event: any) => (
                      <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={event.imageUrl} 
                            alt={event.name}
                            className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{event.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{event.venue}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(event.date).toLocaleDateString('en-US', { 
                                year: 'numeric', month: 'long', day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">${event.ticketPrice}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{event.availableTickets || event.totalTickets} tickets</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(event, 'events')}
                            className="hover:bg-green-50 dark:hover:bg-green-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(event.id, 'events')}
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

          {/* Venues Tab */}
          <TabsContent value="venues" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Venue Management</CardTitle>
                  <CardDescription>Manage platform venues and locations</CardDescription>
                </div>
                <Button onClick={() => openCreateDialog('venues')} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Venue
                </Button>
              </CardHeader>
              <CardContent>
                {venuesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : venues.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No venues added yet. Create your first venue!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {venues.map((venue: any) => (
                      <div key={venue.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={venue.imageUrl} 
                            alt={venue.name}
                            className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{venue.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{venue.location}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Capacity: {venue.capacity}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">${venue.price}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">per event</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(venue, 'venues')}
                            className="hover:bg-purple-50 dark:hover:bg-purple-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(venue.id, 'venues')}
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

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Booking Management</CardTitle>
                <CardDescription>Manage platform bookings and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No bookings yet. Bookings will appear here once users start making reservations.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">Booking #{booking.id}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Type: {booking.type}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Event: {new Date(booking.eventDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            ${booking.totalAmount}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {booking.status || 'Confirmed'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                {editMode ? 'Edit' : 'Add New'} {activeDialog === 'artists' ? 'Artist' : activeDialog === 'events' ? 'Event' : 'Venue'}
              </DialogTitle>
              <DialogDescription>
                {editMode ? 'Update the details below.' : 'Fill in the details to create a new item.'}
              </DialogDescription>
            </DialogHeader>
            
            {activeDialog === 'artists' && (
              <Form {...artistForm}>
                <form onSubmit={artistForm.handleSubmit((data) => handleSubmit(data, 'artists'))} className="space-y-4">
                  <FormField
                    control={artistForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Artist Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter artist name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={artistForm.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select genre" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Electronic">Electronic</SelectItem>
                              <SelectItem value="Rock">Rock</SelectItem>
                              <SelectItem value="Pop">Pop</SelectItem>
                              <SelectItem value="Jazz">Jazz</SelectItem>
                              <SelectItem value="Classical">Classical</SelectItem>
                              <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                              <SelectItem value="R&B">R&B</SelectItem>
                              <SelectItem value="Country">Country</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={artistForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter artist description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={artistForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={artistForm.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (1-5)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="5" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createArtistMutation.isPending || updateArtistMutation.isPending}>
                      {editMode ? 'Update' : 'Create'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}

            {activeDialog === 'events' && (
              <Form {...eventForm}>
                <form onSubmit={eventForm.handleSubmit((data) => handleSubmit(data, 'events'))} className="space-y-4">
                  <FormField
                    control={eventForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter venue name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter event description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={eventForm.control}
                      name="ticketPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ticket Price</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={eventForm.control}
                      name="totalTickets"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Tickets</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createEventMutation.isPending}>
                      Create Event
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}

            {activeDialog === 'venues' && (
              <Form {...venueForm}>
                <form onSubmit={venueForm.handleSubmit((data) => handleSubmit(data, 'venues'))} className="space-y-4">
                  <FormField
                    control={venueForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter venue name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={venueForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter venue location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={venueForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter venue description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={venueForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={venueForm.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={venueForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={venueForm.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amenities</FormLabel>
                        <FormControl>
                          <Textarea placeholder="List venue amenities" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createVenueMutation.isPending}>
                      Create Venue
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}