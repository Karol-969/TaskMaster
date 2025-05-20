import { ReactNode, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingForm } from '@/components/booking/booking-form';
import { PaymentForm } from '@/components/booking/payment-form';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateQRCode } from '@/lib/qrcode';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: 'artist' | 'influencer' | 'sound' | 'venue' | 'ticket';
  item: any; // The item being booked
  children?: ReactNode;
}

export function BookingModal({ isOpen, onClose, itemType, item, children }: BookingModalProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBookingSubmit = (data: any) => {
    setBookingDetails(data);
    setActiveTab('payment');
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    try {
      // In a real app, we would send the booking and payment data to the API
      // For now, we'll simulate a successful booking
      
      // Generate QR code
      const qrData = `REART-BOOKING-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      const qrUrl = generateQRCode(qrData);
      setQrCodeUrl(qrUrl);
      
      toast({
        title: "Booking successful!",
        description: "Your booking has been confirmed.",
      });
      
      setIsBookingComplete(true);
      setActiveTab('confirmation');
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetAndClose = () => {
    setActiveTab('details');
    setBookingDetails(null);
    setIsBookingComplete(false);
    setQrCodeUrl(null);
    onClose();
  };

  // Determine title based on item type
  const getTitle = () => {
    switch (itemType) {
      case 'artist':
        return `Book ${item.name}`;
      case 'influencer':
        return `Book ${item.name}`;
      case 'sound':
        return `Rent ${item.name}`;
      case 'venue':
        return `Book ${item.name}`;
      case 'ticket':
        return `Purchase Tickets for ${item.name}`;
      default:
        return 'Book Now';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{getTitle()}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={resetAndClose} className="absolute right-4 top-4">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <DialogDescription>
            {isBookingComplete 
              ? "Your booking is confirmed! Please save your QR code for reference." 
              : "Complete the form below to proceed with your booking."}
          </DialogDescription>
        </DialogHeader>

        {!isBookingComplete ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Booking Details</TabsTrigger>
              <TabsTrigger value="payment" disabled={!bookingDetails}>Payment</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <BookingForm 
                itemType={itemType} 
                item={item} 
                onSubmit={handleBookingSubmit}
              />
            </TabsContent>
            <TabsContent value="payment">
              <PaymentForm 
                bookingDetails={bookingDetails} 
                totalAmount={bookingDetails?.totalAmount || 0} 
                onSubmit={handlePaymentSubmit}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="py-6 flex flex-col items-center text-center">
            <div className="mb-6">
              <div className="bg-accent/10 text-accent rounded-full p-3 mx-auto w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold">Booking Confirmed!</h3>
              <p className="mt-2 text-muted-foreground">
                Thank you for your booking. A confirmation email has been sent to your email address.
              </p>
            </div>
            
            {qrCodeUrl && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Your QR Code</h4>
                <div className="mx-auto w-48 h-48 border rounded-md flex items-center justify-center bg-white p-2">
                  <img src={qrCodeUrl} alt="Booking QR Code" className="w-full h-full" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please save this QR code. You'll need it to access your booking.
                </p>
              </div>
            )}
            
            <DialogFooter className="flex-col sm:flex-row sm:justify-center gap-2 w-full">
              <Button onClick={resetAndClose}>Done</Button>
              <Button variant="outline" onClick={() => window.print()}>Print</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
