import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Home, Settings, Users, Star, Calendar, MapPin, 
  Edit3, Save, Plus, Trash2, Eye, EyeOff, Image,
  MessageSquare, Clock, Award, Globe
} from 'lucide-react';

// Schema definitions for different content sections
const heroSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  description: z.string().min(1, 'Description is required'),
  backgroundImage: z.string().url('Must be a valid URL'),
  ctaButtons: z.array(z.object({
    text: z.string().min(1, 'Button text is required'),
    link: z.string().min(1, 'Button link is required'),
    variant: z.enum(['primary', 'secondary'])
  }))
});

const aboutSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().min(1, 'Long description is required'),
  image: z.string().url('Must be a valid URL'),
  stats: z.array(z.object({
    value: z.string().min(1, 'Value is required'),
    label: z.string().min(1, 'Label is required'),
    icon: z.string().min(1, 'Icon name is required')
  }))
});

const servicesSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  services: z.array(z.object({
    title: z.string().min(1, 'Service title is required'),
    description: z.string().min(1, 'Service description is required'),
    image: z.string().url('Must be a valid URL'),
    icon: z.string().min(1, 'Icon name is required'),
    linkTo: z.string().min(1, 'Link is required')
  }))
});

const journeySectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  timeline: z.array(z.object({
    year: z.string().min(1, 'Year is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required')
  }))
});

const contactSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Must be a valid email'),
  socialLinks: z.array(z.object({
    platform: z.string().min(1, 'Platform is required'),
    url: z.string().url('Must be a valid URL'),
    icon: z.string().min(1, 'Icon name is required')
  }))
});

type HeroSectionContent = z.infer<typeof heroSectionSchema>;
type AboutSectionContent = z.infer<typeof aboutSectionSchema>;
type ServicesSectionContent = z.infer<typeof servicesSectionSchema>;
type JourneySectionContent = z.infer<typeof journeySectionSchema>;
type ContactSectionContent = z.infer<typeof contactSectionSchema>;

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
  const [activeSection, setActiveSection] = useState('hero');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  // Fetch all home page content
  const { data: homeContent = [], isLoading } = useQuery({
    queryKey: ['/api/admin/home-content'],
    queryFn: async () => {
      const response = await fetch('/api/admin/home-content', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch home content');
      return response.json();
    }
  });

  // Fetch testimonials
  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['/api/admin/testimonials'],
    queryFn: async () => {
      const response = await fetch('/api/admin/testimonials', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      return response.json();
    }
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ section, content }: { section: string; content: any }) => {
      const response = await fetch(`/api/admin/home-content/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content })
      });
      if (!response.ok) throw new Error('Failed to update content');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/home-content'] });
      toast({
        title: "Content Updated",
        description: "Home page content has been successfully updated.",
      });
      setIsEditing(null);
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Create content mutation
  const createContentMutation = useMutation({
    mutationFn: async ({ section, content }: { section: string; content: any }) => {
      const response = await fetch('/api/admin/home-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ section, content })
      });
      if (!response.ok) throw new Error('Failed to create content');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/home-content'] });
      toast({
        title: "Content Created",
        description: "New content section has been successfully created.",
      });
    }
  });

  // Testimonial approval mutation
  const toggleTestimonialMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: number; approved: boolean }) => {
      const response = await fetch(`/api/admin/testimonials/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ approved })
      });
      if (!response.ok) throw new Error('Failed to update testimonial');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      toast({
        title: "Testimonial Updated",
        description: "Testimonial approval status has been updated.",
      });
    }
  });

  // Delete testimonial mutation
  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to delete testimonial');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      toast({
        title: "Testimonial Deleted",
        description: "Testimonial has been successfully deleted.",
      });
    }
  });

  const getContentBySection = (section: string) => {
    return homeContent.find((item: any) => item.section === section)?.content;
  };

  const getSectionSchema = (section: string) => {
    switch (section) {
      case 'hero': return heroSectionSchema;
      case 'about': return aboutSectionSchema;
      case 'services': return servicesSectionSchema;
      case 'journey': return journeySectionSchema;
      case 'contact': return contactSectionSchema;
      default: return z.any();
    }
  };

  const getDefaultContent = (section: string) => {
    switch (section) {
      case 'hero':
        return {
          title: "Elite Event Experiences",
          subtitle: "Crafted to Perfection",
          description: "From booking top artists to securing premium venues, we manage every detail of your event journey with precision and elegance.",
          backgroundImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
          ctaButtons: [
            { text: "Explore Services", link: "/services", variant: "primary" },
            { text: "Contact Us", link: "/contact", variant: "secondary" }
          ]
        };
      case 'about':
        return {
          title: "About Reart Events",
          description: "ReArt Events is an event management company established in 2024.",
          longDescription: "Our approach involves understanding client's business, audience, and goals to create tailored strategies that combine creativity and functionality.",
          image: "https://images.unsplash.com/photo-1560439514-e960a3ef5019",
          stats: [
            { value: "500+", label: "Events Managed", icon: "CalendarCheck" },
            { value: "300+", label: "Happy Clients", icon: "UserCheck" },
            { value: "15+", label: "Industry Awards", icon: "Award" }
          ]
        };
      case 'services':
        return {
          title: "Our Services",
          subtitle: "Comprehensive event solutions",
          services: [
            {
              title: "Artist Booking",
              description: "Book top musicians and performers",
              image: "https://images.unsplash.com/photo-1571151429199-a3371c9c8c8d",
              icon: "Music",
              linkTo: "/artists"
            },
            {
              title: "Influencer Marketing",
              description: "Connect with social media influencers",
              image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71",
              icon: "Sparkles",
              linkTo: "/influencers"
            },
            {
              title: "Sound Equipment",
              description: "Professional audio systems rental",
              image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91",
              icon: "Music",
              linkTo: "/sound"
            },
            {
              title: "Event Management",
              description: "Complete event planning services",
              image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
              icon: "Calendar",
              linkTo: "/events"
            }
          ]
        };
      case 'journey':
        return {
          title: "Our Journey",
          subtitle: "From humble beginnings to industry leadership",
          timeline: [
            {
              year: "2016",
              title: "Humble Beginnings",
              description: "Reart Events was founded as a small booking agency for local artists and venues."
            },
            {
              year: "2018",
              title: "Expanding Horizons",
              description: "Added sound system rentals and influencer bookings to our growing service portfolio."
            },
            {
              year: "2020",
              title: "Digital Transformation",
              description: "Launched our online booking platform to connect artists and venues across the country."
            },
            {
              year: "2022",
              title: "Global Reach",
              description: "Expanded to international markets with artist and influencer management services."
            },
            {
              year: "2024",
              title: "Industry Leader",
              description: "Recognized as a leading booking platform with thousands of successful events each year."
            }
          ]
        };
      case 'contact':
        return {
          title: "Get In Touch",
          subtitle: "Let's create something amazing together",
          address: "123 Event Street, Kathmandu, Nepal",
          phone: "+977 1234567890",
          email: "hello@reartevents.com",
          socialLinks: [
            { platform: "Facebook", url: "https://facebook.com/reartevents", icon: "Facebook" },
            { platform: "Instagram", url: "https://instagram.com/reartevents", icon: "Instagram" },
            { platform: "Twitter", url: "https://twitter.com/reartevents", icon: "Twitter" }
          ]
        };
      default:
        return {};
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Home Page Content Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Update images, text, and content across all home page sections
        </p>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            About
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="journey" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Journey
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Testimonials
          </TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <HeroSectionEditor 
            content={getContentBySection('hero') || getDefaultContent('hero')}
            onSave={(content) => {
              const existingContent = getContentBySection('hero');
              if (existingContent) {
                updateContentMutation.mutate({ section: 'hero', content });
              } else {
                createContentMutation.mutate({ section: 'hero', content });
              }
            }}
            isLoading={updateContentMutation.isPending || createContentMutation.isPending}
          />
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about">
          <AboutSectionEditor 
            content={getContentBySection('about') || getDefaultContent('about')}
            onSave={(content) => {
              const existingContent = getContentBySection('about');
              if (existingContent) {
                updateContentMutation.mutate({ section: 'about', content });
              } else {
                createContentMutation.mutate({ section: 'about', content });
              }
            }}
            isLoading={updateContentMutation.isPending || createContentMutation.isPending}
          />
        </TabsContent>

        {/* Services Section */}
        <TabsContent value="services">
          <ServicesSectionEditor 
            content={getContentBySection('services') || getDefaultContent('services')}
            onSave={(content) => {
              const existingContent = getContentBySection('services');
              if (existingContent) {
                updateContentMutation.mutate({ section: 'services', content });
              } else {
                createContentMutation.mutate({ section: 'services', content });
              }
            }}
            isLoading={updateContentMutation.isPending || createContentMutation.isPending}
          />
        </TabsContent>

        {/* Journey Section */}
        <TabsContent value="journey">
          <JourneySectionEditor 
            content={getContentBySection('journey') || getDefaultContent('journey')}
            onSave={(content) => {
              const existingContent = getContentBySection('journey');
              if (existingContent) {
                updateContentMutation.mutate({ section: 'journey', content });
              } else {
                createContentMutation.mutate({ section: 'journey', content });
              }
            }}
            isLoading={updateContentMutation.isPending || createContentMutation.isPending}
          />
        </TabsContent>

        {/* Contact Section */}
        <TabsContent value="contact">
          <ContactSectionEditor 
            content={getContentBySection('contact') || getDefaultContent('contact')}
            onSave={(content) => {
              const existingContent = getContentBySection('contact');
              if (existingContent) {
                updateContentMutation.mutate({ section: 'contact', content });
              } else {
                createContentMutation.mutate({ section: 'contact', content });
              }
            }}
            isLoading={updateContentMutation.isPending || createContentMutation.isPending}
          />
        </TabsContent>

        {/* Testimonials Management */}
        <TabsContent value="testimonials">
          <TestimonialsManager 
            testimonials={testimonials}
            onToggleApproval={(id, approved) => toggleTestimonialMutation.mutate({ id, approved })}
            onDelete={(id) => deleteTestimonialMutation.mutate(id)}
            isLoading={toggleTestimonialMutation.isPending || deleteTestimonialMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Individual section editors will be created as separate components for better organization
function HeroSectionEditor({ content, onSave, isLoading }: {
  content: HeroSectionContent;
  onSave: (content: HeroSectionContent) => void;
  isLoading: boolean;
}) {
  const form = useForm<HeroSectionContent>({
    resolver: zodResolver(heroSectionSchema),
    defaultValues: content
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5 text-purple-500" />
          Hero Section
        </CardTitle>
        <CardDescription>
          Main banner section with title, subtitle, and call-to-action buttons
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Elite Event Experiences" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input placeholder="Crafted to Perfection" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="From booking top artists to securing premium venues..."
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backgroundImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Background Image URL
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://images.unsplash.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Label className="text-base font-semibold">Call-to-Action Buttons</Label>
              {form.watch('ctaButtons')?.map((button, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <FormField
                    control={form.control}
                    name={`ctaButtons.${index}.text`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Explore Services" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`ctaButtons.${index}.link`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Link</FormLabel>
                        <FormControl>
                          <Input placeholder="/services" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`ctaButtons.${index}.variant`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Style</FormLabel>
                        <FormControl>
                          <select 
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                          >
                            <option value="primary">Primary</option>
                            <option value="secondary">Secondary</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                {isLoading ? 'Saving...' : 'Save Hero Section'}
                <Save className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Placeholder components for other section editors
function AboutSectionEditor({ content, onSave, isLoading }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Section Editor</CardTitle>
        <CardDescription>Edit about section content, stats, and image</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">About section editor will be implemented here.</p>
        <Button onClick={() => onSave(content)} disabled={isLoading} className="mt-4">
          Save About Section
        </Button>
      </CardContent>
    </Card>
  );
}

function ServicesSectionEditor({ content, onSave, isLoading }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Services Section Editor</CardTitle>
        <CardDescription>Edit services cards, images, and descriptions</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Services section editor will be implemented here.</p>
        <Button onClick={() => onSave(content)} disabled={isLoading} className="mt-4">
          Save Services Section
        </Button>
      </CardContent>
    </Card>
  );
}

function JourneySectionEditor({ content, onSave, isLoading }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Journey Section Editor</CardTitle>
        <CardDescription>Edit timeline content and milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Journey section editor will be implemented here.</p>
        <Button onClick={() => onSave(content)} disabled={isLoading} className="mt-4">
          Save Journey Section
        </Button>
      </CardContent>
    </Card>
  );
}

function ContactSectionEditor({ content, onSave, isLoading }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Section Editor</CardTitle>
        <CardDescription>Edit contact information and social links</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Contact section editor will be implemented here.</p>
        <Button onClick={() => onSave(content)} disabled={isLoading} className="mt-4">
          Save Contact Section
        </Button>
      </CardContent>
    </Card>
  );
}

function TestimonialsManager({ testimonials, onToggleApproval, onDelete, isLoading }: {
  testimonials: Testimonial[];
  onToggleApproval: (id: number, approved: boolean) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-500" />
          Testimonials Management
        </CardTitle>
        <CardDescription>
          Approve, manage, and delete user testimonials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testimonials.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No testimonials yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell className="font-medium">{testimonial.name}</TableCell>
                    <TableCell>{testimonial.company}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {testimonial.rating}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{testimonial.text}</TableCell>
                    <TableCell>
                      <Badge variant={testimonial.approved ? "default" : "secondary"}>
                        {testimonial.approved ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={testimonial.approved}
                          onCheckedChange={(checked) => onToggleApproval(testimonial.id, checked)}
                          disabled={isLoading}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(testimonial.id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}