import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingPage } from "@/components/ui/loading";
import { InfluencerBookingModal } from "@/components/booking/influencer-booking-modal";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Instagram,
  MessageCircle,
  Heart,
  Share2,
  Award,
  CheckCircle,
  Eye,
  Clock,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import { Link } from "wouter";
import type { Influencer } from "@shared/schema";

export default function InfluencerProfile() {
  const [, params] = useRoute("/influencer/:id");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<'story' | 'video' | 'package'>('package');

  const { data: influencer, isLoading, error } = useQuery<Influencer>({
    queryKey: [`/api/influencers/${params?.id}`],
    enabled: !!params?.id,
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error || !influencer) {
    return (
      <Layout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Influencer Not Found</h1>
            <p className="text-gray-400 mb-6">The influencer you're looking for doesn't exist.</p>
            <Link href="/influencers">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Influencers
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const formatFollowers = (count: number | null) => {
    if (!count) return '0';
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'Contact for pricing';
    return `NRS ${price.toLocaleString()}`;
  };

  const totalFollowers = 
    (influencer.instagramFollowers || 0) + 
    (influencer.tiktokFollowers || 0) + 
    (influencer.youtubeSubscribers || 0) + 
    (influencer.twitterFollowers || 0);

  return (
    <Layout>
      <Helmet>
        <title>{influencer.name} - Influencer Profile | ReArt Events</title>
        <meta name="description" content={`Book ${influencer.name} for your next campaign. ${influencer.description}`} />
      </Helmet>

      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-purple-900 via-black to-black">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/influencers">
              <Button variant="ghost" className="text-white hover:bg-white/10 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Influencers
              </Button>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Profile Info */}
              <div className="lg:col-span-2">
                <div className="flex items-start gap-6 mb-8">
                  <div className="relative">
                    <img
                      src={influencer.imageUrl || '/placeholder-avatar.png'}
                      alt={influencer.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
                    />
                    {influencer.isVerified && (
                      <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h1 className="text-4xl font-bold text-white">{influencer.name}</h1>
                      <Badge variant="secondary" className="bg-purple-800 text-purple-200">
                        {influencer.rating?.toFixed(1)}★
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-6 text-gray-300 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{influencer.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{formatFollowers(totalFollowers)} followers</span>
                      </div>
                      {influencer.engagementRate && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>{Number(influencer.engagementRate).toFixed(1)}% engagement</span>
                        </div>
                      )}
                    </div>

                    <Badge className="bg-purple-600 text-white mb-4">
                      {influencer.category}
                    </Badge>

                    <p className="text-gray-300 text-lg leading-relaxed">
                      {influencer.description}
                    </p>
                  </div>
                </div>

                {/* Social Media Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {influencer.instagramFollowers && (
                    <Card className="bg-gray-900 border-gray-700">
                      <CardContent className="p-4 text-center">
                        <Instagram className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{formatFollowers(influencer.instagramFollowers)}</p>
                        <p className="text-gray-400 text-sm">Instagram</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {influencer.tiktokFollowers && (
                    <Card className="bg-gray-900 border-gray-700">
                      <CardContent className="p-4 text-center">
                        <MessageCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{formatFollowers(influencer.tiktokFollowers)}</p>
                        <p className="text-gray-400 text-sm">TikTok</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {influencer.youtubeSubscribers && (
                    <Card className="bg-gray-900 border-gray-700">
                      <CardContent className="p-4 text-center">
                        <Globe className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{formatFollowers(influencer.youtubeSubscribers)}</p>
                        <p className="text-gray-400 text-sm">YouTube</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {influencer.twitterFollowers && (
                    <Card className="bg-gray-900 border-gray-700">
                      <CardContent className="p-4 text-center">
                        <Share2 className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{formatFollowers(influencer.twitterFollowers)}</p>
                        <p className="text-gray-400 text-sm">Twitter</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Booking Card */}
              <div className="lg:col-span-1">
                <Card className="bg-gray-900 border-gray-700 sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Book {influencer.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {influencer.storyPrice && (
                        <button 
                          onClick={() => setIsBookingModalOpen(true)}
                          className="w-full flex justify-between items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <span className="text-gray-300">Story Post</span>
                          <span className="text-purple-400 font-semibold">{formatPrice(influencer.storyPrice)}</span>
                        </button>
                      )}
                      
                      {influencer.videoPrice && (
                        <button 
                          onClick={() => setIsBookingModalOpen(true)}
                          className="w-full flex justify-between items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <span className="text-gray-300">Video Content</span>
                          <span className="text-purple-400 font-semibold">{formatPrice(influencer.videoPrice)}</span>
                        </button>
                      )}
                      
                      {influencer.packagePrice && (
                        <button 
                          onClick={() => setIsBookingModalOpen(true)}
                          className="w-full flex justify-between items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border-2 border-purple-500 transition-colors cursor-pointer"
                        >
                          <span className="text-gray-300">Complete Package</span>
                          <span className="text-purple-400 font-semibold">{formatPrice(influencer.packagePrice)}</span>
                        </button>
                      )}
                    </div>

                    <Button 
                      onClick={() => setIsBookingModalOpen(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                    >
                      Book Now
                    </Button>

                    {/* Contact Info */}
                    <div className="space-y-2 pt-4 border-t border-gray-700">
                      {influencer.phone && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">{influencer.phone}</span>
                        </div>
                      )}

                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900">
              <TabsTrigger value="about" className="text-white data-[state=active]:bg-purple-600">About</TabsTrigger>
              <TabsTrigger value="portfolio" className="text-white data-[state=active]:bg-purple-600">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews" className="text-white data-[state=active]:bg-purple-600">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-8">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">About {influencer.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {influencer.bio && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Biography</h3>
                      <p className="text-gray-300 leading-relaxed">{influencer.bio}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Quick Stats</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Followers</span>
                          <span className="text-white">{formatFollowers(totalFollowers)}</span>
                        </div>
                        {influencer.engagementRate && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Engagement Rate</span>
                            <span className="text-white">{influencer.engagementRate.toFixed(1)}%</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Category</span>
                          <span className="text-white">{influencer.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rating</span>
                          <span className="text-white">{influencer.rating?.toFixed(1)}★</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-purple-800 text-purple-200">
                          {influencer.category}
                        </Badge>
                        {influencer.isVerified && (
                          <Badge variant="secondary" className="bg-blue-800 text-blue-200">
                            Verified Creator
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="portfolio" className="mt-8">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  {influencer.portfolioImages && influencer.portfolioImages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {influencer.portfolioImages.map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Eye className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No portfolio images available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-8">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Client Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Reviews coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Booking Modal */}
      <InfluencerBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        influencer={influencer}
      />
    </Layout>
  );
}