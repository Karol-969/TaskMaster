import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, StarHalf, Search, Filter } from 'lucide-react';
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
import { generateStarRating, formatCurrency } from '@/lib/utils';

export function ArtistList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: artists = [], isLoading, error } = useQuery({
    queryKey: ['/api/artists'],
    queryFn: async () => {
      const res = await fetch('/api/artists');
      return res.json();
    }
  });
  
  // Extract unique genres for filter
  const genres = ['all', ...new Set(artists.map((artist: any) => artist.genre.toLowerCase()))];
  
  // Filter artists based on search term and genre
  const filteredArtists = artists.filter((artist: any) => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         artist.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'all' || artist.genre.toLowerCase() === genreFilter;
    
    return matchesSearch && matchesGenre;
  });
  
  const handleBookNow = (artist: any) => {
    setSelectedArtist(artist);
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
        <p className="text-lg">Failed to load artists. Please try again later.</p>
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
            placeholder="Search artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-48 flex items-center">
          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Artists Grid */}
      {filteredArtists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No artists found matching your criteria.</p>
          <Button variant="link" onClick={() => { setSearchTerm(''); setGenreFilter('all'); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist: any) => (
            <BookingCard
              key={artist.id}
              title={artist.name}
              description={artist.description}
              imageUrl={artist.imageUrl}
              price={formatCurrency(artist.price)}
              badge={artist.genre}
              rating={artist.rating}
              onClick={() => handleBookNow(artist)}
            />
          ))}
        </div>
      )}
      
      {selectedArtist && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          itemType="artist"
          item={selectedArtist}
        />
      )}
    </div>
  );
}
