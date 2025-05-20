import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Volume2 } from 'lucide-react';
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
import { formatCurrency } from '@/lib/utils';

export function SoundList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedSound, setSelectedSound] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: soundSystems = [], isLoading, error } = useQuery({
    queryKey: ['/api/sound-systems'],
    queryFn: async () => {
      const res = await fetch('/api/sound-systems');
      return res.json();
    }
  });
  
  // Extract unique types for filter
  const types = ['all', ...new Set(soundSystems.map((sound: any) => sound.type.toLowerCase()))];
  
  // Filter sound systems based on search term and type
  const filteredSoundSystems = soundSystems.filter((sound: any) => {
    const matchesSearch = sound.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sound.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || sound.type.toLowerCase() === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  const handleBookNow = (sound: any) => {
    setSelectedSound(sound);
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
        <p className="text-lg">Failed to load sound systems. Please try again later.</p>
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
            placeholder="Search sound systems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-48 flex items-center">
          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sound Systems Grid */}
      {filteredSoundSystems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No sound systems found matching your criteria.</p>
          <Button variant="link" onClick={() => { setSearchTerm(''); setTypeFilter('all'); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSoundSystems.map((sound: any) => (
            <BookingCard
              key={sound.id}
              title={sound.name}
              description={sound.description}
              imageUrl={sound.imageUrl}
              price={formatCurrency(sound.price)}
              badge={sound.type}
              icon={<Volume2 className="h-5 w-5 text-accent" />}
              onClick={() => handleBookNow(sound)}
            />
          ))}
        </div>
      )}
      
      {selectedSound && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          itemType="sound"
          item={selectedSound}
        />
      )}
    </div>
  );
}
