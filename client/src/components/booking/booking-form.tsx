import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface BookingFormProps {
  itemType: 'artist' | 'influencer' | 'sound' | 'venue' | 'ticket';
  item: any;
  onSubmit: (data: any) => void;
}

export function BookingForm({ itemType, item, onSubmit }: BookingFormProps) {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1); // At least 1 day from now
  
  // Define form schema based on booking type
  const getFormSchema = () => {
    const baseSchema = {
      fullName: z.string().min(3, "Full name is required"),
      email: z.string().email("Invalid email address"),
      phone: z.string().min(10, "Valid phone number is required"),
      eventDate: z.date({
        required_error: "Event date is required",
      }).min(minDate, "Event date must be at least tomorrow"),
      additionalInfo: z.string().optional(),
    };
    
    // Add type-specific fields
    switch (itemType) {
      case 'ticket':
        return z.object({
          ...baseSchema,
          quantity: z.number().min(1, "Must book at least 1 ticket").max(item.availableTickets, `Maximum available tickets: ${item.availableTickets}`),
        });
      default:
        return z.object(baseSchema);
    }
  };
  
  const form = useForm<z.infer<ReturnType<typeof getFormSchema>>>({
    resolver: zodResolver(getFormSchema()),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      additionalInfo: "",
      quantity: itemType === 'ticket' ? 1 : undefined,
    },
  });
  
  // Calculate total price based on item type and form values
  const calculateTotalPrice = () => {
    const quantity = form.watch('quantity') || 1;
    
    switch (itemType) {
      case 'artist':
      case 'influencer':
      case 'sound':
      case 'venue':
        return item.price;
      case 'ticket':
        return item.ticketPrice * quantity;
      default:
        return 0;
    }
  };
  
  const handleSubmit = (values: z.infer<ReturnType<typeof getFormSchema>>) => {
    const bookingData = {
      ...values,
      itemId: item.id,
      type: itemType,
      totalAmount: calculateTotalPrice(),
    };
    
    onSubmit(bookingData);
  };
  
  const getBookingDescription = () => {
    switch (itemType) {
      case 'artist':
        return `You are booking ${item.name}, a ${item.genre} performer.`;
      case 'influencer':
        return `You are booking ${item.name}, a ${item.category} influencer.`;
      case 'sound':
        return `You are renting the ${item.name} sound system (${item.type}).`;
      case 'venue':
        return `You are booking the ${item.name} venue in ${item.location}.`;
      case 'ticket':
        return `You are purchasing tickets for ${item.name} at ${item.venue} on ${format(new Date(item.date), 'PPP')}.`;
      default:
        return "";
    }
  };
  
  return (
    <div className="py-4">
      <p className="text-muted-foreground mb-6">{getBookingDescription()}</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < minDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {itemType === 'ticket' && (
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Tickets</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={item.availableTickets}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.availableTickets} tickets available
                  </p>
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Information</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any specific requirements or details about your event" 
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-muted-foreground">Total Price:</span>
              <span className="text-xl font-bold">{formatCurrency(calculateTotalPrice())}</span>
            </div>
            
            <Button type="submit" className="w-full">Continue to Payment</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
