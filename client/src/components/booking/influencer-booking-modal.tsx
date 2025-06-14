import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Instagram, MessageSquare, Youtube, Twitter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Influencer } from '@shared/schema';

const collaborationSchema = z.object({
  campaignName: z.string().min(1, 'Campaign name is required'),
  collaborationType: z.string().min(1, 'Collaboration type is required'),
  brandName: z.string().min(1, 'Brand/Company name is required'),
  campaignObjectives: z.string().min(10, 'Please provide campaign objectives'),
  deliverables: z.object({
    posts: z.number().default(1),
    stories: z.number().default(0),
    videos: z.number().default(0),
    liveStreams: z.number().default(0),
  }),
});

type CollaborationForm = z.infer<typeof collaborationSchema>;

interface InfluencerBookingModalProps {
  influencer: Influencer;
  isOpen: boolean;
  onClose: () => void;
}

export function InfluencerBookingModal({ influencer, isOpen, onClose }: InfluencerBookingModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CollaborationForm>({
    resolver: zodResolver(collaborationSchema),
    defaultValues: {
      deliverables: {
        posts: 1,
        stories: 0,
        videos: 0,
        liveStreams: 0,
      },
    },
  });

  const collaborationType = watch('collaborationType');
  const deliverables = watch('deliverables');

  const createBookingMutation = useMutation({
    mutationFn: async (data: CollaborationForm) => {
      const totalAmount = calculateTotalCost() * 100; // Convert NPR to paisa for Khalti
      
      // Use the same payment initiation as payment test page
      const paymentPayload = {
        bookingId: Math.floor(Math.random() * 10000), // Generate unique booking ID
        amount: totalAmount / 100, // Convert back to NPR for the API
        productName: `Influencer Collaboration - ${influencer.name}`,
        customerInfo: {
          name: data.brandName,
          email: 'customer@reartevents.com',
          phone: '9800000000'
        }
      };

      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment initiation failed');
      }

      return await response.json();
    },
    onSuccess: (paymentResponse: { paymentUrl: string; paymentId: number; pidx: string }) => {
      toast({
        title: "Redirecting to Payment",
        description: "Redirecting to Khalti for secure payment...",
      });
      
      // Direct redirect to Khalti payment page
      if (paymentResponse?.paymentUrl) {
        window.location.href = paymentResponse.paymentUrl;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const calculateTotalCost = () => {
    let total = 0;
    if (deliverables.posts) total += deliverables.posts * influencer.postPrice;
    if (deliverables.stories) total += deliverables.stories * (influencer.storyPrice ?? Math.round(influencer.postPrice * 0.5));
    if (deliverables.videos) total += deliverables.videos * (influencer.videoPrice ?? Math.round(influencer.postPrice * 2));
    if (deliverables.liveStreams) total += deliverables.liveStreams * (influencer.videoPrice ?? Math.round(influencer.postPrice * 3));
    return total;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const onSubmit = (data: CollaborationForm) => {
    createBookingMutation.mutate(data);
  };

  const totalFollowers = (influencer.instagramFollowers ?? 0) + 
                        (influencer.tiktokFollowers ?? 0) + 
                        (influencer.youtubeSubscribers ?? 0) + 
                        (influencer.twitterFollowers ?? 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Collaboration with {influencer.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Influencer Info Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={influencer.imageUrl}
                    alt={influencer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{influencer.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {influencer.category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Reach</span>
                    <span className="font-semibold">{formatNumber(totalFollowers)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Social Media Reach</h4>
                    
                    <div className="space-y-2">
                      {influencer.instagramFollowers && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Instagram className="h-4 w-4" />
                          <span>{formatNumber(influencer.instagramFollowers)} followers</span>
                        </div>
                      )}
                      
                      {influencer.tiktokFollowers && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MessageSquare className="h-4 w-4" />
                          <span>{formatNumber(influencer.tiktokFollowers)} followers</span>
                        </div>
                      )}
                      
                      {influencer.youtubeSubscribers && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Youtube className="h-4 w-4" />
                          <span>{formatNumber(influencer.youtubeSubscribers)} subscribers</span>
                        </div>
                      )}
                      
                      {influencer.twitterFollowers && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Twitter className="h-4 w-4" />
                          <span>{formatNumber(influencer.twitterFollowers)} followers</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Pricing</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Sponsored Post</span>
                        <span>NPR {influencer.postPrice}</span>
                      </div>
                      {influencer.storyPrice && (
                        <div className="flex justify-between">
                          <span>Story</span>
                          <span>NPR {influencer.storyPrice}</span>
                        </div>
                      )}
                      {influencer.videoPrice && (
                        <div className="flex justify-between">
                          <span>Video Content</span>
                          <span>NPR {influencer.videoPrice}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Simplified Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="campaignName">Campaign Name *</Label>
                      <Input
                        id="campaignName"
                        {...register('campaignName')}
                        placeholder="Enter campaign name"
                      />
                      {errors.campaignName && (
                        <p className="text-sm text-red-600">{errors.campaignName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brandName">Brand/Company Name *</Label>
                      <Input
                        id="brandName"
                        {...register('brandName')}
                        placeholder="Enter brand name"
                      />
                      {errors.brandName && (
                        <p className="text-sm text-red-600">{errors.brandName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collaborationType">Collaboration Type *</Label>
                    <Select onValueChange={(value) => setValue('collaborationType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select collaboration type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sponsored-post">Sponsored Post</SelectItem>
                        <SelectItem value="product-review">Product Review</SelectItem>
                        <SelectItem value="brand-partnership">Brand Partnership</SelectItem>
                        <SelectItem value="event-coverage">Event Coverage</SelectItem>
                        <SelectItem value="brand-ambassador">Brand Ambassador</SelectItem>
                        <SelectItem value="content-creation">Content Creation</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.collaborationType && (
                      <p className="text-sm text-red-600">{errors.collaborationType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaignObjectives">Campaign Objectives *</Label>
                    <Textarea
                      id="campaignObjectives"
                      {...register('campaignObjectives')}
                      placeholder="Describe your campaign goals and what you hope to achieve..."
                      rows={3}
                    />
                    {errors.campaignObjectives && (
                      <p className="text-sm text-red-600">{errors.campaignObjectives.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>Content Deliverables</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="posts" className="text-sm">Posts</Label>
                        <Input
                          id="posts"
                          type="number"
                          min="0"
                          {...register('deliverables.posts', { valueAsNumber: true })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stories" className="text-sm">Stories</Label>
                        <Input
                          id="stories"
                          type="number"
                          min="0"
                          {...register('deliverables.stories', { valueAsNumber: true })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="videos" className="text-sm">Videos</Label>
                        <Input
                          id="videos"
                          type="number"
                          min="0"
                          {...register('deliverables.videos', { valueAsNumber: true })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="liveStreams" className="text-sm">Live Streams</Label>
                        <Input
                          id="liveStreams"
                          type="number"
                          min="0"
                          {...register('deliverables.liveStreams', { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cost Calculator */}
                  <Card className="bg-purple-50 dark:bg-purple-950/20">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">Estimated Cost</h4>
                      <div className="space-y-2 text-sm">
                        {deliverables.posts > 0 && (
                          <div className="flex justify-between">
                            <span>{deliverables.posts} Posts</span>
                            <span>NPR {deliverables.posts * influencer.postPrice}</span>
                          </div>
                        )}
                        {deliverables.stories > 0 && (
                          <div className="flex justify-between">
                            <span>{deliverables.stories} Stories</span>
                            <span>NPR {deliverables.stories * (influencer.storyPrice ?? Math.round(influencer.postPrice * 0.5))}</span>
                          </div>
                        )}
                        {deliverables.videos > 0 && (
                          <div className="flex justify-between">
                            <span>{deliverables.videos} Videos</span>
                            <span>NPR {deliverables.videos * (influencer.videoPrice ?? Math.round(influencer.postPrice * 2))}</span>
                          </div>
                        )}
                        {deliverables.liveStreams > 0 && (
                          <div className="flex justify-between">
                            <span>{deliverables.liveStreams} Live Streams</span>
                            <span>NPR {deliverables.liveStreams * (influencer.videoPrice ?? Math.round(influencer.postPrice * 3))}</span>
                          </div>
                        )}
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold text-base">
                          <span>Total Amount</span>
                          <span>NPR {calculateTotalCost()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                  disabled={createBookingMutation.isPending}
                >
                  {createBookingMutation.isPending ? 'Processing...' : 'Book & Pay Now'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}