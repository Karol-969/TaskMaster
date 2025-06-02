import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchEvents } from '@/lib/api';
import type { Event } from '@shared/schema';

export default function EventsPublicPage() {
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['/api/events'],
    queryFn: fetchEvents,
  });

  const formatDate = (date: Date | string) => {
    const eventDate = date instanceof Date ? date : new Date(date);
    return eventDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = (date: Date | string) => {
    const eventDate = date instanceof Date ? date : new Date(date);
    const now = new Date();
    
    if (eventDate > now) {
      return { label: 'Upcoming', variant: 'default' as const };
    } else if (eventDate.toDateString() === now.toDateString()) {
      return { label: 'Today', variant: 'destructive' as const };
    } else {
      return { label: 'Past', variant: 'secondary' as const };
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-slate-300 rounded w-48 mx-auto mb-4"></div>
                <div className="h-4 bg-slate-300 rounded w-96 mx-auto mb-8"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-slate-300 rounded-lg h-64"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Our Events</h1>
              <p className="text-red-400 text-lg">Unable to load events at the moment. Please try again later.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Events - Reart Events</title>
        <meta name="description" content="Discover our upcoming and past events. From live music performances to corporate events, explore what Reart Events has to offer." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="container mx-auto px-4 py-16">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-white mb-6">
              Our <span className="text-blue-400">Events</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover the amazing events we organize and manage. From intimate live music sessions 
              to large-scale corporate events, we bring your vision to life with precision and creativity.
            </p>
          </motion.div>

          {/* Events Grid */}
          {events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 border border-slate-700">
                <Calendar className="h-16 w-16 text-blue-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">No Events Yet</h3>
                <p className="text-gray-300 text-lg max-w-md mx-auto">
                  We're currently planning some amazing events. Check back soon to see what's coming up!
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: Event, index: number) => {
                const status = getEventStatus(event.date);
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-blue-500/50 transition-all duration-300 overflow-hidden group">
                      <div className="relative">
                        {event.images && event.images.length > 0 ? (
                          <div className="h-48 relative overflow-hidden">
                            <img
                              src={event.images[0]}
                              alt={event.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20"></div>
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden flex items-center justify-center">
                            <Calendar className="h-16 w-16 text-white/70" />
                            <div className="absolute inset-0 bg-black/20"></div>
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <Badge variant={status.variant} className="bg-opacity-90">
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-white text-xl font-bold line-clamp-2">
                          {event.name}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-gray-300 line-clamp-3">
                          {event.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 text-gray-300">
                            <Calendar className="h-4 w-4 text-blue-400" />
                            <span className="text-sm">
                              {formatDate(event.date)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-3 text-gray-300">
                            <MapPin className="h-4 w-4 text-blue-400" />
                            <span className="text-sm">{event.venue}</span>
                          </div>
                          
                          <div className="flex items-center space-x-3 text-gray-300">
                            <Users className="h-4 w-4 text-blue-400" />
                            <span className="text-sm">Capacity: {event.capacity} people</span>
                          </div>
                          
                          <div className="flex items-center space-x-3 text-gray-300">
                            <Clock className="h-4 w-4 text-blue-400" />
                            <span className="text-sm">
                              {event.startTime} - {event.endTime}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-slate-600">
                            <div className="text-xl font-bold text-blue-400">
                              NPR {event.price}
                            </div>
                            <Badge 
                              variant={event.status === 'published' ? 'default' : event.status === 'draft' ? 'secondary' : 'destructive'}
                              className="capitalize"
                            >
                              {event.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}