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
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar, Users, MapPin, Clock, CreditCard, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const soundBookingSchema = z.object({
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
  packageType: z.string().min(1, 'Package type is required'),
  specialRequirements: z.string().optional(),
  soundEngineer: z.boolean().default(false),
  setupAssistance: z.boolean().default(true),
});

type SoundBookingForm = z.infer<typeof soundBookingSchema>;

interface SoundEquipmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundSystem?: any;
}

const packages = [
  {
    id: 'basic',
    name: 'Basic Package',
    description: 'Perfect for small venues (50-100 people)',
    price: 15000,
    features: ['2x Main speakers', '1x Mixer', '2x Microphones', 'Basic lighting setup']
  },
  {
    id: 'standard',
    name: 'Standard Package', 
    description: 'Ideal for medium venues (100-300 people)',
    price: 25000,
    features: ['4x Main speakers', '1x Subwoofer', '1x Professional mixer', 'Wireless microphone system', 'Enhanced lighting package']
  },
  {
    id: 'premium',
    name: 'Premium Package',
    description: 'Complete solution for large venues (300+ people)',
    price: 40000,
    features: ['Full PA system with line arrays', 'Professional mixing console', 'Complete wireless microphone system', 'Professional lighting rig', 'Dedicated sound engineer']
  }
];

export function SoundEquipmentBookingModal({ isOpen, onClose, soundSystem }: SoundEquipmentBookingModalProps) {
  const { toast } = useToast();

  const form = useForm<SoundBookingForm>({
    resolver: zodResolver(soundBookingSchema),
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
      packageType: '',
      specialRequirements: '',
      soundEngineer: false,
      setupAssistance: true,
    },
  });

  const { watch } = form;
  const packageType = watch('packageType');
  const soundEngineer = watch('soundEngineer');
  const setupAssistance = watch('setupAssistance');

  const createBookingMutation = useMutation({
    mutationFn: async (data: SoundBookingForm) => {
      const totalAmount = calculateTotalCost() * 100; // Convert NPR to paisa for Khalti
      
      // Use the same payment initiation as other booking pages
      const paymentPayload = {
        bookingId: Math.floor(Math.random() * 10000), // Generate unique booking ID
        amount: calculateTotalCost(), // Amount in NPR
        productName: `Sound Equipment - ${getSelectedPackage()?.name}`,
        customerInfo: {
          name: data.contactName,
          email: data.contactEmail,
          phone: data.contactPhone
        },
        bookingData: data
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

  const getSelectedPackage = () => {
    return packages.find(pkg => pkg.id === packageType);
  };

  const calculateTotalCost = () => {
    const selectedPackage = getSelectedPackage();
    if (!selectedPackage) return 0;

    let total = selectedPackage.price;
    
    // Add sound engineer cost
    if (soundEngineer) {
      total += 5000;
    }
    
    // Setup assistance is included in all packages
    
    return total;
  };

  const onSubmit = (data: SoundBookingForm) => {
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
            <Volume2 className="h-6 w-6 text-purple-400" />
            Book Sound Equipment
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose the perfect sound package for your event. Professional equipment with setup and technical support included.
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
                              placeholder="e.g., Annual Conference 2024"
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
                              <SelectItem value="conference">Conference</SelectItem>
                              <SelectItem value="wedding">Wedding</SelectItem>
                              <SelectItem value="concert">Concert</SelectItem>
                              <SelectItem value="corporate">Corporate Event</SelectItem>
                              <SelectItem value="party">Party</SelectItem>
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
                              placeholder="e.g., 150"
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
                              placeholder="e.g., Grand Ballroom"
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
                        <FormItem className="md:col-span-1">
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
                          placeholder="Any specific equipment or setup requirements..."
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

              {/* Right Column - Package Selection */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Choose Package</h3>
                  
                  <FormField
                    control={form.control}
                    name="packageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-3">
                            {packages.map((pkg) => (
                              <div
                                key={pkg.id}
                                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                  field.value === pkg.id
                                    ? 'border-purple-500 bg-purple-500/10'
                                    : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                                }`}
                                onClick={() => field.onChange(pkg.id)}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold text-white">{pkg.name}</h4>
                                  <span className="text-purple-400 font-bold">{formatPrice(pkg.price)}</span>
                                </div>
                                <p className="text-gray-400 text-sm mb-3">{pkg.description}</p>
                                <ul className="space-y-1">
                                  {pkg.features.map((feature, index) => (
                                    <li key={index} className="text-gray-300 text-xs flex items-center gap-2">
                                      <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Additional Services</h3>
                  
                  <FormField
                    control={form.control}
                    name="soundEngineer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-gray-600"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-gray-300">
                            Professional Sound Engineer (+{formatPrice(5000)})
                          </FormLabel>
                          <p className="text-xs text-gray-500">
                            Dedicated engineer for your event
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="setupAssistance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-gray-600"
                            disabled={true}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-gray-300">
                            Setup & Breakdown Assistance (Included)
                          </FormLabel>
                          <p className="text-xs text-gray-500">
                            Professional setup and breakdown service
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Cost Summary */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                  <h4 className="font-semibold text-white mb-3">Cost Summary</h4>
                  <div className="space-y-2 text-sm">
                    {getSelectedPackage() && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">{getSelectedPackage()?.name}</span>
                        <span className="text-white">{formatPrice(getSelectedPackage()?.price || 0)}</span>
                      </div>
                    )}
                    {soundEngineer && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Sound Engineer</span>
                        <span className="text-white">{formatPrice(5000)}</span>
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
                  disabled={createBookingMutation.isPending || !packageType}
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