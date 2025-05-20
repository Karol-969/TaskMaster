import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Users, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { BookingCard } from '@/components/ui/booking-card';
import { BookingModal } from '@/components/booking/booking-modal';
import { formatCurrency } from '@/lib/utils';

export function VenueList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityRange, setCapacityRange] = useState([0]); // Slider value
  const [maxCapacity, setMaxCapacity] = useState(0);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: venues = [], isLoading, error } = useQuery({
    queryKey: ['/api/venues'],
    queryFn: async () => {
      const res = await fetch('/api/venues');
      return res.json();
    },
    onSuccess: (data) => {
      // Find the maximum capacity to set the slider max
      if (data.length > 0) {
        const max = Math.max(...data.map((venue: any) => venue.capacity));
        setMaxCapacity(max);
        setCapacityRange([max]);
      }
    }
  });
  
  // Filter venues based on search term and capacity
  const filteredVenues = venues.filter((venue: any) => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          venue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          venue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCapacity = venue.capacity <= capacityRange[0];
    
    return matchesSearch && matchesCapacity;
  });
  
  const handleBookNow = (venue: any) => {
    setSelectedVenue(venue);
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
        <p className="text-lg">Failed to load venues. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search venues by name, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-1" /> Maximum Capacity: {capacityRange[0]}
            </span>
          </div>
          <Slider
            value={capacityRange}
            max={maxCapacity}
            step={1}
            onValueChange={setCapacityRange}
          />
        </div>
      </div>

      {/* Venues Grid */}
      {filteredVenues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No venues found matching your criteria.</p>
          <Button variant="link" onClick={() => { 
            setSearchTerm(''); 
            setCapacityRange([maxCapacity]); 
          }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue: any) => (
            <BookingCard
              key={venue.id}
              title={venue.name}
              description={venue.description}
              imageUrl={venue.imageUrl}
              price={formatCurrency(venue.price)}
              badge={venue.location}
              icon={<Building className="h-5 w-5 text-accent" />}
              subInfo={`Capacity: ${venue.capacity} | Amenities: ${venue.amenities.split(',')[0]}...`}
              onClick={() => handleBookNow(venue)}
            />
          ))}
        </div>
      )}
      
      {selectedVenue && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          itemType="venue"
          item={selectedVenue}
        />
      )}
    </div>
  );
}
