import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface PaymentStatusTrackerProps {
  paymentId?: number;
  pidx?: string;
  onStatusChange?: (status: string) => void;
}

interface PaymentStatus {
  id: number;
  pidx: string;
  status: string;
  amount: number;
  customerName: string;
  createdAt: string;
  updatedAt: string;
}

export function PaymentStatusTracker({ paymentId, pidx, onStatusChange }: PaymentStatusTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [lastStatus, setLastStatus] = useState<string>('');

  const { data: paymentStatus, isLoading, refetch } = useQuery({
    queryKey: ['/api/payment/status', paymentId || pidx],
    enabled: isTracking && (!!paymentId || !!pidx),
    refetchInterval: isTracking ? 3000 : false, // Poll every 3 seconds when tracking
    retry: false,
  });

  const payment = paymentStatus as PaymentStatus;

  useEffect(() => {
    if (payment?.status && payment.status !== lastStatus) {
      setLastStatus(payment.status);
      onStatusChange?.(payment.status);
      
      // Stop tracking if payment is completed or failed
      if (payment.status === 'completed' || payment.status === 'failed') {
        setIsTracking(false);
      }
    }
  }, [payment?.status, lastStatus, onStatusChange]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600 text-white"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-400"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'initiated':
        return <Badge variant="outline" className="border-blue-500 text-blue-400"><Clock className="w-3 h-3 mr-1" />Initiated</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!paymentId && !pidx) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No payment to track</p>
            <p className="text-sm">Complete a payment to see status updates</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-white text-lg">Payment Status</CardTitle>
        <div className="flex items-center gap-2">
          {isTracking && (
            <div className="flex items-center gap-1 text-xs text-blue-400">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Live tracking
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsTracking(!isTracking);
              if (!isTracking) refetch();
            }}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            {isTracking ? 'Stop' : 'Track'} Status
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Checking payment status...
          </div>
        )}

        {payment && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Payment #{payment.id}</h4>
                <p className="text-sm text-gray-400">PIDX: {payment.pidx}</p>
              </div>
              {getStatusBadge(payment.status)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Amount</p>
                <p className="font-medium text-white">{formatAmount(payment.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Customer</p>
                <p className="font-medium text-white">{payment.customerName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Created</p>
                <p className="text-sm text-white">{formatDate(payment.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Updated</p>
                <p className="text-sm text-white">{formatDate(payment.updatedAt)}</p>
              </div>
            </div>

            {payment.status === 'completed' && (
              <div className="bg-green-900/20 border border-green-600 p-3 rounded-lg">
                <p className="text-sm text-green-200">
                  Payment completed successfully! The transaction has been processed and confirmed.
                </p>
              </div>
            )}

            {payment.status === 'failed' && (
              <div className="bg-red-900/20 border border-red-600 p-3 rounded-lg">
                <p className="text-sm text-red-200">
                  Payment failed. Please try again or contact support if the issue persists.
                </p>
              </div>
            )}

            {payment.status === 'pending' && (
              <div className="bg-yellow-900/20 border border-yellow-600 p-3 rounded-lg">
                <p className="text-sm text-yellow-200">
                  Payment is being processed. This may take a few minutes to complete.
                </p>
              </div>
            )}
          </div>
        )}

        {!payment && !isLoading && (
          <div className="text-center text-gray-400 py-4">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Payment not found</p>
            <p className="text-sm">Check the payment ID or try again</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}