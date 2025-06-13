import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2, Star, Users, TrendingUp, Instagram, Youtube, Twitter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Influencer, InsertInfluencer } from '@shared/schema';

const influencerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  bio: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
  instagramHandle: z.string().optional(),
  instagramFollowers: z.number().min(0).optional(),
  tiktokHandle: z.string().optional(),
  tiktokFollowers: z.number().min(0).optional(),
  youtubeHandle: z.string().optional(),
  youtubeSubscribers: z.number().min(0).optional(),
  twitterHandle: z.string().optional(),
  twitterFollowers: z.number().min(0).optional(),
  engagementRate: z.number().min(0).max(100).optional(),
  averageViews: z.number().min(0).optional(),
  storyPrice: z.number().min(0).optional(),
  postPrice: z.number().min(1, 'Post price is required'),
  videoPrice: z.number().min(0).optional(),
  packagePrice: z.number().min(0).optional(),
  verified: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
  completedCampaigns: z.number().min(0).optional(),
  responseTime: z.string().optional(),
  languages: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
});

type InfluencerForm = z.infer<typeof influencerSchema>;

function AdminInfluencersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState<Influencer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: influencers = [], isLoading } = useQuery({
    queryKey: ['/api/admin/influencers'],
    retry: false
  });

  const form = useForm<InfluencerForm>({
    resolver: zodResolver(influencerSchema),
    defaultValues: {
      verified: false,
      engagementRate: 0,
      rating: 0,
      completedCampaigns: 0,
      languages: [],
      tags: []
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: InfluencerForm) => {
      return await apiRequest('/api/admin/influencers', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Influencer created successfully",
      });
      setIsModalOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/influencers'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to create influencer",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InfluencerForm }) => {
      return await apiRequest(`/api/admin/influencers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Influencer updated successfully",
      });
      setIsModalOpen(false);
      setEditingInfluencer(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/influencers'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update influencer",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/influencers/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      toast({
        title: "Influencer deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/influencers'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete influencer",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InfluencerForm) => {
    if (editingInfluencer) {
      updateMutation.mutate({ id: editingInfluencer.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (influencer: Influencer) => {
    setEditingInfluencer(influencer);
    form.reset({
      name: influencer.name,
      description: influencer.description,
      bio: influencer.bio || '',
      category: influencer.category,
      location: influencer.location || '',
      imageUrl: influencer.imageUrl || '',
      instagramHandle: influencer.instagramHandle || '',
      instagramFollowers: influencer.instagramFollowers || 0,
      tiktokHandle: influencer.tiktokHandle || '',
      tiktokFollowers: influencer.tiktokFollowers || 0,
      youtubeHandle: influencer.youtubeHandle || '',
      youtubeSubscribers: influencer.youtubeSubscribers || 0,
      twitterHandle: influencer.twitterHandle || '',
      twitterFollowers: influencer.twitterFollowers || 0,
      engagementRate: influencer.engagementRate || 0,
      averageViews: influencer.averageViews || 0,
      storyPrice: influencer.storyPrice || 0,
      postPrice: influencer.postPrice,
      videoPrice: influencer.videoPrice || 0,
      packagePrice: influencer.packagePrice || 0,
      verified: influencer.verified || false,
      rating: influencer.rating || 0,
      completedCampaigns: influencer.completedCampaigns || 0,
      responseTime: influencer.responseTime || '',
      languages: influencer.languages || [],
      tags: influencer.tags || []
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this influencer?')) {
      deleteMutation.mutate(id);
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

  const filteredInfluencers = (influencers as Influencer[]).filter((influencer) =>
    influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Influencers...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Influencer Management</h1>
          <p className="text-gray-600">Manage influencers and their profiles</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Influencer
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search influencers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInfluencers.map((influencer) => (
          <Card key={influencer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={influencer.imageUrl || '/placeholder-avatar.png'}
                      alt={influencer.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {influencer.verified && (
                      <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                        <Star className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{influencer.name}</CardTitle>
                    <p className="text-purple-600 text-sm">{influencer.category}</p>
                    <p className="text-gray-500 text-xs">{influencer.location}</p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {influencer.rating?.toFixed(1)}★
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm line-clamp-2">
                {influencer.description}
              </p>

              {/* Social Media Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {influencer.instagramFollowers && (
                  <div className="flex items-center gap-1 text-pink-500">
                    <Instagram className="h-3 w-3" />
                    <span>{formatFollowers(influencer.instagramFollowers)}</span>
                  </div>
                )}
                {influencer.youtubeSubscribers && (
                  <div className="flex items-center gap-1 text-red-500">
                    <Youtube className="h-3 w-3" />
                    <span>{formatFollowers(influencer.youtubeSubscribers)}</span>
                  </div>
                )}
                {influencer.tiktokFollowers && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>{formatFollowers(influencer.tiktokFollowers)}</span>
                  </div>
                )}
                {influencer.twitterFollowers && (
                  <div className="flex items-center gap-1 text-blue-500">
                    <Twitter className="h-3 w-3" />
                    <span>{formatFollowers(influencer.twitterFollowers)}</span>
                  </div>
                )}
              </div>

              {/* Performance Metrics */}
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-gray-500">Engagement:</span>
                  <span className="text-green-600 ml-1">{influencer.engagementRate}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Campaigns:</span>
                  <span className="text-blue-600 ml-1">{influencer.completedCampaigns}</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">
                    ${influencer.packagePrice || 0}
                  </div>
                  <div className="text-xs text-gray-500">Package Price</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleEdit(influencer)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(influencer.id)}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInfluencers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No influencers found</h3>
          <p className="text-gray-600">Try adjusting your search or add a new influencer.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingInfluencer ? 'Edit Influencer' : 'Add New Influencer'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Social Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="instagramHandle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram Handle</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="@username" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagramFollowers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram Followers</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tiktokHandle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TikTok Handle</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="@username" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tiktokFollowers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TikTok Followers</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="youtubeHandle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube Handle</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Channel name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="youtubeSubscribers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube Subscribers</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitterHandle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Handle</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="@username" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitterFollowers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter Followers</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="storyPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Story Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Post Price ($) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="videoPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="packagePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="engagementRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engagement Rate (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (0-5)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="completedCampaigns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Completed Campaigns</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingInfluencer(null);
                    form.reset();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingInfluencer
                    ? 'Update Influencer'
                    : 'Create Influencer'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminInfluencersPage;