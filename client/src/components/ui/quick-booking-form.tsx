import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

const quickBookingSchema = z.object({
  serviceType: z.string().min(1, "Please select a service"),
  eventDate: z.string().min(1, "Please select a date"),
  email: z.string().email("Invalid email address"),
});

export function QuickBookingForm({ className }: { className?: string }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof quickBookingSchema>>({
    resolver: zodResolver(quickBookingSchema),
    defaultValues: {
      serviceType: "",
      eventDate: "",
      email: "",
    },
  });
  
  const handleSubmit = (values: z.infer<typeof quickBookingSchema>) => {
    // Navigate to the appropriate page based on service type
    const servicePageMap: Record<string, string> = {
      artist: '/artists',
      influencer: '/influencers',
      sound: '/sound-systems',
      venue: '/venues',
      ticket: '/tickets',
    };
    
    const page = servicePageMap[values.serviceType] || '/';
    
    toast({
      title: "Redirecting you to our booking page",
      description: `We'll help you find the perfect ${values.serviceType} for your event.`,
    });
    
    // In a real app, we might store this info in a state or pass it as URL params
    setTimeout(() => {
      setLocation(page);
    }, 1000);
  };
  
  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">What are you looking for?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/20 text-white border-white/30 focus:ring-accent">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="artist">Book an Artist</SelectItem>
                    <SelectItem value="influencer">Book an Influencer</SelectItem>
                    <SelectItem value="sound">Book Sound System</SelectItem>
                    <SelectItem value="venue">Book a Venue</SelectItem>
                    <SelectItem value="ticket">Buy Event Tickets</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Event Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="bg-white/20 text-white border-white/30 focus:ring-accent"
                    min={new Date().toISOString().split('T')[0]}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Your Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    className="bg-white/20 text-white border-white/30 focus:ring-accent"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white">
            Check Availability
          </Button>
        </form>
      </Form>
    </div>
  );
}
