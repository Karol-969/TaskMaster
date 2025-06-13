import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Filter, Star, Users, TrendingUp, Instagram, Youtube, Twitter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Influencer } from '@shared/schema';

const collaborationSchema = z.object({
  influencerId: z.number(),
  collaborationType: z.string(),
  budget: z.number().min(1),
  timeline: z.string(),
  requirements: z.string().optional(),
  campaignDetails: z.string()
});

type CollaborationForm = z.infer<typeof collaborationSchema>;

interface FilterState {
  category: string;
  followerRange: [number, number];
  engagementRate: [number, number];
  priceRange: [number, number];
  searchTerm: string;
}

function InfluencersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    followerRange: [0, 500000],
    engagementRate: [0, 10],
    priceRange: [0, 5000],
    searchTerm: ''
  });
  
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [comparisonList, setComparisonList] = useState<Influencer[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const { data: influencers = [], isLoading } = useQuery({
    queryKey: ['/api/influencers'],
  });

  // Filter influencers based on current filters
  const filteredInfluencers = (influencers as Influencer[]).filter((influencer: Influencer) => {
    // Category filter
    if (filters.category && influencer.category !== filters.category) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      if (!influencer.name.toLowerCase().includes(searchLower) &&
          !influencer.bio?.toLowerCase().includes(searchLower) &&
          !influencer.tags?.some(tag => tag.toLowerCase().includes(searchLower))) {
        return false;
      }
    }

    // Follower range filter
    if (filters.followerRange) {
      const totalFollowers = 
        (influencer.instagramFollowers || 0) + 
        (influencer.tiktokFollowers || 0) + 
        (influencer.youtubeSubscribers || 0) + 
        (influencer.twitterFollowers || 0);

      if (totalFollowers < filters.followerRange[0] || totalFollowers > filters.followerRange[1]) {
        return false;
      }
    }

    // Engagement rate filter
    if (filters.engagementRate && influencer.engagementRate) {
      if (influencer.engagementRate < filters.engagementRate[0] || influencer.engagementRate > filters.engagementRate[1]) {
        return false;
      }
    }

    // Price range filter
    if (filters.priceRange && influencer.packagePrice) {
      if (influencer.packagePrice < filters.priceRange[0] || influencer.packagePrice > filters.priceRange[1]) {
        return false;
      }
    }

    return true;
  });

  const form = useForm<CollaborationForm>({
    resolver: zodResolver(collaborationSchema),
    defaultValues: {
      collaborationType: 'package',
      budget: 0,
      timeline: '',
      requirements: '',
      campaignDetails: ''
    }
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: CollaborationForm) => {
      return await apiRequest('/api/influencer-bookings', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Booking request sent!",
        description: "We'll contact you within 24 hours to confirm details.",
      });
      setIsBookingModalOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/influencer-bookings'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to send booking request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CollaborationForm) => {
    if (selectedInfluencer) {
      bookingMutation.mutate({
        ...data,
        influencerId: selectedInfluencer.id
      });
    }
  };

  const formatFollowers = (count: number | null) => {
    if (!count) return '0';
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleBookNow = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setIsBookingModalOpen(true);
    form.setValue('influencerId', influencer.id);
    form.setValue('budget', influencer.packagePrice || 0);
  };

  const addToComparison = (influencer: Influencer) => {
    if (comparisonList.length < 3 && !comparisonList.find(i => i.id === influencer.id)) {
      setComparisonList([...comparisonList, influencer]);
      toast({
        title: "Added to comparison",
        description: `${influencer.name} has been added to your comparison list.`,
      });
    } else if (comparisonList.length >= 3) {
      toast({
        title: "Comparison limit reached",
        description: "You can only compare up to 3 influencers at once.",
        variant: "destructive",
      });
    }
  };

  const removeFromComparison = (id: number) => {
    setComparisonList(comparisonList.filter(i => i.id !== id));
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
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8">Loading Influencers...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-900/20 via-black to-black">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
              Top Influencers
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Connect with premium content creators and influencers to amplify your brand's reach. 
              Our curated network features verified creators across all major platforms.
            </p>
            
            {/* Search and Filter Bar */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search influencers by name, bio, or tags..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-gray-700 text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Followers Range: {formatFollowers(filters.followerRange[0])} - {formatFollowers(filters.followerRange[1])}
                  </label>
                  <Slider
                    value={filters.followerRange}
                    onValueChange={(value) => setFilters({ ...filters, followerRange: value as [number, number] })}
                    max={500000}
                    step={10000}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Engagement Rate: {filters.engagementRate[0]}% - {filters.engagementRate[1]}%
                  </label>
                  <Slider
                    value={filters.engagementRate}
                    onValueChange={(value) => setFilters({ ...filters, engagementRate: value as [number, number] })}
                    max={10}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Package Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                    max={5000}
                    step={100}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Bar */}
      {comparisonList.length > 0 && (
        <div className="sticky top-0 z-40 bg-purple-600/90 backdrop-blur-sm border-b border-purple-500/30">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">Compare ({comparisonList.length}/3):</span>
                <div className="flex gap-2">
                  {comparisonList.map((influencer) => (
                    <Badge key={influencer.id} variant="secondary" className="bg-white/20">
                      {influencer.name}
                      <button
                        onClick={() => removeFromComparison(influencer.id)}
                        className="ml-2 text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => setIsComparisonOpen(true)}
                variant="secondary"
                className="bg-white/20 hover:bg-white/30"
              >
                Compare Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Influencers Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">
            {filteredInfluencers.length} Influencers Found
          </h2>
          <div className="flex items-center gap-2 text-gray-400">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filtered by: {filters.category || 'All Categories'}</span>
          </div>
        </div>

        {filteredInfluencers.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-900/50 rounded-2xl p-12 max-w-md mx-auto">
              <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No influencers found</h3>
              <p className="text-gray-400">Try adjusting your filters to see more results.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInfluencers.map((influencer) => (
              <Card key={influencer.id} className="bg-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={influencer.imageUrl || '/placeholder-avatar.png'}
                          alt={influencer.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        {influencer.verified && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                            <Star className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                          {influencer.name}
                        </CardTitle>
                        <p className="text-purple-400 text-sm">{influencer.category}</p>
                        <p className="text-gray-400 text-xs">{influencer.location}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                      {influencer.rating?.toFixed(1)}★
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {influencer.bio}
                  </p>

                  {/* Social Media Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {influencer.instagramFollowers && (
                      <div className="flex items-center gap-1 text-pink-400">
                        <Instagram className="h-3 w-3" />
                        <span>{formatFollowers(influencer.instagramFollowers)}</span>
                      </div>
                    )}
                    {influencer.youtubeSubscribers && (
                      <div className="flex items-center gap-1 text-red-400">
                        <Youtube className="h-3 w-3" />
                        <span>{formatFollowers(influencer.youtubeSubscribers)}</span>
                      </div>
                    )}
                    {influencer.tiktokFollowers && (
                      <div className="flex items-center gap-1 text-gray-300">
                        <TrendingUp className="h-3 w-3" />
                        <span>{formatFollowers(influencer.tiktokFollowers)}</span>
                      </div>
                    )}
                    {influencer.twitterFollowers && (
                      <div className="flex items-center gap-1 text-blue-400">
                        <Twitter className="h-3 w-3" />
                        <span>{formatFollowers(influencer.twitterFollowers)}</span>
                      </div>
                    )}
                  </div>

                  {/* Performance Metrics */}
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-gray-400">Engagement:</span>
                      <span className="text-green-400 ml-1">{influencer.engagementRate}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Campaigns:</span>
                      <span className="text-blue-400 ml-1">{influencer.completedCampaigns}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {influencer.tags && influencer.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {influencer.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-400">
                          {tag}
                        </Badge>
                      ))}
                      {influencer.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                          +{influencer.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="border-t border-gray-700 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        ${influencer.packagePrice || 0}
                      </div>
                      <div className="text-xs text-gray-400">Package Price</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleBookNow(influencer)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      Book Now
                    </Button>
                    <Button
                      onClick={() => addToComparison(influencer)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      disabled={comparisonList.some(i => i.id === influencer.id)}
                    >
                      Compare
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Book {selectedInfluencer?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedInfluencer && (
            <div className="space-y-6">
              {/* Influencer Summary */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={selectedInfluencer.imageUrl || '/placeholder-avatar.png'}
                    alt={selectedInfluencer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{selectedInfluencer.name}</h3>
                    <p className="text-purple-400">{selectedInfluencer.category}</p>
                    <p className="text-gray-400 text-sm">{selectedInfluencer.location}</p>
                  </div>
                </div>

                {/* Social Media Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {selectedInfluencer.instagramFollowers && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-pink-400 mb-1">
                        <Instagram className="h-4 w-4" />
                        <span>Instagram</span>
                      </div>
                      <div className="font-semibold">{formatFollowers(selectedInfluencer.instagramFollowers)}</div>
                    </div>
                  )}
                  {selectedInfluencer.tiktokFollowers && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-300 mb-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>TikTok</span>
                      </div>
                      <div className="font-semibold">{formatFollowers(selectedInfluencer.tiktokFollowers)}</div>
                    </div>
                  )}
                  {selectedInfluencer.youtubeSubscribers && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                        <Youtube className="h-4 w-4" />
                        <span>YouTube</span>
                      </div>
                      <div className="font-semibold">{formatFollowers(selectedInfluencer.youtubeSubscribers)}</div>
                    </div>
                  )}
                  {selectedInfluencer.twitterFollowers && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                        <Twitter className="h-4 w-4" />
                        <span>Twitter</span>
                      </div>
                      <div className="font-semibold">{formatFollowers(selectedInfluencer.twitterFollowers)}</div>
                    </div>
                  )}
                </div>

                {/* Pricing Options */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Story</div>
                    <div className="font-semibold text-purple-400">${selectedInfluencer.storyPrice || 0}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Post</div>
                    <div className="font-semibold text-purple-400">${selectedInfluencer.postPrice}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Video</div>
                    <div className="font-semibold text-purple-400">${selectedInfluencer.videoPrice || 0}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Package</div>
                    <div className="font-semibold text-green-400">${selectedInfluencer.packagePrice || 0}</div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="collaborationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collaboration Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                              <SelectValue placeholder="Select collaboration type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="story">Instagram Story - ${selectedInfluencer.storyPrice || 0}</SelectItem>
                            <SelectItem value="post">Social Media Post - ${selectedInfluencer.postPrice}</SelectItem>
                            <SelectItem value="video">Video Content - ${selectedInfluencer.videoPrice || 0}</SelectItem>
                            <SelectItem value="package">Complete Package - ${selectedInfluencer.packagePrice || 0}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="bg-gray-800/50 border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timeline</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="asap">ASAP (1-3 days)</SelectItem>
                            <SelectItem value="1week">Within 1 week</SelectItem>
                            <SelectItem value="2weeks">Within 2 weeks</SelectItem>
                            <SelectItem value="1month">Within 1 month</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="campaignDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Details</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe your campaign, target audience, key messages, and any specific requirements..."
                            className="bg-gray-800/50 border-gray-700 text-white min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Requirements (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Any specific hashtags, mentions, deliverables, or special requests..."
                            className="bg-gray-800/50 border-gray-700 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsBookingModalOpen(false)}
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={bookingMutation.isPending}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      {bookingMutation.isPending ? 'Sending...' : 'Send Booking Request'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InfluencersPage;