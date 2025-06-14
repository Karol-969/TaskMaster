import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface KhaltiPaymentButtonProps {
  bookingId: number;
  amount: number;
  productName: string;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  onSuccess?: (paymentId: number) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export function KhaltiPaymentButton({
  bookingId,
  amount,
  productName,
  customerInfo,
  onSuccess,
  onError,
  disabled = false,
  className = ''
}: KhaltiPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const { toast } = useToast();

  const formatNPR = (amount: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const initiatePayment = async () => {
    try {
      setIsLoading(true);
      setPaymentDialog(true);
      setPaymentStatus('pending');

      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        body: JSON.stringify({
          bookingId,
          amount,
          productName,
          customerInfo
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment initiation failed');
      }

      setPaymentDetails(data);

      // Redirect to Khalti payment page
      window.location.href = data.paymentUrl;

    } catch (error) {
      console.error('Payment initiation error:', error);
      setPaymentStatus('failed');
      
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={initiatePayment}
        disabled={disabled || isLoading}
        className={`bg-purple-600 hover:bg-purple-700 text-white ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay with Khalti - {formatNPR(amount)}
          </>
        )}
      </Button>

      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-400" />
              Payment Status
            </DialogTitle>
          </DialogHeader>

          <Card className="bg-gray-800 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">{productName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Amount:</span>
                <span className="font-semibold text-white">{formatNPR(amount)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">Status:</span>
                <Badge 
                  variant={
                    paymentStatus === 'success' ? 'default' : 
                    paymentStatus === 'failed' ? 'destructive' : 
                    'secondary'
                  }
                  className={
                    paymentStatus === 'success' ? 'bg-green-600' :
                    paymentStatus === 'failed' ? 'bg-red-600' :
                    'bg-yellow-600'
                  }
                >
                  {paymentStatus === 'success' && <CheckCircle className="mr-1 h-3 w-3" />}
                  {paymentStatus === 'failed' && <XCircle className="mr-1 h-3 w-3" />}
                  {paymentStatus === 'pending' && <AlertCircle className="mr-1 h-3 w-3" />}
                  {paymentStatus === 'success' ? 'Completed' : 
                   paymentStatus === 'failed' ? 'Failed' : 
                   'Processing'}
                </Badge>
              </div>

              {paymentStatus === 'pending' && (
                <div className="flex items-center gap-2 p-4 bg-yellow-900/20 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
                  <span className="text-yellow-300 text-sm">
                    Redirecting to Khalti payment gateway...
                  </span>
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="flex items-center gap-2 p-4 bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-300 text-sm">
                    Payment successful! Your booking is confirmed.
                  </span>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="flex items-center gap-2 p-4 bg-red-900/20 rounded-lg">
                  <XCircle className="h-4 w-4 text-red-400" />
                  <span className="text-red-300 text-sm">
                    Payment failed. Please try again or contact support.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}