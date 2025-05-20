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

export function InfluencerList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: influencers = [], isLoading, error } = useQuery({
    queryKey: ['/api/influencers'],
    queryFn: async () => {
      const res = await fetch('/api/influencers');
      return res.json();
    }
  });
  
  // Extract unique categories for filter
  const categories = ['all', ...new Set(influencers.map((influencer: any) => influencer.category.toLowerCase()))];
  
  // Filter influencers based on search term and category
  const filteredInfluencers = influencers.filter((influencer: any) => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         influencer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || influencer.category.toLowerCase() === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleBookNow = (influencer: any) => {
    setSelectedInfluencer(influencer);
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
        <p className="text-lg">Failed to load influencers. Please try again later.</p>
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
            placeholder="Search influencers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-48 flex items-center">
          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Influencers Grid */}
      {filteredInfluencers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No influencers found matching your criteria.</p>
          <Button variant="link" onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInfluencers.map((influencer: any) => (
            <BookingCard
              key={influencer.id}
              title={influencer.name}
              description={influencer.description}
              imageUrl={influencer.imageUrl}
              price={formatCurrency(influencer.price)}
              badge={influencer.category}
              rating={influencer.rating}
              subInfo={influencer.socialStats}
              onClick={() => handleBookNow(influencer)}
            />
          ))}
        </div>
      )}
      
      {selectedInfluencer && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          itemType="influencer"
          item={selectedInfluencer}
        />
      )}
    </div>
  );
}
