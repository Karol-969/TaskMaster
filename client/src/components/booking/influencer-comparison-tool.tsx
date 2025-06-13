import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Instagram, Youtube, Twitter, MessageSquare, Star, Users, CheckCircle, MapPin, X } from 'lucide-react';
import type { Influencer } from '@shared/schema';

interface InfluencerComparisonToolProps {
  influencers: Influencer[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: number) => void;
}

export function InfluencerComparisonTool({ influencers, isOpen, onClose, onRemove }: InfluencerComparisonToolProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getEngagementPercent = (rate: number | null) => {
    return ((rate || 0) / 100).toFixed(1);
  };

  const getTotalFollowers = (influencer: Influencer) => {
    return (influencer.instagramFollowers || 0) + 
           (influencer.tiktokFollowers || 0) + 
           (influencer.youtubeSubscribers || 0) + 
           (influencer.twitterFollowers || 0);
  };

  const ComparisonMetric = ({ label, values }: { label: string; values: (string | number)[] }) => (
    <div className="py-3 border-b border-gray-100 dark:border-gray-800">
      <div className="font-medium text-sm text-gray-600 dark:text-gray-400 mb-2">{label}</div>
      <div className="grid grid-cols-3 gap-4">
        {values.map((value, index) => (
          <div key={index} className="text-center">
            <span className="font-semibold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (influencers.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Influencer Comparison</DialogTitle>
          </DialogHeader>
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Influencers Selected</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Select up to 3 influencers from the gallery to compare their profiles, engagement rates, and pricing.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            Compare Influencers ({influencers.length}/3)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {influencers.map((influencer) => (
              <Card key={influencer.id} className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemove(influencer.id)}
                  className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <img 
                      src={influencer.imageUrl} 
                      alt={influencer.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto"
                    />
                    {influencer.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-1">{influencer.name}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {influencer.category}
                  </Badge>
                  
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-3 w-3" />
                    {influencer.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                <ComparisonMetric 
                  label="Total Followers" 
                  values={influencers.map(inf => formatNumber(getTotalFollowers(inf)))} 
                />
                
                <ComparisonMetric 
                  label="Engagement Rate" 
                  values={influencers.map(inf => `${getEngagementPercent(inf.engagementRate)}%`)} 
                />
                
                <ComparisonMetric 
                  label="Rating" 
                  values={influencers.map(inf => (
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      {inf.rating}
                    </div>
                  ))} 
                />
                
                <ComparisonMetric 
                  label="Total Collaborations" 
                  values={influencers.map(inf => inf.totalCollaborations || 0)} 
                />
                
                <ComparisonMetric 
                  label="Average Views" 
                  values={influencers.map(inf => formatNumber(inf.averageViews || 0))} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                <ComparisonMetric 
                  label="Instagram" 
                  values={influencers.map(inf => (
                    <div className="flex items-center justify-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-500" />
                      {formatNumber(inf.instagramFollowers || 0)}
                    </div>
                  ))} 
                />
                
                <ComparisonMetric 
                  label="TikTok" 
                  values={influencers.map(inf => (
                    <div className="flex items-center justify-center gap-2">
                      <MessageSquare className="h-4 w-4 text-black dark:text-white" />
                      {formatNumber(inf.tiktokFollowers || 0)}
                    </div>
                  ))} 
                />
                
                <ComparisonMetric 
                  label="YouTube" 
                  values={influencers.map(inf => (
                    <div className="flex items-center justify-center gap-2">
                      <Youtube className="h-4 w-4 text-red-500" />
                      {formatNumber(inf.youtubeSubscribers || 0)}
                    </div>
                  ))} 
                />
                
                <ComparisonMetric 
                  label="Twitter" 
                  values={influencers.map(inf => (
                    <div className="flex items-center justify-center gap-2">
                      <Twitter className="h-4 w-4 text-blue-500" />
                      {formatNumber(inf.twitterFollowers || 0)}
                    </div>
                  ))} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                <ComparisonMetric 
                  label="Sponsored Post" 
                  values={influencers.map(inf => `$${inf.postPrice}`)} 
                />
                
                <ComparisonMetric 
                  label="Story Price" 
                  values={influencers.map(inf => inf.storyPrice ? `$${inf.storyPrice}` : 'N/A')} 
                />
                
                <ComparisonMetric 
                  label="Video Content" 
                  values={influencers.map(inf => inf.videoPrice ? `$${inf.videoPrice}` : 'N/A')} 
                />
                
                <ComparisonMetric 
                  label="Campaign Package" 
                  values={influencers.map(inf => inf.packagePrice ? `$${inf.packagePrice}` : 'N/A')} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                <ComparisonMetric 
                  label="Languages" 
                  values={influencers.map(inf => (inf.languages || []).join(', ') || 'Not specified')} 
                />
                
                <ComparisonMetric 
                  label="Collaboration Types" 
                  values={influencers.map(inf => (inf.collaborationTypes || []).slice(0, 2).join(', ') || 'All types')} 
                />
                
                <ComparisonMetric 
                  label="Contact" 
                  values={influencers.map(inf => inf.contactEmail || 'Available on request')} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button variant="outline" onClick={onClose}>
              Close Comparison
            </Button>
            
            <div className="space-x-2">
              <Button 
                onClick={() => {
                  // Export comparison data (could be implemented)
                  const data = influencers.map(inf => ({
                    name: inf.name,
                    category: inf.category,
                    totalFollowers: getTotalFollowers(inf),
                    engagementRate: getEngagementPercent(inf.engagementRate),
                    postPrice: inf.postPrice,
                    rating: inf.rating,
                  }));
                  console.log('Comparison data:', data);
                }}
                variant="outline"
              >
                Export Data
              </Button>
              
              <Button 
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                onClick={() => {
                  // Could implement bulk booking functionality
                  onClose();
                }}
              >
                Book Selected
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}