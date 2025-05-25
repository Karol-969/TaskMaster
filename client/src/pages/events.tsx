import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, MapPin, Users, Edit, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { fetchEvents, deleteEvent } from '@/lib/api';
import { EventFormDialog } from '@/components/events/event-form-dialog';
import { EventDetailsDialog } from '@/components/events/event-details-dialog';
import type { Event } from '@shared/schema';

export default function EventsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['/api/events'],
    queryFn: fetchEvents,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: "Event deleted",
        description: "Event has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = async (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteMutation.mutate(eventId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <Helmet>
        <title>Events Management - Reart Events</title>
        <meta name="description" content="Manage events, create new events, and track event details." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div 
            className="flex justify-between items-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 mb-2">
                Events Management
              </h1>
              <p className="text-gray-300 text-lg">
                Create, manage, and track your events
              </p>
            </div>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Event
            </Button>
          </motion.div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-700/50 rounded-2xl h-96"></div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Calendar className="mx-auto h-24 w-24 text-gray-400 mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-2">No events yet</h3>
              <p className="text-gray-400 mb-6">Get started by creating your first event</p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Event
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-blue-600 text-white">
                          ${event.ticketPrice}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-xl line-clamp-1">{event.name}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 text-sm line-clamp-2">{event.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.venue}
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Users className="h-4 w-4 mr-2" />
                          {event.availableTickets}/{event.totalTickets} tickets available
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(event)}
                          className="flex-1 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                          className="flex-1 border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          className="flex-1 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <EventFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />
      
      <EventFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mode="edit"
        event={selectedEvent}
      />
      
      <EventDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        event={selectedEvent}
      />
    </Layout>
  );
}