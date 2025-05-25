import { format } from 'date-fns';
import { Calendar, MapPin, Users, DollarSign, Image } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@shared/schema';

interface EventDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
}

export function EventDetailsDialog({ open, onOpenChange, event }: EventDetailsDialogProps) {
  if (!event) return null;

  const formatEventDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE, MMMM d, yyyy \'at\' h:mm a');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">{event.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Image */}
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-blue-600 text-white text-lg px-3 py-1">
                ${event.ticketPrice}
              </Badge>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <p className="text-white font-medium">Event Date</p>
                  <p className="text-gray-300">{formatEventDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <p className="text-white font-medium">Venue</p>
                  <p className="text-gray-300">{event.venue}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <p className="text-white font-medium">Tickets</p>
                  <p className="text-gray-300">
                    {event.availableTickets} of {event.totalTickets} available
                  </p>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full"
                      style={{
                        width: `${((event.totalTickets - event.availableTickets) / event.totalTickets) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <DollarSign className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <p className="text-white font-medium">Ticket Price</p>
                  <p className="text-gray-300">${event.ticketPrice} per ticket</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-white font-medium text-lg mb-3">Description</h3>
            <p className="text-gray-300 leading-relaxed">{event.description}</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{event.totalTickets}</p>
              <p className="text-gray-400 text-sm">Total Tickets</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{event.totalTickets - event.availableTickets}</p>
              <p className="text-gray-400 text-sm">Tickets Sold</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">
                ${(event.totalTickets - event.availableTickets) * event.ticketPrice}
              </p>
              <p className="text-gray-400 text-sm">Revenue</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}