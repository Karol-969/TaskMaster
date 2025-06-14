import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Eye, Search, Filter, Star, Users, TrendingUp, CheckCircle, XCircle, Instagram, Youtube, Twitter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Helmet } from 'react-helmet';
import type { Influencer, InsertInfluencer } from '@shared/schema';

const CATEGORIES = ['Lifestyle', 'Gaming', 'Food', 'Travel', 'Technology', 'Fitness', 'Fashion', 'Beauty', 'Music', 'Sports'];
const LANGUAGES = ['Nepali', 'English', 'Hindi', 'Other'];

interface InfluencerFormData {
  name: string;
  category: string;
  description: string;
  bio: string;
  imageUrl: string;
  portfolioImages: string[];
  postPrice: number;
  storyPrice: number;
  videoPrice: number;
  packagePrice: number;
  phone: string;
  contactEmail: string;
  location: string;
  languages: string[];
  instagramFollowers: number;
  tiktokFollowers: number;
  youtubeSubscribers: number;
  engagementRate: number;
  averageViews: number;
  totalReach: number;
  rating: number;
  totalCollaborations: number;
  isVerified: boolean;
  isActive: boolean;
  targetAudience: any;
}

export default function AdminInfluencersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [formData, setFormData] = useState<InfluencerFormData>({
    name: '',
    category: '',
    description: '',
    bio: '',
    imageUrl: '',
    portfolioImages: [],
    postPrice: 0,
    storyPrice: 0,
    videoPrice: 0,
    packagePrice: 0,
    phone: '',
    contactEmail: '',
    location: '',
    languages: [],
    instagramFollowers: 0,
    tiktokFollowers: 0,
    youtubeSubscribers: 0,
    engagementRate: 0,
    averageViews: 0,
    totalReach: 0,
    rating: 5,
    totalCollaborations: 0,
    isVerified: false,
    isActive: true,
    targetAudience: {}
  });

  const { data: influencers = [], isLoading } = useQuery<Influencer[]>({
    queryKey: ['/api/influencers'],
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertInfluencer) => {
      const response = await apiRequest('/api/influencers', 'POST', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/influencers'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Influencer created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create influencer",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertInfluencer> }) => {
      const response = await apiRequest(`/api/influencers/${id}`, 'PATCH', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/influencers'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Influencer updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update influencer",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/influencers/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/influencers'] });
      toast({
        title: "Success",
        description: "Influencer deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete influencer",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      bio: '',
      imageUrl: '',
      portfolioImages: [],
      postPrice: 0,
      storyPrice: 0,
      videoPrice: 0,
      packagePrice: 0,
      phone: '',
      contactEmail: '',
      location: '',
      languages: [],
      instagramFollowers: 0,
      tiktokFollowers: 0,
      youtubeSubscribers: 0,
      engagementRate: 0,
      averageViews: 0,
      totalReach: 0,
      rating: 5,
      totalCollaborations: 0,
      isVerified: false,
      isActive: true,
      targetAudience: {}
    });
  };

  const handleEdit = (influencer: Influencer) => {
    setFormData({
      name: influencer.name,
      category: influencer.category,
      description: influencer.description,
      bio: influencer.bio || '',
      imageUrl: influencer.imageUrl,
      portfolioImages: influencer.portfolioImages || [],
      postPrice: influencer.postPrice,
      storyPrice: influencer.storyPrice || 0,
      videoPrice: influencer.videoPrice || 0,
      packagePrice: influencer.packagePrice || 0,
      phone: influencer.phone || '',
      contactEmail: influencer.contactEmail || '',
      location: influencer.location || '',
      languages: influencer.languages || [],
      instagramFollowers: influencer.instagramFollowers || 0,
      tiktokFollowers: influencer.tiktokFollowers || 0,
      youtubeSubscribers: influencer.youtubeSubscribers || 0,
      engagementRate: influencer.engagementRate || 0,
      averageViews: influencer.averageViews || 0,
      totalReach: influencer.totalReach || 0,
      rating: influencer.rating || 5,
      totalCollaborations: influencer.totalCollaborations || 0,
      isVerified: influencer.isVerified || false,
      isActive: influencer.isActive || true,
      targetAudience: influencer.targetAudience || {}
    });
    setSelectedInfluencer(influencer);
    setIsEditDialogOpen(true);
  };

  const handleView = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this influencer?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      engagementRate: Math.round(formData.engagementRate * 100), // Convert percentage to basis points
    };

    if (selectedInfluencer) {
      updateMutation.mutate({ id: selectedInfluencer.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || influencer.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'verified' && influencer.isVerified) ||
                         (statusFilter === 'unverified' && !influencer.isVerified) ||
                         (statusFilter === 'active' && influencer.isActive) ||
                         (statusFilter === 'inactive' && !influencer.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatCurrency = (amount: number) => `NPR ${amount.toLocaleString()}`;
  const formatEngagement = (rate: number) => `${(rate / 100).toFixed(1)}%`;

  if (isLoading) {
    return (
      <AdminLayout>
        <Helmet>
          <title>Influencer Management - Admin | ReArt Events</title>
          <meta name="description" content="Manage influencers, collaborations, and content creator partnerships for ReArt Events platform." />
        </Helmet>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading influencers...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Influencer Management - Admin | ReArt Events</title>
        <meta name="description" content="Comprehensive influencer management system for ReArt Events. Manage content creators, track collaborations, and oversee social media partnerships." />
      </Helmet>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Influencer Management</h1>
            <p className="text-gray-400 mt-1">Manage your influencer network and collaborations</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Influencer
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Influencer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat} className="text-white">{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl">Profile Image URL *</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                {/* Contact Information */}
                <Separator className="bg-gray-700" />
                <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                {/* Pricing */}
                <Separator className="bg-gray-700" />
                <h3 className="text-lg font-semibold text-white">Pricing (NPR)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postPrice">Post Price *</Label>
                    <Input
                      id="postPrice"
                      type="number"
                      value={formData.postPrice}
                      onChange={(e) => setFormData({...formData, postPrice: Number(e.target.value)})}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="storyPrice">Story Price</Label>
                    <Input
                      id="storyPrice"
                      type="number"
                      value={formData.storyPrice}
                      onChange={(e) => setFormData({...formData, storyPrice: Number(e.target.value)})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="videoPrice">Video Price</Label>
                    <Input
                      id="videoPrice"
                      type="number"
                      value={formData.videoPrice}
                      onChange={(e) => setFormData({...formData, videoPrice: Number(e.target.value)})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="packagePrice">Package Price</Label>
                    <Input
                      id="packagePrice"
                      type="number"
                      value={formData.packagePrice}
                      onChange={(e) => setFormData({...formData, packagePrice: Number(e.target.value)})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                {/* Social Media Stats */}
                <Separator className="bg-gray-700" />
                <h3 className="text-lg font-semibold text-white">Social Media Statistics</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="instagramFollowers">Instagram Followers</Label>
                    <Input
                      id="instagramFollowers"
                      type="number"
                      value={formData.instagramFollowers}
                      onChange={(e) => setFormData({...formData, instagramFollowers: Number(e.target.value)})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tiktokFollowers">TikTok Followers</Label>
                    <Input
                      id="tiktokFollowers"
                      type="number"
                      value={formData.tiktokFollowers}
                      onChange={(e) => setFormData({...formData, tiktokFollowers: Number(e.target.value)})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtubeSubscribers">YouTube Subscribers</Label>
                    <Input
                      id="youtubeSubscribers"
                      type="number"
                      value={formData.youtubeSubscribers}
                      onChange={(e) => setFormData({...formData, youtubeSubscribers: Number(e.target.value)})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="engagementRate">Engagement Rate (%)</Label>
                    <Input
                      id="engagementRate"
                      type="number"
                      step="0.1"
                      value={formData.engagementRate}
                      onChange={(e) => setFormData({...formData, engagementRate: Number(e.target.value)})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="averageViews">Average Views</Label>
                    <Input
                      id="averageViews"
                      type="number"
                      value={formData.averageViews}
                      onChange={(e) => setFormData({...formData, averageViews: Number(e.target.value)})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                {/* Status */}
                <Separator className="bg-gray-700" />
                <h3 className="text-lg font-semibold text-white">Status & Verification</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isVerified"
                      checked={formData.isVerified}
                      onCheckedChange={(checked) => setFormData({...formData, isVerified: checked})}
                    />
                    <Label htmlFor="isVerified">Verified Influencer</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                    />
                    <Label htmlFor="isActive">Active Status</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Influencer'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Influencers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{influencers.length}</div>
              <div className="flex items-center text-green-500 text-sm mt-1">
                <Users className="w-4 h-4 mr-1" />
                Active Network
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Verified Influencers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {influencers.filter(i => i.isVerified).length}
              </div>
              <div className="flex items-center text-violet-500 text-sm mt-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                Verified
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Reach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {(influencers.reduce((sum, i) => sum + (i.totalReach || 0), 0) / 1000000).toFixed(1)}M
              </div>
              <div className="flex items-center text-blue-500 text-sm mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                Combined Reach
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {influencers.reduce((sum, i) => sum + (i.totalCollaborations || 0), 0)}
              </div>
              <div className="flex items-center text-orange-500 text-sm mt-1">
                <Star className="w-4 h-4 mr-1" />
                Total Collaborations
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search influencers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white">All Categories</SelectItem>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category} className="text-white">{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white">All Status</SelectItem>
                  <SelectItem value="verified" className="text-white">Verified</SelectItem>
                  <SelectItem value="unverified" className="text-white">Unverified</SelectItem>
                  <SelectItem value="active" className="text-white">Active</SelectItem>
                  <SelectItem value="inactive" className="text-white">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Influencers Table */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Influencers ({filteredInfluencers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3">Influencer</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-left p-3">Followers</th>
                    <th className="text-left p-3">Engagement</th>
                    <th className="text-left p-3">Pricing</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInfluencers.map((influencer) => (
                    <tr key={influencer.id} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={influencer.imageUrl}
                            alt={influencer.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-white">{influencer.name}</div>
                            <div className="text-sm text-gray-400">{influencer.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="border-violet-500 text-violet-400">
                          {influencer.category}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-1">
                            <Instagram className="w-3 h-3" />
                            <span>{(influencer.instagramFollowers || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Youtube className="w-3 h-3" />
                            <span>{(influencer.youtubeSubscribers || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          <div>{formatEngagement(influencer.engagementRate || 0)}</div>
                          <div className="text-gray-400">{(influencer.averageViews || 0).toLocaleString()} avg views</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          <div>{formatCurrency(influencer.postPrice)}</div>
                          <div className="text-gray-400">per post</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          {influencer.isVerified ? (
                            <Badge className="bg-green-900 text-green-300">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-gray-600 text-gray-400">
                              <XCircle className="w-3 h-3 mr-1" />
                              Unverified
                            </Badge>
                          )}
                          {influencer.isActive ? (
                            <Badge className="bg-blue-900 text-blue-300">Active</Badge>
                          ) : (
                            <Badge variant="outline" className="border-red-600 text-red-400">Inactive</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(influencer)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(influencer)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(influencer.id)}
                            className="border-red-600 text-red-400 hover:bg-red-900"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedInfluencer && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl">{selectedInfluencer.name}</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <img
                    src={selectedInfluencer.imageUrl}
                    alt={selectedInfluencer.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Bio</h3>
                    <p className="text-gray-300">{selectedInfluencer.bio || 'No bio available'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Contact</h3>
                    <div className="space-y-1 text-gray-300">
                      <div>📧 {selectedInfluencer.contactEmail}</div>
                      <div>📱 {selectedInfluencer.phone}</div>
                      <div>📍 {selectedInfluencer.location}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Social Media Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-3 rounded">
                        <div className="text-2xl font-bold text-white">{(selectedInfluencer.instagramFollowers || 0).toLocaleString()}</div>
                        <div className="text-gray-400">Instagram</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <div className="text-2xl font-bold text-white">{(selectedInfluencer.youtubeSubscribers || 0).toLocaleString()}</div>
                        <div className="text-gray-400">YouTube</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <div className="text-2xl font-bold text-white">{formatEngagement(selectedInfluencer.engagementRate || 0)}</div>
                        <div className="text-gray-400">Engagement</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <div className="text-2xl font-bold text-white">{selectedInfluencer.totalCollaborations || 0}</div>
                        <div className="text-gray-400">Collaborations</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Pricing</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Post:</span>
                        <span className="text-white">{formatCurrency(selectedInfluencer.postPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Story:</span>
                        <span className="text-white">{formatCurrency(selectedInfluencer.storyPrice || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Video:</span>
                        <span className="text-white">{formatCurrency(selectedInfluencer.videoPrice || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Package:</span>
                        <span className="text-white">{formatCurrency(selectedInfluencer.packagePrice || 0)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {selectedInfluencer.isVerified ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-white">
                          {selectedInfluencer.isVerified ? 'Verified' : 'Not Verified'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${selectedInfluencer.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-white">
                          {selectedInfluencer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Influencer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Similar form structure as Add dialog, but with update logic */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat} className="text-white">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-postPrice">Post Price *</Label>
                <Input
                  id="edit-postPrice"
                  type="number"
                  value={formData.postPrice}
                  onChange={(e) => setFormData({...formData, postPrice: Number(e.target.value)})}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-engagementRate">Engagement Rate (%)</Label>
                <Input
                  id="edit-engagementRate"
                  type="number"
                  step="0.1"
                  value={formData.engagementRate}
                  onChange={(e) => setFormData({...formData, engagementRate: Number(e.target.value)})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isVerified"
                  checked={formData.isVerified}
                  onCheckedChange={(checked) => setFormData({...formData, isVerified: checked})}
                />
                <Label htmlFor="edit-isVerified">Verified</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Updating...' : 'Update Influencer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}