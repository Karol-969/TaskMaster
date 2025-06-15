import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar, Users, MapPin, Clock, CreditCard, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const artistBookingSchema = z.object({
  eventName: z.string().min(1, 'Event name is required'),
  eventType: z.string().min(1, 'Event type is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  venueName: z.string().min(1, 'Venue name is required'),
  venueAddress: z.string().min(1, 'Venue address is required'),
  expectedAttendance: z.number().min(1, 'Expected attendance is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().min(1, 'Phone number is required'),
  performanceType: z.string().min(1, 'Performance type is required'),
  duration: z.string().min(1, 'Performance duration is required'),
  specialRequirements: z.string().optional(),
});

type ArtistBookingForm = z.infer<typeof artistBookingSchema>;

interface Artist {
  id: number;
  name: string;
  genre: string;
  description: string;
  imageUrl: string;
  rating: number | null;
  price?: number;
}

interface ArtistBookingModalProps {
  artist: Artist;
  isOpen: boolean;
  onClose: () => void;
}

const performanceTypes = [
  { id: 'solo', name: 'Solo Performance', basePrice: 15000 },
  { id: 'duo', name: 'Duo Performance', basePrice: 25000 },
  { id: 'band', name: 'Full Band', basePrice: 40000 },
  { id: 'acoustic', name: 'Acoustic Set', basePrice: 18000 },
  { id: 'dj', name: 'DJ Set', basePrice: 20000 },
];

const durations = [
  { id: '1hour', name: '1 Hour', multiplier: 1 },
  { id: '2hours', name: '2 Hours', multiplier: 1.8 },
  { id: '3hours', name: '3 Hours', multiplier: 2.5 },
  { id: '4hours', name: '4+ Hours', multiplier: 3.2 },
];

export function ArtistBookingModal({ artist, isOpen, onClose }: ArtistBookingModalProps) {
  const { toast } = useToast();

  const form = useForm<ArtistBookingForm>({
    resolver: zodResolver(artistBookingSchema),
    defaultValues: {
      eventName: '',
      eventType: '',
      eventDate: '',
      startTime: '',
      endTime: '',
      venueName: '',
      venueAddress: '',
      expectedAttendance: 50,
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      performanceType: '',
      duration: '',
      specialRequirements: '',
    },
  });

  const { watch } = form;
  const performanceType = watch('performanceType');
  const duration = watch('duration');

  const createBookingMutation = useMutation({
    mutationFn: async (data: ArtistBookingForm) => {
      const totalAmount = calculateTotalCost() * 100; // Convert NPR to paisa for Khalti
      
      // Use the same payment initiation as other booking pages
      const paymentPayload = {
        bookingId: Math.floor(Math.random() * 10000), // Generate unique booking ID
        amount: totalAmount / 100, // Convert back to NPR for the API
        productName: `Artist Booking - ${artist.name}`,
        customerInfo: {
          name: data.contactName,
          email: data.contactEmail,
          phone: data.contactPhone
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

  const getSelectedPerformance = () => {
    return performanceTypes.find(type => type.id === performanceType);
  };

  const getSelectedDuration = () => {
    return durations.find(dur => dur.id === duration);
  };

  const calculateTotalCost = () => {
    const selectedPerformance = getSelectedPerformance();
    const selectedDuration = getSelectedDuration();
    
    if (!selectedPerformance || !selectedDuration) return 0;

    const basePrice = selectedPerformance.basePrice;
    const totalPrice = basePrice * selectedDuration.multiplier;
    
    return Math.round(totalPrice);
  };

  const onSubmit = (data: ArtistBookingForm) => {
    createBookingMutation.mutate(data);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Music className="h-6 w-6 text-purple-400" />
            Book {artist.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {artist.genre} • {artist.description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Event Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-400" />
                    Event Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="eventName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Event Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Wedding Reception"
                              className="bg-gray-800 border-gray-600 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Event Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                <SelectValue placeholder="Select event type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="wedding">Wedding</SelectItem>
                              <SelectItem value="birthday">Birthday Party</SelectItem>
                              <SelectItem value="corporate">Corporate Event</SelectItem>
                              <SelectItem value="concert">Concert</SelectItem>
                              <SelectItem value="festival">Festival</SelectItem>
                              <SelectItem value="private">Private Party</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
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
                          <FormLabel className="text-gray-300">Event Date *</FormLabel>
                          <FormControl>
                            <Input 
                              type="date"
                              className="bg-gray-800 border-gray-600 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expectedAttendance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Expected Attendance *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="e.g., 100"
                              className="bg-gray-800 border-gray-600 text-white"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Start Time *</FormLabel>
                          <FormControl>
                            <Input 
                              type="time"
                              className="bg-gray-800 border-gray-600 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">End Time *</FormLabel>
                          <FormControl>
                            <Input 
                              type="time"
                              className="bg-gray-800 border-gray-600 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-400" />
                    Venue Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="venueName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Venue Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Hotel Himalaya"
                              className="bg-gray-800 border-gray-600 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="venueAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Venue Address *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Full venue address"
                              className="bg-gray-800 border-gray-600 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Contact Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your full name"
                              className="bg-gray-800 border-gray-600 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Email *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="your@email.com"
                              className="bg-gray-800 border-gray-600 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Phone *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="98XXXXXXXX"
                              className="bg-gray-800 border-gray-600 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="specialRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Special Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any specific song requests, equipment needs, or special arrangements..."
                          className="bg-gray-800 border-gray-600 text-white"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column - Performance Options */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-400" />
                    Performance Details
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="performanceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Performance Type *</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            {performanceTypes.map((type) => (
                              <div
                                key={type.id}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                  field.value === type.id
                                    ? 'border-purple-500 bg-purple-500/10'
                                    : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                                }`}
                                onClick={() => field.onChange(type.id)}
                              >
                                <div className="flex justify-between items-center">
                                  <h4 className="font-semibold text-white">{type.name}</h4>
                                  <span className="text-purple-400 font-bold">{formatPrice(type.basePrice)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Duration *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {durations.map((dur) => (
                              <SelectItem key={dur.id} value={dur.id}>
                                {dur.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Cost Summary */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                  <h4 className="font-semibold text-white mb-3">Cost Summary</h4>
                  <div className="space-y-2 text-sm">
                    {getSelectedPerformance() && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">{getSelectedPerformance()?.name}</span>
                        <span className="text-white">{formatPrice(getSelectedPerformance()?.basePrice || 0)}</span>
                      </div>
                    )}
                    {getSelectedDuration() && getSelectedPerformance() && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Duration ({getSelectedDuration()?.name})</span>
                        <span className="text-white">×{getSelectedDuration()?.multiplier}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-600 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">Total Amount</span>
                        <span className="text-purple-400 text-lg">{formatPrice(calculateTotalCost())}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={createBookingMutation.isPending || !performanceType || !duration}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  {createBookingMutation.isPending ? 'Processing...' : `Book & Pay Now - ${formatPrice(calculateTotalCost())}`}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}