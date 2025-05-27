import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, Search, Calendar as CalendarLucide, MapPin, Ticket, DollarSign, Users, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const eventSchema = z.object({
  name: z.string().min(2, 'Event name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.date(),
  venue: z.string().min(2, 'Venue is required'),
  ticketPrice: z.number().min(0, 'Price must be positive'),
  totalTickets: z.number().min(1, 'Must have at least 1 ticket'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type EventFormData = z.infer<typeof eventSchema>;

export function EventManagement() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['/api/events'],
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          availableTickets: data.totalTickets,
        }),
      });
      if (!response.ok) throw new Error('Failed to create event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      setIsCreateOpen(false);
      toast({ title: 'Event created successfully' });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async (data: { id: number } & Partial<EventFormData>) => {
      const response = await fetch(`/api/events/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      setIsEditOpen(false);
      setSelectedEvent(null);
      toast({ title: 'Event updated successfully' });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete event');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({ title: 'Event deleted successfully' });
    },
  });

  const createForm = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      description: '',
      venue: '',
      ticketPrice: 0,
      totalTickets: 100,
      imageUrl: '',
    },
  });

  const editForm = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const getEventStatus = (event: any) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const soldOut = event.availableTickets === 0;
    
    if (soldOut) return { label: 'Sold Out', variant: 'destructive' as const };
    if (eventDate < now) return { label: 'Past', variant: 'secondary' as const };
    if (eventDate.toDateString() === now.toDateString()) return { label: 'Today', variant: 'destructive' as const };
    return { label: 'Upcoming', variant: 'default' as const };
  };

  const filteredEvents = (events as any[]).filter((event: any) => {
    const matchesSearch = event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue?.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getEventStatus(event);
    const matchesStatus = statusFilter === 'all' || status.label.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const eventStats = {
    total: (events as any[]).length,
    upcoming: (events as any[]).filter(e => new Date(e.date) > new Date()).length,
    soldOut: (events as any[]).filter(e => e.availableTickets === 0).length,
    totalRevenue: (events as any[]).reduce((sum, e) => sum + (e.ticketPrice * (e.totalTickets - (e.availableTickets || e.totalTickets))), 0),
    averagePrice: (events as any[]).length > 0 ? (events as any[]).reduce((sum, e) => sum + e.ticketPrice, 0) / (events as any[]).length : 0,
  };

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    editForm.reset({
      name: event.name,
      description: event.description,
      date: new Date(event.date),
      venue: event.venue,
      ticketPrice: event.ticketPrice,
      totalTickets: event.totalTickets,
      imageUrl: event.imageUrl || '',
    });
    setIsEditOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEventMutation.mutate(id);
    }
  };

  const onCreateSubmit = (data: EventFormData) => {
    createEventMutation.mutate(data);
  };

  const onEditSubmit = (data: EventFormData) => {
    if (selectedEvent) {
      updateEventMutation.mutate({ ...data, id: selectedEvent.id });
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Events</p>
                <p className="text-2xl font-bold text-white">{eventStats.total}</p>
              </div>
              <CalendarLucide className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming</p>
                <p className="text-2xl font-bold text-white">{eventStats.upcoming}</p>
              </div>
              <CalendarLucide className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Sold Out</p>
                <p className="text-2xl font-bold text-white">{eventStats.soldOut}</p>
              </div>
              <Ticket className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">${eventStats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg. Price</p>
                <p className="text-2xl font-bold text-white">${eventStats.averagePrice.toFixed(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Management */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white text-xl">Event Management</CardTitle>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Event</DialogTitle>
                </DialogHeader>
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Event Name</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-800 border-slate-700 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="venue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Venue</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-slate-800 border-slate-700 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={createForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="bg-slate-800 border-slate-700 text-white" rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-white">Event Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                                >
                                  {field.value ? format(field.value, "PPP") : "Pick a date"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="ticketPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Ticket Price ($)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                className="bg-slate-800 border-slate-700 text-white" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="totalTickets"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Total Tickets</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                className="bg-slate-800 border-slate-700 text-white" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createEventMutation.isPending}>
                        {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="past">Past</SelectItem>
                <SelectItem value="sold out">Sold Out</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Events Table */}
          <div className="rounded-lg border border-slate-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-gray-300">Event</TableHead>
                  <TableHead className="text-gray-300">Date & Venue</TableHead>
                  <TableHead className="text-gray-300">Tickets</TableHead>
                  <TableHead className="text-gray-300">Revenue</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event: any) => {
                  const status = getEventStatus(event);
                  const soldTickets = event.totalTickets - (event.availableTickets || event.totalTickets);
                  const revenue = event.ticketPrice * soldTickets;
                  
                  return (
                    <TableRow key={event.id} className="border-slate-800 hover:bg-slate-800/30">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {event.imageUrl ? (
                            <img
                              src={event.imageUrl}
                              alt={event.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                              <CalendarLucide className="h-6 w-6 text-white" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-white">{event.name}</div>
                            <div className="text-sm text-gray-400 line-clamp-1">
                              {event.description?.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <CalendarLucide className="h-4 w-4 text-gray-400" />
                            <span className="text-white text-sm">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-300 text-sm">{event.venue}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-white text-sm">
                            {soldTickets} / {event.totalTickets}
                          </div>
                          <div className="text-gray-400 text-xs">
                            ${event.ticketPrice} each
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-white font-medium">
                          ${revenue.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-700 hover:bg-slate-800"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(event)}
                            className="border-slate-700 hover:bg-slate-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(event.id)}
                            className="border-red-600 text-red-400 hover:bg-red-600/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}