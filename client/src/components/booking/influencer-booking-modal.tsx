import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Instagram, Youtube, Twitter, MessageSquare, Star, Users, CheckCircle, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Influencer } from '@shared/schema';

const collaborationSchema = z.object({
  campaignName: z.string().min(1, 'Campaign name is required'),
  collaborationType: z.string().min(1, 'Collaboration type is required'),
  brandName: z.string().min(1, 'Brand name is required'),
  campaignObjectives: z.string().min(10, 'Please provide detailed campaign objectives'),
  contentRequirements: z.string().min(10, 'Please specify content requirements'),
  timeline: z.string().min(1, 'Timeline is required'),
  budget: z.number().min(1, 'Budget must be greater than 0'),
  targetAudience: z.object({
    ageGroups: z.array(z.string()).min(1, 'Select at least one age group'),
    interests: z.array(z.string()).min(1, 'Select at least one interest'),
    demographics: z.string().optional(),
  }),
  specialRequirements: z.string().optional(),
  deliverables: z.object({
    posts: z.number().default(0),
    stories: z.number().default(0),
    videos: z.number().default(0),
    liveStreams: z.number().default(0),
    other: z.string().optional(),
  }),
});

type CollaborationForm = z.infer<typeof collaborationSchema>;

interface InfluencerBookingModalProps {
  influencer: Influencer;
  isOpen: boolean;
  onClose: () => void;
}

export function InfluencerBookingModal({ influencer, isOpen, onClose }: InfluencerBookingModalProps) {
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
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
      budget: influencer.postPrice,
      targetAudience: {
        ageGroups: [],
        interests: [],
      },
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
      const bookingData = {
        ...data,
        influencerId: influencer.id,
        timeline: `${startDate ? format(startDate, 'yyyy-MM-dd') : ''} to ${endDate ? format(endDate, 'yyyy-MM-dd') : ''}`,
      };
      
      // First create the collaboration booking
      const booking = await apiRequest('/api/influencer-bookings', 'POST', bookingData);

      // Then initiate Khalti payment
      const totalAmount = calculateTotalCost() * 100; // Convert NPR to paisa for Khalti
      const paymentData = {
        return_url: `${window.location.origin}/payment/status`,
        website_url: window.location.origin,
        amount: totalAmount,
        purchase_order_id: `INF-${booking.id}-${Date.now()}`,
        purchase_order_name: `Influencer Collaboration - ${influencer.name}`,
        customer_info: {
          name: data.brandName,
          email: 'customer@reartevents.com',
          phone: '9800000000'
        },
        amount_breakdown: [
          {
            label: "Influencer Collaboration Fee",
            amount: totalAmount
          }
        ],
        product_details: [
          {
            identity: influencer.id.toString(),
            name: `Collaboration with ${influencer.name}`,
            total_price: totalAmount,
            quantity: 1,
            unit_price: totalAmount
          }
        ]
      };

      const paymentResponse = await apiRequest('/api/payments/initiate', 'POST', paymentData);

      return { booking, payment: paymentResponse };
    },
    onSuccess: (data) => {
      toast({
        title: "Redirecting to Payment",
        description: "Your collaboration request has been created. Redirecting to Khalti for payment...",
      });
      
      // Redirect to Khalti payment URL
      if (data.payment?.payment_url) {
        window.location.href = data.payment.payment_url;
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/influencer-bookings'] });
      reset();
      setStep(1);
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process collaboration request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const calculateTotalCost = () => {
    let total = 0;
    if (deliverables.posts) total += deliverables.posts * influencer.postPrice;
    if (deliverables.stories) total += deliverables.stories * (influencer.storyPrice ?? influencer.postPrice * 0.5);
    if (deliverables.videos) total += deliverables.videos * (influencer.videoPrice ?? influencer.postPrice * 2);
    if (deliverables.liveStreams) total += deliverables.liveStreams * (influencer.videoPrice ?? influencer.postPrice * 3);
    return total;
  };

  const formatNumber = (num: number | null) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const onSubmit = (data: CollaborationForm) => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      createBookingMutation.mutate(data);
    }
  };

  const totalFollowers = (influencer.instagramFollowers ?? 0) + 
                        (influencer.tiktokFollowers ?? 0) + 
                        (influencer.youtubeSubscribers ?? 0) + 
                        (influencer.twitterFollowers ?? 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            Book Collaboration with {influencer.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Influencer Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-0">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="relative inline-block">
                    <img 
                      src={influencer.imageUrl} 
                      alt={influencer.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                    />
                    {influencer.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{influencer.name}</h3>
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
                    {influencer.category}
                  </Badge>
                  <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {influencer.location}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Social Stats */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Social Media Reach</h4>
                  {influencer.instagramFollowers > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        <span className="text-sm">Instagram</span>
                      </div>
                      <span className="font-medium">{formatNumber(influencer.instagramFollowers)}</span>
                    </div>
                  )}
                  {influencer.tiktokFollowers > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-black" />
                        <span className="text-sm">TikTok</span>
                      </div>
                      <span className="font-medium">{formatNumber(influencer.tiktokFollowers)}</span>
                    </div>
                  )}
                  {influencer.youtubeSubscribers > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-red-500" />
                        <span className="text-sm">YouTube</span>
                      </div>
                      <span className="font-medium">{formatNumber(influencer.youtubeSubscribers)}</span>
                    </div>
                  )}
                  {influencer.twitterFollowers > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Twitter</span>
                      </div>
                      <span className="font-medium">{formatNumber(influencer.twitterFollowers)}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Pricing */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Pricing</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Sponsored Post</span>
                      <span className="font-medium">${influencer.postPrice}</span>
                    </div>
                    {influencer.storyPrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm">Story</span>
                        <span className="font-medium">${influencer.storyPrice}</span>
                      </div>
                    )}
                    {influencer.videoPrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm">Video Content</span>
                        <span className="font-medium">${influencer.videoPrice}</span>
                      </div>
                    )}
                    {influencer.packagePrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm">Campaign Package</span>
                        <span className="font-medium">${influencer.packagePrice}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Performance */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Performance</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-purple-600">{((influencer.engagementRate || 0) / 100).toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">{influencer.totalCollaborations}</div>
                      <div className="text-xs text-gray-500">Campaigns</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {stepNumber}
                    </div>
                    {stepNumber < 4 && (
                      <div className={`w-20 h-1 mx-2 ${
                        step > stepNumber ? 'bg-purple-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Campaign Basics */}
              {step === 1 && (
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
                          placeholder="Summer Collection Launch"
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
                          placeholder="Your Brand Name"
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
                          <SelectItem value="ambassador-program">Ambassador Program</SelectItem>
                          <SelectItem value="content-creation">Custom Content Creation</SelectItem>
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
                        placeholder="Describe your campaign goals, target outcomes, and key messages you want to convey..."
                        rows={4}
                      />
                      {errors.campaignObjectives && (
                        <p className="text-sm text-red-600">{errors.campaignObjectives.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Content Requirements */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Content Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contentRequirements">Content Guidelines *</Label>
                      <Textarea
                        id="contentRequirements"
                        {...register('contentRequirements')}
                        placeholder="Specify content style, key messages, hashtags, mentions, visual requirements, etc..."
                        rows={4}
                      />
                      {errors.contentRequirements && (
                        <p className="text-sm text-red-600">{errors.contentRequirements.message}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label>Deliverables</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="posts">Instagram Posts</Label>
                          <Input
                            id="posts"
                            type="number"
                            min="0"
                            {...register('deliverables.posts', { valueAsNumber: true })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="stories">Stories</Label>
                          <Input
                            id="stories"
                            type="number"
                            min="0"
                            {...register('deliverables.stories', { valueAsNumber: true })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="videos">Videos</Label>
                          <Input
                            id="videos"
                            type="number"
                            min="0"
                            {...register('deliverables.videos', { valueAsNumber: true })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="liveStreams">Live Streams</Label>
                          <Input
                            id="liveStreams"
                            type="number"
                            min="0"
                            {...register('deliverables.liveStreams', { valueAsNumber: true })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialRequirements">Special Requirements</Label>
                      <Textarea
                        id="specialRequirements"
                        {...register('specialRequirements')}
                        placeholder="Any specific requirements, restrictions, or preferences..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Timeline & Budget */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Timeline & Budget</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Campaign Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "PPP") : "Select start date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Campaign End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP") : "Select end date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              disabled={(date) => date < (startDate || new Date())}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget (USD) *</Label>
                      <Input
                        id="budget"
                        type="number"
                        min="1"
                        {...register('budget', { valueAsNumber: true })}
                        placeholder="Enter your budget"
                      />
                      {errors.budget && (
                        <p className="text-sm text-red-600">{errors.budget.message}</p>
                      )}
                    </div>

                    {/* Cost Calculator */}
                    <Card className="bg-purple-50 dark:bg-purple-950/20">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">Estimated Cost Breakdown</h4>
                        <div className="space-y-2 text-sm">
                          {deliverables.posts > 0 && (
                            <div className="flex justify-between">
                              <span>{deliverables.posts} Posts</span>
                              <span>${deliverables.posts * influencer.postPrice}</span>
                            </div>
                          )}
                          {deliverables.stories > 0 && (
                            <div className="flex justify-between">
                              <span>{deliverables.stories} Stories</span>
                              <span>${deliverables.stories * (influencer.storyPrice ?? influencer.postPrice * 0.5)}</span>
                            </div>
                          )}
                          {deliverables.videos > 0 && (
                            <div className="flex justify-between">
                              <span>{deliverables.videos} Videos</span>
                              <span>${deliverables.videos * (influencer.videoPrice ?? influencer.postPrice * 2)}</span>
                            </div>
                          )}
                          {deliverables.liveStreams > 0 && (
                            <div className="flex justify-between">
                              <span>{deliverables.liveStreams} Live Streams</span>
                              <span>${deliverables.liveStreams * (influencer.videoPrice ?? influencer.postPrice * 3)}</span>
                            </div>
                          )}
                          <Separator className="my-2" />
                          <div className="flex justify-between font-semibold">
                            <span>Estimated Total</span>
                            <span>${calculateTotalCost()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Target Audience */}
              {step === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Target Audience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Age Groups *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'].map((age) => (
                          <div key={age} className="flex items-center space-x-2">
                            <Checkbox
                              id={`age-${age}`}
                              onCheckedChange={(checked) => {
                                const current = watch('targetAudience.ageGroups') || [];
                                if (checked) {
                                  setValue('targetAudience.ageGroups', [...current, age]);
                                } else {
                                  setValue('targetAudience.ageGroups', current.filter(item => item !== age));
                                }
                              }}
                            />
                            <Label htmlFor={`age-${age}`} className="text-sm">{age}</Label>
                          </div>
                        ))}
                      </div>
                      {errors.targetAudience?.ageGroups && (
                        <p className="text-sm text-red-600">{errors.targetAudience.ageGroups.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Interests *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {['Fashion', 'Technology', 'Travel', 'Food', 'Fitness', 'Beauty', 'Gaming', 'Music', 'Sports', 'Education', 'Lifestyle', 'Business'].map((interest) => (
                          <div key={interest} className="flex items-center space-x-2">
                            <Checkbox
                              id={`interest-${interest}`}
                              onCheckedChange={(checked) => {
                                const current = watch('targetAudience.interests') || [];
                                if (checked) {
                                  setValue('targetAudience.interests', [...current, interest]);
                                } else {
                                  setValue('targetAudience.interests', current.filter(item => item !== interest));
                                }
                              }}
                            />
                            <Label htmlFor={`interest-${interest}`} className="text-sm">{interest}</Label>
                          </div>
                        ))}
                      </div>
                      {errors.targetAudience?.interests && (
                        <p className="text-sm text-red-600">{errors.targetAudience.interests.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="demographics">Additional Demographics</Label>
                      <Textarea
                        id="demographics"
                        {...register('targetAudience.demographics')}
                        placeholder="Specify gender preferences, location, income level, or other demographic details..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                >
                  {step === 1 ? 'Cancel' : 'Previous'}
                </Button>
                
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                  disabled={createBookingMutation.isPending}
                >
                  {createBookingMutation.isPending ? 'Submitting...' : step === 4 ? 'Send Collaboration Request' : 'Next Step'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}