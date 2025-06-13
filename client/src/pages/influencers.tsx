import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, Star, Users, Eye, Heart, Instagram, Youtube, Twitter, MessageSquare, CheckCircle, MapPin, Calendar, DollarSign } from 'lucide-react';
import { InfluencerBookingModal } from '@/components/booking/influencer-booking-modal';
import { InfluencerComparisonTool } from '@/components/booking/influencer-comparison-tool';
import type { Influencer } from '@shared/schema';

export default function InfluencersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [followerRange, setFollowerRange] = useState([0, 1000000]);
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [comparisonList, setComparisonList] = useState<Influencer[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const { data: influencers = [], isLoading } = useQuery({
    queryKey: ['/api/influencers'],
  });

  const categories = [
    'All Categories', 'Fashion', 'Technology', 'Food & Lifestyle', 'Travel', 
    'Health & Fitness', 'Gaming', 'Beauty', 'Sports', 'Music', 'Education'
  ];

  const platforms = [
    'All Platforms', 'Instagram', 'TikTok', 'YouTube', 'Twitter'
  ];

  const filteredInfluencers = useMemo(() => {
    if (!influencers) return [];
    
    return influencers.filter((influencer: Influencer) => {
      const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           influencer.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
                             influencer.category.toLowerCase() === selectedCategory.toLowerCase();
      
      const totalFollowers = (influencer.instagramFollowers || 0) + 
                            (influencer.tiktokFollowers || 0) + 
                            (influencer.youtubeSubscribers || 0) + 
                            (influencer.twitterFollowers || 0);
      
      const matchesFollowerRange = totalFollowers >= followerRange[0] && totalFollowers <= followerRange[1];
      
      const matchesPriceRange = influencer.postPrice >= priceRange[0] && influencer.postPrice <= priceRange[1];
      
      const matchesPlatform = selectedPlatform === 'all' || 
                             (selectedPlatform === 'Instagram' && influencer.instagramFollowers > 0) ||
                             (selectedPlatform === 'TikTok' && influencer.tiktokFollowers > 0) ||
                             (selectedPlatform === 'YouTube' && influencer.youtubeSubscribers > 0) ||
                             (selectedPlatform === 'Twitter' && influencer.twitterFollowers > 0);
      
      return matchesSearch && matchesCategory && matchesFollowerRange && matchesPriceRange && matchesPlatform;
    }).sort((a: Influencer, b: Influencer) => {
      switch (sortBy) {
        case 'popular':
          return (b.totalCollaborations || 0) - (a.totalCollaborations || 0);
        case 'price-low':
          return a.postPrice - b.postPrice;
        case 'price-high':
          return b.postPrice - a.postPrice;
        case 'engagement':
          return (b.engagementRate || 0) - (a.engagementRate || 0);
        case 'followers':
          const aTotal = (a.instagramFollowers || 0) + (a.tiktokFollowers || 0) + (a.youtubeSubscribers || 0);
          const bTotal = (b.instagramFollowers || 0) + (b.tiktokFollowers || 0) + (b.youtubeSubscribers || 0);
          return bTotal - aTotal;
        default:
          return 0;
      }
    });
  }, [influencers, searchTerm, selectedCategory, followerRange, priceRange, selectedPlatform, sortBy]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleBookInfluencer = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setShowBookingModal(true);
  };

  const toggleComparison = (influencer: Influencer) => {
    const exists = comparisonList.find(item => item.id === influencer.id);
    if (exists) {
      setComparisonList(comparisonList.filter(item => item.id !== influencer.id));
    } else if (comparisonList.length < 3) {
      setComparisonList([...comparisonList, influencer]);
    }
  };

  const InfluencerCard = ({ influencer }: { influencer: Influencer }) => {
    const totalFollowers = (influencer.instagramFollowers || 0) + 
                          (influencer.tiktokFollowers || 0) + 
                          (influencer.youtubeSubscribers || 0) + 
                          (influencer.twitterFollowers || 0);

    const engagementPercent = (influencer.engagementRate || 0) / 100;
    const isInComparison = comparisonList.some(item => item.id === influencer.id);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden bg-white dark:bg-black border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 group">
          <div className="relative">
            <img 
              src={influencer.imageUrl} 
              alt={influencer.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
                {influencer.category}
              </Badge>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              {influencer.isVerified && (
                <div className="bg-blue-500 text-white p-1 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}
              <Button
                size="sm"
                variant={isInComparison ? "default" : "outline"}
                onClick={() => toggleComparison(influencer)}
                className="bg-white/90 hover:bg-white text-black border-none"
              >
                Compare
              </Button>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">Engagement Rate</span>
                  <span className="text-green-400 font-bold">{engagementPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(engagementPercent * 20, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{influencer.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  {influencer.location}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-semibold">{influencer.rating}</span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {influencer.description}
            </p>

            {/* Social Media Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                {influencer.instagramFollowers > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Instagram className="h-4 w-4 text-pink-500" />
                    <span className="font-medium">{formatNumber(influencer.instagramFollowers)}</span>
                  </div>
                )}
                {influencer.youtubeSubscribers > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Youtube className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{formatNumber(influencer.youtubeSubscribers)}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {influencer.tiktokFollowers > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-black dark:text-white" />
                    <span className="font-medium">{formatNumber(influencer.tiktokFollowers)}</span>
                  </div>
                )}
                {influencer.twitterFollowers > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Twitter className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{formatNumber(influencer.twitterFollowers)}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Pricing */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sponsored Post</span>
                <span className="font-bold text-purple-600">${influencer.postPrice}</span>
              </div>
              {influencer.packagePrice > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Campaign Package</span>
                  <span className="font-bold text-purple-600">${influencer.packagePrice}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={() => handleBookInfluencer(influencer)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
              >
                Book Collaboration
              </Button>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{formatNumber(totalFollowers)}</div>
                <div className="text-xs text-gray-500">Total Reach</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{influencer.totalCollaborations}</div>
                <div className="text-xs text-gray-500">Collaborations</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{formatNumber(influencer.averageViews || 0)}</div>
                <div className="text-xs text-gray-500">Avg Views</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-black dark:via-purple-950/20 dark:to-black">
      <Helmet>
        <title>Influencers - ReArt Events | Professional Social Media Partnerships</title>
        <meta name="description" content="Discover and collaborate with top social media influencers across fashion, tech, lifestyle, travel, and more. Professional influencer marketing partnerships with verified creators." />
        <meta name="keywords" content="influencers, social media marketing, brand partnerships, content creators, Nepal influencers" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-violet-900 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-violet-200 bg-clip-text text-transparent">
              Partner with Influencers
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 leading-relaxed">
              Connect with verified social media creators and build authentic brand partnerships 
              that drive engagement and reach your target audience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-purple-900 hover:bg-purple-50 px-8 py-3 text-lg font-semibold"
                onClick={() => document.getElementById('influencer-gallery')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Influencers
              </Button>
              {comparisonList.length > 0 && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-purple-900 px-8 py-3 text-lg font-semibold"
                  onClick={() => setShowComparison(true)}
                >
                  Compare ({comparisonList.length})
                </Button>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Floating Social Icons */}
        <div className="absolute top-20 left-10 animate-float">
          <Instagram className="h-8 w-8 text-pink-300 opacity-60" />
        </div>
        <div className="absolute top-32 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <Youtube className="h-8 w-8 text-red-300 opacity-60" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '2s' }}>
          <Twitter className="h-8 w-8 text-blue-300 opacity-60" />
        </div>
      </section>

      {/* Filters Section */}
      <section className="container mx-auto px-4 py-8">
        <Card className="mb-8 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search influencers by name or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-black border-purple-200 dark:border-purple-700"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 bg-white dark:bg-black border-purple-200 dark:border-purple-700">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category === 'All Categories' ? 'all' : category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-white dark:bg-black border-purple-200 dark:border-purple-700">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="followers">Most Followers</SelectItem>
                    <SelectItem value="engagement">Highest Engagement</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-purple-200 dark:border-purple-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Follower Range</Label>
                    <Slider
                      value={followerRange}
                      onValueChange={setFollowerRange}
                      max={1000000}
                      step={10000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{formatNumber(followerRange[0])}</span>
                      <span>{formatNumber(followerRange[1])}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Price Range ($)</Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={15000}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger className="bg-white dark:bg-black border-purple-200 dark:border-purple-700">
                        <SelectValue placeholder="Select Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform} value={platform === 'All Platforms' ? 'all' : platform}>
                            {platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredInfluencers.length} Influencers Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Professional content creators ready for collaboration
            </p>
          </div>
          {comparisonList.length > 0 && (
            <Button
              onClick={() => setShowComparison(true)}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
            >
              Compare Selected ({comparisonList.length})
            </Button>
          )}
        </div>
      </section>

      {/* Influencer Gallery */}
      <section id="influencer-gallery" className="container mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-300 dark:bg-gray-700"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredInfluencers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredInfluencers.map((influencer: Influencer) => (
              <InfluencerCard key={influencer.id} influencer={influencer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-6">
              <Users className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Influencers Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Try adjusting your search criteria or filters to discover more content creators.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setFollowerRange([0, 1000000]);
                setPriceRange([0, 15000]);
                setSelectedPlatform('all');
              }}
              variant="outline"
              className="border-purple-200 dark:border-purple-700"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {showBookingModal && selectedInfluencer && (
        <InfluencerBookingModal
          influencer={selectedInfluencer}
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedInfluencer(null);
          }}
        />
      )}

      {/* Comparison Tool */}
      {showComparison && (
        <InfluencerComparisonTool
          influencers={comparisonList}
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
          onRemove={(id) => setComparisonList(comparisonList.filter(item => item.id !== id))}
        />
      )}
    </div>
  );
}