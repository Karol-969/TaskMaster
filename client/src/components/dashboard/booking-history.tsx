import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye, Download, X } from 'lucide-react';
import { generateQRCode } from '@/lib/qrcode';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

interface BookingHistoryProps {
  bookings: any[];
  isLoading: boolean;
  isAdmin?: boolean;
}

export function BookingHistory({ bookings, isLoading, isAdmin = false }: BookingHistoryProps) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { toast } = useToast();
  
  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };
  
  const handleCancelBooking = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsCancelling(true);
      await apiRequest('PUT', `/api/bookings/${id}/cancel`);
      
      toast({
        title: 'Booking cancelled',
        description: 'Your booking has been successfully cancelled.',
      });
      
      // Invalidate booking queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      setIsDialogOpen(false);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCancelling(false);
    }
  };
  
  const getItemTypeName = (type: string) => {
    const typeNames: Record<string, string> = {
      artist: 'Artist',
      influencer: 'Influencer',
      sound: 'Sound System',
      venue: 'Venue',
      ticket: 'Event Ticket'
    };
    
    return typeNames[type] || type;
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-2">No bookings found</p>
        <Button variant="outline" asChild>
          <a href="/">Browse Services</a>
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Event Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">#{booking.id}</TableCell>
                <TableCell>{getItemTypeName(booking.type)}</TableCell>
                <TableCell>{formatDate(booking.eventDate)}</TableCell>
                <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(booking.status) as any}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleViewBooking(booking)}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Booking Details Dialog */}
      {selectedBooking && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Booking #{selectedBooking.id}</DialogTitle>
              <DialogDescription>
                {getItemTypeName(selectedBooking.type)} booking details
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Booking Type</p>
                  <p className="text-sm text-muted-foreground">
                    {getItemTypeName(selectedBooking.type)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Event Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedBooking.eventDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm">
                    <Badge variant={getStatusBadgeVariant(selectedBooking.status) as any}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </Badge>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(selectedBooking.totalAmount)}
                  </p>
                </div>
              </div>
              
              {selectedBooking.qrCode && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Booking QR Code</p>
                  <div className="bg-white p-4 rounded-md shadow-sm flex justify-center">
                    <img 
                      src={generateQRCode(selectedBooking.qrCode)}
                      alt="Booking QR Code"
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                </div>
              )}
              
              {selectedBooking.additionalInfo && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Additional Information</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.additionalInfo}
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex gap-2">
              {(selectedBooking.status !== 'cancelled' && new Date(selectedBooking.eventDate) > new Date()) && (
                <Button 
                  variant="destructive" 
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel Booking
                    </>
                  )}
                </Button>
              )}
              
              {selectedBooking.qrCode && (
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR
                </Button>
              )}
              
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
