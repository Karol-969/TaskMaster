import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, Users, MapPin, Clock, Phone, Mail, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { SoundPackageSelector } from './sound-package-selector';

const bookingSchema = z.object({
  eventName: z.string().min(1, 'Event name is required'),
  eventType: z.string().min(1, 'Event type is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  venueType: z.string().min(1, 'Venue type is required'),
  venueSize: z.string().min(1, 'Venue size is required'),
  expectedAttendance: z.string().min(1, 'Expected attendance is required'),
  venueName: z.string().min(1, 'Venue name is required'),
  venueAddress: z.string().min(1, 'Venue address is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().min(1, 'Phone number is required'),
  specialRequirements: z.string().optional(),
  soundEngineer: z.boolean(),
  setupAssistance: z.boolean(),
  selectedPackage: z.string().optional(),
  customEquipment: z.array(z.string()).optional(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  insuranceNeeded: z.boolean(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface SoundSystem {
  id: number;
  name: string;
  type: string;
  description: string;
  specifications: string;
  pricing: string;
  powerRating: string;
  coverageArea: string;
  image: string;
  category: string;
  features: string[];
  available: boolean;
}

interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  image: string;
}

interface EnhancedSoundBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  soundSystems: SoundSystem[];
  packages: Package[];
}

export function EnhancedSoundBookingForm({ isOpen, onClose, soundSystems, packages }: EnhancedSoundBookingFormProps) {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      soundEngineer: false,
      setupAssistance: true,
      insuranceNeeded: false,
      customEquipment: [],
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    try {
      const bookingData = {
        ...data,
        selectedPackage,
        customEquipment: selectedEquipment,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      toast({
        title: "Booking Submitted Successfully",
        description: "We'll contact you within 24 hours to confirm your sound equipment booking.",
      });

      onClose();
      form.reset();
      setStep(1);
      setSelectedPackage('');
      setSelectedEquipment([]);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  };

  const nextStep = () => setStep(Math.min(step + 1, 4));
  const prevStep = () => setStep(Math.max(step - 1, 1));

  const toggleEquipment = (equipmentId: string) => {
    setSelectedEquipment(prev => 
      prev.includes(equipmentId)
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Book Sound Equipment
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? 'bg-accent text-black'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Step 1: Event Details */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold mb-4">Event Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="eventName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter event name" {...field} />
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
                              <FormLabel>Event Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select event type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="concert">Concert</SelectItem>
                                  <SelectItem value="wedding">Wedding</SelectItem>
                                  <SelectItem value="corporate">Corporate Event</SelectItem>
                                  <SelectItem value="party">Party</SelectItem>
                                  <SelectItem value="festival">Festival</SelectItem>
                                  <SelectItem value="conference">Conference</SelectItem>
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
                              <FormLabel>Event Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
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
                              <FormLabel>Expected Attendance</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select attendance" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="50-100">50-100 people</SelectItem>
                                  <SelectItem value="100-300">100-300 people</SelectItem>
                                  <SelectItem value="300-500">300-500 people</SelectItem>
                                  <SelectItem value="500+">500+ people</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
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
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Venue Details */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold mb-4">Venue Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="venueName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Venue Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter venue name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="venueType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Venue Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select venue type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="indoor">Indoor</SelectItem>
                                  <SelectItem value="outdoor">Outdoor</SelectItem>
                                  <SelectItem value="mixed">Mixed (Indoor/Outdoor)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="venueSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Venue Size</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select venue size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="small">Small (up to 100 sqm)</SelectItem>
                                  <SelectItem value="medium">Medium (100-500 sqm)</SelectItem>
                                  <SelectItem value="large">Large (500+ sqm)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="venueAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Venue Address</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter complete venue address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {/* Step 3: Equipment Selection */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-lg font-semibold">Choose Your Equipment</h3>
                      
                      {/* Package Selection */}
                      <div>
                        <h4 className="font-medium mb-4">Select a Package (Recommended)</h4>
                        <SoundPackageSelector
                          packages={packages}
                          selectedPackage={selectedPackage}
                          onSelectPackage={setSelectedPackage}
                        />
                      </div>

                      {/* Additional Services */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Additional Services</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="soundEngineer"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Professional Sound Engineer</FormLabel>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    +NPR 15,000 (Dedicated engineer for your event)
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
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Setup & Breakdown Assistance</FormLabel>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Professional setup and breakdown service
                                  </p>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Contact & Payment */}
                  {step === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold mb-4">Contact & Payment Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="contactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your full name" {...field} />
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
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your@email.com" {...field} />
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
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Your phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Method</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="esewa">eSewa</SelectItem>
                                  <SelectItem value="khalti">Khalti</SelectItem>
                                  <SelectItem value="bank">Bank Transfer</SelectItem>
                                  <SelectItem value="cash">Cash on Delivery</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="specialRequirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Requirements (Optional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Any special audio requirements or additional information..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="insuranceNeeded"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Equipment Damage Insurance</FormLabel>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                +5% of total cost (Covers accidental equipment damage)
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </form>
              </Form>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={step === 1 ? onClose : prevStep}
              >
                {step === 1 ? 'Cancel' : 'Previous'}
              </Button>
              
              {step < 4 ? (
                <Button type="button" onClick={nextStep} className="bg-accent hover:bg-accent/90 text-black">
                  Next Step
                </Button>
              ) : (
                <Button type="submit" onClick={form.handleSubmit(onSubmit)} className="bg-accent hover:bg-accent/90 text-black">
                  Submit Booking
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}