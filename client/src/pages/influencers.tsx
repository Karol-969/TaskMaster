import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Search, Filter, Star, Users, TrendingUp, Instagram, Youtube, Twitter, MessageSquare, Eye, Link } from 'lucide-react';
import { Link as RouterLink } from 'wouter';
import { LoadingPage, LoadingCard } from '@/components/ui/loading';
import { InfluencerBookingModal } from '@/components/booking/influencer-booking-modal';
import { InfluencerComparisonTool } from '@/components/booking/influencer-comparison-tool';
import type { Influencer } from '@shared/schema';

interface FilterState {
  category: string;
  followerRange: [number, number];
  engagementRate: [number, number];
  priceRange: [number, number];
  searchTerm: string;
}

import { Layout } from '@/components/layout/layout';
import { Helmet } from 'react-helmet';

function InfluencersPage() {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    followerRange: [0, 1000000],
    engagementRate: [0, 20],
    priceRange: [0, 1000000],
    searchTerm: ''
  });
  
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [comparisonList, setComparisonList] = useState<Influencer[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const { data: influencers = [], isLoading, error } = useQuery<Influencer[]>({
    queryKey: ['/api/influencers'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  // Optimized filter logic with useMemo
  const filteredInfluencers = useMemo(() => {
    if (!influencers.length) return [];
    
    return (influencers as Influencer[]).filter((influencer: Influencer) => {
      // Category filter
      if (filters.category && filters.category !== 'all' && influencer.category !== filters.category) {
        return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!influencer.name.toLowerCase().includes(searchLower) &&
            !influencer.bio?.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Follower range filter
      const totalFollowers = 
        (influencer.instagramFollowers || 0) + 
        (influencer.tiktokFollowers || 0) + 
        (influencer.youtubeSubscribers || 0) + 
        (influencer.twitterFollowers || 0);

      if (totalFollowers < filters.followerRange[0] || totalFollowers > filters.followerRange[1]) {
        return false;
      }

      // Engagement rate filter - only apply if influencer has engagement rate
      if (influencer.engagementRate !== null && influencer.engagementRate !== undefined) {
        if (influencer.engagementRate < filters.engagementRate[0] || influencer.engagementRate > filters.engagementRate[1]) {
          return false;
        }
      }

      // Price range filter - only apply if influencer has pricing
      const hasPrice = influencer.packagePrice || influencer.storyPrice || influencer.videoPrice;
      if (hasPrice) {
        const price = influencer.packagePrice || influencer.storyPrice || influencer.videoPrice || 0;
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
          return false;
        }
      }

      return true;
    });
  }, [influencers, filters]);

  const formatFollowers = (count: number | null) => {
    if (!count) return '0';
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleBookInfluencer = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setIsBookingModalOpen(true);
  };

  const addToComparison = (influencer: Influencer) => {
    if (comparisonList.length < 3 && !comparisonList.find(i => i.id === influencer.id)) {
      setComparisonList([...comparisonList, influencer]);
    }
  };

  const removeFromComparison = (influencerId: number) => {
    setComparisonList(comparisonList.filter(i => i.id !== influencerId));
  };

  const categories = [
    'Fashion & Beauty',
    'Technology', 
    'Health & Fitness',
    'Food & Travel',
    'Music & Entertainment',
    'Lifestyle'
  ];

  if (isLoading) {
    return (
      <LoadingPage 
        title="Loading Influencers"
        description="Finding the perfect influencers for your campaigns"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to load influencers</h2>
          <p className="text-gray-400">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Connect with Top Influencers | ReArt Events</title>
        <meta name="description" content="Discover and collaborate with verified influencers across all social media platforms. Find the perfect match for your brand and campaign goals with NRS pricing." />
      </Helmet>
      
      <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 to-black py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Connect with Top <span className="text-purple-400">Influencers</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover and collaborate with verified influencers across all social media platforms.
              Find the perfect match for your brand and campaign goals.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Filters Section */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-semibold">Filter Influencers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search influencers..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Category</label>
              <Select 
                value={filters.category} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Followers Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Followers: {formatFollowers(filters.followerRange[0])} - {formatFollowers(filters.followerRange[1])}
              </label>
              <Slider
                value={filters.followerRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, followerRange: value as [number, number] }))}
                max={1000000}
                step={10000}
                className="w-full"
              />
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Budget: NRS {filters.priceRange[0].toLocaleString()} - NRS {filters.priceRange[1].toLocaleString()}
              </label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                max={1000000}
                step={5000}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Comparison Tool */}
        {comparisonList.length > 0 && (
          <div className="mb-8">
            <div className="bg-purple-900 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <span className="font-medium">Comparison List ({comparisonList.length}/3)</span>
                </div>
                <Button
                  onClick={() => setIsComparisonOpen(true)}
                  disabled={comparisonList.length < 2}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Compare Selected
                </Button>
              </div>
              <div className="flex gap-2 mt-3">
                {comparisonList.map((influencer) => (
                  <Badge key={influencer.id} variant="secondary" className="flex items-center gap-1">
                    {influencer.name}
                    <button
                      onClick={() => removeFromComparison(influencer.id)}
                      className="ml-1 text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredInfluencers.length} of {influencers.length} influencers
          </p>
        </div>

        {/* Influencers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInfluencers.map((influencer) => (
            <Card key={influencer.id} className="bg-gray-900 border-gray-700 hover:border-purple-500 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={influencer.imageUrl || '/placeholder-avatar.png'}
                        alt={influencer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {influencer.isVerified && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                          <Star className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{influencer.name}</CardTitle>
                      <p className="text-purple-400 text-sm">{influencer.category}</p>
                      <p className="text-gray-400 text-xs">{influencer.location}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-purple-800 text-purple-200">
                    {influencer.rating?.toFixed(1)}★
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm line-clamp-2">
                  {influencer.description}
                </p>

                {/* Social Media Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {influencer.instagramFollowers && (
                    <div className="flex items-center gap-2 text-pink-400">
                      <Instagram className="h-4 w-4" />
                      <span className="text-sm">{formatFollowers(influencer.instagramFollowers)}</span>
                    </div>
                  )}
                  {influencer.youtubeSubscribers && (
                    <div className="flex items-center gap-2 text-red-400">
                      <Youtube className="h-4 w-4" />
                      <span className="text-sm">{formatFollowers(influencer.youtubeSubscribers)}</span>
                    </div>
                  )}
                  {influencer.tiktokFollowers && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">{formatFollowers(influencer.tiktokFollowers)}</span>
                    </div>
                  )}
                  {influencer.twitterFollowers && (
                    <div className="flex items-center gap-2 text-blue-400">
                      <Twitter className="h-4 w-4" />
                      <span className="text-sm">{formatFollowers(influencer.twitterFollowers)}</span>
                    </div>
                  )}
                </div>

                {/* Performance Metrics */}
                <div className="flex justify-between text-sm bg-gray-800 rounded p-3">
                  <div className="text-center">
                    <div className="text-green-400 font-semibold">{influencer.engagementRate}%</div>
                    <div className="text-gray-400 text-xs">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 font-semibold">12</div>
                    <div className="text-gray-400 text-xs">Campaigns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 font-semibold">24h</div>
                    <div className="text-gray-400 text-xs">Response</div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t border-gray-700 pt-4">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-purple-400">
                      NRS {(influencer.packagePrice || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Package Price</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <RouterLink href={`/influencer/${influencer.id}`}>
                      <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </RouterLink>
                    <Button
                      onClick={() => addToComparison(influencer)}
                      variant="outline"
                      disabled={comparisonList.length >= 3 || comparisonList.some(i => i.id === influencer.id)}
                      className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                    >
                      Compare
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInfluencers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">No influencers found</h3>
            <p className="text-gray-400">Try adjusting your filters to see more results.</p>
          </div>
        )}
        </div>

        {/* Booking Modal */}
        {selectedInfluencer && (
          <InfluencerBookingModal
            isOpen={isBookingModalOpen}
            onClose={() => {
              setIsBookingModalOpen(false);
              setSelectedInfluencer(null);
            }}
            influencer={selectedInfluencer}
          />
        )}

        {/* Comparison Tool - Temporarily disabled for performance */}
      </div>
    </Layout>
  );
}

export default InfluencersPage;