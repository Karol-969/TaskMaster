import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Upload, 
  Eye, 
  Settings, 
  Image,
  FileText,
  Users,
  Calendar,
  Star,
  Quote,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/admin-layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';

interface HomePageContent {
  id: number;
  section: string;
  content: any;
  createdAt: string;
  updatedAt: string;
}

interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
  rating: number;
  email: string;
  approved: boolean;
  createdAt: string;
}

export default function HomeContentAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('hero');

  // Fetch home content from database
  const { data: homeContentArray, isLoading, error } = useQuery({
    queryKey: ['/api/admin/home-content'],
    retry: false,
  });

  // Transform array to object for easier access
  const homeContentData = Array.isArray(homeContentArray) 
    ? homeContentArray.reduce((acc: any, item: any) => {
        acc[item.section] = item.content;
        return acc;
      }, {})
    : {};

  // Default content structure for fallback
  const defaultContentData = {
    hero: {
      title: "Elite Event Experiences",
      subtitle: "Crafted to Perfection",
      description: "From booking top artists to securing premium venues, we manage every detail of your event journey with precision and elegance.",
      backgroundImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      ctaButtons: [
        { text: "Explore Services", link: "/services", variant: "primary" },
        { text: "Contact Us", link: "/contact", variant: "secondary" }
      ]
    },
    about: {
      title: "About Reart Events",
      description: "ReArt Events is an event management company established in 2024. We specialize in providing live music solutions and managing various events.",
      longDescription: "Our approach involves understanding client business, audience, and goals to create tailored strategies that combine creativity and functionality. From arranging live music performances to developing crowd-engaging event concepts, we handle every detail with precision and care.",
      image: "https://images.unsplash.com/photo-1560439514-e960a3ef5019?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=750&q=80",
      stats: [
        { value: "500+", label: "Events Managed", icon: "CalendarCheck" },
        { value: "300+", label: "Happy Clients", icon: "UserCheck" },
        { value: "15+", label: "Industry Awards", icon: "Award" }
      ]
    },
    services: {
      title: "Our Premium Services",
      subtitle: "Comprehensive event solutions tailored for your success",
      services: [
        {
          title: "Artist Booking",
          description: "Connect with top-tier artists for unforgettable performances",
          icon: "Music",
          features: ["Verified Artists", "Flexible Pricing", "Direct Communication"]
        },
        {
          title: "Sound Equipment",
          description: "Professional-grade audio systems for perfect sound quality",
          icon: "Volume2",
          features: ["Premium Equipment", "Technical Support", "Setup Included"]
        },
        {
          title: "Influencer Marketing",
          description: "Partner with influential creators to amplify your reach",
          icon: "Users",
          features: ["Verified Influencers", "Campaign Management", "Analytics"]
        }
      ]
    },
    journey: {
      title: "Our Journey",
      subtitle: "From humble beginnings to industry leadership",
      timeline: [
        { year: "2016", title: "Humble Beginnings", description: "Reart Events was founded as a small booking agency for local artists and venues." },
        { year: "2018", title: "Expanding Horizons", description: "Added sound system rentals and influencer bookings to our growing service portfolio." },
        { year: "2020", title: "Digital Transformation", description: "Launched our online booking platform to connect artists and venues across the country." },
        { year: "2022", title: "Global Reach", description: "Expanded to international markets with artist and influencer management services." },
        { year: "2024", title: "Industry Leader", description: "Recognized as a leading booking platform with thousands of successful events each year." }
      ]
    }
  };

  const mockTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "EventPro Solutions",
      text: "Reart Events transformed our corporate event into an unforgettable experience. Their attention to detail and professional service exceeded our expectations.",
      rating: 5,
      email: "sarah@eventpro.com",
      approved: true,
      createdAt: "2024-06-01T10:00:00Z"
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "TechStart Inc.",
      text: "The sound quality at our product launch was phenomenal. The team's expertise in audio engineering made all the difference.",
      rating: 5,
      email: "michael@techstart.com",
      approved: false,
      createdAt: "2024-06-10T14:30:00Z"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      company: "Creative Collective",
      text: "Working with Reart Events was seamless from start to finish. They understood our vision and brought it to life perfectly.",
      rating: 4,
      email: "emily@creative.com",
      approved: true,
      createdAt: "2024-06-05T09:15:00Z"
    }
  ];

  // Use real data from database with fallback to defaults
  const contentData = {
    hero: homeContentData.hero || defaultContentData.hero,
    about: homeContentData.about || defaultContentData.about,
    services: homeContentData.services || defaultContentData.services,
    journey: homeContentData.journey || defaultContentData.journey
  };

  // Content sections with real data
  const contentSections = [
    { id: 'hero', title: 'Hero Section', icon: Image, content: contentData.hero },
    { id: 'about', title: 'About Section', icon: FileText, content: contentData.about },
    { id: 'services', title: 'Services Section', icon: Settings, content: contentData.services },
    { id: 'journey', title: 'Journey Section', icon: Calendar, content: contentData.journey }
  ];

  // Real API mutations
  const updateContentMutation = useMutation({
    mutationFn: async ({ section, content }: { section: string; content: any }) => {
      return await apiRequest('PUT', `/api/admin/home-content/${section}`, { content });
    },
    onSuccess: () => {
      toast({
        title: "Content Updated",
        description: "Home page content has been successfully updated.",
      });
      // Invalidate all related queries to ensure frontend updates
      queryClient.invalidateQueries({ queryKey: ['/api/admin/home-content'] });
      queryClient.invalidateQueries({ queryKey: ['/api/home-content'] });
      // Force refetch to ensure immediate update
      queryClient.refetchQueries({ queryKey: ['/api/home-content'] });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update content. Please try again.",
        variant: "destructive"
      });
    }
  });

  const toggleTestimonialMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: number; approved: boolean }) => {
      return await apiRequest('PUT', `/api/admin/testimonials/${id}/toggle`, { approved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/home-content'] });
      toast({
        title: "Testimonial Updated",
        description: "Testimonial approval status has been updated.",
      });
    }
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/admin/testimonials/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/home-content'] });
      toast({
        title: "Testimonial Deleted",
        description: "Testimonial has been successfully deleted.",
      });
    }
  });

  const handleContentSave = (section: string, content: any) => {
    updateContentMutation.mutate({ section, content });
  };

  const handleTestimonialToggle = (id: number, approved: boolean) => {
    toggleTestimonialMutation.mutate({ id, approved });
  };

  const handleTestimonialDelete = (id: number) => {
    deleteTestimonialMutation.mutate(id);
  };

  // Handle authentication errors
  if (error && error.message.includes('401')) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Session Expired
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your admin session has expired. Please log in again to manage content.
            </p>
            <Button 
              onClick={() => window.location.href = '/admin/auth/login'}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Log In Again
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Home Page Content Management - ReArt Events Admin</title>
        <meta name="description" content="Manage home page content, sections, and testimonials" />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Home Page Content
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage all home page sections, content, and testimonials
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </Button>
            <Button className="flex items-center space-x-2 bg-violet-600 hover:bg-violet-700">
              <Save className="w-4 h-4" />
              <span>Save All Changes</span>
            </Button>
          </div>
        </div>

        {/* Content Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="journey">Journey</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <HeroSectionEditor 
              content={contentData.hero}
              onSave={(content: any) => handleContentSave('hero', content)}
              isLoading={updateContentMutation.isPending}
            />
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about">
            <AboutSectionEditor 
              content={contentData.about}
              onSave={(content: any) => handleContentSave('about', content)}
              isLoading={updateContentMutation.isPending}
            />
          </TabsContent>

          {/* Services Section */}
          <TabsContent value="services">
            <ServicesSectionEditor 
              content={contentData.services}
              onSave={(content: any) => handleContentSave('services', content)}
              isLoading={updateContentMutation.isPending}
            />
          </TabsContent>

          {/* Journey Section */}
          <TabsContent value="journey">
            <JourneySectionEditor 
              content={contentData.journey}
              onSave={(content: any) => handleContentSave('journey', content)}
              isLoading={updateContentMutation.isPending}
            />
          </TabsContent>

          {/* Testimonials Management */}
          <TabsContent value="testimonials">
            <TestimonialsManager 
              testimonials={mockTestimonials}
              onToggleApproval={handleTestimonialToggle}
              onDelete={handleTestimonialDelete}
              isLoading={toggleTestimonialMutation.isPending || deleteTestimonialMutation.isPending}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

// Hero Section Editor Component
function HeroSectionEditor({ content, onSave, isLoading }: {
  content: any;
  onSave: (content: any) => void;
  isLoading: boolean;
}) {
  const [editedContent, setEditedContent] = useState(content);

  // Update local state when content prop changes
  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Image className="w-5 h-5" />
          <span>Hero Section Content</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="hero-title">Main Title</Label>
              <Input
                id="hero-title"
                value={editedContent.title}
                onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
                placeholder="Enter main title"
              />
            </div>
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={editedContent.subtitle}
                onChange={(e) => setEditedContent({ ...editedContent, subtitle: e.target.value })}
                placeholder="Enter subtitle"
              />
            </div>
            <div>
              <Label htmlFor="hero-description">Description</Label>
              <Textarea
                id="hero-description"
                value={editedContent.description}
                onChange={(e) => setEditedContent({ ...editedContent, description: e.target.value })}
                placeholder="Enter description"
                rows={4}
              />
            </div>
          </div>
          <div className="space-y-4">
            <ImageUpload
              label="Background Image"
              value={editedContent.backgroundImage || ''}
              onChange={(imageUrl) => setEditedContent({ ...editedContent, backgroundImage: imageUrl })}
              placeholder="Enter background image URL or upload file"
            />
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-3">Call-to-Action Buttons</h4>
              {editedContent.ctaButtons?.map((button: any, index: number) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <Input
                    value={button.text}
                    onChange={(e) => {
                      const newButtons = [...editedContent.ctaButtons];
                      newButtons[index].text = e.target.value;
                      setEditedContent({ ...editedContent, ctaButtons: newButtons });
                    }}
                    placeholder="Button text"
                  />
                  <Input
                    value={button.link}
                    onChange={(e) => {
                      const newButtons = [...editedContent.ctaButtons];
                      newButtons[index].link = e.target.value;
                      setEditedContent({ ...editedContent, ctaButtons: newButtons });
                    }}
                    placeholder="Button link"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={() => onSave(editedContent)}
            disabled={isLoading}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {isLoading ? 'Saving...' : 'Save Hero Section'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// About Section Editor Component
function AboutSectionEditor({ content, onSave, isLoading }: any) {
  const [editedContent, setEditedContent] = useState(content);

  // Update local state when content prop changes
  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>About Section Content</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="about-title">Section Title</Label>
              <Input
                id="about-title"
                value={editedContent.title}
                onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="about-description">Short Description</Label>
              <Textarea
                id="about-description"
                value={editedContent.description}
                onChange={(e) => setEditedContent({ ...editedContent, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="about-long-description">Long Description</Label>
              <Textarea
                id="about-long-description"
                value={editedContent.longDescription}
                onChange={(e) => setEditedContent({ ...editedContent, longDescription: e.target.value })}
                rows={5}
              />
            </div>
          </div>
          <div className="space-y-4">
            <ImageUpload
              label="Section Image"
              value={editedContent.image || ''}
              onChange={(imageUrl) => setEditedContent({ ...editedContent, image: imageUrl })}
              placeholder="Enter section image URL or upload file"
            />
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-3">Statistics</h4>
              {editedContent.stats?.map((stat: any, index: number) => (
                <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                  <Input
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...editedContent.stats];
                      newStats[index].value = e.target.value;
                      setEditedContent({ ...editedContent, stats: newStats });
                    }}
                    placeholder="Value"
                  />
                  <Input
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...editedContent.stats];
                      newStats[index].label = e.target.value;
                      setEditedContent({ ...editedContent, stats: newStats });
                    }}
                    placeholder="Label"
                  />
                  <Input
                    value={stat.icon}
                    onChange={(e) => {
                      const newStats = [...editedContent.stats];
                      newStats[index].icon = e.target.value;
                      setEditedContent({ ...editedContent, stats: newStats });
                    }}
                    placeholder="Icon"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={() => onSave(editedContent)}
            disabled={isLoading}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {isLoading ? 'Saving...' : 'Save About Section'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Services Section Editor Component
function ServicesSectionEditor({ content, onSave, isLoading }: any) {
  const [editedContent, setEditedContent] = useState(content);

  // Update local state when content prop changes
  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Services Section Content</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="services-title">Section Title</Label>
            <Input
              id="services-title"
              value={editedContent.title}
              onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="services-subtitle">Section Subtitle</Label>
            <Input
              id="services-subtitle"
              value={editedContent.subtitle}
              onChange={(e) => setEditedContent({ ...editedContent, subtitle: e.target.value })}
            />
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-medium mb-3">Services</h4>
          {editedContent.services?.map((service: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 mb-4 bg-white dark:bg-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    value={service.title}
                    onChange={(e) => {
                      const newServices = [...editedContent.services];
                      newServices[index].title = e.target.value;
                      setEditedContent({ ...editedContent, services: newServices });
                    }}
                    placeholder="Service title"
                    className="mb-2"
                  />
                  <Textarea
                    value={service.description}
                    onChange={(e) => {
                      const newServices = [...editedContent.services];
                      newServices[index].description = e.target.value;
                      setEditedContent({ ...editedContent, services: newServices });
                    }}
                    placeholder="Service description"
                    rows={2}
                  />
                </div>
                <div>
                  <Input
                    value={service.icon}
                    onChange={(e) => {
                      const newServices = [...editedContent.services];
                      newServices[index].icon = e.target.value;
                      setEditedContent({ ...editedContent, services: newServices });
                    }}
                    placeholder="Icon name"
                    className="mb-2"
                  />
                  <div className="space-y-1">
                    {service.features?.map((feature: string, fIndex: number) => (
                      <Input
                        key={fIndex}
                        value={feature}
                        onChange={(e) => {
                          const newServices = [...editedContent.services];
                          newServices[index].features[fIndex] = e.target.value;
                          setEditedContent({ ...editedContent, services: newServices });
                        }}
                        placeholder="Feature"
                        size="sm"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={() => onSave(editedContent)}
            disabled={isLoading}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {isLoading ? 'Saving...' : 'Save Services Section'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Journey Section Editor Component
function JourneySectionEditor({ content, onSave, isLoading }: any) {
  const [editedContent, setEditedContent] = useState(content || {
    title: "Our Journey",
    subtitle: "From a small startup to Nepal's premier event management company",
    timeline: []
  });

  // Update local state when content prop changes
  useEffect(() => {
    setEditedContent(content || {
      title: "Our Journey",
      subtitle: "From a small startup to Nepal's premier event management company", 
      timeline: []
    });
  }, [content]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Journey Section Content</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="journey-title">Section Title</Label>
            <Input
              id="journey-title"
              value={editedContent.title}
              onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="journey-subtitle">Section Subtitle</Label>
            <Input
              id="journey-subtitle"
              value={editedContent.subtitle}
              onChange={(e) => setEditedContent({ ...editedContent, subtitle: e.target.value })}
            />
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Timeline</h4>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const newTimeline = [...(editedContent.timeline || []), { year: '', title: '', description: '' }];
                setEditedContent({ ...editedContent, timeline: newTimeline });
              }}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Add Timeline Item
            </Button>
          </div>
          {(editedContent.timeline || []).map((item: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 mb-4 bg-white dark:bg-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Timeline Item {index + 1}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newTimeline = editedContent.timeline.filter((_: any, i: number) => i !== index);
                    setEditedContent({ ...editedContent, timeline: newTimeline });
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  value={item.year || ''}
                  onChange={(e) => {
                    const newTimeline = [...editedContent.timeline];
                    newTimeline[index].year = e.target.value;
                    setEditedContent({ ...editedContent, timeline: newTimeline });
                  }}
                  placeholder="Year"
                />
                <Input
                  value={item.title || ''}
                  onChange={(e) => {
                    const newTimeline = [...editedContent.timeline];
                    newTimeline[index].title = e.target.value;
                    setEditedContent({ ...editedContent, timeline: newTimeline });
                  }}
                  placeholder="Title"
                />
                <Textarea
                  value={item.description || ''}
                  onChange={(e) => {
                    const newTimeline = [...editedContent.timeline];
                    newTimeline[index].description = e.target.value;
                    setEditedContent({ ...editedContent, timeline: newTimeline });
                  }}
                  placeholder="Description"
                  rows={2}
                />
              </div>
            </div>
          ))}
          {(!editedContent.timeline || editedContent.timeline.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No timeline items yet. Click "Add Timeline Item" to get started.
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={() => onSave(editedContent)}
            disabled={isLoading}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {isLoading ? 'Saving...' : 'Save Journey Section'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Testimonials Manager Component
function TestimonialsManager({ testimonials, onToggleApproval, onDelete, isLoading }: {
  testimonials: Testimonial[];
  onToggleApproval: (id: number, approved: boolean) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Quote className="w-5 h-5" />
            <span>Testimonials Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <Badge variant="outline">{testimonial.company}</Badge>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <Badge variant={testimonial.approved ? 'default' : 'secondary'}>
                        {testimonial.approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      "{testimonial.text}"
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.email} • {new Date(testimonial.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant={testimonial.approved ? 'outline' : 'default'}
                      onClick={() => onToggleApproval(testimonial.id, !testimonial.approved)}
                      disabled={isLoading}
                      className="flex items-center space-x-1"
                    >
                      {testimonial.approved ? (
                        <>
                          <X className="w-4 h-4" />
                          <span>Unapprove</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Approve</span>
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(testimonial.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}