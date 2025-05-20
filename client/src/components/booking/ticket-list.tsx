import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, CalendarDays, Ticket } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { BookingCard } from '@/components/ui/booking-card';
import { BookingModal } from '@/components/booking/booking-modal';
import { formatCurrency, formatDate } from '@/lib/utils';

export function TicketList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['/api/events'],
    queryFn: async () => {
      const res = await fetch('/api/events');
      return res.json();
    }
  });
  
  // Price filter options
  const priceOptions = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under $50', value: 'under-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: 'Over $200', value: 'over-200' }
  ];
  
  // Filter events based on search term and price
  const filteredEvents = events.filter((event: any) => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.venue.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesPrice = true;
    if (priceFilter !== 'all') {
      if (priceFilter === 'under-50') matchesPrice = event.ticketPrice < 50;
      else if (priceFilter === '50-100') matchesPrice = event.ticketPrice >= 50 && event.ticketPrice <= 100;
      else if (priceFilter === '100-200') matchesPrice = event.ticketPrice > 100 && event.ticketPrice <= 200;
      else if (priceFilter === 'over-200') matchesPrice = event.ticketPrice > 200;
    }
    
    return matchesSearch && matchesPrice;
  });
  
  // Sort events by date (upcoming first)
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const handleBookNow = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p className="text-lg">Failed to load events. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-48 flex items-center">
          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by price" />
            </SelectTrigger>
            <SelectContent>
              {priceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events Grid */}
      {sortedEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No events found matching your criteria.</p>
          <Button variant="link" onClick={() => { setSearchTerm(''); setPriceFilter('all'); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event: any) => (
            <BookingCard
              key={event.id}
              title={event.name}
              description={event.description}
              imageUrl={event.imageUrl}
              price={formatCurrency(event.ticketPrice)}
              badge={`${event.availableTickets} tickets left`}
              icon={<Ticket className="h-5 w-5 text-accent" />}
              subInfo={
                <div className="flex items-center text-sm">
                  <CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{formatDate(event.date)}</span>
                </div>
              }
              label={event.venue}
              onClick={() => handleBookNow(event)}
              disabled={event.availableTickets <= 0}
            />
          ))}
        </div>
      )}
      
      {selectedEvent && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          itemType="ticket"
          item={selectedEvent}
        />
      )}
    </div>
  );
}
